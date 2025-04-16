import { Search } from 'lucide-react';
import { useState } from 'react';
export function SearchBar({ className = '', placeholder = 'Search for content...', onSearch }) {
    const [query, setQuery] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) {
            onSearch(query);
        }
    };
    return (<form onSubmit={handleSubmit} className={`relative flex items-center ${className}`}>
      <input type="text" placeholder={placeholder} value={query} onChange={(e) => setQuery(e.target.value)} className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
      <button type="submit" className="absolute right-3 text-gray-500 hover:text-gray-700" aria-label="Search">
        <Search size={20}/>
      </button>
    </form>);
}
//# sourceMappingURL=SearchBar.js.map