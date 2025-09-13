import os, sys, time, requests, psycopg2
import psycopg2.extras as pe
from urllib.parse import urlencode
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# garante que a saída não quebre por encoding
try: sys.stdout.reconfigure(encoding="utf-8", errors="replace")
except Exception: ...

API, PAGE_SIZE = "https://api.pokemontcg.io/v2/cards", 250
try:
    from dotenv import load_dotenv; load_dotenv()
except Exception: ...
DB_URL = os.getenv("DATABASE_URL"); assert DB_URL, "Defina DATABASE_URL"
API_KEY = os.getenv("POKEMON_TCG_API_KEY")

def log(msg): print(time.strftime("[%H:%M:%S] "), msg, sep="", flush=True)

# sessão HTTP com retry
s = requests.Session()
s.headers.update({"Accept":"application/json","User-Agent":"pokecards_dt/1.0"})
if API_KEY: s.headers["X-Api-Key"] = API_KEY
s.mount("https://", HTTPAdapter(max_retries=Retry(
    total=6, backoff_factor=1.5, status_forcelist=[429,500,502,503,504], allowed_methods=["GET"]
)))

DDL = """
CREATE TABLE IF NOT EXISTS pokecards_dt (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  set_name TEXT, set_series TEXT, number TEXT, rarity TEXT,
  supertype TEXT, types TEXT[], hp INTEGER,
  image_small TEXT, image_large TEXT,
  price NUMERIC, price_currency TEXT, price_source TEXT,
  prices_raw JSONB,
  updated_at TIMESTAMP DEFAULT NOW()
);
"""
UPSERT = """
INSERT INTO pokecards_dt
(id,name,set_name,set_series,number,rarity,supertype,types,hp,image_small,image_large,
 price,price_currency,price_source,prices_raw)
VALUES %s
ON CONFLICT (id) DO UPDATE SET
 name=EXCLUDED.name, set_name=EXCLUDED.set_name, set_series=EXCLUDED.set_series,
 number=EXCLUDED.number, rarity=EXCLUDED.rarity, supertype=EXCLUDED.supertype,
 types=EXCLUDED.types, hp=EXCLUDED.hp, image_small=EXCLUDED.image_small,
 image_large=EXCLUDED.image_large, price=EXCLUDED.price,
 price_currency=EXCLUDED.price_currency, price_source=EXCLUDED.price_source,
 prices_raw=EXCLUDED.prices_raw, updated_at=NOW();
"""

def _float(x):
    try: return float(x)
    except: return None

def pick_price(card):
    tcg = (card.get("tcgplayer") or {}).get("prices") or {}
    cmk = (card.get("cardmarket") or {}).get("prices") or {}
    for variant in ("holofoil","reverseHolofoil","normal","1stEditionHolofoil","1stEditionNormal"):
        v = tcg.get(variant) or {}
        for k in ("market","mid","low"):
            val = _float(v.get(k))
            if val is not None: return val,"USD","tcgplayer."+variant+"."+k
    for k in ("trendPrice","avg1","avg7","avg30","lowPrice"):
        val = _float(cmk.get(k))
        if val is not None: return val,"EUR","cardmarket."+k
    return None,None,None

SELECT = "id,name,set,number,rarity,types,hp,supertype,images,tcgplayer,cardmarket"

def fetch(page):
    url = f"{API}?{urlencode({'page':page,'pageSize':PAGE_SIZE,'select':SELECT})}"
    log(f"-> Buscando pagina {page} ...")
    r = s.get(url, timeout=(10,60)); r.raise_for_status()
    return r.json()

def map_row(c):
    price, cur, src = pick_price(c)
    st, im = c.get("set") or {}, c.get("images") or {}
    hp = c.get("hp"); hp = int(hp) if str(hp or "").isdigit() else None
    return (c.get("id"), c.get("name"), st.get("name"), st.get("series"),
            c.get("number"), c.get("rarity"), c.get("supertype"), c.get("types"),
            hp, im.get("small"), im.get("large"), price, cur, src,
            pe.Json({"tcgplayer":c.get("tcgplayer"), "cardmarket":c.get("cardmarket")})
           )

def main():
    log(f"Config: page_size={PAGE_SIZE}, api_key={'sim' if API_KEY else 'nao'}")
    log("Conectando ao PostgreSQL ...")
    conn = psycopg2.connect(DB_URL); conn.autocommit=False
    with conn.cursor() as cur: cur.execute(DDL); conn.commit()
    log("Tabela verificada/criada.")

    page, total, done, t0 = 1, None, 0, time.time()
    while True:
        try:
            data = fetch(page)
        except Exception as e:
            log(f"[ERRO] Falha ao buscar pagina {page}: {e}. Nova tentativa em 3s.")
            time.sleep(3); continue

        cards = data.get("data") or []
        if total is None: total = data.get("totalCount") or 0
        if not cards: break

        rows = [map_row(c) for c in cards]
        with conn.cursor() as cur: pe.execute_values(cur, UPSERT, rows, page_size=PAGE_SIZE)
        conn.commit()

        done += len(rows); page += 1
        pct = (done/(total or done))*100
        log(f"[OK] +{len(rows)} (total {done}/{total or '?'} | {pct:.1f}% | {time.time()-t0:.0f}s)")
        time.sleep(0.03)
        if total and done >= total: break

    conn.close()
    log(f"Concluido em {time.time()-t0:.1f}s. Registros: {done}.")

if __name__ == "__main__":
    try: main()
    except KeyboardInterrupt:
        log("Interrompido pelo usuario.")
        raise