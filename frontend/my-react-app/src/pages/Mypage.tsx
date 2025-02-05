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
      const response = await axios.get('http://13.124.88.193:8080/mypage', {
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
      const response = await axios.get(`http://13.124.88.193:8080/search/${searchTerm}`);
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
      const response = await axios.post('http://13.124.88.193:8080/mypage/update', 
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

      await axios.post('http://13.124.88.193:8080/mypage/profile-image', formData, {
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

      await axios.post('http://13.124.88.193:8080/mypage/medication', 
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