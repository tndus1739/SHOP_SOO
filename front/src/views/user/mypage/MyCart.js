import React, {useEffect, useState} from 'react';
import MyPageTabs from "src/views/user/mypage/MyPageTabs";
import {CButton, CCard, CCardBody, CCol, CRow} from "@coreui/react";
import axios from "axios";
import Cart from "src/views/user/mypage/component/Cart";

const MyCart = () => {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)

  const addCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const getCart = () => {
    axios.get(`http://localhost:3011/cart/${localStorage.getItem('email')}`).then((res) => {
      console.log(res)
      setCart(res.data)
    })
  }

  const buy = () => {

  }

  const del = (id) => {
    axios.delete(`http://localhost:3011/cart/cartItem/${id}`).then((res) => {
      console.log(res)
      getCart()
    })
  }

  useEffect(() => {
    getCart()
  }, []);

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <MyPageTabs/>
              <CCardBody>
                {/*내용*/}
                장바구니
                <Cart cart={cart} total={setTotal} setCart={setCart} deleteFnc={del}/>
                <CRow>
                  <CCol style={{textAlign: 'center'}}>
                    <strong style={{fontSize: '23px'}}>전체 금액 : {addCommas(Number(total))}</strong>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol style={{textAlign: 'center'}}>
          <CButton color={'dark'} size={'lg'} onClick={buy}>주문하기</CButton>
        </CCol>
      </CRow>
    </>
  );
};

export default MyCart;
