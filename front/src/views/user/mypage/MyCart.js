import React, {useEffect, useState} from 'react';
import MyPageTabs from "src/views/user/mypage/MyPageTabs";
import {CButton, CCard, CCardBody, CCol, CRow} from "@coreui/react";
import axios from "axios";
import Cart from "src/views/user/mypage/component/Cart";
import {useNavigate} from "react-router-dom";

const MyCart = () => {
  const navigator = useNavigate()
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
    console.log(cart)
    for(const c of cart) {
      c.email = localStorage.getItem('email')
    }
    axios.post('http://localhost:3011/item/order/test', cart).then(res => {
      console.log(res)
      navigator(`/order/${res.data}`)
    })
  }

  const del = (id) => {
    axios.delete(`http://localhost:3011/cart/cartItem/${id}`).then((res) => {
      console.log(res)
      getCart()
    })
  }

  useEffect(() => {
    const email = localStorage.getItem('email')
    if(!email) {
      alert('로그인이 필요한 페이지입니다.')
      navigator(-1)
    }
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
                <Cart cart={cart} total={setTotal} setCart={setCart} deleteFnc={del}/>
                {
                  total ?
                  <CRow>
                    <CCol style={{textAlign: 'center'}}>
                      <strong style={{fontSize: '23px'}}>전체 금액 : {addCommas(Number(total))}</strong>
                    </CCol>
                  </CRow>
                    :
                    <></>
                }
              </CCardBody>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {
        total ?
        <CRow>
          <CCol style={{textAlign: 'center'}}>
            <CButton color={'dark'} size={'lg'} onClick={buy}>주문하기</CButton>
          </CCol>
        </CRow>
          :
          <></>
      }
    </>
  );
};

export default MyCart;
