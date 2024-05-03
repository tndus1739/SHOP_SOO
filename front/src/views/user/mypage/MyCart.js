import React from 'react';
import MyPageTabs from "src/views/user/mypage/MyPageTabs";
import {CCard, CCardBody, CCol} from "@coreui/react";

const MyCart = () => {
  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardBody>
          <MyPageTabs/>
          <CCardBody>
            {/*내용*/}
            장바구니
          </CCardBody>
        </CCardBody>
      </CCard>
    </CCol>
  );
};

export default MyCart;
