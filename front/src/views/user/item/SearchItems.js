import React, {useEffect, useState} from 'react';
import {CButton, CCard, CCardBody, CCardHeader, CCardText, CCarousel, CCarouselItem, CCol, CRow} from "@coreui/react";
import {DocsExample} from "src/components";
import ReactImg from "src/assets/images/react.jpg";
import AngularImg from "src/assets/images/angular.jpg";
import VueImg from "src/assets/images/vue.jpg";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import CIcon from "@coreui/icons-react";
import CoreUIIcons from "src/views/icons/coreui-icons/CoreUIIcons";
import {freeSet} from "@coreui/icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faStar, faStarHalf, faHeart} from "@fortawesome/free-solid-svg-icons"

import axios from "axios";
import ItemList from "src/views/user/item/ItemList";

function Items({props}) {
  const [items, setItems] = useState([])
  const [likes, setLikes] = useState([])
  const {category_id} = useParams()

  const img1 = 'https://cf.product-image.s.zigzag.kr/original/d/2024/2/22/202_202402221324280320_79765.gif?width=400&height=400&quality=80&format=jpeg'
  const img2 = 'https://cf.product-image.s.zigzag.kr/original/d/2024/4/12/7416_202404121417300928_37462.gif?width=400&height=400&quality=80&format=jpeg'
  const img3 = 'https://image.msscdn.net/images/plan_w_mobile_img/2024041616370700000006399.jpg'

  const [isBaskHovered, setIsBaskHovered] = useState(false);



  const getItems = () => {
    axios.get('http://localhost:3011/items/test/' + category_id).then((res) => {
      getLikes(res.data)
      // setItems(res.data)
    })
  }
  const getLikes = async (list) => {
    const email = localStorage.getItem('email')
    let likeList = []
    axios.get(`http://localhost:3011/like/${email}`).then(res => {
      console.log(res.data)
      if (res.data.length) {
        for(const it of list) {
          it.isLike = 0
          for(const like of res.data) {
            if(it.id == like.itemGroup.id) {
              it.isLike = 1
            }
          }
        }
        likeList = res.data
      }
    }).then(() => {
      setItems(list)
      setLikes(likeList)
      console.log(list)
    })
  }

  useEffect(() => {
    // getItemsTest()
    getItems()
  }, [category_id]);
  const basketIcon = {
    cursor: 'pointer',
  }

  return (
    <>
      <CRow>
        {
          items.map((it, index) => (
            <ItemList item={it} key={index} likeClick={getItems} />
          ))
        }
      </CRow>
    </>
  );
}

export default Items;
