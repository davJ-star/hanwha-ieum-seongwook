interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  className?: string;
  buttonText?: string;
}

const SearchBar = ({ placeholder, onSearch, className, buttonText }: SearchBarProps) => {
  return (
    <div className={`search-bar ${className || ''} input-group`} role="search">
      <input
        type="text"
        placeholder={placeholder || "검색어를 입력하세요"}
        onChange={(e) => onSearch(e.target.value)}
        aria-label={placeholder || "검색어 입력"}
        className="search-input"
      />
      {buttonText && (
        <button 
          className="search-button"
          onClick={() => onSearch}
          aria-label={`${buttonText} 검색하기`}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default SearchBar;
