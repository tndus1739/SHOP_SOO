import React, {useEffect, useState} from 'react';
import {CButton, CFormInput, CImage, CInputGroup, CTableDataCell, CTableHeaderCell, CTableRow} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {cilDelete, cilMinus, cilPlus} from "@coreui/icons";
import {useNavigate} from "react-router-dom";

function OrderItem({it, num, total, delFunc}) {
  const navigator = useNavigate()

  const [count, setCount] = useState(it.cnt)
  const minus = () => {
    if (count == 1) {
      return
    }
    setCount(count - 1)
  }

  const plus = () => {
    setCount(count + 1)
  }

  const itemDetail = (id) => {
    navigator(`/item/${id}`)
  }

  const addCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const deleteOrderItem = () => {
    delFunc(it.item.id)
  }

  useEffect(() => {
    total(it.item.id, count)
  }, [count]);

  return (
    <>
      <CTableRow>
        <CTableHeaderCell scope="row">{num + 1}</CTableHeaderCell>
        <CTableDataCell onClick={() => itemDetail(it.groupId)}>
          {
            it.images &&
            it.images.map((img, idx) => (
              img.isMain ?
                <CImage src={`http://localhost:3011${img.path}`} height={60} key={idx}
                        style={{cursor: 'pointer'}}/>
                :
                <CImage key={idx}></CImage>
            ))
          }
        </CTableDataCell>
        <CTableDataCell onClick={() => itemDetail(it.groupId)}>
          <strong style={{cursor: 'pointer'}}>
            {it.item.name}
          </strong>
        </CTableDataCell>
        <CTableDataCell>{it.category.name}</CTableDataCell>
        <CTableDataCell>{addCommas(Number(it.item.salePrice) + Number(it.item.optionPrice))}</CTableDataCell>
        <CTableDataCell width={'10%'}>
          <CInputGroup className="mb-1" size={'sm'}>
            <CButton type="button" color="secondary" variant="outline" id="button-addon1"
                     size={'sm'} style={{width: '30%'}} onClick={minus}>
              <CIcon icon={cilMinus}/>
            </CButton>
            <CFormInput
              type={'number'}
              value={count}
              readOnly
              style={{textAlign: 'center'}}
            />
            <CButton type="button" color="secondary" variant="outline" id="button-addon1" style={{width: '30%'}}
                     onClick={plus}>
              <CIcon icon={cilPlus}/>
            </CButton>
          </CInputGroup>
        </CTableDataCell>
        <CTableDataCell>
          <CButton color={'danger'} onClick={deleteOrderItem}>
            <CIcon icon={cilDelete}/>
          </CButton>
        </CTableDataCell>
      </CTableRow>
    </>
  );
}

export default OrderItem;
