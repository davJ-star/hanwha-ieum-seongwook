// src/components/common/SearchForm.tsx
import React, { useState, useEffect } from 'react';

interface SearchFormProps {
  onSubmit: (e: React.FormEvent, searchType: string, searchTerm: string) => void;
  defaultSearchType?: string;
  disableSearchType?: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSubmit,
  defaultSearchType,
  disableSearchType = false,
}) => {
  const [searchType, setSearchType] = useState<string>(defaultSearchType || '');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    // defaultSearchType이 존재하면 searchType을 해당 값으로 설정
    if (defaultSearchType) {
      setSearchType(defaultSearchType);
    }
  }, [defaultSearchType]);

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
        disabled={disableSearchType}
        style={{ color: '#000' }}
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

// // src/components/common/SearchForm.tsx
// import React, { useState, useEffect } from 'react';

// interface SearchFormProps {
//   onSubmit: (e: React.FormEvent, searchType: string, searchTerm: string) => void;
//   defaultSearchType?: string;
//   disableSearchType?: boolean;
// }

// const SearchForm: React.FC<SearchFormProps> = ({
//   onSubmit,
//   defaultSearchType,
//   disableSearchType = false,
// }) => {
//   // defaultSearchType이 있으면 초기값, 없으면 빈 문자열
//   const [searchType, setSearchType] = useState<string>(defaultSearchType || '');
//   const [searchTerm, setSearchTerm] = useState<string>('');

//   useEffect(() => {
//     if (defaultSearchType) {
//       setSearchType(defaultSearchType);
//     } else {
//       setSearchType('');
//     }
//   }, [defaultSearchType]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit(e, searchType, searchTerm);
//   };

//   return (
//     <form onSubmit={handleSubmit} role="search" aria-label="검색 폼">
//       <select
//         name="type"
//         value={searchType}
//         onChange={(e) => setSearchType(e.target.value)}
//         aria-label="검색 조건 선택"
//         disabled={disableSearchType}
//       >
//         <option value="" disabled>
//           검색 조건
//         </option>
//         <option value="medicine">의약품</option>
//         <option value="disease">질병</option>
//       </select>
//       <input
//         type="text"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         placeholder="검색어를 입력하세요"
//         aria-label="검색어 입력"
//         style={{ color: '#000' }}
//       />
//       <button type="submit" aria-label="검색" style={{ color: '#000' }}>
//         검색
//       </button>
//     </form>
//   );
// };

// export default SearchForm;