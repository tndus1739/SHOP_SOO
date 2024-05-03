import React, { useState } from 'react';
// import CustomDatePicker from "src/views/admin/order/CustomDatePicker";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from "@coreui/react";
import Dropdown from "src/views/admin/order/Dropdown";

const OrderList = () => {
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());
//
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [selectedPeriod, setSelectedPeriod] = useState(PERIOD[3].name);
//
//   const toggleDropdown = () => {
//     setIsDropdownOpen((prev) => !prev);
//   };
//
//   const setDateRange = (period) => {
//     const start = new Date(formatDate(new Date()));
//
//     if (period === "1주일") {
//       start.setDate(start.getDate() - 7);
//     } else if (period.includes("개월")) {
//       start.setMonth(start.getMonth() - Number(period[0]));
//     }
//
//     setStartDate(period === "전체" ? new Date("2020-01-01") : start);
//     setEndDate(new Date(formatDate(new Date())));
//   };
//
//   const onClickPeriod = (e) => {
//     const { value } = e.target;
//     setSelectedPeriod(value);
//     setDateRange(value);
//     setIsDropdownOpen((prev) => !prev);
//   };


  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>주문내역</strong>

            {/*검색 박스*/}
            {/*주문 기간*/}
            {/*<div className="App">*/}
            {/*  <Dropdown*/}
            {/*    isDropdownOpen={isDropdownOpen}*/}
            {/*    toggleDropdown={toggleDropdown}*/}
            {/*    selectedPeriod={selectedPeriod}*/}
            {/*    onClickPeriod={onClickPeriod}*/}
            {/*  />*/}

            {/*  <CustomDatePicker*/}
            {/*    selectedDate={startDate}*/}
            {/*    setSelectedDate={setStartDate}*/}
            {/*  />*/}
            {/*  <span>-</span>*/}
            {/*  <CustomDatePicker*/}
            {/*    selectedDate={endDate}*/}
            {/*    setSelectedDate={setEndDate}*/}
            {/*  />*/}
            {/*  <button className="search-button" disabled={startDate > endDate}>*/}
            {/*    검색*/}
            {/*  </button>*/}
            {/*</div>*/}
          </CCardHeader>

          <CCardBody>
            {/* 주문 목록 표시 */}
            <div style={{minHeight: '550px', maxHeight: '550px', overflowY: 'auto'}}>
              <CTable style={{textAlign: 'center'}}>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col" style={{width: '20%'}}>주문번호</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '20%' }}>주문자</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '10%' }}>총 금액</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '20%' }}>주문일자</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '10%' }}>결제방법</CTableHeaderCell>
                    <CTableHeaderCell scope="col" style={{ width: '20%' }}>관리</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {/* 주문 목록 아이템 */}
                  <CTableRow>
                    <CTableHeaderCell scope="row" style={{ width: '20%' }}></CTableHeaderCell>
                    <CTableDataCell style={{ width: '20%' }}></CTableDataCell>
                    <CTableDataCell style={{ width: '10%' }}></CTableDataCell>
                    <CTableDataCell style={{ width: '20%' }}></CTableDataCell>
                    <CTableDataCell style={{ width: '10%' }}></CTableDataCell>
                    <CTableDataCell style={{ width: '20%' }}>
                      <CButton color="primary" variant="outline" style={{ height: '30px', lineHeight: '10px' }}>관리</CButton>
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>

        </CCard>
      </CCol>
    </CRow>
  );
}

export default OrderList;
