import React, { useState } from "react";
import "../styles/pages/MemberInfo.css";
import axios from "axios";

const MemberInfo = () => {
 const [email, setEmail] = useState("hongildong@example.com");
 const [emailCode, setEmailCode] = useState("");
 const [isEmailVerified, setIsEmailVerified] = useState(false);
 const [currentPassword, setCurrentPassword] = useState("");
 const [newPassword, setNewPassword] = useState("");
 const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
 const [passwordError, setPasswordError] = useState("");
 const [deletePassword, setDeletePassword] = useState("");

 const handleEmailVerify = async () => {
   try {
     const response = await axios.post("http://13.124.88.193:8080/api/email/send-verification", { email });
     if (response.status === 200) {
       alert("이메일로 인증번호가 발송되었습니다.");
     }
   } catch (error) {
     alert("이메일 인증번호 발송 실패");
   }
 };

 const handleEmailCodeVerify = async () => {
   try {
     const verifyResponse = await axios.post("http://13.124.88.193:8080/api/email/verify", { 
       email, 
       code: emailCode 
     });
     
     if (verifyResponse.data.success) {
       const changeResponse = await axios.post("http://13.124.88.193:8080/mypage/email", null, {
         params: { email },
         withCredentials: true
       });

       if (changeResponse.data.includes("완료")) {
         setIsEmailVerified(true);
         alert("이메일이 변경되었습니다.");
       } else {
         alert(changeResponse.data);
       }
     } else {
       alert("인증번호가 일치하지 않습니다.");
     }
   } catch (error) {
     alert("이메일 인증에 실패했습니다.");
   }
 };

 const handlePasswordChange = async () => {
  if (newPassword.length < 8) {
    setPasswordError("비밀번호는 8자 이상이어야 합니다.");
    return;
  }
  if (newPassword !== newPasswordConfirm) {
    setPasswordError("비밀번호가 일치하지 않습니다.");
    return;
  }
  try {
    const response = await axios.post("http://13.124.88.193:8080/mypage/password", null, {
      params: {
        currentPassword,
        newPassword,
        newPasswordConfirm
      },
      withCredentials: true
    });
    
    if (response.status === 200) {
      alert("비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setPasswordError("");
    }
  } catch (error) {
    alert("비밀번호 변경에 실패했습니다.");
  }
};

 const handleAccountDelete = async () => {
   if (!deletePassword) {
     alert("비밀번호를 입력해주세요.");
     return;
   }

   const confirmDelete = window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
   if (confirmDelete) {
     try {
       const response = await axios.delete("http://13.124.88.193:8080/mypage/delete", {
         params: { password: deletePassword },
         withCredentials: true
       });

       if (response.status === 200) {
         alert("회원 탈퇴가 완료되었습니다.");
         window.location.href = '/login';
       }
     } catch (error) {
       alert("회원 탈퇴에 실패했습니다.");
     }
   }
 };

 // JSX는 동일하게 유지
 return (
   <div className="mypage-wrapper">
     <h2>회원정보 수정</h2>
     <p>이메일 주소를 수정하거나 비밀번호를 재설정할 수 있습니다.</p>

     <section className="section">
       <h3>개인정보 수정</h3>
       <label>이메일</label>
       <div className="input-group">
         <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isEmailVerified} />
         <button onClick={handleEmailVerify} className="black-button">인증</button>
       </div>
       <div className="input-group">
         <input type="text" placeholder="인증번호 입력" value={emailCode} onChange={(e) => setEmailCode(e.target.value)} disabled={isEmailVerified} />
         <button onClick={handleEmailCodeVerify} className="black-button">확인</button>
       </div>
     </section>

     <section className="section">
       <h3>비밀번호 변경</h3>
       <label>현재 비밀번호</label>
       <div className="input-group">
         <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
       </div>
       <label>새 비밀번호</label>
       <div className="input-group">
         <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="8자 이상 입력" />
       </div>
       <label>새 비밀번호 확인</label>
       <div className="input-group">
         <input type="password" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} placeholder="새 비밀번호 재입력" />
       </div>
       {passwordError && <p className="error-text">{passwordError}</p>}
       <button onClick={handlePasswordChange} className="black-button">비밀번호 변경</button>
     </section>

     <section className="section">
       <h3>회원 탈퇴</h3>
       <label>현재 비밀번호</label>
       <div className="input-group">
         <input type="password" placeholder="현재 비밀번호 입력" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
       </div>
       <button onClick={handleAccountDelete} className="delete-button">회원 탈퇴</button>
     </section>
   </div>
 );
};

export default MemberInfo;
// import React, { useState } from "react";
// import "../styles/pages/MemberInfo.css";
// import axios from "axios";

// const MemberInfo = () => {
//   const [email, setEmail] = useState("hongildong@example.com");
//   const [emailCode, setEmailCode] = useState("");
//   const [isEmailVerified, setIsEmailVerified] = useState(false);

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [passwordError, setPasswordError] = useState("");

//   const [deletePassword, setDeletePassword] = useState("");
//   const [confirmDeletePassword, setConfirmDeletePassword] = useState("");

//   // 이메일 인증 요청
//   const handleEmailVerify = async () => {
//     try {
//       const response = await axios.post("/api/email/send-verification", { email });
//       if (response.status === 200) {
//         alert("이메일로 인증번호가 발송되었습니다.");
//       }
//     } catch (error) {
//       alert("이메일 인증번호 발송 실패");
//     }
//   };

//   // 이메일 인증 확인
//   const handleEmailCodeVerify = async () => {
//     try {
//       const response = await axios.post("/api/email/verify", { email, verificationCode: emailCode });
//       if (response.status === 200) {
//         setIsEmailVerified(true);
//         alert("이메일이 성공적으로 인증되었습니다.");
//       }
//     } catch (error) {
//       alert("인증번호가 일치하지 않습니다.");
//     }
//   };

//   // 비밀번호 변경 요청
//   const handlePasswordChange = async () => {
//     if (newPassword !== confirmNewPassword) {
//       setPasswordError("새 비밀번호가 일치하지 않습니다.");
//       return;
//     }
//     if (newPassword.length < 8) {
//       setPasswordError("비밀번호는 8자 이상이어야 합니다.");
//       return;
//     }
//     try {
//       const response = await axios.post("/api/change-password", {
//         currentPassword,
//         newPassword,
//       });
//       if (response.status === 200) {
//         alert("비밀번호가 변경되었습니다.");
//         setCurrentPassword("");
//         setNewPassword("");
//         setConfirmNewPassword("");
//         setPasswordError("");
//       }
//     } catch (error) {
//       alert("비밀번호 변경에 실패했습니다.");
//     }
//   };

//   // 회원 탈퇴 요청
//   const handleAccountDelete = async () => {
//     if (deletePassword !== confirmDeletePassword) {
//       alert("입력한 비밀번호가 일치하지 않습니다.");
//       return;
//     }
//     const confirmDelete = window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
//     if (confirmDelete) {
//       try {
//         const response = await axios.post("/api/delete-account", { password: deletePassword });
//         if (response.status === 200) {
//           alert("회원 탈퇴가 완료되었습니다.");
//         }
//       } catch (error) {
//         alert("회원 탈퇴에 실패했습니다.");
//       }
//     }
//   };

//   return (
//     <div className="mypage-wrapper">
//       <h2>회원정보 수정</h2>
//       <p>이메일 주소를 수정하거나 비밀번호를 재설정할 수 있습니다.</p>

//       {/* 이메일 인증 섹션 */}
//       <section className="section">
//         <h3>개인정보 수정</h3>
//         <label>이메일</label>
//         <div className="input-group">
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isEmailVerified} />
//           <button onClick={handleEmailVerify} className="black-button">인증</button>
//         </div>
//         <div className="input-group">
//           <input type="text" placeholder="인증번호 입력" value={emailCode} onChange={(e) => setEmailCode(e.target.value)} disabled={isEmailVerified} />
//           <button onClick={handleEmailCodeVerify} className="black-button">확인</button>
//         </div>
//       </section>

//       {/* 비밀번호 변경 섹션 */}
//       <section className="section">
//         <h3>비밀번호 변경</h3>
//         <label>현재 비밀번호</label>
//         <div className="input-group">
//           <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
//           <button className="black-button">확인</button>
//         </div>
//         <label>새 비밀번호</label>
//         <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="8자 이상 입력" />
//         <label>새 비밀번호 확인</label>
//         <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="새 비밀번호 재입력" />
//         {passwordError && <p className="error-text">{passwordError}</p>}
//         <button onClick={handlePasswordChange} className="black-button">비밀번호 변경</button>
//       </section>

//       {/* 회원 탈퇴 섹션 */}
//       <section className="section">
//         <h3>회원 탈퇴</h3>
//         <label>현재 비밀번호</label>
//         <input type="password" placeholder="현재 비밀번호 입력" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
//         <label>비밀번호 확인</label>
//         <input type="password" placeholder="비밀번호 재입력" value={confirmDeletePassword} onChange={(e) => setConfirmDeletePassword(e.target.value)} />
//         <button onClick={handleAccountDelete} className="delete-button">회원 탈퇴</button>
//       </section>
//     </div>
//   );
// };

// export default MemberInfo;


// import React, { useState } from "react";
// import "../styles/pages/MemberInfo.css";
// import axios from "axios";

// const MemberInfo = () => {
//   const [email, setEmail] = useState("hongildong@example.com");
//   const [emailCode, setEmailCode] = useState("");
//   const [isEmailVerified, setIsEmailVerified] = useState(false);

//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [passwordError, setPasswordError] = useState("");

//   const [deletePassword, setDeletePassword] = useState("");
//   const [confirmDeletePassword, setConfirmDeletePassword] = useState("");

//   // 이메일 인증 요청
//   const handleEmailVerify = async () => {
//     try {
//       const response = await axios.post("/api/email/send-verification", { email });
//       if (response.status === 200) {
//         alert("이메일로 인증번호가 발송되었습니다.");
//       }
//     } catch (error) {
//       alert("이메일 인증번호 발송 실패");
//     }
//   };

//   // 이메일 인증 확인
//   const handleEmailCodeVerify = async () => {
//     try {
//       const response = await axios.post("/api/email/verify", { email, verificationCode: emailCode });
//       if (response.status === 200) {
//         setIsEmailVerified(true);
//         alert("이메일이 성공적으로 인증되었습니다.");
//       }
//     } catch (error) {
//       alert("인증번호가 일치하지 않습니다.");
//     }
//   };

//   // 비밀번호 변경 요청
//   const handlePasswordChange = async () => {
//     if (newPassword !== confirmNewPassword) {
//       setPasswordError("새 비밀번호가 일치하지 않습니다.");
//       return;
//     }
//     if (newPassword.length < 8) {
//       setPasswordError("비밀번호는 8자 이상이어야 합니다.");
//       return;
//     }
//     try {
//       const response = await axios.post("/api/change-password", {
//         currentPassword,
//         newPassword,
//       });
//       if (response.status === 200) {
//         alert("비밀번호가 변경되었습니다.");
//         setCurrentPassword("");
//         setNewPassword("");
//         setConfirmNewPassword("");
//         setPasswordError("");
//       }
//     } catch (error) {
//       alert("비밀번호 변경에 실패했습니다.");
//     }
//   };

//   // 회원 탈퇴 요청
//   const handleAccountDelete = async () => {
//     if (deletePassword !== confirmDeletePassword) {
//       alert("입력한 비밀번호가 일치하지 않습니다.");
//       return;
//     }
//     const confirmDelete = window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
//     if (confirmDelete) {
//       try {
//         const response = await axios.post("/api/delete-account", { password: deletePassword });
//         if (response.status === 200) {
//           alert("회원 탈퇴가 완료되었습니다.");
//         }
//       } catch (error) {
//         alert("회원 탈퇴에 실패했습니다.");
//       }
//     }
//   };

//   return (
//     <div className="mypage-wrapper">
//       <h2>회원정보 수정</h2>
//       <p>이메일 주소를 수정하거나 비밀번호를 재설정할 수 있습니다.</p>

//       {/* 이메일 인증 섹션 */}
//       <section className="section">
//         <h3>개인정보 수정</h3>
//         <label>이메일</label>
//         <div className="input-group">
//           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isEmailVerified} />
//           <button onClick={handleEmailVerify} className="black-button">인증</button>
//         </div>
//         <div className="input-group">
//           <input type="text" placeholder="인증번호 입력" value={emailCode} onChange={(e) => setEmailCode(e.target.value)} disabled={isEmailVerified} />
//           <button onClick={handleEmailCodeVerify} className="black-button">확인</button>
//         </div>
//       </section>

//       {/* 비밀번호 변경 섹션 */}
//       <section className="section">
//         <h3>비밀번호 변경</h3>
//         <label>현재 비밀번호</label>
//         <div className="input-group">
//           <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
//           <button className="black-button">확인</button>
//         </div>
//         <label>새 비밀번호</label>
//         <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="8자 이상 입력" />
//         <label>새 비밀번호 확인</label>
//         <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} placeholder="새 비밀번호 재입력" />
//         {passwordError && <p className="error-text">{passwordError}</p>}
//         <button onClick={handlePasswordChange} className="black-button">비밀번호 변경</button>
//       </section>

//       {/* 회원 탈퇴 섹션 */}
//       <section className="section">
//         <h3>회원 탈퇴</h3>
//         <label>현재 비밀번호</label>
//         <input type="password" placeholder="현재 비밀번호 입력" value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
//         <label>비밀번호 확인</label>
//         <input type="password" placeholder="비밀번호 재입력" value={confirmDeletePassword} onChange={(e) => setConfirmDeletePassword(e.target.value)} />
//         <button onClick={handleAccountDelete} className="delete-button">회원 탈퇴</button>
//       </section>
//     </div>
//   );
// };

// export default MemberInfo;


// import React, { useState } from 'react';
// import '../styles/pages/MemberInfo.css';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const MemberInfo = () => {
//     const navigate = useNavigate();
    
//     const [email, setEmail] = useState('hongildong@example.com');
//     const [emailCode, setEmailCode] = useState('');
//     const [isEmailVerified, setIsEmailVerified] = useState(false);
    
//     const [currentPassword, setCurrentPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [passwordError, setPasswordError] = useState('');
//     const [isPasswordValid, setIsPasswordValid] = useState(false);

//     const handleEmailVerify = async () => {
//         try {
//             const response = await axios.post('/api/email/send-verification', { email });
//             if (response.status === 200) {
//                 alert('이메일로 인증번호가 발송되었습니다.');
//             }
//         } catch (error) {
//             if (axios.isAxiosError(error)) {
//                 alert(error.response?.data?.message || '인증번호 발송에 실패했습니다.');
//             }
//         }
//     };

//     const handleEmailCodeVerify = async () => {
//         try {
//             const response = await axios.post('/api/email/verify', { email, verificationCode: emailCode });
//             if (response.status === 200) {
//                 setIsEmailVerified(true);
//                 alert('이메일이 성공적으로 인증되었습니다.');
//             }
//         } catch (error) {
//             if (axios.isAxiosError(error)) {
//                 alert(error.response?.data?.message || '인증번호가 일치하지 않습니다.');
//             }
//         }
//     };

//     const handlePasswordVerify = async () => {
//         if (currentPassword.length === 0) {
//             alert('현재 비밀번호를 입력해주세요.');
//             return;
//         }
//         setIsPasswordValid(true);
//     };

//     const handleConfirmNewPassword = () => {
//         if (newPassword !== confirmPassword) {
//             setPasswordError('새 비밀번호가 일치하지 않습니다.');
//             return;
//         }
//         alert('비밀번호가 변경되었습니다.');
//         setNewPassword('');
//         setConfirmPassword('');
//     };

//     const handleDeleteAccount = () => {
//         const confirmDelete = window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
//         if (confirmDelete) {
//             alert('회원 탈퇴가 완료되었습니다.');
//             navigate('/login');
//         }
//     };

//     return (
//         <div className="mypage-wrapper">
//             <h2>회원정보 수정</h2>
//             <p>이메일 주소를 수정하거나 비밀번호를 재설정할 수 있습니다.</p>

//             {/* 이메일 인증 섹션 */}
//             <section className="section">
//                 <h3>개인정보 수정</h3>
//                 <label>
//                     이메일
//                     <div className="input-group">
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             disabled={isEmailVerified}
//                         />
//                         {!isEmailVerified && (
//                             <button onClick={handleEmailVerify}>인증</button>
//                         )}
//                     </div>
//                 </label>

//                 {!isEmailVerified && (
//                     <div className="input-group">
//                         <input
//                             type="text"
//                             placeholder="인증번호 입력"
//                             value={emailCode}
//                             onChange={(e) => setEmailCode(e.target.value)}
//                         />
//                         <button onClick={handleEmailCodeVerify}>확인</button>
//                     </div>
//                 )}
//             </section>

//             {/* 비밀번호 변경 섹션 */}
//             <section className="section">
//                 <h3>비밀번호 변경</h3>
//                 <label>
//                     현재 비밀번호
//                     <div className="input-group">
//                         <input
//                             type="password"
//                             value={currentPassword}
//                             onChange={(e) => setCurrentPassword(e.target.value)}
//                         />
//                         <button onClick={handlePasswordVerify}>확인</button>
//                     </div>
//                 </label>

//                 {isPasswordValid && (
//                     <>
//                         <label>
//                             새 비밀번호
//                             <input
//                                 type="password"
//                                 value={newPassword}
//                                 onChange={(e) => setNewPassword(e.target.value)}
//                                 placeholder="새 비밀번호 입력"
//                             />
//                         </label>

//                         <label>
//                             새 비밀번호 확인
//                             <div className="input-group">
//                                 <input
//                                     type="password"
//                                     value={confirmPassword}
//                                     onChange={(e) => setConfirmPassword(e.target.value)}
//                                     placeholder="새 비밀번호 다시 입력"
//                                 />
//                                 <button onClick={handleConfirmNewPassword}>확인</button>
//                             </div>
//                         </label>

//                         {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
//                     </>
//                 )}
//             </section>

//             {/* 회원 탈퇴 섹션 */}
//             <section className="section">
//                 <h3>회원 탈퇴</h3>
//                 <label>
//                     현재 비밀번호
//                     <div className="input-group">
//                         <input
//                             type="password"
//                             placeholder="현재 비밀번호 입력"
//                         />
//                         <button className="delete-account" onClick={handleDeleteAccount}>회원 탈퇴</button>
//                     </div>
//                 </label>
//             </section>
//         </div>
//     );
// };

// export default MemberInfo;

// import React, { useState } from 'react';
// import '../styles/pages/MemberInfo.css';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const MemberInfo = () => {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('hongildong@example.com');
//     const [emailCode, setEmailCode] = useState('');
//     const [isEmailVerified, setIsEmailVerified] = useState(false);

//     const handleEmailVerify = async () => {
//         try {
//             const response = await axios.post('/api/email/send-verification', { email });
//             if (response.status === 200) {
//                 alert('이메일로 인증번호가 발송되었습니다.');
//             }
//         } catch (error) {
//             if (axios.isAxiosError(error)) {
//                 alert(error.response?.data?.message || '인증번호 발송에 실패했습니다.');
//             }
//         }
//     };

//     const handleEmailCodeVerify = async () => {
//         try {
//             const response = await axios.post('/api/email/verify', { email, verificationCode: emailCode });
//             if (response.status === 200) {
//                 setIsEmailVerified(true);
//                 alert('이메일이 성공적으로 인증되었습니다.');
//             }
//         } catch (error) {
//             if (axios.isAxiosError(error)) {
//                 alert(error.response?.data?.message || '인증번호가 일치하지 않습니다.');
//             }
//         }
//     };

//     return (
//         <div className="mypage-wrapper">
//             <h2>회원정보 수정</h2>
//             <p>이메일 주소를 수정하거나 비밀번호를 재설정할 수 있습니다.</p>

//             <section className="section">
//                 <h3>개인정보 수정</h3>
//                 <label>
//                     이메일
//                     <div className="input-group">
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             disabled={isEmailVerified}
//                         />
//                         {!isEmailVerified && (
//                             <button 
//                                 onClick={handleEmailVerify} 
//                                 style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
//                             >
//                                 인증
//                             </button>
//                         )}
//                     </div>
//                 </label>

//                 {!isEmailVerified && (
//                     <div className="input-group">
//                         <input
//                             type="text"
//                             placeholder="인증번호 입력"
//                             value={emailCode}
//                             onChange={(e) => setEmailCode(e.target.value)}
//                         />
//                         <button 
//                             onClick={handleEmailCodeVerify} 
//                             style={{ backgroundColor: '#000000', color: '#FFFFFF' }}
//                         >
//                             확인
//                         </button>
//                     </div>
//                 )}
//             </section>

//             <div className="actions">
//                 <button>저장</button>
//                 <button className="delete-account" onClick={() => alert('회원 탈퇴 기능 구현 예정')}>
//                     회원 탈퇴
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default MemberInfo;

// import React, { useState } from 'react';
// import '../styles/pages/MemberInfo.css';
// import Layout from '../components/Layout/Layout';
// import axios from 'axios';

// const MemberInfo = () => {
//   const [email, setEmail] = useState('hongildong@example.com');
//   const [emailCode, setEmailCode] = useState('');
//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const [showEmailCodeInput, setShowEmailCodeInput] = useState(false);

//   const handleEmailVerify = async () => {
//     try {
//       const response = await axios.post('/api/email/send-verification', {
//         email: email
//       });

//       if (response.status === 200) {
//         alert('이메일로 인증번호가 발송되었습니다.');
//         setShowEmailCodeInput(true);
//       }
//     } catch (error) {
//       alert('인증번호 발송에 실패했습니다.');
//     }
//   };

//   const handleEmailCodeVerify = async () => {
//     try {
//       const response = await axios.post('/api/email/verify', {
//         email: email,
//         verificationCode: emailCode
//       });

//       if (response.status === 200) {
//         setIsEmailVerified(true);
//         alert('이메일 인증이 완료되었습니다.');
//       }
//     } catch (error) {
//       alert('인증번호가 일치하지 않습니다.');
//     }
//   };

//   return (
//     <Layout>
//       <div className="mypage-wrapper">
//         <h2>회원정보 수정</h2>
//         <p>전화번호와 이메일 주소를 수정하거나 비밀번호를 재설정할 수 있어요.</p>

//         {/* 📌 이메일 인증 섹션 */}
//         <section className="section">
//           <h3>개인정보 수정</h3>
//           <label>
//             이메일
//             <div className="input-group">
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 disabled={isEmailVerified}
//               />
//               {!isEmailVerified && (
//                 <button onClick={handleEmailVerify}>인증</button>
//               )}
//             </div>
//           </label>

//           {/* ✅ 이메일 인증번호 입력 폼 (버튼 클릭 후 등장) */}
//           {showEmailCodeInput && !isEmailVerified && (
//             <label>
//               인증번호 입력
//               <div className="input-group">
//                 <input
//                   type="text"
//                   placeholder="인증번호 입력"
//                   value={emailCode}
//                   onChange={(e) => setEmailCode(e.target.value)}
//                 />
//                 <button onClick={handleEmailCodeVerify}>확인</button>
//               </div>
//             </label>
//           )}
//         </section>

//         {/* 저장 및 탈퇴 버튼 */}
//         <div className="actions">
//           <button>저장</button>
//           <button className="delete-account">회원 탈퇴</button>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default MemberInfo;


// // export default MemberInfo;
// import React, { useState } from 'react';
// import '../styles/pages/MemberInfo.css';
// // import { FaSearch, FaUniversalAccess } from 'react-icons/fa';
// import { useNavigate } from 'react-router-dom';
// import AccessibilityModal from '../components/AccessibilityModal';
// import Layout from '../components/Layout/Layout';
// import axios from 'axios';

// // 입력 필드 컴포넌트 (이미 알고 계신 구성)
// interface InputFieldProps {
//   id: string;
//   label: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   type?: string;
//   disabled?: boolean;
//   placeholder?: string;
// }

// const InputField = ({
//   id,
//   label,
//   value,
//   onChange,
//   type = "text",
//   disabled = false,
//   placeholder
// }: InputFieldProps) => (
//   <label id={id}>
//     {label}
//     <input
//       type={type}
//       value={value}
//       onChange={onChange}
//       disabled={disabled}
//       aria-labelledby={id}
//       placeholder={placeholder}
//       style={{ color: '#000000', display: 'block' }}
//     />
//   </label>
// );

// // 인증 버튼 컴포넌트
// interface VerifyButtonProps {
//   onClick: () => void;
//   label: string;
// }

// const VerifyButton = ({ onClick, label }: VerifyButtonProps) => (
//   <button onClick={onClick} aria-label={label} style={{ color: '#000000' }}>
//     인증
//   </button>
// );

// // 인증 입력 필드 컴포넌트
// interface VerificationInputGroupProps {
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onVerify: () => void;
//   disabled: boolean;
//   type: string;
// }

// const VerificationInputGroup = ({
//   value,
//   onChange,
//   onVerify,
//   disabled,
//   type
// }: VerificationInputGroupProps) => (
//   <div className="input-group">
//     <input
//       type="text"
//       placeholder="인증번호 입력"
//       value={value}
//       onChange={onChange}
//       disabled={disabled}
//       aria-label={`${type} 인증번호 입력`}
//       style={{ color: '#000000' }}
//     />
//     <button onClick={onVerify} style={{ color: '#000000' }} aria-label="인증번호 확인">
//       확인
//     </button>
//   </div>
// );

// // 개인정보 수정 섹션 컴포넌트
// interface PersonalInfoSectionProps {
//   name: string;
//   phone: string;
//   email: string;
//   phoneCode: string;
//   emailCode: string;
//   isPhoneVerified: boolean;
//   isEmailVerified: boolean;
//   onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onPhoneCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onEmailCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onPhoneVerify: () => void;
//   onEmailVerify: () => void;
//   onPhoneCodeVerify: () => void;
//   onEmailCodeVerify: () => void;
// }

// const PersonalInfoSection = ({
//   name,
//   // phone,
//   email,
//   // phoneCode,
//   emailCode,
//   // isPhoneVerified,
//   isEmailVerified,
//   onNameChange,
//   // onPhoneChange,
//   onEmailChange,
//   // onPhoneCodeChange,
//   onEmailCodeChange,
//   // onPhoneVerify,
//   onEmailVerify,
//   // onPhoneCodeVerify,
//   onEmailCodeVerify
// }: PersonalInfoSectionProps) => (
//   <section className="section" aria-labelledby="personalInfoTitle">
//     <h3 id="personalInfoTitle">개인정보 수정</h3>
//     <div role="form">

//       <label id="emailLabel">
//         이메일
//         <div className="input-group">
//           <input
//             type="email"
//             value={email}
//             onChange={onEmailChange}
//             disabled={isEmailVerified}
//             aria-labelledby="emailLabel"
//             style={{ color: '#000000' }}
//           />
//           <VerifyButton onClick={onEmailVerify} label="이메일 인증하기" />
//         </div>
//         <VerificationInputGroup
//           value={emailCode}
//           onChange={onEmailCodeChange}
//           onVerify={onEmailCodeVerify}
//           disabled={isEmailVerified}
//           type="이메일"
//         />
//       </label>
//     </div>
//   </section>
// );

// // 비밀번호 재설정 섹션 컴포넌트
// interface PasswordSectionProps {
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
//   passwordError: string;
//   isPasswordValid: boolean;
//   onCurrentPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onNewPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onConfirmPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onPasswordVerify: () => void;
//   onConfirmNewPassword: () => void;
// }

// const PasswordSection = ({
//   currentPassword,
//   newPassword,
//   confirmPassword,
//   passwordError,
//   isPasswordValid,
//   onCurrentPasswordChange,
//   onNewPasswordChange,
//   onConfirmPasswordChange,
//   onPasswordVerify,
//   onConfirmNewPassword
// }: PasswordSectionProps) => (
//   <section className="section" aria-labelledby="passwordTitle">
//     <h3 id="passwordTitle">비밀번호 재설정</h3>
//     <div role="form">
//       <label id="currentPwLabel">
//         현재 비밀번호
//         <div className="input-group">
//           <input
//             type="password"
//             value={currentPassword}
//             onChange={onCurrentPasswordChange}
//             aria-labelledby="currentPwLabel"
//             style={{ color: '#000000' }}
//           />
//           <button 
//             onClick={onPasswordVerify} 
//             aria-label="현재 비밀번호 확인"
//             style={{ color: '#000000' }}
//           >
//             확인
//           </button>
//         </div>
//       </label>
//       {isPasswordValid && (
//         <>
//           <label id="newPwLabel">
//             새 비밀번호
//             <div className="input-group">
//               <input
//                 type="password"
//                 value={newPassword}
//                 onChange={onNewPasswordChange}
//                 placeholder="8자 이상 입력해주세요"
//                 aria-labelledby="newPwLabel"
//                 style={{ color: '#000000' }}
//               />
//             </div>
//           </label>
//           <label id="confirmPwLabel">
//             새 비밀번호 확인
//             <div className="input-group">
//               <input
//                 type="password"
//                 value={confirmPassword}
//                 onChange={onConfirmPasswordChange}
//                 placeholder="새 비밀번호를 다시 입력해주세요"
//                 aria-labelledby="confirmPwLabel"
//                 style={{ color: '#000000' }}
//               />
//               <button 
//                 onClick={onConfirmNewPassword} 
//                 aria-label="새 비밀번호 확인"
//                 style={{ color: '#000000' }}
//               >
//                 확인
//               </button>
//             </div>
//           </label>
//           {passwordError && <p role="alert" aria-live="polite">{passwordError}</p>}
//         </>
//       )}
//     </div>
//   </section>
// );

// // MemberInfo 페이지 컴포넌트
// const MemberInfo = () => {
//   const navigate = useNavigate();
//   const [name, setName] = useState('홍길동');
//   const [phone, setPhone] = useState('010-1234-5678');
//   const [email, setEmail] = useState('hongildong@example.com');
//   const [phoneCode, setPhoneCode] = useState('');
//   const [emailCode, setEmailCode] = useState('');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [isPhoneVerified, setIsPhoneVerified] = useState(false);
//   const [isEmailVerified, setIsEmailVerified] = useState(false);
//   const [isPasswordValid, setIsPasswordValid] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const handlePhoneVerify = () => {
//     alert('문자메시지로 인증번호가 발송되었습니다.');
//     // 인증번호 발송 로직 추가
//   };

//   const handleEmailVerify = async () => {
//     try {
//       const response = await axios.post('/api/email/send-verification', {
//         email: email
//       });
      
//       if (response.status === 200) {
//         alert('이메일로 인증번호가 발송되었습니다.');
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         alert(error.response?.data?.message || '인증번호 발송에 실패했습니다.');
//       }
//     }
//   };

//   const handleEmailCodeVerify = async () => {
//     try {
//       const response = await axios.post('/api/email/verify', {
//         email: email,
//         verificationCode: emailCode
//       });
      
//       if (response.status === 200) {
//         setIsEmailVerified(true);
//         alert('이메일이 성공적으로 변경되었습니다.');
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         alert(error.response?.data?.message || '인증번호가 일치하지 않습니다.');
//       }
//     }
//   };

//   const handleNameUpdate = async () => {
//     try {
//       const response = await axios.put('/*추후추가예정*/', {
//         name: name
//       });
      
//       if (response.status === 200) {
//         alert('이름이 성공적으로 변경되었습니다.');
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         alert(error.response?.data?.message || '이름 변경에 실패했습니다.');
//       }
//     }
//   };

//   const handlePasswordVerify = async () => {
//     try {
//       const response = await axios.post('/*추후추가예정*/', {
//         currentPassword: currentPassword
//       });
      
//       if (response.status === 200) {
//         setIsPasswordValid(true);
//         alert('비밀번호가 확인되었습니다.');
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         setIsPasswordValid(false);
//         alert(error.response?.data?.message || '현재 비밀번호가 일치하지 않습니다.');
//       }
//     }
//   };

//   const handleConfirmNewPassword = async () => {
//     if (newPassword !== confirmPassword) {
//       setPasswordError('새 비밀번호가 일치하지 않습니다.');
//       return;
//     }
    
//     if (newPassword.length < 8) {
//       setPasswordError('비밀번호는 8자 이상이어야 합니다.');
//       return;
//     }
    
//     try {
//       const response = await axios.post('/{id}/mypage/password', {
//         currentPassword: currentPassword,
//         newPassword: newPassword
//       });
      
//       if (response.status === 200) {
//         setPasswordError('');
//         alert('비밀번호가 성공적으로 변경되었습니다.');
//         setCurrentPassword('');
//         setNewPassword('');
//         setConfirmPassword('');
//         setIsPasswordValid(false);
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         setPasswordError(error.response?.data?.message || '비밀번호 변경에 실패했습니다.');
//       }
//     }
//   };

//   const handleDeleteAccount = async () => {
//     const confirmDelete = window.confirm('정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.');
//     if (confirmDelete) {
//       try {
//         const response = await axios.delete('/{id}/mypage/delete');
//         if (response.status === 200) {
//           alert('회원 탈퇴가 완료되었습니다.');
//           localStorage.removeItem('token');
//           navigate('/login');
//         }
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           alert(error.response?.data?.message || '회원 탈퇴에 실패했습니다.');
//         }
//       }
//     }
//   };

//   const handleSave = async () => {
//     try {
//       if (name) {
//         await handleNameUpdate();
//       }
//       alert('모든 변경사항이 저장되었습니다.');
//     } catch (error) {
//       console.log(error.response);
//       alert('변경사항 저장에 실패했습니다.');
//     }
//   };

//   // const handleZoom = (zoomType: string) => {
//   //   const currentZoom = document.body.style.zoom ? parseFloat(document.body.style.zoom) : 1;
//   //   if (zoomType === 'in') document.body.style.zoom = (currentZoom + 0.1).toString();
//   //   if (zoomType === 'out') document.body.style.zoom = (currentZoom - 0.1).toString();
//   // };

//   return (
//     <Layout>
//       <div role="main">
//         <div className="mypage-wrapper">
//           <h2 id="pageTitle">회원정보 수정</h2>
//           <p>전화번호와 이메일 주소를 수정하거나 비밀번호를 재설정할 수 있어요.</p>

//           <PersonalInfoSection
//             name={name}
//             phone={phone}
//             email={email}
//             phoneCode={phoneCode}
//             emailCode={emailCode}
//             isPhoneVerified={isPhoneVerified}
//             isEmailVerified={isEmailVerified}
//             onNameChange={(e) => setName(e.target.value)}
//             onPhoneChange={(e) => setPhone(e.target.value)}
//             onEmailChange={(e) => setEmail(e.target.value)}
//             onPhoneCodeChange={(e) => setPhoneCode(e.target.value)}
//             onEmailCodeChange={(e) => setEmailCode(e.target.value)}
//             onPhoneVerify={handlePhoneVerify}
//             onEmailVerify={handleEmailVerify}
//             onPhoneCodeVerify={() => {
//               if (phoneCode === '123456') {
//                 setIsPhoneVerified(true);
//                 alert('전화번호 인증이 완료되었습니다.');
//               } else {
//                 alert('인증번호가 일치하지 않습니다.');
//               }
//             }}
//             onEmailCodeVerify={handleEmailCodeVerify}
//           />

//           <PasswordSection
//             currentPassword={currentPassword}
//             newPassword={newPassword}
//             confirmPassword={confirmPassword}
//             passwordError={passwordError}
//             isPasswordValid={isPasswordValid}
//             onCurrentPasswordChange={(e) => setCurrentPassword(e.target.value)}
//             onNewPasswordChange={(e) => setNewPassword(e.target.value)}
//             onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
//             onPasswordVerify={handlePasswordVerify}
//             onConfirmNewPassword={handleConfirmNewPassword}
//           />

//           <div className="actions" role="group" aria-label="회원 정보 관리">
//             <button onClick={handleSave} aria-label="변경사항 저장">저장</button>
//             <button 
//               className="delete-account" 
//               onClick={handleDeleteAccount}
//               aria-label="회원 탈퇴"
//               style={{ color: '#000000' }}
//             >
//               회원 탈퇴
//             </button>
//           </div>
//         </div>

//         <AccessibilityModal 
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//         />
//       </div>
//     </Layout>
//   );
// };

// export default MemberInfo;
