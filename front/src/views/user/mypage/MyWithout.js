import React, {useEffect, useState} from 'react';
import MyPageTabs from "src/views/user/mypage/MyPageTabs";
import {CButton, CCard, CCardBody, CCol, CFormInput, CFormLabel, CRow} from "@coreui/react";
import UserMyPageMemberService from "src/services/UserMyPageMemberService";

const MyWithout = () => {
  const [userData, setUserData] = useState(null);
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [withdrawn, setWithdrawn] = useState(false);
  const email = localStorage.getItem('email');

  const handleCheckPassword = async () => {
    try {
      console.log("입력된 비밀번호: ", pwd);
      const response = await UserMyPageMemberService.checkPassword(pwd);

      if (response.status === 200 && response.data === "비밀번호가 일치합니다.") {
        handleWithdraw();
      } else {
        setError("비밀번호가 일치하지 않습니다.");
      }
    } catch (error) {
      console.error("Error checking password:", error);
      setError("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleWithdraw = async () => {
    try {
      const response = await UserMyPageMemberService.withdrawUser(email);

      if (response.status === 200 && response.data === "회원 탈퇴가 완료되었습니다") {
        // 탈퇴 성공 시 처리
        setWithdrawn(true);
        alert('탈퇴가 완료되었습니다.');
      } else {
        // 탈퇴 실패 시 처리
        setError("탈퇴 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Error withdrawing user:", error);
      setError("탈퇴 처리 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!email) return;
        const response = await UserMyPageMemberService.getMember(email);
        setUserData(response.data);
        console.log("사용자 이메일: ", email);
      } catch (error) {
        console.error('Error', error);
      }
    };

    fetchUserData();
  }, [email]);

  if (withdrawn) {
    // 로그아웃 처리
    localStorage.removeItem('accessToken');
    localStorage.removeItem('email');
    // 홈으로 이동
    window.location.href = '/';
    return null;
  }

  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardBody>
          <MyPageTabs/>

          <CCardBody>
            <CCol sm={12} style={{marginTop: "10px"}}>

              <h5><b>회원 탈퇴</b></h5><p/>

              <div style={{marginTop: "40px"}}>
                {/* 이메일 입력란 */}
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputEmail" className="col-sm-2 col-form-label">이메일</CFormLabel>
                  <CCol sm={10}>
                    <CFormInput
                      placeholder="이메일"
                      autoComplete="email"
                      readOnly plainText
                      value={email}
                      required
                      defaultValue={userData ? userData.email : ''}
                      type={'email'}
                    />
                  </CCol>
                </CRow>

                {/* 비밀번호 입력란 */}
                <CRow className="mb-3">
                  <CFormLabel htmlFor="inputPassword" className="col-sm-2 col-form-label">비밀번호</CFormLabel>
                  <CCol sm={10}>
                    <CFormInput
                      placeholder="비밀번호"
                      type="password"
                      value={pwd}
                      onChange={(e) => setPwd(e.target.value)}
                      style={{width: "285px"}}
                    />
                  </CCol>
                </CRow>
              </div>
              {error && (
                <CRow className="mb-3">
                  <CCol sm={12} className="text-center">
                    <p className="text-danger">{error}</p>
                  </CCol>
                </CRow>
              )}

              {/* 탈퇴 버튼 */}
              <CRow>
                <CCol className="d-grid gap-2 d-md-flex justify-content-md-end" sm={12}>
                  <CButton
                    color="primary"
                    onClick={handleCheckPassword}
                  >
                    탈퇴하기
                  </CButton>
                </CCol>
              </CRow>

            </CCol>
          </CCardBody>
        </CCardBody>
      </CCard>
    </CCol>
  );
};

export default MyWithout;
