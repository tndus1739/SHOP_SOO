import React, {useState} from 'react';
import {CButton, CCardBody, CCol, CFormInput, CRow} from "@coreui/react";
import UserMyPageMemberService from "src/services/UserMyPageMemberService";

const MyPwdCheck = ({onPasswordValidation}) => {
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
      setError("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <CCol xs={12}>
      <CCardBody style={{textAlign: 'center'}}>
        <CRow className="mb-3">
          <CCol sm={12} style={{marginTop: 100}}>
            <h4><b>비밀번호 확인</b></h4>
          </CCol>
        </CRow>
        <CRow className="mb-3 justify-content-center">
          <CCol sm={6} className="text-center">
            <div style={{marginBottom: "10px"}}>
              회원 정보를 안전하게 보호하기 위해 <br/>
              비밀번호를 한번 더 확인해 주세요.
            </div>
          </CCol>
        </CRow>
        <CRow className="mb-3 justify-content-center">
          <CCol sm={12} className="d-flex justify-content-center">
            <CFormInput
              placeholder="비밀번호"
              autoComplete="current-password"
              type="password"
              value={pwd}
              onChange={handlePasswordChange}
              style={{ width: '285px' }}
            />
          </CCol>
        </CRow>

        <CRow>
          <CCol sm={12} style={{height: 170}}>
            <CButton
              color="primary"
              onClick={handleCheckPassword}
              style={{width: '285px', marginBottom: '20px'}}>
              확인
            </CButton>
            {error && (
              <CRow className="mb-3">
                <CCol sm={12} className="text-center">
                  <p className="text-danger">{error}</p>
                </CCol>
              </CRow>
            )}
          </CCol>

        </CRow>
      </CCardBody>
    </CCol>
  );
};

export default MyPwdCheck;
