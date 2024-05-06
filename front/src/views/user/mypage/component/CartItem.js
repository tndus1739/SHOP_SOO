import React, {useEffect, useState} from 'react';
import {CButton, CFormInput, CImage, CInputGroup, CTableDataCell, CTableHeaderCell, CTableRow} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {cilDelete, cilMinus, cilPlus} from "@coreui/icons";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function CartItem({it, num, total, delFunc}) {
  const navigator = useNavigate()

  const [count, setCount] = useState(it.count)
  const minus = () => {
    if (count == 1) {
      return
    }
    const idx = count - 1
    updateCount(idx)
    setCount(idx)
  }

  const plus = () => {
    const idx = count + 1
    updateCount(idx)
    setCount(idx)
  }

  const updateCount = (cnt) => {
    axios.put(`http://localhost:3011/cartItem/${it.cartItemId}/${cnt}`).then((res) => {
      console.log(res)
    })
  }

  const itemDetail = (itemGroupId) => {
    navigator(`/item/${itemGroupId}`)
  }

  const addCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const deleteOrderItem = () => {
    delFunc(it.cartItemId)
  }

  useEffect(() => {
    total(it.cartItemId, count)
  }, [count]);

  useEffect(() => {
    setCount(it.count)
  }, [it]);

  return (
    <>
      <CTableRow>
        <CTableHeaderCell scope="row">{num + 1}</CTableHeaderCell>
        <CTableDataCell onClick={() => itemDetail(it.itemGroupId)}>
          <CImage src={`http://localhost:3011${it.path}`} height={60}
                  style={{cursor: 'pointer'}}/>
        </CTableDataCell>
        <CTableDataCell onClick={() => itemDetail(it.itemGroupId)}>
          <strong style={{cursor: 'pointer'}}>
            {it.name}
          </strong>
        </CTableDataCell>
        {/*<CTableDataCell>{it.category.name}</CTableDataCell>*/}
        <CTableDataCell>{addCommas(Number(it.price))}</CTableDataCell>
        <CTableDataCell width={'20%'}>
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

export default CartItem;
