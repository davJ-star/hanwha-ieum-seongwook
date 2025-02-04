// Mypage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { FaPlus, FaMinus, FaUpload } from 'react-icons/fa';
import '../styles/pages/Mypage.css';
import axios from 'axios';

// 백엔드 enum과 일치하는 타입 정의
enum DosageUnit {
  MG = 'MG',
  MCG = 'MCG',
  G = 'G',
  ML = 'ML',
  TABLET = 'TABLET',
  PERCENT = 'PERCENT'
}

enum MedicationCycle {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY'
}

enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}

interface MedicationItem {
  id: string;
  name: string;
  dosage: number;
  unit: DosageUnit;
  frequency: MedicationCycle;
  time: {
    hour: number;
    minute: number;
  };
  weekday?: DayOfWeek;
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
  const { id } = useParams<{ id: string }>();
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

  const handleMedicationSubmit = async (medication: MedicationItem) => {
    try {
      if (!medication.name || !medication.dosage || medication.dosage <= 0) {
        alert('약 이름과 유효한 복용량을 입력해주세요.');
        return;
      }

      const requestData = {
        drugName: medication.name,
        dosage: medication.dosage,
        unit: medication.unit,
        cycle: medication.frequency,
        ...(medication.frequency === MedicationCycle.WEEKLY && {
          dayOfWeek: medication.weekday
        }),
        hour: medication.time.hour,
        minute: medication.time.minute
      };

      const response = await axios.post(
        `http://localhost:8080/${id}/mypage/medication`,
        requestData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        alert('복용약이 추가되었습니다.');
        await setMedicationReminder(medication);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
        alert(error.response?.data || '복용약 추가에 실패했습니다.');
      } else {
        console.error('Unexpected error:', error);
        alert('예기치 않은 오류가 발생했습니다.');
      }
    }
  };

  const setMedicationReminder = async (medication: MedicationItem) => {
    try {
      const requestData = {
        drugName: medication.name,
        dosage: medication.dosage,
        unit: medication.unit,
        cycle: medication.frequency,
        ...(medication.frequency === MedicationCycle.WEEKLY && {
          dayOfWeek: medication.weekday
        }),
        hour: medication.time.hour,
        minute: medication.time.minute
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

  const handleAddToMyMedications = async (medication: MedicationItem) => {
    await handleMedicationSubmit(medication);
    navigate('/mypage');
  };

  const addMedication = () => {
    const newMed: MedicationItem = {
      id: Date.now().toString(),
      name: '',
      dosage: 0,
      unit: DosageUnit.MG,
      frequency: MedicationCycle.DAILY,
      time: { hour: 9, minute: 0 },
      weekday: DayOfWeek.MONDAY
    };
    setMedications([...medications, newMed]);
  };

  const removeMedication = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
  };

  const handleMedicationSelect = async (medication: { id: string, name: string }) => {
    const updatedMedications = medications.map(med => {
      if (med.id === selectedMedicationId) {
        return { ...med, name: medication.name };
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

  const handleSendToBackend = async () => {
    try {
      for (const medication of medications) {
        if (!medication.name || !medication.dosage || !medication.unit || !medication.frequency || !medication.time) {
          alert(`복용약 ${medication.name || '(이름 미입력)'} 의 정보가 완전하지 않습니다. 해당 약은 전송되지 않습니다.`);
          continue;
        }

        if (medication.frequency === MedicationCycle.WEEKLY && !medication.weekday) {
          alert(`주간 복용 약물의 요일을 선택해주세요: ${medication.name}`);
          continue;
        }

        const requestData = {
          drugName: medication.name,
          dosage: medication.dosage,
          unit: medication.unit,
          cycle: medication.frequency,
          ...(medication.frequency === MedicationCycle.WEEKLY && {
            dayOfWeek: medication.weekday
          }),
          hour: medication.time.hour,
          minute: medication.time.minute
        };

        const response = await axios.post(
          `http://localhost:8080/${id}/mypage/medication`, 
          requestData,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.status === 200) {
          await setMedicationReminder(medication);
        }
      }
      alert('모든 복용약 정보가 성공적으로 전송되었습니다.');
    } catch (error) {
      console.error('Error sending medication data:', error);
      if (axios.isAxiosError(error)) {
        alert(error.response?.data || '데이터 전송 중 오류가 발생했습니다.');
      } else {
        alert('예기치 않은 오류가 발생했습니다.');
      }
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
                    value={med.dosage}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value) || 0;
                      const updated = medications.map(m =>
                        m.id === med.id ? { ...m, dosage: value } : m
                      );
                      setMedications(updated);
                    }}
                    min="0"
                    step="0.1"
                    aria-label="복용량"
                  />
                  <select
                    value={med.unit}
                    onChange={(e) => {
                      const updated = medications.map(m =>
                        m.id === med.id ? { ...m, unit: e.target.value as DosageUnit } : m
                      );
                      setMedications(updated);
                    }}
                    aria-label="복용 단위"
                  >
                    {Object.values(DosageUnit).map((unit) => (
                      <option key={unit} value={unit}>{unit.toLowerCase()}</option>
                    ))}
                  </select>
                </div>

                <div className="reminder-container">
                  <div className="frequency-row">
                    <select
                      value={med.frequency}
                      onChange={(e) => {
                        const updated = medications.map(m =>
                          m.id === med.id ? { ...m, frequency: e.target.value as MedicationCycle } : m
                        );
                        setMedications(updated);
                      }}
                      aria-label="복용 주기"
                    >
                      <option value={MedicationCycle.DAILY}>매일</option>
                      <option value={MedicationCycle.WEEKLY}>매주</option>
                    </select>

                        value={med.frequency === MedicationCycle.WEEKLY && (
                      <select
                        value={med.weekday}
                        onChange={(e) => {
                          const updated = medications.map(m =>
                            m.id === med.id ? { ...m, weekday: e.target.value as DayOfWeek } : m
                          );
                          setMedications(updated);
                        }}
                        aria-label="요일 선택"
                      >
                        {Object.entries(DayOfWeek).map(([key, value]) => (
                          <option key={value} value={value}>
                            {key === 'MONDAY' ? '월요일' :
                             key === 'TUESDAY' ? '화요일' :
                             key === 'WEDNESDAY' ? '수요일' :
                             key === 'THURSDAY' ? '목요일' :
                             key === 'FRIDAY' ? '금요일' :
                             key === 'SATURDAY' ? '토요일' : '일요일'}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="time-selector">
                    <select
                      value={med.time.hour}
                      onChange={(e) => {
                        const updated = medications.map(m =>
                          m.id === med.id ? { ...m, time: { ...m.time, hour: parseInt(e.target.value) } } : m
                        );
                        setMedications(updated);
                      }}
                      aria-label="시간"
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={i} value={i}>{i.toString().padStart(2, '0')}시</option>
                      ))}
                    </select>
                    <select
                      value={med.time.minute}
                      onChange={(e) => {
                        const updated = medications.map(m =>
                          m.id === med.id ? { ...m, time: { ...m.time, minute: parseInt(e.target.value) } } : m
                        );
                        setMedications(updated);
                      }}
                      aria-label="분"
                    >
                      {Array.from({ length: 60 }).map((_, i) => (
                        <option key={i} value={i}>{i.toString().padStart(2, '0')}분</option>
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