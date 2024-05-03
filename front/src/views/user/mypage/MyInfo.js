import React from 'react';
import MyPageTabs from './MyPageTabs';
import {CCardBody, CCol} from "@coreui/react";

const MyInfo = () => {
  return (
    <CCol xs={12}>
      <MyPageTabs />
      <CCardBody>
        dd
      </CCardBody>

    </CCol>
  );
};

export default MyInfo;
