import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader, CCardText,
  CCol, CFormCheck, CFormLabel, CImage, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,
  CRow, CTable,
  CTableBody, CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {cilDelete} from "@coreui/icons";
import Order from "src/views/user/item/order/Order";
import kakaoPay from 'src/assets/images/kakaopay.png'
import axios from "axios";

function Orders(props) {
  const {orderId} = useParams()
  const [orders, setOrders] = useState([])
  const navigator = useNavigate()
  const [total, setTotal] = useState(0)
  const [visible, setVisible] = useState(false)
  const [kakaopay, setKakaopay] = useState('')


  const mock = [
    {
      groupId: 954,
      cnt: 3,
      item: {
        id: 969,
        name: 'mock1',
        colors: {
          name: 'black'
        },
        itemSize: 'XL',
        optionPrice: 1000,
        salePrice: 30000,
      },
      images: [
        {
          isMain: 1,
          path: '/images/item/8061f475-f8bd-4b2f-8f4e-f88f7d58514e.jpg'
        },
      ],
      category: {
        name: '반팔티'
      },
    },
    {
      groupId: 954,
      cnt: 2,
      item: {
        id: 968,
        name: 'mock2',
        colors: {
          name: 'red'
        },
        itemSize: 'XL',
        optionPrice: 1100,
        salePrice: 30000,
      },
      images: [
        {
          isMain: 1,
          path: '/images/item/8061f475-f8bd-4b2f-8f4e-f88f7d58514e.jpg'
        },
      ],
      category: {
        name: '반팔티'
      },
    },
    {
      groupId: 954,
      cnt: 5,
      item: {
        id: 970,
        name: 'mock3',
        colors: {
          name: 'blue'
        },
        itemSize: 'XL',
        optionPrice: 1200,
        salePrice: 30000,
      },
      images: [
        {
          isMain: 1,
          path: '/images/item/8061f475-f8bd-4b2f-8f4e-f88f7d58514e.jpg'
        },
      ],
      category: {
        name: '반팔티'
      },
    },
  ]
  const addCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const getOrder = () => {
    setOrders(mock)
  }

  const payment = () => {
    if (!orders.length) {
      alert('주문할 상품이 없습니다.')
      return
    } else {
      let payData = []
      const email = localStorage.getItem('email')
      for (const order of orders) {
        const obj = {}
        obj['itemId'] = order.item.id
        obj['cnt'] = order.cnt
        obj['email'] = email
        payData.push(obj)
      }
      axios.post('http://localhost:3011/pay/kakaopay', payData).then((res) => {
        console.log(res)
        if (res.data.msg === 'success' && res.data.next_redirect_pc_url) {
          window.open(res.data.next_redirect_pc_url, '_blank', 'width=350,height=500')
          // setVisible(true)
          // setKakaopay(res.data.next_redirect_pc_url)
        }
      })
    }
  }

  const test = (msg) => {
    console.log(msg)
  }

  const StaticBackdrop = () => {
    return (
      <>
        <CModal backdrop="static" visible={visible} onClose={() => setVisible(false)}>
          <CModalHeader>
            <CModalTitle>Modal title</CModalTitle>
          </CModalHeader>
          <CModalBody style={{textAlign: 'center'}}>
            <iframe src={kakaopay} height={'600px'}/>
          </CModalBody>
        </CModal>
      </>
    )
  }

  useEffect(() => {
    if (!orderId) {
      alert('잘못된 접근입니다.')
      navigator(-1)
    }
    getOrder()
  }, [orderId])

  useEffect(() => {
    window.addEventListener('message', msg)
    return () => window.removeEventListener('message', msg)
  }, []);

  const msg = (e) => {
    if (e.data.source != 'react-devtools-bridge' && e.data.source != 'react-devtools-content-script') {
      setKakaopay(e.data)
    }
  }

  useEffect(() => {
    if (kakaopay == 'success') {
      alert("결제가 완료되었습니다.")
      navigator('/')
    } else {
      if (typeof kakaopay == 'string' && kakaopay.trim()) {
        alert(kakaopay)
      }
      return
    }
  }, [kakaopay]);

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>Order Info</strong>&nbsp;&nbsp;
              <small>
                <p className="text-body-secondary small" style={{display: "inline-block", marginBottom: 0}}>
                  주문 정보
                </p>
              </small>
            </CCardHeader>
            <CCardBody>
              <Order orders={orders} total={setTotal} setOrders={setOrders}/>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <p/>
      <CRow>
        <CCol xs={3}>
          <CCard>
            <CCardHeader>
              <strong>Payment Method</strong>&nbsp;&nbsp;
              <small>
                <p className="text-body-secondary small" style={{display: "inline-block", marginBottom: 0}}>
                  결제 수단
                </p>
              </small>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={4} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <CFormCheck type="radio" defaultChecked/>
                </CCol>
                <CCol>
                  <CImage src={kakaoPay}/>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol>

        </CCol>
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>Payment Info</strong>&nbsp;&nbsp;
              <small>
                <p className="text-body-secondary small" style={{display: "inline-block", marginBottom: 0}}>
                  결제 정보
                </p>
              </small>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <CCardText style={{textAlign: 'center', fontSize: '20px'}}>
                    <strong>결제금액 : </strong>
                  </CCardText>
                </CCol>
                <CCol>
                  <CCardText style={{textAlign: 'center', fontSize: '20px'}}>
                    <strong>{addCommas(Number(total))}</strong>
                  </CCardText>
                </CCol>
              </CRow>
              <p/>
              <CRow>
                <CCol xs={6}></CCol>
                <CCol>
                  <CButton color={'primary'} style={{width: '100%'}} onClick={payment}>주문</CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      {/*{StaticBackdrop()}*/}
    </>
  );
}

export default Orders;
