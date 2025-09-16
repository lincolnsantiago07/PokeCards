// src/components/search/SearchBox.tsx
import "./searchBox.css";

export function SearchBox({
  value,
  onChange,
}: { value: string; onChange: (v: string) => void }) {
  return (
    <label className="search" aria-label="Buscar cards">
      <svg
        className="search__icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          d="M21 21l-4.3-4.3M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>

      <input
        className="search__input"
        type="text"
        placeholder="Search cards..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
