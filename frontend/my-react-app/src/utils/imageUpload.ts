import axios from 'axios';

export const uploadImage = async (file: File, onImageUpload: (file: File) => void, setIsLoading: (loading: boolean) => void) => {
  const formData = new FormData();
  formData.append('file', file);
  setIsLoading(true);
  try {
    const response = await axios.post(`http://13.124.88.193:8080/ocr`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    console.log('[ImageUpload] 이미지 검색 응답:', response.data);
    onImageUpload(file);
  } catch (error) {
    console.error('[ImageUpload] 이미지 검색 중 오류 발생:', error);
    alert('이미지 분석 중 오류가 발생했습니다.');
  } finally {
    setIsLoading(false);
  }
};
