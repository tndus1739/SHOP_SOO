import React, {useEffect, useState} from 'react';
import MyPageTabs from "src/views/user/mypage/MyPageTabs";
import {CCard, CCardBody, CCol} from "@coreui/react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import PaymentHistroy from "src/views/user/mypage/component/PaymentHistroy";

const MyOrder = () => {
  const navigator = useNavigate()
  const [items, setItems] = useState([])

  const getPayHistory = () => {
    const email = localStorage.getItem('email')
    if(email) {
      axios.get(`http://localhost:3011/pay/history/${email}`).then(res => {
        console.log(res)
        // const arr = []
        // for(const data of res.data) {
        //   for(const p of data.paymentList) {
        //     p.tid = data.tid
        //     arr.push(p)
        //   }
        // }
        // setItems(arr)
        // console.log(arr)
        setItems(res.data)
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
            {
              items.length ?
                items.map((it, index) => (
                  <PaymentHistroy item={it} key={index} idx={index} />
                ))
                :
                <></>
            }
          </CCardBody>
        </CCardBody>
      </CCard>
    </CCol>
  );
};

export default MyOrder;
