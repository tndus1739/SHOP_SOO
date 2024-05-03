import React, {useEffect, useState} from 'react';
import { CCol, CNav, CNavItem, CNavLink } from '@coreui/react';
import {NavLink, useLocation, useParams} from "react-router-dom";
import UserMyPageMemberService from "src/services/UserMyPageMemberService";

const MyPageTabs = ({ id }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('');


  useEffect(() => {
    console.log('useEffect ID in MyPageTabs1:', id); // id를 콘솔에 출력
    const fetchUserData = async () => {
      try {
        const response = await UserMyPageMemberService.getMember(id);
        const userId = response.data.id;
        console.log('useEffect MypageTabs User ID2:', userId);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (id !== null) {
      fetchUserData();
    }
  }, [id]);

  const handleTabClick = (tab) => {
    console.log('Current tab:', tab);
    setActiveTab(tab);
  };

  console.log('MypageTabs User ID:', id);

  return (
    <CCol xs={12}>
      <CNav variant="tabs">
        <CNavItem>
          <CNavLink
            as={NavLink}
            to="/mypage/myHome"
            onClick={() => handleTabClick('MyHome')}
            style={{ cursor: 'pointer' }}
            active={activeTab === 'MyHome'}
          >
            Home
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            as={NavLink}
            to={`/mypage/${id}`}
            onClick={() => handleTabClick('MyInfo')}
            style={{ cursor: 'pointer' }}
            active={activeTab === 'MyInfo' || location.pathname === `/mypage/${id}`}
          >
            정보수정 : {id}
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            as={NavLink}
            to="/mypage/myOrder"
            onClick={() => handleTabClick('MyOrder')}
            style={{ cursor: 'pointer' }}
            active={activeTab === 'MyOrder'}
          >
            주문내역
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            as={NavLink}
            to="/mypage/myCart"
            onClick={() => handleTabClick('MyCart')}
            style={{ cursor: 'pointer' }}
            active={activeTab === 'MyCart'}
          >
            장바구니
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            as={NavLink}
            to="/mypage/myLike"
            onClick={() => handleTabClick('MyLike')}
            style={{ cursor: 'pointer' }}
            active={activeTab === 'MyLike'}
          >
            좋아요
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            as={NavLink}
            to="/mypage/myWithout"
            onClick={() => handleTabClick('MyWithout')}
            style={{ cursor: 'pointer' }}
            active={activeTab === 'MyWithout'}
          >
            탈퇴
          </CNavLink>
        </CNavItem>
      </CNav>
    </CCol>
  );
};

export default MyPageTabs;
