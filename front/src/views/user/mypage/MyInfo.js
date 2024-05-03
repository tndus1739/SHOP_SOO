import React, { useState } from 'react';
import { CButton, CCard, CCardBody, CCol, CRow } from "@coreui/react";
import MyPageTabs from "src/views/user/mypage/MyPageTabs";
import MyPwdCheck from "src/views/user/mypage/MyPwdCheck";
import MyInfoForm from "src/views/user/mypage/MyInfoForm";

const MyInfo = () => {
  const [isPasswordValidated, setIsPasswordValidated] = useState(false);

  const handlePasswordValidation = (isValidated) => {
    setIsPasswordValidated(isValidated);
  };

  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardBody>
          <MyPageTabs />
          {isPasswordValidated ? (
            <MyInfoForm />
          ) : (
            <MyPwdCheck onPasswordValidation={handlePasswordValidation} />
          )}
        </CCardBody>
      </CCard>
    </CCol>
  );
};

export default MyInfo;
