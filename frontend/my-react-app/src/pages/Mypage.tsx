import React, { useState, useEffect, KeyboardEvent } from 'react';
import axios from 'axios';
import Layout from '../components/Layout/Layout';
import { FaPlus, FaMinus, FaUpload } from 'react-icons/fa';
import '../styles/pages/Mypage.css';

interface TimeData {
  hour: string;
  minute: string;
}

interface MedicationData {
  drugName: string;
  dosage: number;
  unit: string;
  frequency: string;
  time: TimeData;
  weekday?: string;
}

interface DrugSearchResult {
  id: number;
  itemName: string;
  entpName: string;
}

interface NewMedication {
  drugName: string;
  dosage: number;
  unit: string;
  frequency: string;
  hour: string;
  minute: string;
  weekday?: string;
}

const Mypage = () => {
  const [medications, setMedications] = useState<MedicationData[]>([]);
  const [profileImage, setProfileImage] = useState('');
  const [nickname, setNickname] = useState('');
  const [tempProfileImage, setTempProfileImage] = useState('');
  const [tempNickname, setTempNickname] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<DrugSearchResult[]>([]);
  const [newMedication, setNewMedication] = useState<NewMedication>({
    drugName: '',
    dosage: 1,
    unit: 'MG',
    frequency: 'daily',
    hour: '09',
    minute: '00'
  });
  const defaultProfileImage = '/images/profile.png';

  useEffect(() => {
    fetchMyPageData();
  }, []);

  const fetchMyPageData = async () => {
    try {
      const response = await axios.get('http://localhost:8080/mypage', {
        withCredentials: true
      });
      
      if (response.status === 200) {
        const userData = response.data.mypage.fields.user;
        const medicationData = response.data.mypage.fields.medications;
        
        setProfileImage(userData.profileImage);
        setNickname(userData.nickname);
        setTempProfileImage(userData.profileImage);
        setTempNickname(userData.nickname);
        setMedications(medicationData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    try {
      const response = await axios.get(`http://localhost:8080/search/${searchTerm}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('약품 검색 실패:', error);
      alert('약품 검색에 실패했습니다.');
    }
  };

  const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleDrugSelect = (drug: DrugSearchResult) => {
    setNewMedication(prev => ({
      ...prev,
      drugName: drug.itemName
    }));
    setIsSearchModalOpen(false);
    setSearchResults([]);
    setSearchTerm('');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempNickname(e.target.value);
  };

  const handleNameUpdate = async () => {
    try {
      const response = await axios.post('http://localhost:8080/mypage/update', 
        null, 
        { 
          params: { name: tempNickname },
          withCredentials: true 
        }
      );
      if (response.status === 200) {
        setNickname(tempNickname);
        alert('이름이 변경되었습니다.');
      }
    } catch (error) {
      alert('이름 변경 실패');
    }
  };

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

  const handleImageUpdate = async () => {
    try {
      const file = await fetch(tempProfileImage).then(r => r.blob());
      const formData = new FormData();
      formData.append('image', file, 'profile.jpg');

      await axios.post('http://localhost:8080/mypage/profile-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      setProfileImage(tempProfileImage);
      alert('프로필 이미지가 업데이트되었습니다.');
    } catch (error) {
      alert('프로필 이미지 업데이트에 실패했습니다.');
    }
  };

  const handleAddMedication = async () => {
    if (!newMedication.drugName) {
      alert('약품을 선택해주세요.');
      return;
    }

    try {
      const medicationRequest = {
        drugName: newMedication.drugName,
        dosage: newMedication.dosage,
        unit: newMedication.unit,
        cycle: newMedication.frequency.toUpperCase(),
        hour: parseInt(newMedication.hour),
        minute: parseInt(newMedication.minute),
        dayOfWeek: newMedication.frequency === 'weekly' ? newMedication.weekday?.toUpperCase() : null
      };

      await axios.post('http://localhost:8080/mypage/medication', 
        medicationRequest,
        { withCredentials: true }
      );

      await fetchMyPageData();
      
      setNewMedication({
        drugName: '',
        dosage: 1,
        unit: 'MG',
        frequency: 'daily',
        hour: '09',
        minute: '00'
      });

      alert('복용약이 추가되었습니다.');
    } catch (error) {
      alert('복용약 추가에 실패했습니다.');
    }
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
              onChange={handleNameChange}
              className="nickname-input"
              aria-label="닉네임"
              maxLength={20}
            />
            <div className="button-container">
              <button
                onClick={handleNameUpdate}
                className="profile-update-button"
                aria-label="이름 변경"
              >
                이름 변경
              </button>
              <button
                onClick={handleImageUpdate}
                className="profile-update-button"
                aria-label="이미지 변경"
              >
                이미지 변경
              </button>
            </div>
          </div>
        </section>

        <section className="medications-section" aria-label="복용약 관리">
          <header className="medications-header">
            <h2>복용약 목록</h2>
            <button 
              className="add-medication-button"
              onClick={() => setIsSearchModalOpen(true)}
            >
              새 약품 추가
            </button>
          </header>

          <div className="medications-list">
            {medications.map((med, index) => (
              <div key={index} className="medication-item">
                <div className="medication-content">
                  <h3 className="medication-name">약품명: {med.drugName}</h3>
                  <div className="medication-details">
                    <p>복용량: {med.dosage}{med.unit}</p>
                    <p>복용 주기: {med.frequency}</p>
                    <p>복용 시간: {med.time.hour}:{med.time.minute}</p>
                    {med.weekday && <p>요일: {med.weekday}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isSearchModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <h3>약품 검색</h3>
                <div className="search-container">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    placeholder="약품명 입력"
                  />
                  <button onClick={handleSearch}>검색</button>
                </div>
                <div className="search-results">
                  {searchResults.map((drug) => (
                    <div
                      key={drug.id}
                      className="search-result-item"
                      onClick={() => handleDrugSelect(drug)}
                    >
                      <h4>{drug.itemName}</h4>
                      <p>{drug.entpName}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => {
                  setIsSearchModalOpen(false);
                  setSearchResults([]);
                  setSearchTerm('');
                }}>닫기</button>
              </div>
            </div>
          )}

          {newMedication.drugName && (
            <div className="new-medication-form">
              <h3>새 약품 추가</h3>
              <div className="form-group">
                <label>약품명</label>
                <input type="text" value={newMedication.drugName} readOnly className="mediName"/>
              </div>
              <div className="form-group">
                <label>복용량</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  className='dosage-input'
                  value={newMedication.dosage}
                  onChange={(e) => setNewMedication(prev => ({
                    ...prev,
                    dosage: e.target.value === '' ? 0 : parseFloat(e.target.value)
                  }))}
                />
                <select
                  value={newMedication.unit}
                  onChange={(e) => setNewMedication(prev => ({
                    ...prev,
                    unit: e.target.value
                  }))}
                >
                  <option value="MG">mg</option>
                  <option value="MCG">mcg</option>
                  <option value="G">g</option>
                  <option value="ML">ml</option>
                  <option value="TABLET">정</option>
                </select>
              </div>
              <div className="form-group">
                <label>복용 주기</label>
                <select
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication(prev => ({
                    ...prev,
                    frequency: e.target.value,
                    weekday: e.target.value === 'weekly' ? 'MONDAY' : undefined
                  }))}
                >
                  <option value="daily">매일</option>
                  <option value="weekly">매주</option>
                </select>
              </div>
              {newMedication.frequency === 'weekly' && (
                <div className="form-group">
                  <label>요일</label>
                  <select
                    value={newMedication.weekday}
                    onChange={(e) => setNewMedication(prev => ({
                      ...prev,
                      weekday: e.target.value
                    }))}
                  >
                    <option value="MONDAY">월요일</option>
                    <option value="TUESDAY">화요일</option>
                    <option value="WEDNESDAY">수요일</option>
                    <option value="THURSDAY">목요일</option>
                    <option value="FRIDAY">금요일</option>
                    <option value="SATURDAY">토요일</option>
                    <option value="SUNDAY">일요일</option>
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>복용 시간</label>
                <select
                  value={newMedication.hour}
                  onChange={(e) => setNewMedication(prev => ({
                    ...prev,
                    hour: e.target.value
                  }))}
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}시
                    </option>
                  ))}
                </select>
                <select
                  value={newMedication.minute}
                  onChange={(e) => setNewMedication(prev => ({
                    ...prev,
                    minute: e.target.value
                  }))}
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={i.toString().padStart(2, '0')}>
                      {i.toString().padStart(2, '0')}분
                    </option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleAddMedication}
                className="add-button"
              >
                추가
              </button>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
};

export default Mypage;

// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import Layout from '../components/Layout/Layout';
// // import { FaPlus, FaMinus, FaUpload } from 'react-icons/fa';
// // import '../styles/pages/Mypage.css';

// // interface TimeData {
// //   hour: string;
// //   minute: string;
// // }

// // interface MedicationData {
// //   drugName: string;
// //   dosage: number;
// //   unit: string;
// //   frequency: string;
// //   time: TimeData;
// //   weekday?: string;
// // }

// // const Mypage = () => {
// //   const [medications, setMedications] = useState<MedicationData[]>([]);
// //   const [profileImage, setProfileImage] = useState('');
// //   const [nickname, setNickname] = useState('');
// //   const [tempProfileImage, setTempProfileImage] = useState('');
// //   const [tempNickname, setTempNickname] = useState('');
// //   const defaultProfileImage = '/images/profile.png';

// //   useEffect(() => {
// //     const fetchMyPageData = async () => {
// //       try {
// //         const response = await axios.get('http://localhost:8080/mypage', {
// //           withCredentials: true
// //         });
        
// //         if (response.status === 200) {
// //           const userData = response.data.mypage.fields.user;
// //           const medicationData = response.data.mypage.fields.medications;
          
// //           setProfileImage(userData.profileImage);
// //           setNickname(userData.nickname);
// //           setTempProfileImage(userData.profileImage);
// //           setTempNickname(userData.nickname);
// //           setMedications(medicationData);
// //         }
// //       } catch (error) {
// //         console.error('Error:', error);
// //       }
// //     };

// //     fetchMyPageData();
// //   }, []);

// //   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
// //     const file = event.target.files?.[0];
// //     if (file) {
// //       const reader = new FileReader();
// //       reader.onloadend = () => {
// //         setTempProfileImage(reader.result as string);
// //       };
// //       reader.readAsDataURL(file);
// //     }
// //   };

// //   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     setTempNickname(e.target.value);
// //   };

// //   const handleNameUpdate = async () => {
// //     try {
// //       const response = await axios.post('http://localhost:8080/mypage/update', 
// //         null, 
// //         { 
// //           params: { name: tempNickname },
// //           withCredentials: true 
// //         }
// //       );
// //       if (response.status === 200) {
// //         setNickname(tempNickname);
// //         alert('이름이 변경되었습니다.');
// //       }
// //     } catch (error) {
// //       alert('이름 변경 실패');
// //     }
// //   };
// //   const handleImageUpdate = async () => {
// //     try {
// //       const file = event.target.files?.[0];
// //       if (!file) return;
  
// //       const formData = new FormData();
// //       formData.append('image', file);
  
// //       await axios.post('http://localhost:8080/mypage/profile-image', formData, {
// //         headers: { 'Content-Type': 'multipart/form-data' },
// //         withCredentials: true
// //       });
  
// //       setProfileImage(URL.createObjectURL(file));
// //       alert('프로필 이미지가 업데이트되었습니다.');
// //     } catch (error) {
// //       alert('프로필 이미지 업데이트에 실패했습니다.');
// //     }
// //   };

// //   return (
// //     <Layout>
// //       <main className="mypage-container" role="main">
// //         <h1 className="visually-hidden">마이페이지</h1>
        
// //         <section className="profile-section" aria-label="커뮤니티 프로필">
// //           <div className="profile-image-container" role="img" aria-label="프로필 이미지">
// //             <img 
// //               src={tempProfileImage || defaultProfileImage} 
// //               alt="프로필 사진" 
// //               className="profile-image"
// //             />
// //             <label className="upload-button" role="button" aria-label="프로필 사진 업로드">
// //               <FaUpload />
// //               <input 
// //                 type="file" 
// //                 accept="image/*" 
// //                 onChange={handleImageUpload}
// //                 className="visually-hidden"
// //               />
// //             </label>
// //           </div>
// //           <div className="profile-input-container">
// //             <input
// //               type="text"
// //               value={tempNickname}
// //               onChange={handleNameChange}
// //               className="nickname-input"
// //               aria-label="닉네임"
// //               maxLength={20}
// //             />
// //             <div className="button-container">
// //               <button
// //                 onClick={handleNameUpdate}
// //                 className="profile-update-button"
// //                 aria-label="이름 변경"
// //               >
// //                 이름 변경
// //               </button>
// //               <button
// //                 onClick={handleImageUpdate}
// //                 className="profile-update-button"
// //                 aria-label="이미지 변경"
// //               >
// //                 이미지 변경
// //               </button>
// //             </div>
// //           </div>
// //         </section>

// //         <section className="medications-section" aria-label="복용약 관리">
// //           <header className="medications-header">
// //             <h2>복용약 목록</h2>
// //           </header>

// //           <div className="medications-list">
// //             {medications.map((med, index) => (
// //               <div key={index} className="medication-item">
// //                 <div className="medication-content">
// //                   <h3 className="medication-name">약품명: {med.drugName}</h3>
// //                   <div className="medication-details">
// //                     <p>복용량: {med.dosage}{med.unit}</p>
// //                     <p>복용 주기: {med.frequency}</p>
// //                     <p>복용 시간: {med.time.hour}:{med.time.minute}</p>
// //                     {med.weekday && <p>요일: {med.weekday}</p>}
// //                   </div>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         </section>
// //       </main>
// //     </Layout>
// //   );
// // };

// // export default Mypage;

// // // import React, { useState, useEffect } from 'react';
// // // import axios from 'axios';
// // // import Layout from '../components/Layout/Layout';
// // // import { FaPlus, FaMinus, FaUpload } from 'react-icons/fa';
// // // import '../styles/pages/Mypage.css';

// // // interface TimeData {
// // //   hour: string;
// // //   minute: string;
// // // }

// // // interface MedicationData {
// // //   drugName: string;
// // //   dosage: number;
// // //   unit: string;
// // //   frequency: string;
// // //   time: TimeData;
// // //   weekday?: string;
// // // }

// // // const Mypage = () => {
// // //   const [medications, setMedications] = useState<MedicationData[]>([]);
// // //   const [profileImage, setProfileImage] = useState('');
// // //   const [nickname, setNickname] = useState('');
// // //   const [tempProfileImage, setTempProfileImage] = useState('');
// // //   const [tempNickname, setTempNickname] = useState('');
// // //   const defaultProfileImage = '/images/profile.png';

// // //   useEffect(() => {
// // //     const fetchMyPageData = async () => {
// // //       try {
// // //         const response = await axios.get('http://localhost:8080/mypage', {
// // //           withCredentials: true
// // //         });
        
// // //         if (response.status === 200) {
// // //           const userData = response.data.mypage.fields.user;
// // //           const medicationData = response.data.mypage.fields.medications;
          
// // //           setProfileImage(userData.profileImage);
// // //           setNickname(userData.nickname);
// // //           setTempProfileImage(userData.profileImage);
// // //           setTempNickname(userData.nickname);
// // //           setMedications(medicationData);
// // //         }
// // //       } catch (error) {
// // //         console.error('Error:', error);
// // //       }
// // //     };

// // //     fetchMyPageData();
// // //   }, []);

// // //   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
// // //     const file = event.target.files?.[0];
// // //     if (file) {
// // //       const reader = new FileReader();
// // //       reader.onloadend = () => {
// // //         setTempProfileImage(reader.result as string);
// // //       };
// // //       reader.readAsDataURL(file);
// // //     }
// // //   };

// // //   const handleProfileUpdate = async () => {
// // //     try {
// // //       const formData = new FormData();
// // //       if (tempProfileImage && tempProfileImage !== profileImage) {
// // //         const response = await fetch(tempProfileImage);
// // //         const blob = await response.blob();
// // //         formData.append('image', blob, 'profile.jpg');
// // //       }
// // //       formData.append('nickname', tempNickname);

// // //       await axios.post('http://localhost:8080/mypage/profile-image', formData, {
// // //         headers: { 'Content-Type': 'multipart/form-data' },
// // //         withCredentials: true
// // //       });

// // //       setProfileImage(tempProfileImage);
// // //       setNickname(tempNickname);
// // //       alert('프로필이 업데이트되었습니다.');
// // //     } catch (error) {
// // //       console.error('Profile update error:', error);
// // //       alert('프로필 업데이트에 실패했습니다.');
// // //     }
// // //   };

// // //   return (
// // //     <Layout>
// // //       <main className="mypage-container" role="main">
// // //         <h1 className="visually-hidden">마이페이지</h1>
        
// // //         <section className="profile-section" aria-label="커뮤니티 프로필">
// // //           <div className="profile-image-container" role="img" aria-label="프로필 이미지">
// // //             <img 
// // //               src={tempProfileImage || defaultProfileImage} 
// // //               alt="프로필 사진" 
// // //               className="profile-image"
// // //             />
// // //             <label className="upload-button" role="button" aria-label="프로필 사진 업로드">
// // //               <FaUpload />
// // //               <input 
// // //                 type="file" 
// // //                 accept="image/*" 
// // //                 onChange={handleImageUpload}
// // //                 className="visually-hidden"
// // //               />
// // //             </label>
// // //           </div>
// // //           <div className="profile-input-container">
// // //             <input
// // //               type="text"
// // //               value={tempNickname}
// // //               onChange={(e) => setTempNickname(e.target.value)}
// // //               className="nickname-input"
// // //               aria-label="닉네임"
// // //               maxLength={20}
// // //             />
// // //             <button
// // //               onClick={handleProfileUpdate}
// // //               className="profile-update-button"
// // //               aria-label="프로필 변경 저장"
// // //             >
// // //               변경사항 저장
// // //             </button>
// // //           </div>
// // //         </section>

// // //         <section className="medications-section" aria-label="복용약 관리">
// // //           <header className="medications-header">
// // //             <h2>복용약 목록</h2>
// // //           </header>

// // //           <div className="medications-list">
// // //             {medications.map((med, index) => (
// // //               <div key={index} className="medication-item">
// // //                 <div className="medication-content">
// // //                   <h3 className="medication-name">약품명: {med.drugName}</h3>
// // //                   <div className="medication-details">
// // //                     <p>복용량: {med.dosage}{med.unit}</p>
// // //                     <p>복용 주기: {med.frequency}</p>
// // //                     <p>복용 시간: {med.time.hour}:{med.time.minute}</p>
// // //                     {med.weekday && <p>요일: {med.weekday}</p>}
// // //                   </div>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         </section>
// // //       </main>
// // //     </Layout>
// // //   );
// // // };

// // // export default Mypage;
// // // // import React, { useState, useEffect } from 'react';
// // // // import axios from 'axios';
// // // // import Layout from '../components/Layout/Layout';
// // // // import { FaPlus, FaMinus, FaUpload } from 'react-icons/fa';

// // // // interface TimeData {
// // // //   hour: string;
// // // //   minute: string;
// // // // }

// // // // interface MedicationData {
// // // //   drugName: string;
// // // //   dosage: number;
// // // //   unit: string;
// // // //   frequency: string;
// // // //   time: TimeData;
// // // //   weekday?: string;
// // // // }

// // // // const Mypage = () => {
// // // //   const [medications, setMedications] = useState<MedicationData[]>([]);
// // // //   const [profileImage, setProfileImage] = useState('');
// // // //   const [nickname, setNickname] = useState('');
// // // //   const [tempProfileImage, setTempProfileImage] = useState('');
// // // //   const [tempNickname, setTempNickname] = useState('');
// // // //   const defaultProfileImage = '/images/profile.png';

// // // //   useEffect(() => {
// // // //     const fetchMyPageData = async () => {
// // // //       try {
// // // //         const response = await axios.get('http://localhost:8080/mypage', {
// // // //           withCredentials: true
// // // //         });
        
// // // //         if (response.status === 200) {
// // // //           console.log('Response:', response.data);
// // // //           const userData = response.data.mypage.fields.user;
// // // //           const medicationData = response.data.mypage.fields.medications;
          
// // // //           setProfileImage(userData.profileImage);
// // // //           setNickname(userData.nickname);
// // // //           setTempProfileImage(userData.profileImage);
// // // //           setTempNickname(userData.nickname);
// // // //           setMedications(medicationData);
// // // //         }
// // // //       } catch (error) {
// // // //         console.error('Error:', error);
// // // //       }
// // // //     };

// // // //     fetchMyPageData();
// // // //   }, []);

// // // //   const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
// // // //     const file = event.target.files?.[0];
// // // //     if (file) {
// // // //       const reader = new FileReader();
// // // //       reader.onloadend = () => {
// // // //         setTempProfileImage(reader.result as string);
// // // //       };
// // // //       reader.readAsDataURL(file);
// // // //     }
// // // //   };

// // // //   const handleProfileUpdate = async () => {
// // // //     try {
// // // //       const formData = new FormData();
// // // //       if (tempProfileImage && tempProfileImage !== profileImage) {
// // // //         const response = await fetch(tempProfileImage);
// // // //         const blob = await response.blob();
// // // //         formData.append('image', blob, 'profile.jpg');
// // // //       }
// // // //       formData.append('nickname', tempNickname);

// // // //       await axios.post('http://localhost:8080/mypage/profile-image', formData, {
// // // //         headers: { 'Content-Type': 'multipart/form-data' },
// // // //         withCredentials: true
// // // //       });

// // // //       setProfileImage(tempProfileImage);
// // // //       setNickname(tempNickname);
// // // //       alert('프로필이 업데이트되었습니다.');
// // // //     } catch (error) {
// // // //       console.error('Profile update error:', error);
// // // //       alert('프로필 업데이트에 실패했습니다.');
// // // //     }
// // // //   };

// // // //   return (
// // // //     <Layout>
// // // //       <div className="p-4">
// // // //         <section className="mb-8">
// // // //           <div className="flex items-center space-x-4">
// // // //             <div className="relative">
// // // //               <img
// // // //                 src={tempProfileImage || defaultProfileImage}
// // // //                 alt="프로필"
// // // //                 className="w-24 h-24 rounded-full object-cover"
// // // //               />
// // // //               <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer">
// // // //                 <FaUpload />
// // // //                 <input
// // // //                   type="file"
// // // //                   className="hidden"
// // // //                   accept="image/*"
// // // //                   onChange={handleImageUpload}
// // // //                 />
// // // //               </label>
// // // //             </div>
// // // //             <div>
// // // //               <input
// // // //                 type="text"
// // // //                 value={tempNickname}
// // // //                 onChange={(e) => setTempNickname(e.target.value)}
// // // //                 className="border p-2 rounded"
// // // //               />
// // // //               <button
// // // //                 onClick={handleProfileUpdate}
// // // //                 className="ml-2 bg-blue-500 text-white px-4 py-2 rounded"
// // // //               >
// // // //                 저장
// // // //               </button>
// // // //             </div>
// // // //           </div>
// // // //         </section>

// // // //         <section>
// // // //           <h2 className="text-xl font-bold mb-4">복용약 목록</h2>
// // // //           <div className="space-y-4">
// // // //             {medications.map((med, index) => (
// // // //               <div key={index} className="border p-4 rounded">
// // // //                 <p>약품명: {med.drugName}</p>
// // // //                 <p>복용량: {med.dosage}{med.unit}</p>
// // // //                 <p>복용 주기: {med.frequency}</p>
// // // //                 <p>복용 시간: {med.time.hour}:{med.time.minute}</p>
// // // //                 {med.weekday && <p>요일: {med.weekday}</p>}
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         </section>
// // // //       </div>
// // // //     </Layout>
// // // //   );
// // // // };

// // // // export default Mypage;

// // // // // import React, { useEffect, useState } from 'react';
// // // // // import axios from 'axios';

// // // // // const Mypage = () => {
// // // // //   const [userId, setUserId] = useState(null);
// // // // //   const [error, setError] = useState(null);

// // // // //   useEffect(() => {
// // // // //     const fetchCurrentUser = async () => {
// // // // //       try {
// // // // //         const response = await axios.get('http://localhost:8080/mypage', {
// // // // //           withCredentials: true
// // // // //         });
// // // // //         // 리다이렉트 URL에서 ID 추출
// // // // //         const userId = response.data.split('/')[1];
// // // // //         console.log('User ID:', userId);
// // // // //         setUserId(userId);
// // // // //       } catch (error) {
// // // // //         console.error('Error:', error);
// // // // //       }
// // // // //     };
// // // // //     fetchCurrentUser();
// // // // //   }, []);

// // // // //   return (
// // // // //     <div className="p-4">
// // // // //       <h1 className="text-xl mb-4">User ID Test</h1>
// // // // //       {userId ? (
// // // // //         <p className="text-green-600">User ID: {userId}</p>
// // // // //       ) : (
// // // // //         <p className="text-red-600">{error || 'Loading...'}</p>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // export default Mypage;

// // import React from 'react';
// // import { FaUpload, FaPlus, FaMinus } from 'react-icons/fa';

// // const Mypage = () => {
// //   return (
// //     <div className="min-h-screen bg-gray-50 p-6">
// //       <main className="max-w-4xl mx-auto">
// //         {/* Profile Section */}
// //         <section className="bg-white rounded-lg shadow-md p-6 mb-8">
// //           <div className="flex flex-col md:flex-row items-center gap-6">
// //             {/* Profile Image */}
// //             <div className="relative">
// //               <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
// //                 <img
// //                   src="/api/placeholder/128/128"
// //                   alt="프로필 사진"
// //                   className="w-full h-full object-cover"
// //                 />
// //               </div>
// //               <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer hover:bg-gray-50 transition-colors">
// //                 <FaUpload className="text-gray-600" />
// //                 <input type="file" className="hidden" accept="image/*" />
// //               </label>
// //             </div>

// //             {/* Profile Info */}
// //             <div className="flex-1 w-full">
// //               <input
// //                 type="text"
// //                 placeholder="닉네임"
// //                 className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
// //               />
// //               <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
// //                 변경사항 저장
// //               </button>
// //             </div>
// //           </div>
// //         </section>

// //         {/* Medications Section */}
// //         <section className="bg-white rounded-lg shadow-md p-6">
// //           <div className="flex justify-between items-center mb-6">
// //             <h2 className="text-xl font-semibold text-gray-800">복용약 목록</h2>
// //             <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
// //               알림 설정 전송
// //             </button>
// //           </div>

// //           {/* Medication List */}
// //           <div className="space-y-4">
// //             {/* Single Medication Item */}
// //             <div className="border border-gray-200 rounded-lg p-4">
// //               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
// //                 {/* Medication Name */}
// //                 <div className="col-span-3 md:col-span-1">
// //                   <button className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50">
// //                     복용약 이름 추가
// //                   </button>
// //                 </div>

// //                 {/* Dosage */}
// //                 <div className="flex gap-2 items-center">
// //                   <input
// //                     type="number"
// //                     placeholder="용량"
// //                     className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
// //                   />
// //                   <select className="px-3 py-2 border border-gray-300 rounded-lg">
// //                     <option value="mg">mg</option>
// //                     <option value="g">g</option>
// //                     <option value="ml">ml</option>
// //                     <option value="정">정</option>
// //                   </select>
// //                 </div>

// //                 {/* Time Selection */}
// //                 <div className="flex gap-2">
// //                   <select className="px-3 py-2 border border-gray-300 rounded-lg">
// //                     <option value="daily">매일</option>
// //                     <option value="weekly">매주</option>
// //                   </select>
// //                   <select className="px-3 py-2 border border-gray-300 rounded-lg">
// //                     <option>09시</option>
// //                     <option>10시</option>
// //                     <option>11시</option>
// //                   </select>
// //                   <select className="px-3 py-2 border border-gray-300 rounded-lg">
// //                     <option>00분</option>
// //                     <option>30분</option>
// //                   </select>
// //                 </div>
// //               </div>
              
// //               <button className="mt-4 p-2 text-red-500 hover:bg-red-50 rounded-full">
// //                 <FaMinus />
// //               </button>
// //             </div>
// //           </div>

// //           {/* Add Medication Button */}
// //           <button className="mt-6 w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
// //             <FaPlus />
// //             복용약 추가
// //           </button>
// //         </section>
// //       </main>
// //     </div>
// //   );
// // };

// // export default Mypage;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Layout from '../components/Layout/Layout';
// import { FaPlus, FaMinus, FaUpload } from 'react-icons/fa';
// import '../styles/pages/Mypage.css';

// interface TimeData {
//   hour: string;
//   minute: string;
// }

// interface MedicationData {
//   drugName: string;
//   dosage: number;
//   unit: string;
//   frequency: string;
//   time: TimeData;
//   weekday?: string;
// }

// interface DrugSearchResult {
//   id: number;
//   itemName: string;
//   entpName: string;
//   efcyQesitm: string;
// }

// const Mypage = () => {
//   const [medications, setMedications] = useState<MedicationData[]>([]);
//   const [profileImage, setProfileImage] = useState('');
//   const [nickname, setNickname] = useState('');
//   const [tempProfileImage, setTempProfileImage] = useState('');
//   const [tempNickname, setTempNickname] = useState('');
//   const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [searchResults, setSearchResults] = useState<DrugSearchResult[]>([]);
//   const [newMedication, setNewMedication] = useState<{
//     drugId?: number;
//     drugName: string;
//     dosage: number;
//     unit: string;
//     frequency: string;
//     hour: string;
//     minute: string;
//     weekday?: string;
//   }>({
//     drugName: '',
//     dosage: 1,
//     unit: 'MG',
//     frequency: 'daily',
//     hour: '09',
//     minute: '00'
//   });
//   const defaultProfileImage = '/images/profile.png';

//   useEffect(() => {
//     const fetchMyPageData = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/mypage', {
//           withCredentials: true
//         });
        
//         if (response.status === 200) {
//           const userData = response.data.mypage.fields.user;
//           const medicationData = response.data.mypage.fields.medications;
          
//           setProfileImage(userData.profileImage);
//           setNickname(userData.nickname);
//           setTempProfileImage(userData.profileImage);
//           setTempNickname(userData.nickname);
//           setMedications(medicationData);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };

//     fetchMyPageData();
//   }, []);

//   const handleSearch = async () => {
//     try {
//       const response = await axios.get(`http://localhost:8080/search/${searchTerm}`);
//       setSearchResults(response.data);
//     } catch (error) {
//       console.error('약품 검색 실패:', error);
//       alert('약품 검색에 실패했습니다.');
//     }
//   };

//   const handleDrugSelect = (drug: DrugSearchResult) => {
//     setNewMedication(prev => ({
//       ...prev,
//       drugId: drug.id,
//       drugName: drug.itemName
//     }));
//     setIsSearchModalOpen(false);
//   };

//   const handleAddMedication = async () => {
//     try {
//       const medicationRequest = {
//         drugName: newMedication.drugName,
//         dosage: newMedication.dosage,
//         unit: newMedication.unit,
//         cycle: newMedication.frequency.toUpperCase(),
//         hour: parseInt(newMedication.hour),
//         minute: parseInt(newMedication.minute),
//         dayOfWeek: newMedication.frequency === 'weekly' ? newMedication.weekday?.toUpperCase() : null
//       };

//       await axios.post('http://localhost:8080/mypage/medication', 
//         medicationRequest,
//         { withCredentials: true }
//       );

//       // 약 목록 새로고침
//       const response = await axios.get('http://localhost:8080/mypage', {
//         withCredentials: true
//       });
//       setMedications(response.data.mypage.fields.medications);
      
//       // 새 약 입력 폼 초기화
//       setNewMedication({
//         drugName: '',
//         dosage: 1,
//         unit: 'MG',
//         frequency: 'daily',
//         hour: '09',
//         minute: '00'
//       });

//       alert('복용약이 추가되었습니다.');
//     } catch (error) {
//       alert('복용약 추가에 실패했습니다.');
//     }
//   };

//   // ... (기존 프로필 관련 핸들러들)

//   return (
//     <Layout>
//       {/* ... (기존 프로필 섹션) */}

//       <section className="medications-section" aria-label="복용약 관리">
//         <header className="medications-header">
//           <h2>복용약 목록</h2>
//           <button 
//             className="add-medication-button"
//             onClick={() => setIsSearchModalOpen(true)}
//           >
//             새 약품 추가
//           </button>
//         </header>

//         {/* 기존 약 목록 */}
//         <div className="medications-list">
//           {medications.map((med, index) => (
//             <div key={index} className="medication-item">
//               <div className="medication-content">
//                 <h3 className="medication-name">약품명: {med.drugName}</h3>
//                 <div className="medication-details">
//                   <p>복용량: {med.dosage}{med.unit}</p>
//                   <p>복용 주기: {med.frequency}</p>
//                   <p>복용 시간: {med.time.hour}:{med.time.minute}</p>
//                   {med.weekday && <p>요일: {med.weekday}</p>}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* 약 검색 모달 */}
//         {isSearchModalOpen && (
//           <div className="modal">
//             <div className="modal-content">
//               <h3>약품 검색</h3>
//               <div className="search-container">
//                 <input
//                   type="text"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   placeholder="약품명 입력"
//                 />
//                 <button onClick={handleSearch}>검색</button>
//               </div>
//               <div className="search-results">
//                 {searchResults.map((drug) => (
//                   <div
//                     key={drug.id}
//                     className="search-result-item"
//                     onClick={() => handleDrugSelect(drug)}
//                   >
//                     <h4>{drug.itemName}</h4>
//                     <p>{drug.entpName}</p>
//                   </div>
//                 ))}
//               </div>
//               <button onClick={() => setIsSearchModalOpen(false)}>닫기</button>
//             </div>
//           </div>
//         )}

//         {/* 새 약 추가 폼 */}
//         {newMedication.drugName && (
//           <div className="new-medication-form">
//             <h3>새 약품 추가</h3>
//             <div className="form-group">
//               <label>약품명</label>
//               <input type="text" value={newMedication.drugName} readOnly />
//             </div>
//             <div className="form-group">
//               <label>복용량</label>
//               <input
//                 type="number"
//                 value={newMedication.dosage}
//                 onChange={(e) => setNewMedication(prev => ({
//                   ...prev,
//                   dosage: parseFloat(e.target.value)
//                 }))}
//               />
//               <select
//                 value={newMedication.unit}
//                 onChange={(e) => setNewMedication(prev => ({
//                   ...prev,
//                   unit: e.target.value
//                 }))}
//               >
//                 <option value="MG">mg</option>
//                 <option value="MCG">mcg</option>
//                 <option value="G">g</option>
//                 <option value="ML">ml</option>
//                 <option value="TABLET">정</option>
//               </select>
//             </div>
//             <div className="form-group">
//               <label>복용 주기</label>
//               <select
//                 value={newMedication.frequency}
//                 onChange={(e) => setNewMedication(prev => ({
//                   ...prev,
//                   frequency: e.target.value,
//                   weekday: e.target.value === 'weekly' ? 'MONDAY' : undefined
//                 }))}
//               >
//                 <option value="daily">매일</option>
//                 <option value="weekly">매주</option>
//               </select>
//             </div>
//             {newMedication.frequency === 'weekly' && (
//               <div className="form-group">
//                 <label>요일</label>
//                 <select
//                   value={newMedication.weekday}
//                   onChange={(e) => setNewMedication(prev => ({
//                     ...prev,
//                     weekday: e.target.value
//                   }))}
//                 >
//                   <option value="MONDAY">월요일</option>
//                   <option value="TUESDAY">화요일</option>
//                   <option value="WEDNESDAY">수요일</option>
//                   <option value="THURSDAY">목요일</option>
//                   <option value="FRIDAY">금요일</option>
//                   <option value="SATURDAY">토요일</option>
//                   <option value="SUNDAY">일요일</option>
//                 </select>
//               </div>
//             )}
//             <div className="form-group">
//               <label>복용 시간</label>
//               <select
//                 value={newMedication.hour}
//                 onChange={(e) => setNewMedication(prev => ({
//                   ...prev,
//                   hour: e.target.value
//                 }))}
//               >
//                 {Array.from({ length: 24 }, (_, i) => (
//                   <option key={i} value={i.toString().padStart(2, '0')}>
//                     {i.toString().padStart(2, '0')}시
//                   </option>
//                 ))}
//               </select>
//               <select
//                 value={newMedication.minute}
//                 onChange={(e) => setNewMedication(prev => ({
//                   ...prev,
//                   minute: e.target.value
//                 }))}
//               >
//                 {Array.from({ length: 60 }, (_, i) => (
//                   <option key={i} value={i.toString().padStart(2, '0')}>
//                     {i.toString().padStart(2, '0')}분
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <button onClick={handleAddMedication}>추가</button>
//           </div>
//         )}
//       </section>
//     </Layout>
//   );
// };

// export default Mypage;