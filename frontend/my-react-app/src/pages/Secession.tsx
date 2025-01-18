import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Secession.css';

const Secession = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleSecession = () => {
    if (!password) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    if (!reason) {
      alert('탈퇴 사유를 선택해주세요.');
      return;
    }
    if (!isConfirmed) {
      alert('안내 사항을 확인하고 동의해주세요.');
      return;
    }

    // 여기에 회원 탈퇴 API 호출 로직 추가
    alert('회원 탈퇴가 완료되었습니다.');
    navigate('/');
  };

  return (
    <div className="secession-wrapper">
      <h2>회원 탈퇴</h2>
      <div className="secession-content">
        <div className="warning-box">
          <h3>회원 탈퇴 전 꼭 확인해주세요!</h3>
          <ul>
            <li>탈퇴 시 모든 개인정보가 삭제되며 복구가 불가능합니다.</li>
            <li>작성하신 게시물은 삭제되지 않으며, 익명처리 됩니다.</li>
            <li>탈퇴 후 동일한 이메일로 재가입이 불가능합니다.</li>
          </ul>
        </div>

        <div className="input-section">
          <label>
            비밀번호 확인
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="현재 비밀번호를 입력해주세요"
            />
          </label>

          <label>
            탈퇴 사유
            <select value={reason} onChange={(e) => setReason(e.target.value)}>
              <option value="">탈퇴 사유를 선택해주세요</option>
              <option value="사용빈도낮음">사용 빈도가 낮아서</option>
              <option value="서비스불만족">서비스가 불만족스러워서</option>
              <option value="개인정보우려">개인정보 유출이 우려되어서</option>
              <option value="기타">기타</option>
            </select>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
            />
            위 안내 사항을 모두 확인하였으며, 이에 동의합니다.
          </label>
        </div>

        <div className="button-group">
          <button onClick={() => navigate('/mypage')} className="cancel-button">
            취소
          </button>
          <button onClick={handleSecession} className="secession-button">
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Secession;
