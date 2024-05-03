import React, {useEffect, useState} from 'react';
import MyPageTabs from "src/views/user/mypage/MyPageTabs";
import {CCard, CCardBody, CCol} from "@coreui/react";
import axios from "axios";

const MyCart = () => {
  const [cart, setCart] = useState([])

  const getCart = () => {
    axios.get(`http://localhost:3011/cart/${localStorage.getItem('email')}`).then((res) => {
      console.log(res)
    })
  }

  useEffect(() => {
    getCart()
  }, []);

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
