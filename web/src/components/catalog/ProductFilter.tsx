export default function ProductFilter({
  searchTerm, selectedCategory, sortOrder, categories,
  onSearchChange, onCategoryChange, onSortChange,
}: {
  searchTerm: string;
  selectedCategory: string;
  sortOrder: 'asc' | 'desc';
  categories: string[];
  onSearchChange: (val: string) => void;
  onCategoryChange: (val: string) => void;
  onSortChange: (val: 'asc' | 'desc') => void;
}) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <input
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Rechercher..."
        className="border rounded px-4 py-2"
      />
      <select value={selectedCategory} onChange={e => onCategoryChange(e.target.value)} className="border rounded px-4 py-2">
        {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
      </select>
      <select value={sortOrder} onChange={e => onSortChange(e.target.value as 'asc' | 'desc')} className="border rounded px-4 py-2">
        <option value="asc">Prix croissant</option>
        <option value="desc">Prix décroissant</option>
      </select>
    </div>
  );
}
