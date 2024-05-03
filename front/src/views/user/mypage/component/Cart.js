import React, {useEffect, useState} from 'react';
import {
  CButton, CCol, CFormInput,
  CImage, CInputGroup, CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {cilDelete, cilMinus, cilPlus} from "@coreui/icons";
import OrderItem from "src/views/user/item/order/OrderItem";
import CartItem from "src/views/user/mypage/component/CartItem";

function Cart({cart, total, setCart, deleteFnc}) {

  const calculate_total = (id, count, arr) => {
    let totalPrice = 0
    let data = []
    let idx = 0
    if (id == null && count == null) {
      for (const item of arr) {
        totalPrice += (item.price) * item.count
      }
    } else {
      for (const ca of cart) {
        data.push(ca)
        if (data[idx].cartItemId == id) {
          data[idx].count = count
        }
        totalPrice += (data[idx].price) * data[idx].count
        idx++
      }
      setCart(data)
    }
    total(totalPrice)
  }


  const deleteCart = (id) => {
    // const data = []
    // for(const ct of cart) {
    //   data.push(ct)
    // }
    // for(const idx in data) {
    //   if(id == data[Number(idx)].cartItemId) {
    //     data.splice(Number(idx), 1)
    //   }
    // }
    // setCart(data)
    // calculate_total(null, null, data)
    deleteFnc(id)
  }

  useEffect(() => {
    calculate_total(null, null, cart)
  }, [cart]);

  return (
    <>
      <CTable hover style={{textAlign: 'center'}}>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">이미지</CTableHeaderCell>
            <CTableHeaderCell scope="col">상품명</CTableHeaderCell>
            <CTableHeaderCell scope="col">판매가격</CTableHeaderCell>
            <CTableHeaderCell scope="col">수량</CTableHeaderCell>
            <CTableHeaderCell scope="col"></CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {
            cart.length ?
              cart.map((it, index) => (
                <CartItem it={it} key={index} num={index} total={calculate_total} delFunc={deleteCart}/>
              ))
              :
              <CTableRow>
                <CTableDataCell colSpan={5}>등록된 상품이 없습니다.</CTableDataCell>
              </CTableRow>
          }
        </CTableBody>
      </CTable>
    </>
  );
}

export default Cart;
