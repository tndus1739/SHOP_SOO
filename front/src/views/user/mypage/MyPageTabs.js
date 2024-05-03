import React, {useEffect, useState} from 'react';
import { CCol, CNav, CNavItem, CNavLink } from '@coreui/react';
import {NavLink, useLocation, useParams} from "react-router-dom";
import UserMyPageMemberService from "src/services/UserMyPageMemberService";

const MyPageTabs = ({ id }) => {
  const location = useLocation();
  const { email } = useParams();
  const [activeTab, setActiveTab] = useState('');


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await UserMyPageMemberService.getMember(email);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (email !== null) {
      fetchUserData();
    }
  }, [email]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };


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
            to="/mypage/myInfo"
            onClick={() => handleTabClick('MyInfo')}
            style={{ cursor: 'pointer' }}
            active={activeTab === 'MyInfo'}
          >
            정보수정
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
