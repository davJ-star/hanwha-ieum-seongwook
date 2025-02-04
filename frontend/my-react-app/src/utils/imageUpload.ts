import axios from 'axios';

export const uploadImage = async (
  file: File,
  onImageUpload: (data: SearchResult[]) => void, // `File`이 아니라 `SearchResult[]`을 넘겨줌
  setIsLoading: (loading: boolean) => void
) => {
  const formData = new FormData();
  formData.append('file', file);
  setIsLoading(true);

  try {
    const response = await axios.post(`http://13.124.88.193:8080/ocr`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('[ImageUpload] 이미지 검색 응답:', response.data);

    if (Array.isArray(response.data)) {
      onImageUpload(response.data); // `response.data`를 콜백으로 전달
    } else {
      onImageUpload([]); // API 응답이 배열이 아닐 경우 빈 배열 전달
    }
  } catch (error) {
    console.error('[ImageUpload] 이미지 검색 중 오류 발생:', error);
    alert('이미지 분석 중 오류가 발생했습니다.');
    onImageUpload([]); // 에러 발생 시 빈 배열 전달
  } finally {
    setIsLoading(false);
  }
};


// import axios from 'axios';

// export const uploadImage = async (
//   file: File,
//   onImageUpload: (data: any) => void, // file이 아니라 API 응답 데이터를 받도록 변경
//   setIsLoading: (loading: boolean) => void
// ) => {
//   const formData = new FormData();
//   formData.append('file', file);
//   setIsLoading(true);
//   try {
//     const response = await axios.post(`http://13.124.88.193:8080/ocr`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     console.log('[ImageUpload] 이미지 검색 응답:', response.data);
//     onImageUpload(response.data); // API 응답 데이터를 넘겨줌
//   } catch (error) {
//     console.error('[ImageUpload] 이미지 검색 중 오류 발생:', error);
//     alert('이미지 분석 중 오류가 발생했습니다.');
//   } finally {
//     setIsLoading(false);
//   }
// };


// // import axios from 'axios';

// // export const uploadImage = async (file: File, onImageUpload: (file: File) => void, setIsLoading: (loading: boolean) => void) => {
// //   const formData = new FormData();
// //   formData.append('file', file);
// //   setIsLoading(true);
// //   try {
// //     const response = await axios.post(`http://13.124.88.193:8080/ocr`, formData, {
// //       headers: { 'Content-Type': 'multipart/form-data' },
// //     });
// //     console.log('[ImageUpload] 이미지 검색 응답:', response.data);
// //     onImageUpload(file);
// //   } catch (error) {
// //     console.error('[ImageUpload] 이미지 검색 중 오류 발생:', error);
// //     alert('이미지 분석 중 오류가 발생했습니다.');
// //   } finally {
// //     setIsLoading(false);
// //   }
// // };
