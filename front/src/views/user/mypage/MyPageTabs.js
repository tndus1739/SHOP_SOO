import React from 'react';
import { CCard, CCardBody, CCol, CNav, CNavItem, CNavLink } from '@coreui/react';
import {useNavigate} from 'react-router-dom';
import MyInfo from './MyInfo';

const MyPageTabs = () => {
  const navigator = useNavigate()

  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardBody>
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink onClick={() => {navigator('/user/mypage/MyPageTabs')}} style={{cursor: 'pointer'}} active>
                Home
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink onClick={() => {navigator('/user/mypage/MyInfo')}} style={{cursor: 'pointer'}} >정보수정</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#">주문내역</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#">장바구니</CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink href="#">좋아요</CNavLink>
            </CNavItem>
          </CNav>
          <MyInfo />
        </CCardBody>
      </CCard>
    </CCol>
  );
};

export default MyPageTabs;
