import React from 'react';
import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CCol, CImage,
  CRow,
  CTable,
  CTableBody, CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from "@coreui/react";

function PaymentHistroy({item}) {

  const dateFormat = (regdate) => {
    const date = new Date(regdate);
    return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
  }

  const addCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  return (
    <>
      <CRow>
        <CAccordion alwaysOpen>
          <CAccordionItem itemKey={1}>
            <CAccordionHeader>
              <CCol xs={1}>
                주문번호 :
              </CCol>
              <CCol style={{textAlign: 'left'}}>
                <strong>{item.tid}</strong>
              </CCol>
              <CCol xs={1}>
                주문일자 :
              </CCol>
              <CCol>
                <strong>{dateFormat(item.regDate)}</strong>
              </CCol>
              <CCol xs={1}>
                총 금액 :
              </CCol>
              <CCol>
                <strong>{addCommas(Number(item.totalPrice))}</strong>
              </CCol>
            </CAccordionHeader>
            <CAccordionBody>
            <CTable hover style={{textAlign: 'center'}}>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">이미지</CTableHeaderCell>
                    <CTableHeaderCell scope="col">상품명</CTableHeaderCell>
                    <CTableHeaderCell scope="col">주문금액</CTableHeaderCell>
                    <CTableHeaderCell scope="col">수량</CTableHeaderCell>
                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {
                    item.paymentList.length ?
                      item.paymentList.map((it, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell>
                            {index + 1}
                          </CTableDataCell>
                          <CTableDataCell>
                            {
                              it.item.itemGroup.images.map((img, idx) => (
                                img.isMain == 1 ?
                                <CImage src={`http://localhost:3011${img.path}`} height={60} key={idx}
                                        style={{cursor: 'pointer'}}/>
                                  :
                                  <CImage key={idx}/>
                              ))
                            }
                          </CTableDataCell>
                          <CTableDataCell>
                            {it.item.name}
                          </CTableDataCell>
                          <CTableDataCell>
                            {addCommas(Number(it.price))}
                          </CTableDataCell>
                          <CTableDataCell>
                            {it.cnt}
                          </CTableDataCell>
                        </CTableRow>
                      ))
                      :
                      <></>
                  }

                </CTableBody>
              </CTable>
            </CAccordionBody>
          </CAccordionItem>
        </CAccordion>
      </CRow>
    </>
  );
}

export default PaymentHistroy;
