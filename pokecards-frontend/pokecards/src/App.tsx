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

  // se sua API aceitar q, passe { page, size, sorts, q }; senão remova q
  const { data, isPending, error } = useCardData({ page, size, sorts, q });

  return (
    <div className="page">
      <header className="page-header">
        <h1>PokéCards</h1>
      </header>

      <div className="toolbar">
        <SearchBox value={q} onChange={setQ} />
        <SortSelect value={sorts} onChange={setSorts} />
      </div>


      {isPending && <p>Carregando…</p>}
      {error && <p>Erro ao carregar.</p>}

      <section className="grid">
        {data?.content.map(c => (
          <Cards key={c.id ?? `${c.name}-${c.image}`}
            name={c.name} rarity={c.rarity} price={c.price} image={c.image} />
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
