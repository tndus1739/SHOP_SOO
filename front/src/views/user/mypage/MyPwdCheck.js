import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CCol, CFormInput, CRow } from "@coreui/react";
import { useNavigate } from "react-router-dom";
import UserMyPageMemberService from "src/services/UserMyPageMemberService";

const MyPwdCheck = ({ onPasswordValidation }) => {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');

  const handlePasswordChange = (e) => {
    setPwd(e.target.value);
    setError('');
  };

  const handleCheckPassword = async () => {
    try {
      console.log("입력된 비밀번호: ", pwd);
      const response = await UserMyPageMemberService.checkPassword(pwd);

      if (response.data) {
        onPasswordValidation(true); // 부모 컴포넌트에게 알림
      } else {
        setError("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("Error checking password:", error);
      setError("비밀번호 확인 중 오류가 발생했습니다.");
    }
  };

  return (
    <CCol xs={12}>
        <CCardBody>
          <CRow className="mb-3">
            <CCol sm={12}>
              <h5>비밀번호 확인</h5>
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol sm={12}>
              <CFormInput
                placeholder="비밀번호"
                autoComplete="current-password"
                type="password"
                value={pwd}
                onChange={handlePasswordChange}
              />
            </CCol>
          </CRow>
          {error && (
            <CRow className="mb-3">
              <CCol sm={12}>
                <p className="text-danger">{error}</p>
              </CCol>
            </CRow>
          )}
          <CRow>
            <CCol sm={12}>
              <CButton color="primary" onClick={handleCheckPassword}>확인</CButton>
            </CCol>
          </CRow>
        </CCardBody>
    </CCol>
  );
};

export default MyPwdCheck;
