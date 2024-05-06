import React, {useEffect, useState} from 'react';
import MyPageTabs from "src/views/user/mypage/MyPageTabs";
import {CCard, CCardBody, CCol, CRow} from "@coreui/react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import ItemList from "src/views/user/item/ItemList";

const MyLike = () => {
  const navigator = useNavigate()
  const [items, setItems] = useState([])

  const getLikeItems = () => {
    const email = localStorage.getItem('email')
    if (!email) {
      alert('로그인이 필요한 페이지입니다')
      navigator('/signin')
    }
    axios.get(`http://localhost:3011/like/${email}`).then((res) => {
      console.log(res)
      const data = []
      for (const item of res.data) {
        item.itemGroup.isLike = 1
        data.push(item.itemGroup)
      }
      setItems(data)
    })

  }

  useEffect(() => {
    getLikeItems()
  }, []);

  return (
    <CCol xs={12}>
      <CCard className="mb-4">
        <CCardBody>
          <MyPageTabs/>
          <CCardBody>
            <CRow>
              {
                items.length ?
                items.map((it, index) => (
                  <ItemList item={it} key={index} likeClick={getLikeItems}/>
                ))
                  :
                  <CCol style={{textAlign: 'center'}}>
                    좋아하는 상품이 없습니다.
                    상품을 추가해보세요.</CCol>
              }
            </CRow>
          </CCardBody>
        </CCardBody>
      </CCard>
    </CCol>
  );
};

export default MyLike;
