import { useEffect, useState } from "react";
import "./App.css";
import { Cards } from "./components/card/cards";
import { SortSelect, type SortSpec } from "./components/sort/sortSelect";
import { Pagination } from "./components/pagination/pagination";
import { SearchBox } from "./components/search/searchBox";
import { useCardData } from "./hook/useCardsData";

export default function App() {
  const [sorts, setSorts] = useState<SortSpec[]>([{ field: "name", direction: "asc" }]);
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");
  const size = 50;

  useEffect(() => { setPage(0); }, [sorts, q]);

  // if API accepts q, pass { page, size, sorts, q }; otherwise remove q
  const { data, isPending, error } = useCardData({ page, size, sorts, q });

  return (
    <div className="page">
      {/* background decor */}
      <div className="bg-decor" aria-hidden />

      <header className="page-header">
        <div className="brand">
          {/* SVG Pokeball */}
          <svg className="pokeball" viewBox="0 0 24 24" width="28" height="28" aria-hidden>
            <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" opacity=".9"/>
            <path d="M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3.25" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
          <h1>PokeCards</h1>
        </div>
        <p className="subtitle">Search your favorite card here!</p>
      </header>

      <div className="toolbar">
        <div className="toolbar-left">
          <SearchBox value={q} onChange={setQ} />
        </div>
        <div className="toolbar-right">
          <SortSelect value={sorts} onChange={setSorts} />
          {!!data && (
            <span className="chip" title="Cards Found">
              {data.totalElements.toLocaleString()} cards
            </span>
          )}
        </div>
      </div>

      {isPending && (
        <p className="status" aria-live="polite">
          <span className="dot-bounce" /> Loading
        </p>
      )}
      {error && <p className="error status ">Failed to Load :/.</p>}

      <section className={`grid ${isPending ? "is-dimmed" : ""}`}>
        {data?.content.map(c => (
          <Cards
            key={c.id ?? `${c.name}-${c.image}`}
            name={c.name}
            rarity={c.rarity}
            price={c.price}
            image={c.image}
          />
        ))}
      </section>

      {!!data && data.totalPages > 1 && (
        <Pagination
          page={data.number}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          onChange={setPage}
        />
      )}
    </div>
  );
}
