// Mypage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { FaPlus, FaMinus, FaUpload } from 'react-icons/fa';
import '../styles/pages/Mypage.css';
import axios from 'axios';

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  unit: 'MG' | 'MCG' | 'G' | 'ML' | 'TABLET' | 'PERCENT';
  frequency: 'DAILY' | 'WEEKLY';
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
  const [medications, setMedications] = useState<MedicationItem[]>(() => {
    const savedMedications = localStorage.getItem('medications');
    return savedMedications ? JSON.parse(savedMedications) : [];
  });
  const [profileImage, setProfileImage] = useState<string>('');
  const [nickname, setNickname] = useState('사용자');
  const [tempProfileImage, setTempProfileImage] = useState<string>('');
  const [tempNickname, setTempNickname] = useState<string>('사용자');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState<string>('');

  const defaultProfileImage = '/images/profile.png';

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
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

  const convertToDayOfWeek = (weekday: string): string => {
    const dayMap: { [key: string]: string } = {
      '월요일': 'MONDAY',
      '화요일': 'TUESDAY',
      '수요일': 'WEDNESDAY',
      '목요일': 'THURSDAY',
      '금요일': 'FRIDAY',
      '토요일': 'SATURDAY',
      '일요일': 'SUNDAY'
    };
    return dayMap[weekday];
  };

  const setMedicationReminder = async (medication: MedicationItem) => {
    try {
      const requestData = {
        drugName: medication.name,
        dosage: parseFloat(medication.dosage),
        unit: medication.unit.toUpperCase(),
        cycle: medication.frequency.toUpperCase(),
        ...(medication.frequency === 'WEEKLY' && {
          dayOfWeek: convertToDayOfWeek(medication.weekday!)
        }),
        hour: parseInt(medication.time.hour),
        minute: parseInt(medication.time.minute)
      };

      const response = await axios.post('http://localhost:8080/medication/reminder/set', requestData);
      if (response.status === 200) {
        console.log('알림이 성공적으로 설정되었습니다:', response.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('알림 설정 중 오류 발생:', error);
        throw new Error(error.response?.data?.message || '알림 설정에 실패했습니다.');
      }
    }
  };

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

  const handleMedicationSubmit = async (medication: MedicationItem) => {
    try {
      console.log('전송할 의약품 정보:', medication);
      const requestParams = {
        drugId: medication.id,
        drugName: medication.name,
        dosage: medication.dosage,
        unit: medication.unit,
        cycle: medication.frequency.toUpperCase(),
        ...(medication.frequency === 'WEEKLY' && {
          dayOfWeek: convertToDayOfWeek(medication.weekday!)
        }),
        hour: medication.time.hour,
        minute: medication.time.minute
      };

      const response = await axios.get('http://localhost:8080/{id}/mypage/medication', {
        params: requestParams,
        withCredentials: true
      });

      if (response.status === 200) {
        await setMedicationReminder(medication);
        alert('복용약이 추가되고 알람이 설정되었습니다.');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '복용약 추가 및 알람 설정에 실패했습니다.');
      }
    }
  };

  const handleAddToMyMedications = async (medication: MedicationItem) => {
    await handleMedicationSubmit(medication);
    navigate('/mypage');
  };

  const handleSendToBackend = async () => {
    try {
      for (const medication of medications) {
        if (!medication.name || !medication.dosage || !medication.unit || !medication.frequency || !medication.time) {
          alert(`복용약 ${medication.name || '(이름 미입력)'} 의 정보가 완전하지 않습니다. 해당 약은 전송되지 않습니다.`);
          continue;
        }

        const requestParams = {
          drugId: medication.id,
          drugName: medication.name,
          dosage: medication.dosage,
          unit: medication.unit,
          cycle: medication.frequency.toUpperCase(),
          ...(medication.frequency === 'WEEKLY' && {
            dayOfWeek: convertToDayOfWeek(medication.weekday!)
          }),
          hour: medication.time.hour,
          minute: medication.time.minute
        };

        const response = await axios.get('http://localhost:8080/{id}/mypage/medication', {
          params: requestParams,
          withCredentials: true
        });

        if (response.status === 200) {
          await setMedicationReminder(medication);
        }
      }
      alert('모든 복용약 정보가 백엔드로 전송되었습니다.');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || '복용약 정보 전송에 실패했습니다.');
      }
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
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
      unit: 'MG',
      frequency: 'DAILY',
      time: { hour: '09', minute: '00' },
      weekday: '월요일'
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

    const selectedMed = updatedMedications.find(med => med.id === selectedMedicationId);
    if (selectedMed && selectedMed.name && selectedMed.dosage && selectedMed.unit && selectedMed.frequency && selectedMed.time) {
      await handleAddToMyMedications(selectedMed);
    }
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
              value={tempNickname ?? ''}
              onChange={(e) => setTempNickname(e.target.value)}
              placeholder="닉네임을 입력하세요"
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
                    value={med.dosage ?? ''}
                    onChange={(e) => {
                      const updated = medications.map(m => 
                        m.id === med.id ? { ...m, dosage: e.target.value } : m
                      );
                      setMedications(updated);
                    }}
                    aria-label="복용량"
                  />
                  <select
                    value={med.unit}
                    onChange={(e) => {
                      const updated = medications.map(m =>
                        m.id === med.id ? { ...m, unit: e.target.value as MedicationItem['unit'] } : m
                      );
                      setMedications(updated);
                    }}
                    aria-label="복용 단위"
                  >
                    <option value="MG">mg</option>
                    <option value="MCG">mcg</option>
                    <option value="G">g</option>
                    <option value="ML">ml</option>
                    <option value="TABLET">정</option>
                    <option value="PERCENT">%</option>
                  </select>
                </div>

                <div className="reminder-container">
                  <div className="frequency-row">
                    <select
                      value={med.frequency}
                      onChange={(e) => {
                        const updated = medications.map(m =>
                          m.id === med.id ? { ...m, frequency: e.target.value as 'DAILY' | 'WEEKLY' } : m
                        );
                        setMedications(updated);
                      }}
                      aria-label="복용 주기"
                    >
                      <option value="DAILY">매일</option>
                      <option value="WEEKLY">매주</option>
                    </select>

                    {med.frequency === 'WEEKLY' && (
                      <select
                        value={med.weekday ?? '월요일'}
                        onChange={(e) => {
                          const updated = medications.map(m =>
                            m.id === med.id ? { ...m, weekday: e.target.value } : m
                          );
                          setMedications(updated);
                        }}
                        aria-label="요일 선택"
                      >
                        {['월요일', '화요일', '수요일', '목요일', '금요일', '토요일', '일요일'].map((day) => (
                          <option key={day} value={day}>{day}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="time-selector">
                    <select
                      value={med.time.hour ?? '09'}
                      onChange={(e) => {
                        const updated = medications.map(m =>
                          m.id === med.id ? { ...m, time: { ...m.time, hour: e.target.value } } : m
                        );
                        setMedications(updated);
                      }}
                      aria-label="시간"
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={i} value={i.toString().padStart(2, '0')}>
                          {i.toString().padStart(2, '0')}시
                        </option>
                      ))}
                    </select>
                    <select
                      value={med.time.minute ?? '00'}
                      onChange={(e) => {
                        const updated = medications.map(m =>
                          m.id === med.id ? { ...m, time: { ...m.time, minute: e.target.value } } : m
                        );
                        setMedications(updated);
                      }}
                      aria-label="분"
                    >
                      {Array.from({ length: 60 }).map((_, i) => (
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
          <div className="medications-actions">
            <button 
              onClick={addMedication}
              aria-label="약 추가하기"
              className="add-medication-button"
            >
              복용약 추가
            </button>
            <button 
              onClick={handleSendToBackend}
              aria-label="백엔드로 전송"
              className="send-backend-button"
            >
              백엔드로 전송
            </button>
          </div>
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