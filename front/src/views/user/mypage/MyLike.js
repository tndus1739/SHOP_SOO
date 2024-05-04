import React, {useEffect} from 'react';
import MyPageTabs from "src/views/user/mypage/MyPageTabs";
import {CCard, CCardBody, CCol} from "@coreui/react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const MyLike = () => {
  const navigator = useNavigate()

  const getLikeItems = () => {
    const email = localStorage.getItem('email')
    if(!email) {
      alert('로그인이 필요한 페이지입니다')
      navigator('/signin')
    }
    axios.get(`http://localhost:3011/like/${email}`).then((res) => {
      console.log(res)
    })

  }

  useEffect(() => {
    getLikeItems()
  }, []);

  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardBody>
          <MyPageTabs/>
          <CCardBody>
            {/*내용*/}
            좋아요
          </CCardBody>
        </CCardBody>
      </CCard>
    </CCol>
  );
};

export default MyLike;
