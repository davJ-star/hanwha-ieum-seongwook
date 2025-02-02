// interface SearchBarProps {
//   placeholder?: string;
//   onSearch: (value: string) => void;
//   className?: string;
//   buttonText?: string;
// }

// const SearchBar = ({ placeholder, onSearch, className, buttonText }: SearchBarProps) => {
//   return (
//     <div className={`search-bar ${className || ''} input-group`} role="search">
//       <input
//         type="text"
//         placeholder={placeholder || "검색어를 입력하세요"}
//         onChange={(e) => onSearch(e.target.value)}
//         aria-label={placeholder || "검색어 입력"}
//         className="search-input"
//       />
//       {buttonText && (
//         <button 
//           className="search-button"
//           onClick={() => onSearch}
//           aria-label={`${buttonText} 검색하기`}
//         >
//           {buttonText}
//         </button>
//       )}
//     </div>
//   );
// };

// export default SearchBar;
// components/SearchForm.tsx
import React, { useState } from 'react';

interface SearchFormProps {
  onSubmit: (e: React.FormEvent, searchType: string, searchTerm: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSubmit }) => {
  const [searchType, setSearchType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e, searchType, searchTerm);
  };

  return (
    <form onSubmit={handleSubmit} role="search" aria-label="검색 폼">
      <select 
        name="type" 
        value={searchType}
        onChange={(e) => setSearchType(e.target.value)}
        aria-label="검색 조건 선택"
      >
        <option value="" disabled>검색 조건</option>
        <option value="medicine">의약품</option>
        <option value="disease">질병</option>
      </select>
      <input 
        type="text" 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="검색어를 입력하세요" 
        aria-label="검색어 입력"
        style={{ color: '#000' }}
      />
      <button type="submit" aria-label="검색" style={{ color: '#000' }}>
        검색
      </button>
    </form>
  );
};

export default SearchForm;
