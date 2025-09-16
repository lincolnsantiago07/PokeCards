import "./sort.css";

export type SortSpec = { field: "name"|"rarity"|"price"; direction: "asc"|"desc" };

type Option = { key: string; label: string; sorts: SortSpec[] };
const OPTIONS: Option[] = [
  { key: "name-asc",   label: "Name ↑",   sorts: [{ field: "name",   direction: "asc" }] },
  { key: "name-desc",  label: "Name ↓",   sorts: [{ field: "name",   direction: "desc"}] },
  { key: "rarity-asc", label: "Rarity ↑", sorts: [{ field: "rarity", direction: "asc"}] },
  { key: "rarity-desc",label: "Rarity ↓", sorts: [{ field: "rarity", direction: "desc"}] },
  { key: "price-asc",  label: "Price ↑",  sorts: [{ field: "price",  direction: "asc"}] },
  { key: "price-desc", label: "Price ↓",  sorts: [{ field: "price",  direction: "desc"}] },
];

const same = (a: SortSpec[], b: SortSpec[]) => JSON.stringify(a) === JSON.stringify(b);

export function SortSelect({ value, onChange }: { value: SortSpec[]; onChange: (s: SortSpec[]) => void }) {
  const selectedKey = OPTIONS.find(o => same(o.sorts, value))?.key || "name-asc";
  return (
    <div className="sort">
      <label className="sr-only" htmlFor="sort">Sort by</label>
      <div className="select">
        <svg aria-hidden="true" className="select__icon" width="18" height="18" viewBox="0 0 24 24">
          <path d="M3 6h18M6 12h12M10 18h4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
        <select id="sort" className="select__input" value={selectedKey}
          onChange={(e) => onChange(OPTIONS.find(o => o.key === e.target.value)!.sorts)}>
          {OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
        <svg aria-hidden="true" className="select__chev" width="16" height="16" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}
