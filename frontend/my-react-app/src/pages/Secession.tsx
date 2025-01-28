import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/Secession.css';
import Layout from '../components/Layout/Layout';

// 경고 박스 컴포넌트
const WarningBox = () => (
  <div className="warning-box" role="alert" aria-labelledby="warningTitle">
    <h3 id="warningTitle">회원 탈퇴 전 꼭 확인해주세요!</h3>
    <ul>
      <li>탈퇴 시 모든 개인정보가 삭제되며 복구가 불가능합니다.</li>
      <li>작성하신 게시물은 삭제되지 않으며, 익명처리 됩니다.</li>
      <li>탈퇴 후 동일한 이메일로 재가입이 불가능합니다.</li>
    </ul>
  </div>
);

// 비밀번호 입력 컴포넌트
interface PasswordInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput = ({ value, onChange }: PasswordInputProps) => (
  <label id="passwordLabel">
    비밀번호 확인
    <input
      type="password"
      value={value}
      onChange={onChange}
      placeholder="현재 비밀번호를 입력해주세요"
      aria-required="true"
      aria-labelledby="passwordLabel"
      style={{ color: '#000000' }}
    />
  </label>
);

// 탈퇴 사유 선택 컴포넌트
interface ReasonSelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const ReasonSelect = ({ value, onChange }: ReasonSelectProps) => (
  <label id="reasonLabel">
    탈퇴 사유
    <select 
      value={value} 
      onChange={onChange}
      aria-required="true"
      aria-labelledby="reasonLabel"
      style={{ 
        color: '#000000',
        backgroundColor: '#FFFFFF'
      }}
    >
      <option value="">탈퇴 사유를 선택해주세요</option>
      <option value="사용빈도낮음">사용 빈도가 낮아서</option>
      <option value="서비스불만족">서비스가 불만족스러워서</option>
      <option value="개인정보우려">개인정보 유출이 우려되어서</option>
      <option value="기타">기타</option>
    </select>
  </label>
);

// 동의 체크박스 컴포넌트
interface ConfirmCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ConfirmCheckbox = ({ checked, onChange }: ConfirmCheckboxProps) => (
  <label className="checkbox-label">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      aria-required="true"
    />
    위 안내 사항을 모두 확인하였으며, 이에 동의합니다.
  </label>
);

// 버튼 그룹 컴포넌트
interface ButtonGroupProps {
  onCancel: () => void;
  onSecession: () => void;
}

const ButtonGroup = ({ onCancel, onSecession }: ButtonGroupProps) => (
  <div className="button-group" role="group" aria-label="회원탈퇴 버튼">
    <button 
      onClick={onCancel} 
      className="cancel-button"
      aria-label="마이페이지로 돌아가기"
    >
      취소
    </button>
    <button 
      onClick={onSecession} 
      className="secession-button"
      aria-label="회원탈퇴 진행하기"
    >
      탈퇴하기
    </button>
  </div>
);

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
    <Layout>
      <div className="secession-wrapper" role="main">
        <h2 id="pageTitle">회원 탈퇴</h2>
        <div className="secession-content">
          <WarningBox />
          <div className="input-section" role="form" aria-labelledby="pageTitle">
            <PasswordInput 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <ReasonSelect 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <ConfirmCheckbox 
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
            />
          </div>
          <ButtonGroup 
            onCancel={() => navigate('/mypage')}
            onSecession={handleSecession}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Secession;
