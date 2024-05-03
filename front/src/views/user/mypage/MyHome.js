import React from 'react';
import MyPageTabs from "src/views/user/mypage/MyPageTabs";
import {CCard, CCardBody, CCol} from "@coreui/react";

const MyHome = () => {
  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardBody>
          <MyPageTabs/>
          <CCardBody>
            {/*내용*/}
            홈
          </CCardBody>
        </CCardBody>
      </CCard>
    </CCol>
  );
};

export default MyHome;
