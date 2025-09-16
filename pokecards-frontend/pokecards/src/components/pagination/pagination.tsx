import "./pagination.css";

type Props = {
  page: number;             // 0-based (vindo do Spring)
  totalPages: number;       // total de páginas
  totalElements?: number;   // opcional: total de itens
  onChange: (page: number) => void;
  windowSize?: number;      // quantos botões em volta da atual (padrão 2)
};

export function Pagination({
  page,
  totalPages,
  totalElements,
  onChange,
  windowSize = 2,
}: Props) {
  if (totalPages <= 1) return null;

  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;

  const go = (p: number) => () =>
    onChange(Math.max(0, Math.min(totalPages - 1, p)));

  // gera janela: sempre mostra 1, última, atual ± windowSize e reticências no meio
  const raw = Array.from({ length: totalPages }, (_, i) => i);
  const visible = raw.filter(
    (i) =>
      i === 0 ||
      i === totalPages - 1 ||
      (i >= page - windowSize && i <= page + windowSize)
  );
  const withGaps: (number | "…")[] = [];
  visible.forEach((p, idx) => {
    if (idx && p - (visible[idx - 1]) > 1) withGaps.push("…");
    withGaps.push(p);
  });

  return (
    <div className="pager__wrap">
      <div className="pager__summary">
        Página <b>{page + 1}</b> de <b>{totalPages}</b>
        {typeof totalElements === "number" && (
          <> • <b>{totalElements}</b> itens</>
        )}
      </div>

      <nav className="pager" aria-label="pagination">
        <button className="pager__btn" disabled={!canPrev} onClick={go(0)}>
          «
        </button>
        <button className="pager__btn" disabled={!canPrev} onClick={go(page - 1)}>
          ‹
        </button>

        <ul className="pager__list">
          {withGaps.map((v, i) =>
            v === "…" ? (
              <li key={`gap-${i}`} className="pager__gap">…</li>
            ) : (
              <li key={v}>
                <button
                  className={`pager__num ${v === page ? "is-active" : ""}`}
                  onClick={go(v)}
                >
                  {v + 1}
                </button>
              </li>
            )
          )}
        </ul>

        <button className="pager__btn" disabled={!canNext} onClick={go(page + 1)}>
          ›
        </button>
        <button className="pager__btn" disabled={!canNext} onClick={go(totalPages - 1)}>
          »
        </button>
      </nav>
    </div>
  );
}
