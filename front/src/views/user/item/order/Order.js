import React, {useEffect, useState} from 'react';
import {
  CButton, CFormInput,
  CImage, CInputGroup,
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

function Order({orders, total, setOrders}) {

  const calculate_total = (id, count, arr) => {
    let totalPrice = 0
    let data = []
    let idx = 0
    if (id == null && count == null) {
      for (const item of arr) {
        totalPrice += (item.item.salePrice + item.item.optionPrice) * item.cnt
      }
    } else {
      for (const order of orders) {
        data.push(order)
        if (data[idx].item.id == id) {
          data[idx].cnt = count
        }
        totalPrice += (data[idx].item.salePrice + data[idx].item.optionPrice) * data[idx].cnt
        idx++
      }
      setOrders(data)
    }
    total(totalPrice)
  }


  const deleteOrder = (id) => {
    const data = []
    for(const order of orders) {
      data.push(order)
    }
    for(const idx in data) {
      if(id == data[Number(idx)].item.id) {
        data.splice(Number(idx), 1)
      }
    }
    setOrders(data)
    calculate_total(null, null, data)
  }

  return (
    <>
      <CTable hover style={{textAlign: 'center'}}>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">이미지</CTableHeaderCell>
            <CTableHeaderCell scope="col">상품명</CTableHeaderCell>
            <CTableHeaderCell scope="col">카테고리</CTableHeaderCell>
            <CTableHeaderCell scope="col">판매가격</CTableHeaderCell>
            <CTableHeaderCell scope="col">수량</CTableHeaderCell>
            <CTableHeaderCell scope="col"></CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {
            orders.length ?
              orders.map((it, index) => (
                <OrderItem it={it} key={index} num={index} total={calculate_total} delFunc={deleteOrder}/>
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

export default Order;
