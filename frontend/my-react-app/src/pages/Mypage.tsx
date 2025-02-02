// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaPlus, FaMinus, FaUpload } from 'react-icons/fa';
// import Layout from '../components/Layout/Layout';
// import axios from 'axios';
// import '../styles/pages/Mypage.css';

// interface MedicationItem {
//  id: string;
//  name: string;
//  dosage: string;
//  unit: string;
//  frequency: string;
//  time: {
//    hour: string;
//    minute: string;
//  };
//  weekday?: string;
// }

// const Mypage = () => {
//  const [medications, setMedications] = useState<MedicationItem[]>([]);
//  const [profileImage, setProfileImage] = useState<string>('');
//  const [nickname, setNickname] = useState('사용자');
//  const [tempProfileImage, setTempProfileImage] = useState<string>('');
//  const [tempNickname, setTempNickname] = useState('사용자');
//  const [loading, setLoading] = useState(true);
//  const navigate = useNavigate();

//  const defaultProfileImage = '/images/profile.png';

//  // 초기 데이터 로드
//  useEffect(() => {
//    const fetchInitialData = async () => {
//      try {
//        const response = await axios.get('/mypage', {
//          withCredentials: true
//        });

//        if (response.status === 200) {
//          const { profileImage, nickname } = response.data.mypage.fields.user;
//          setProfileImage(profileImage || defaultProfileImage);
//          setNickname(nickname);
//          setTempProfileImage(profileImage || defaultProfileImage);
//          setTempNickname(nickname);
//        }
//      } catch (error) {
//        console.error('프로필 정보 로드 실패:', error);
//        navigate('/login');
//      } finally {
//        setLoading(false);
//      }
//    };

//    fetchInitialData();
//  }, [navigate]);

//  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//    const file = event.target.files?.[0];
//    if (file) {
//      const reader = new FileReader();
//      reader.onloadend = () => {
//        setTempProfileImage(reader.result as string);
//      };
//      reader.readAsDataURL(file);
//    }
//  };

//  const handleProfileUpdate = async () => {
//    try {
//      // 닉네임 업데이트
//      if (tempNickname !== nickname) {
//        await axios.post('/mypage/update', {
//          nickname: tempNickname
//        }, {
//          withCredentials: true
//        });
//      }

//      // 프로필 이미지 업데이트
//      if (tempProfileImage !== profileImage) {
//        // base64 이미지를 File 객체로 변환
//        const response = await fetch(tempProfileImage);
//        const blob = await response.blob();
//        const formData = new FormData();
//        formData.append('image', blob, 'profile.jpg');

//        await axios.post('/mypage/profile-image', formData, {
//          headers: {
//            'Content-Type': 'multipart/form-data',
//          },
//          withCredentials: true
//        });
//      }

//      // 상태 업데이트
//      setProfileImage(tempProfileImage);
//      setNickname(tempNickname);
//      alert('프로필이 성공적으로 업데이트되었습니다.');

//    } catch (error) {
//      if (axios.isAxiosError(error)) {
//        alert(error.response?.data?.message || '프로필 업데이트에 실패했습니다.');
//      } else {
//        alert('프로필 업데이트 중 오류가 발생했습니다.');
//      }
//    }
//  };

//  //의약품 상세 정보 조회 API 호출 
//  const fetchDrugDetail = async (drugId: string) => {
//    try {
//      const response = await axios.get(`/search/${drugId}/info`);
//      return response.data;
//    } catch (error) {
//      if (axios.isAxiosError(error)) {
//        alert(error.response?.data?.message || '약물 정보를 가져오는데 실패했습니다.');
//      }
//      return null;
//    }
//  };

//  //복용약 알림 설정 API 호출
//  const setMedicationReminder = async (medication: MedicationItem) => {
//    try {
//      const response = await axios.post('/medication/reminder', {
//        drugId: medication.id,
//        drugName: medication.name,
//        dosage: medication.dosage,
//        unit: medication.unit,
//        frequency: medication.frequency,
//        time: medication.time,
//        weekday: medication.weekday,
//      }, {
//        withCredentials: true
//      });

//      if (response.status === 200) {
//        alert('복용 알림이 설정되었습니다.');
//      }
//    } catch (error) {
//      if (axios.isAxiosError(error)) {
//        alert(error.response?.data?.message || '알림 설정에 실패했습니다.');
//      }
//    }
//  };

//  const addUserMedication = async (drugId: string) => {
//    try {
//      // 1) 의약품 상세 정보 조회
//      const drugDetail = await fetchDrugDetail(drugId);
//      if (!drugDetail) {
//        return;
//      }

//      // 2) 사용자 복용약 추가
//      const response = await axios.post('/mypage/medication', {
//        drugId: drugDetail.id,
//        drugName: drugDetail.name,
//        manufacturer: drugDetail.manufacturer,
//        ingredients: drugDetail.ingredients,
//        dosageForm: drugDetail.dosageForm,
//        dosage: '',
//        unit: 'mg',
//        frequency: 'daily',
//        time: {
//          hour: '09',
//          minute: '00'
//        },
//        weekday: '월'
//      }, {
//        withCredentials: true
//      });

//      if (response.status === 200) {
//        const newMed: MedicationItem = {
//          id: response.data.id,
//          name: drugDetail.name,
//          dosage: '',
//          unit: 'mg',
//          frequency: 'daily',
//          time: { hour: '09', minute: '00' },
//          weekday: '월'
//        };
//        setMedications([...medications, newMed]);
       
//        // 3) 복용 알림 설정
//        await setMedicationReminder(newMed);
       
//        alert('복용약이 추가되었습니다.');
//      }
//    } catch (error) {
//      if (axios.isAxiosError(error)) {
//        alert(error.response?.data?.message || '복용약 추가에 실패했습니다.');
//      }
//    }
//  };

//  const handleAddMedication = () => {
//    navigate('/drug-search');
//  };

//  const handleAddToMyMedications = async (drugId: string) => {
//    await addUserMedication(drugId);
//    navigate('/mypage');
//  };

//  const addMedication = () => {
//    const newMed: MedicationItem = {
//      id: Date.now().toString(),
//      name: '',
//      dosage: '',
//      unit: 'mg',
//      frequency: 'daily',
//      time: { hour: '09', minute: '00' },
//      weekday: '월'
//    };
//    setMedications([...medications, newMed]);
//  };

//  const removeMedication = (id: string) => {
//    setMedications(medications.filter(med => med.id !== id));
//  };

//  if (loading) {
//    return <div>Loading...</div>;
//  }

//  return (
//    <Layout>
//      <main className="mypage-container" role="main">
//        <h1 className="visually-hidden">마이페이지</h1>
       
//        <section className="profile-section" aria-label="커뮤니티 프로필">
//          <div className="profile-image-container" role="img" aria-label="프로필 이미지">
//            <img 
//              src={tempProfileImage || defaultProfileImage} 
//              alt="프로필 사진" 
//              className="profile-image"
//            />
//            <label className="upload-button" role="button" aria-label="프로필 사진 업로드">
//              <FaUpload />
//              <input 
//                type="file" 
//                accept="image/*" 
//                onChange={handleImageUpload}
//                className="visually-hidden"
//              />
//            </label>
//          </div>
//          <div className="profile-input-container">
//            <input
//              type="text"
//              value={tempNickname}
//              onChange={(e) => setTempNickname(e.target.value)}
//              className="nickname-input"
//              aria-label="닉네임"
//              maxLength={20}
//            />
//            <button
//              onClick={handleProfileUpdate}
//              className="profile-update-button"
//              aria-label="프로필 변경 저장"
//            >
//              변경사항 저장
//            </button>
//          </div>
//        </section>

//        <section className="medications-section" aria-label="복용약 관리">
//          <header className="medications-header">
//            <h2>복용약 목록</h2>
//          </header>

//          <ul className="medications-list" role="list">
//            {medications.map((med) => (
//              <li key={med.id} className="medication-item" role="listitem">
//                <button
//                  className="search-drug-button"
//                  onClick={() => handleAddToMyMedications(med.id)}
//                  aria-label="의약품 검색하기"
//                >
//                  {med.name || '복용약 이름 추가'}
//                </button>

//                <div className="dosage-container">
//                  <input
//                    type="number"
//                    value={med.dosage}
//                    onChange={(e) => {
//                      const updated = medications.map(m => 
//                        m.id === med.id ? {...m, dosage: e.target.value} : m
//                      );
//                      setMedications(updated);
//                    }}
//                    aria-label="복용량"
//                  />
//                  <select
//                    value={med.unit}
//                    onChange={(e) => {
//                      const updated = medications.map(m =>
//                        m.id === med.id ? {...m, unit: e.target.value} : m
//                      );
//                      setMedications(updated);
//                    }}
//                    aria-label="복용 단위"
//                  >
//                    <option value="g">g</option>
//                    <option value="mg">mg</option>
//                    <option value="ml">ml</option>
//                    <option value="정">정</option>
//                  </select>
//                </div>

//                <div className="reminder-container">
//                  <div className="frequency-row">
//                    <select
//                      value={med.frequency}
//                      onChange={(e) => {
//                        const updated = medications.map(m =>
//                          m.id === med.id ? {...m, frequency: e.target.value} : m
//                        );
//                        setMedications(updated);
//                      }}
//                      aria-label="복용 주기"
//                    >
//                      <option value="daily">매일</option>
//                      <option value="weekly">매주</option>
//                    </select>

//                    {med.frequency === 'weekly' && (
//                      <select
//                        value={med.weekday}
//                        onChange={(e) => {
//                          const updated = medications.map(m =>
//                            m.id === med.id ? {...m, weekday: e.target.value} : m
//                          );
//                          setMedications(updated);
//                        }}
//                        aria-label="요일 선택"
//                      >
//                        {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
//                          <option key={day} value={day}>{day}요일</option>
//                        ))}
//                      </select>
//                    )}
//                  </div>

//                  <div className="time-selector">
//                    <select
//                      value={med.time.hour}
//                      onChange={(e) => {
//                        const updated = medications.map(m =>
//                          m.id === med.id ? {...m, time: {...m.time, hour: e.target.value}} : m
//                        );
//                        setMedications(updated);
//                      }}
//                      aria-label="시간"
//                    >
//                      {Array.from({length: 24}).map((_, i) => (
//                        <option key={i} value={i.toString().padStart(2, '0')}>
//                          {i.toString().padStart(2, '0')}시
//                        </option>
//                      ))}
//                    </select>
//                    <select
//                      value={med.time.minute}
//                      onChange={(e) => {
//                        const updated = medications.map(m =>
//                          m.id === med.id ? {...m, time: {...m.time, minute: e.target.value}} : m
//                        );
//                        setMedications(updated);
//                      }}
//                      aria-label="분"
//                    >
//                      {Array.from({length: 60}).map((_, i) => (
//                        <option key={i} value={i.toString().padStart(2, '0')}>
//                          {i.toString().padStart(2, '0')}분
//                        </option>
//                      ))}
//                    </select>
//                  </div>
//                </div>

//                <button
//                  onClick={() => removeMedication(med.id)}
//                  className="remove-button"
//                  aria-label="약 삭제하기"
//                >
//                  <FaMinus />
//                </button>
//              </li>
//            ))}
//          </ul>
//          <button 
//            onClick={handleAddMedication}
//            aria-label="약 추가하기"
//            className="add-medication-button"
//          >
//            복용약 추가
//          </button>
//        </section>
//      </main>
//    </Layout>
//  );
// };

// export default Mypage;

// // Mypage.tsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FaMinus, FaUpload, FaSearch } from 'react-icons/fa';
// import Layout from '../components/Layout/Layout';
// import axios from 'axios';
// import '../styles/pages/Mypage.css';

// interface MedicationItem {
//   id: string;
//   name: string;
//   dosage: string;
//   unit: string;
//   frequency: string;
//   time: {
//     hour: string;
//     minute: string;
//   };
//   weekday?: string;
// }

// interface DrugSearchResult {
//   id: string;
//   name: string;
//   // 기타 필요한 필드가 있다면 추가
// }

// interface MedicationSearchModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSelect: (medication: { id: string, name: string }) => void;
// }

// const MedicationSearchModal: React.FC<MedicationSearchModalProps> = ({ isOpen, onClose, onSelect }) => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState<Array<{ id: string, name: string }>>([]);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!searchTerm.trim()) {
//       alert('검색어를 입력해주세요.');
//       return;
//     }

//     try {
//       setLoading(true);
//       const response = await axios.get(`http://localhost:8080/search/${searchTerm.trim()}`, {
//         params: { type: 'medicine' }
//       });

//       // 응답에서 의약품 이름만 추출하여 검색 결과 설정
//       const results = response.data.map((item: any) => ({
//         id: item.id,
//         name: item.itemName || item.name || '이름 없음'
//       }));
//       setSearchResults(results);
//     } catch (error) {
//       console.error('의약품 검색 중 오류 발생:', error);
//       alert('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>의약품 검색</h2>
//         <form onSubmit={handleSearch} className="search-form">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             placeholder="의약품 이름을 입력하세요"
//             className="search-input"
//           />
//           <button type="submit" className="search-button">
//             <FaSearch /> 검색
//           </button>
//         </form>

//         <div className="search-results">
//           {loading ? (
//             <p>검색 중...</p>
//           ) : (
//             <ul>
//               {searchResults.map((result) => (
//                 <li
//                   key={result.id}
//                   onClick={() => onSelect(result)}
//                   className="search-result-item"
//                 >
//                   {result.name}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <button onClick={onClose} className="close-button">
//           닫기
//         </button>
//       </div>
//     </div>
//   );
// };

// const Mypage = () => {
//   // 프로필/복용약 관련 상태
//   const [medications, setMedications] = useState<MedicationItem[]>([]);
//   const [profileImage, setProfileImage] = useState<string>('');
//   const [nickname, setNickname] = useState('사용자');
//   const [tempProfileImage, setTempProfileImage] = useState<string>('');
//   const [tempNickname, setTempNickname] = useState('사용자');
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();
//   const defaultProfileImage = '/images/profile.png';

//   // 마이페이지 내 의약품 검색 관련 상태
//   const [showDrugSearch, setShowDrugSearch] = useState(false);
//   const [drugSearchTerm, setDrugSearchTerm] = useState('');
//   const [drugSearchResults, setDrugSearchResults] = useState<DrugSearchResult[]>([]);
//   const [selectedDrugId, setSelectedDrugId] = useState('');

//   // 프로필 정보 로드 (프로필 정보가 없으면 기본값 사용)
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const response = await axios.get('/mypage', { withCredentials: true });
//         if (response.status === 200) {
//           // 프로필 정보가 없을 수도 있으므로 optional chaining 사용
//           const user = response.data?.mypage?.fields?.user;
//           setProfileImage(user?.profileImage || defaultProfileImage);
//           setNickname(user?.nickname || '사용자');
//           setTempProfileImage(user?.profileImage || defaultProfileImage);
//           setTempNickname(user?.nickname || '사용자');
//         }
//       } catch (error) {
//         console.error('프로필 정보 로드 실패:', error);
//         if (axios.isAxiosError(error) && error.response?.status === 401) {
//           navigate('/login');
//         } else {
//           alert('프로필 정보를 불러오는데 문제가 발생했습니다.');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, [navigate]);

//   // 프로필 이미지 업로드 처리
//   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setTempProfileImage(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // 프로필 업데이트 처리
//   const handleProfileUpdate = async () => {
//     try {
//       if (tempNickname !== nickname) {
//         await axios.post('/mypage/update', { nickname: tempNickname }, { withCredentials: true });
//       }
//       if (tempProfileImage !== profileImage) {
//         const response = await fetch(tempProfileImage);
//         const blob = await response.blob();
//         const formData = new FormData();
//         formData.append('image', blob, 'profile.jpg');
//         await axios.post('/mypage/profile-image', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//           withCredentials: true
//         });
//       }
//       setProfileImage(tempProfileImage);
//       setNickname(tempNickname);
//       alert('프로필이 성공적으로 업데이트되었습니다.');
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         alert(error.response?.data?.message || '프로필 업데이트에 실패했습니다.');
//       } else {
//         alert('프로필 업데이트 중 오류가 발생했습니다.');
//       }
//     }
//   };

//   // ---------------------------
//   // 의약품 검색 관련 함수들
//   // ---------------------------
//   const handleDrugSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!drugSearchTerm.trim()) {
//       alert('검색어를 입력해주세요.');
//       return;
//     }
//     try {
//       // 의약품 검색 API 호출 (DrugSearchResult 페이지와 동일 API 사용)
//       const response = await axios.get('/search/medicine', {
//         params: { query: drugSearchTerm, page: 1, limit: 10 },
//         headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } // 필요시
//       });
//       if (response.data && response.data.results) {
//         setDrugSearchResults(response.data.results);
//       } else {
//         setDrugSearchResults([]);
//       }
//     } catch (error) {
//       console.error('의약품 검색 중 오류 발생:', error);
//       alert('의약품 검색에 실패했습니다.');
//     }
//   };

//   const handleSelectDrug = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setSelectedDrugId(e.target.value);
//   };

//   const handleAddSelectedDrug = async () => {
//     if (!selectedDrugId) {
//       alert('의약품을 선택해주세요.');
//       return;
//     }
//     await addUserMedication(selectedDrugId);
//     setShowDrugSearch(false);
//     setDrugSearchTerm('');
//     setDrugSearchResults([]);
//     setSelectedDrugId('');
//   };

//   // 기존의 addUserMedication 함수 (DrugSearchResult 페이지에서 사용한 API 호출 로직)
//   const fetchDrugDetail = async (drugId: string) => {
//     try {
//       const response = await axios.get(`/search/${drugId}/info`);
//       return response.data;
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         alert(error.response?.data?.message || '약물 정보를 가져오는데 실패했습니다.');
//       }
//       return null;
//     }
//   };

//   const setMedicationReminder = async (medication: MedicationItem) => {
//     try {
//       const response = await axios.post(
//         '/medication/reminder',
//         {
//           drugId: medication.id,
//           drugName: medication.name,
//           dosage: medication.dosage,
//           unit: medication.unit,
//           frequency: medication.frequency,
//           time: medication.time,
//           weekday: medication.weekday,
//         },
//         { withCredentials: true }
//       );
//       if (response.status === 200) {
//         alert('복용 알림이 설정되었습니다.');
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         alert(error.response?.data?.message || '알림 설정에 실패했습니다.');
//       }
//     }
//   };

//   const addUserMedication = async (drugId: string) => {
//     try {
//       const drugDetail = await fetchDrugDetail(drugId);
//       if (!drugDetail) {
//         return;
//       }
//       const response = await axios.post(
//         '/mypage/medication',
//         {
//           drugId: drugDetail.id,
//           drugName: drugDetail.name,
//           manufacturer: drugDetail.manufacturer,
//           ingredients: drugDetail.ingredients,
//           dosageForm: drugDetail.dosageForm,
//           dosage: '',
//           unit: 'mg',
//           frequency: 'daily',
//           time: { hour: '09', minute: '00' },
//           weekday: '월'
//         },
//         { withCredentials: true }
//       );
//       if (response.status === 200) {
//         const newMed: MedicationItem = {
//           id: response.data.id,
//           name: drugDetail.name,
//           dosage: '',
//           unit: 'mg',
//           frequency: 'daily',
//           time: { hour: '09', minute: '00' },
//           weekday: '월'
//         };
//         setMedications([...medications, newMed]);
//         await setMedicationReminder(newMed);
//         alert('복용약이 추가되었습니다.');
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         alert(error.response?.data?.message || '복용약 추가에 실패했습니다.');
//       }
//     }
//   };

//   // 토글: "복용약 추가" 버튼 클릭 시 의약품 검색 영역을 보여주거나 숨김
//   const handleToggleDrugSearch = () => {
//     setShowDrugSearch(!showDrugSearch);
//   };

//   // 복용약 삭제 처리
//   const removeMedication = (id: string) => {
//     setMedications(medications.filter((med) => med.id !== id));
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Layout>
//       <main className="mypage-container" role="main">
//         <h1 className="visually-hidden">마이페이지</h1>

//         {/* 프로필 영역 */}
//         <section className="profile-section" aria-label="커뮤니티 프로필">
//           <div className="profile-image-container" role="img" aria-label="프로필 이미지">
//             <img
//               src={tempProfileImage || defaultProfileImage}
//               alt="프로필 사진"
//               className="profile-image"
//             />
//             <label className="upload-button" role="button" aria-label="프로필 사진 업로드">
//               <FaUpload />
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageUpload}
//                 className="visually-hidden"
//               />
//             </label>
//           </div>
//           <div className="profile-input-container">
//             <input
//               type="text"
//               value={tempNickname}
//               onChange={(e) => setTempNickname(e.target.value)}
//               className="nickname-input"
//               aria-label="닉네임"
//               maxLength={20}
//             />
//             <button
//               onClick={handleProfileUpdate}
//               className="profile-update-button"
//               aria-label="프로필 변경 저장"
//             >
//               변경사항 저장
//             </button>
//           </div>
//         </section>

//         {/* 의약품 검색 모달 */}
//         <MedicationSearchModal
//           isOpen={showDrugSearch}
//           onClose={() => setShowDrugSearch(false)}
//           onSelect={(medication) => {
//             addUserMedication(medication.id);
//             setShowDrugSearch(false);
//           }}
//         />

//         {/* 복용약 관리 영역 */}
//         <section className="medications-section" aria-label="복용약 관리">
//           <header className="medications-header">
//             <h2>복용약 목록</h2>
//           </header>
//           <ul className="medications-list" role="list">
//             {medications.map((med) => (
//               <li key={med.id} className="medication-item" role="listitem">
//                 <button className="search-drug-button" aria-label="의약품 검색하기">
//                   {med.name || '복용약 이름 추가'}
//                 </button>
//                 <div className="dosage-container">
//                   <input
//                     type="number"
//                     value={med.dosage}
//                     onChange={(e) => {
//                       const updated = medications.map((m) =>
//                         m.id === med.id ? { ...m, dosage: e.target.value } : m
//                       );
//                       setMedications(updated);
//                     }}
//                     aria-label="복용량"
//                   />
//                   <select
//                     value={med.unit}
//                     onChange={(e) => {
//                       const updated = medications.map((m) =>
//                         m.id === med.id ? { ...m, unit: e.target.value } : m
//                       );
//                       setMedications(updated);
//                     }}
//                     aria-label="복용 단위"
//                   >
//                     <option value="g">g</option>
//                     <option value="mg">mg</option>
//                     <option value="ml">ml</option>
//                     <option value="정">정</option>
//                   </select>
//                 </div>
//                 <div className="reminder-container">
//                   <div className="frequency-row">
//                     <select
//                       value={med.frequency}
//                       onChange={(e) => {
//                         const updated = medications.map((m) =>
//                           m.id === med.id ? { ...m, frequency: e.target.value } : m
//                         );
//                         setMedications(updated);
//                       }}
//                       aria-label="복용 주기"
//                     >
//                       <option value="daily">매일</option>
//                       <option value="weekly">매주</option>
//                     </select>
//                     {med.frequency === 'weekly' && (
//                       <select
//                         value={med.weekday}
//                         onChange={(e) => {
//                           const updated = medications.map((m) =>
//                             m.id === med.id ? { ...m, weekday: e.target.value } : m
//                           );
//                           setMedications(updated);
//                         }}
//                         aria-label="요일 선택"
//                       >
//                         {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
//                           <option key={day} value={day}>{day}요일</option>
//                         ))}
//                       </select>
//                     )}
//                   </div>
//                   <div className="time-selector">
//                     <select
//                       value={med.time.hour}
//                       onChange={(e) => {
//                         const updated = medications.map((m) =>
//                           m.id === med.id ? { ...m, time: { ...m.time, hour: e.target.value } } : m
//                         );
//                         setMedications(updated);
//                       }}
//                       aria-label="시간"
//                     >
//                       {Array.from({ length: 24 }).map((_, i) => (
//                         <option key={i} value={i.toString().padStart(2, '0')}>
//                           {i.toString().padStart(2, '0')}시
//                         </option>
//                       ))}
//                     </select>
//                     <select
//                       value={med.time.minute}
//                       onChange={(e) => {
//                         const updated = medications.map((m) =>
//                           m.id === med.id ? { ...m, time: { ...m.time, minute: e.target.value } } : m
//                         );
//                         setMedications(updated);
//                       }}
//                       aria-label="분"
//                     >
//                       {Array.from({ length: 60 }).map((_, i) => (
//                         <option key={i} value={i.toString().padStart(2, '0')}>
//                           {i.toString().padStart(2, '0')}분
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => removeMedication(med.id)}
//                   className="remove-button"
//                   aria-label="약 삭제하기"
//                 >
//                   <FaMinus />
//                 </button>
//               </li>
//             ))}
//           </ul>
//           <button
//             onClick={handleToggleDrugSearch}
//             aria-label="약 추가하기"
//             className="add-medication-button"
//           >
//             복용약 추가
//           </button>
//         </section>
//       </main>
//     </Layout>
//   );
// };

// export default Mypage;
//                         {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
//                           <option key={day} value={day}>
//                             {day}요일
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                   </div>
//                   <div className="time-selector">
//                     <select
//                       value={med.time.hour}
//                       onChange={(e) => {
//                         const updated = medications.map((m) =>
//                           m.id === med.id ? { ...m, time: { ...m.time, hour: e.target.value } } : m
//                         );
//                         setMedications(updated);
//                       }}
//                       aria-label="시간"
//                     >
//                       {Array.from({ length: 24 }).map((_, i) => (
//                         <option key={i} value={i.toString().padStart(2, '0')}>
//                           {i.toString().padStart(2, '0')}시
//                         </option>
//                       ))}
//                     </select>
//                     <select
//                       value={med.time.minute}
//                       onChange={(e) => {
//                         const updated = medications.map((m) =>
//                           m.id === med.id ? { ...m, time: { ...m.time, minute: e.target.value } } : m
//                         );
//                         setMedications(updated);
//                       }}
//                       aria-label="분"
//                     >
//                       {Array.from({ length: 60 }).map((_, i) => (
//                         <option key={i} value={i.toString().padStart(2, '0')}>
//                           {i.toString().padStart(2, '0')}분
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//                 <button onClick={() => removeMedication(med.id)} className="remove-button" aria-label="약 삭제하기">
//                   <FaMinus />
//                 </button>
//               </li>
//             ))}
//           </ul>
//           {/* "복용약 추가" 버튼는 여기서는 의약품 검색 영역 토글로 동작 */}
//           <button onClick={handleToggleDrugSearch} aria-label="약 추가하기" className="add-medication-button">
//             {showDrugSearch ? '검색 숨기기' : '복용약 추가'}
//           </button>
//         </section>
//       </main>
//     </Layout>
//   );
// };

// export default Mypage;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { FaPlus, FaMinus, FaUpload } from 'react-icons/fa';
import '../styles/pages/Mypage.css';
import axios from 'axios';

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  unit: string;
  frequency: string;
  time: {
    hour: string;
    minute: string;
  };
  weekday?: string;
}

interface MedicationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (medication: { id: string, name: string }) => void;
}

const MedicationSearchModal: React.FC<MedicationSearchModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ id: string, name: string }>>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      alert('검색어를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/search/${searchTerm.trim()}`, {
        params: { type: 'medicine' }
      });

      // 응답에서 의약품 이름만 추출하여 검색 결과 설정
      const results = response.data.map((item: any) => ({
        id: item.id,
        name: item.itemName || item.name || '이름 없음'
      }));
      setSearchResults(results);
    } catch (error) {
      console.error('의약품 검색 중 오류 발생:', error);
      alert('검색 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <h2>의약품 검색</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="의약품명을 입력하세요"
          />
          <button type="submit">검색</button>
        </form>

        <div className="search-results">
          {loading ? (
            <p>검색 중...</p>
          ) : (
            <ul>
              {searchResults.map((result) => (
                <li 
                  key={result.id}
                  onClick={() => {
                    onSelect(result);
                    onClose();
                  }}
                >
                  {result.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="close-button" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

const Mypage = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState<MedicationItem[]>([]);
  const [profileImage, setProfileImage] = useState<string>('');
  const [nickname, setNickname] = useState('사용자');
  const [tempProfileImage, setTempProfileImage] = useState<string>('');
  const [tempNickname, setTempNickname] = useState('사용자');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState<string>('');

  const defaultProfileImage = '/images/profile.png';

  React.useEffect(() => {
    setTempProfileImage(profileImage);
    setTempNickname(nickname);
  }, [profileImage, nickname]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      if (tempProfileImage && tempProfileImage !== profileImage) {
        const response = await fetch(tempProfileImage);
        const blob = await response.blob();
        formData.append('image', blob, 'profile.jpg');
      }
      formData.append('nickname', tempNickname);
      //프로필 이미지 업데이트 API 호출 추가(테스트 전)
      const response = await axios.post('/{id}/mypage/profile-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 200) {
        setProfileImage(tempProfileImage);
        setNickname(tempNickname);
        alert('프로필이 성공적으로 업데이트되었습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '프로필 업데이트에 실패했습니다.');
      }
    }
  };

  //의약품 상세 정보 조회 API 호출 추가(테스트 전)
  const fetchDrugDetail = async (drugId: string) => {
    try {
      const response = await axios.get(`http://localhost:8080/search/${drugId}/info`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '약물 정보를 가져오는데 실패했습니다.');
      }
      return null;
    }
  };

  //복용약 알림 설정 API 호출 추가(테스트 전)
  const setMedicationReminder = async (medication: MedicationItem) => {
    try {
      const response = await axios.post('/*추후추가예정*/', {
        drugId: medication.id,
        drugName: medication.name,
        dosage: medication.dosage,
        unit: medication.unit,
        frequency: medication.frequency,
        time: medication.time,
        weekday: medication.weekday,
        userEmail: 'user@example.com' // 현재 로그인한 사용자의 이메일
      });

      if (response.status === 200) {
        alert('복용 알림이 설정되었습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '알림 설정에 실패했습니다.');
      }
    }
  };

  const addUserMedication = async (drugId: string) => {
    try {
      // 1) 의약품 상세 정보 조회 API 호출 추가(테스트 전) 
      const drugDetail = await fetchDrugDetail(drugId);
      if (!drugDetail) {
        return;
      }

      // 2) 사용자 복용약 추가 API 호출 추가(테스트 전)
      const response = await axios.post('/{id}/mypage/medication', {
        drugId: drugDetail.id,
        drugName: drugDetail.name,
        manufacturer: drugDetail.manufacturer,
        ingredients: drugDetail.ingredients,
        dosageForm: drugDetail.dosageForm,
        dosage: '',
        unit: 'mg',
        frequency: 'daily',
        time: {
          hour: '09',
          minute: '00'
        },
        weekday: '월'
      });

      if (response.status === 200) {
        const newMed: MedicationItem = {
          id: response.data.id,
          name: drugDetail.name,
          dosage: '',
          unit: 'mg',
          frequency: 'daily',
          time: { hour: '09', minute: '00' },
          weekday: '월'
        };
        setMedications([...medications, newMed]);
        
        // 3) 복용 알림 설정 API 호출 추가(테스트 전)
        await setMedicationReminder(newMed);
        
        alert('복용약이 추가되었습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '복용약 추가에 실패했습니다.');
      }
    }
  };

  const handleAddMedication = () => {
    navigate('/drug-search');
  };

  const handleAddToMyMedications = async (drugId: string) => {
    await addUserMedication(drugId);
    navigate('/mypage');
  };

  React.useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // 프로필 정보 조회 API 호출 추가(테스트 전)
        const response = await axios.get('/*추후추가예정*/');
        if (response.status === 200) {
          setProfileImage(response.data.profileImage);
          setNickname(response.data.nickname);
          setTempProfileImage(response.data.profileImage);
          setTempNickname(response.data.nickname);
        }
      } catch (error) {
        console.error('프로필 정보 로드 실패:', error);
      }
    };

    fetchProfileData();
  }, []);

  const addMedication = () => {
    const newMed: MedicationItem = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      unit: 'mg',
      frequency: 'daily',
      time: { hour: '09', minute: '00' },
      weekday: '월'
    };
    setMedications([...medications, newMed]);
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const handleMedicationSelect = async (medication: { id: string, name: string }) => {
    const updatedMedications = medications.map(med => {
      if (med.id === selectedMedicationId) {
        return { ...med, id: medication.id, name: medication.name };
      }
      return med;
    });
    setMedications(updatedMedications);
  };

  const handleSearchDrugClick = (medicationId: string) => {
    setSelectedMedicationId(medicationId);
    setIsSearchModalOpen(true);
  };

  return (
    <Layout>
      <main className="mypage-container" role="main">
        <h1 className="visually-hidden">마이페이지</h1>
        
        <section className="profile-section" aria-label="커뮤니티 프로필">
          <div className="profile-image-container" role="img" aria-label="프로필 이미지">
            <img 
              src={tempProfileImage || defaultProfileImage} 
              alt="프로필 사진" 
              className="profile-image"
            />
            <label className="upload-button" role="button" aria-label="프로필 사진 업로드">
              <FaUpload />
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="visually-hidden"
              />
            </label>
          </div>
          <div className="profile-input-container">
            <input
              type="text"
              value={tempNickname}
              onChange={(e) => setTempNickname(e.target.value)}
              className="nickname-input"
              aria-label="닉네임"
              maxLength={20}
            />
            <button
              onClick={handleProfileUpdate}
              className="profile-update-button"
              aria-label="프로필 변경 저장"
            >
              변경사항 저장
            </button>
          </div>
        </section>

        <section className="medications-section" aria-label="복용약 관리">
          <header className="medications-header">
            <h2>복용약 목록</h2>
          </header>

          <ul className="medications-list" role="list">
            {medications.map((med) => (
              <li key={med.id} className="medication-item" role="listitem">
                <button
                  className="search-drug-button"
                  onClick={() => handleSearchDrugClick(med.id)}
                  aria-label="의약품 검색하기"
                >
                  {med.name || '복용약 이름 추가'}
                </button>

                <div className="dosage-container">
                  <input
                    type="number"
                    value={med.dosage}
                    onChange={(e) => {
                      const updated = medications.map(m => 
                        m.id === med.id ? {...m, dosage: e.target.value} : m
                      );
                      setMedications(updated);
                    }}
                    aria-label="복용량"
                  />
                  <select
                    value={med.unit}
                    onChange={(e) => {
                      const updated = medications.map(m =>
                        m.id === med.id ? {...m, unit: e.target.value} : m
                      );
                      setMedications(updated);
                    }}
                    aria-label="복용 단위"
                  >
                    <option value="g">g</option>
                    <option value="mg">mg</option>
                    <option value="ml">ml</option>
                    <option value="정">정</option>
                  </select>
                </div>

                <div className="reminder-container">
                  <select
                    value={med.frequency}
                    onChange={(e) => {
                      const updated = medications.map(m =>
                        m.id === med.id ? {...m, frequency: e.target.value} : m
                      );
                      setMedications(updated);
                    }}
                    aria-label="복용 주기"
                  >
                    <option value="daily">매일</option>
                    <option value="weekly">매주</option>
                  </select>

                  {med.frequency === 'weekly' && (
                    <select
                      value={med.weekday}
                      onChange={(e) => {
                        const updated = medications.map(m =>
                          m.id === med.id ? {...m, weekday: e.target.value} : m
                        );
                        setMedications(updated);
                      }}
                      aria-label="요일 선택"
                    >
                      {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
                        <option key={day} value={day}>{day}요일</option>
                      ))}
                    </select>
                  )}

                  <div className="time-selector">
                    <select
                      value={med.time.hour}
                      onChange={(e) => {
                        const updated = medications.map(m =>
                          m.id === med.id ? {...m, time: {...m.time, hour: e.target.value}} : m
                        );
                        setMedications(updated);
                      }}
                      aria-label="시간"
                    >
                      {Array.from({length: 24}).map((_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}시
                        </option>
                      ))}
                    </select>
                    <select
                      value={med.time.minute}
                      onChange={(e) => {
                        const updated = medications.map(m =>
                          m.id === med.id ? {...m, time: {...m.time, minute: e.target.value}} : m
                        );
                        setMedications(updated);
                      }}
                      aria-label="분"
                    >
                      {Array.from({length: 60}).map((_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}분
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => removeMedication(med.id)}
                  className="remove-button"
                  aria-label="약 삭제하기"
                >
                  <FaMinus />
                </button>
              </li>
            ))}
          </ul>
          <button 
            onClick={addMedication}
            aria-label="약 추가하기"
            className="add-medication-button"
          >
            복용약 추가
          </button>
        </section>
      </main>

      <MedicationSearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        onSelect={handleMedicationSelect}
      />
    </Layout>
  );
};

export default Mypage;
