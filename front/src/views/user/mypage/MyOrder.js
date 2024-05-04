import React, {useEffect} from 'react';
import MyPageTabs from "src/views/user/mypage/MyPageTabs";
import {CCard, CCardBody, CCol} from "@coreui/react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const MyOrder = () => {
  const navigator = useNavigate()

  const getPayHistory = () => {
    const email = localStorage.getItem('email')
    if(email) {
      axios.get(`http://localhost:3011/pay/history/${email}`).then(res => {
        console.log(res)
      })
    } else {
      alert('로그인이 필요한 페이지입니다.')
      navigator('/signin')
    }
  }

  useEffect(() => {
    getPayHistory()
  }, []);

  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardBody>
          <MyPageTabs/>
          <CCardBody>
            {/*내용*/}
            주문
          </CCardBody>
        </CCardBody>
      </CCard>
    </CCol>
  );
};

export default MyOrder;
