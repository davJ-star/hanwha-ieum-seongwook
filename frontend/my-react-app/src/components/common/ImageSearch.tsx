// src/components/common/ImageSearch.tsx
import React from 'react';

interface ImageSearchProps {
  onUpload: (file: File) => void;
}

const ImageSearch: React.FC<ImageSearchProps> = ({ onUpload }) => {
  return (
    <div className="image-search-container" role="region" aria-label="이미지 검색">
      <h3>이미지로 검색하기</h3>
      <div className="image-upload-box" role="button" aria-label="이미지 업로드 영역">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onUpload(e.target.files[0]);
            }
          }}
          aria-label="이미지 파일 선택"
        />
        <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
      </div>
    </div>
  );
};

export default ImageSearch;


// // components/ImageSearch.tsx
// import React from 'react';

// interface ImageSearchProps {
//   onUpload: (file: File) => void;
// }

// const ImageSearch: React.FC<ImageSearchProps> = ({ onUpload }) => {
//   return (
//     <div className="image-search-container" role="region" aria-label="이미지 검색">
//       <h3>이미지로 검색하기</h3>
//       <div className="image-upload-box" role="button" aria-label="이미지 업로드 영역">
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => {
//             if (e.target.files && e.target.files[0]) {
//               onUpload(e.target.files[0]);
//             }
//           }}
//           aria-label="이미지 파일 선택"
//         />
//         <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
//       </div>
//     </div>
//   );
// };

// export default ImageSearch;
