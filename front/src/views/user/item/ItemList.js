import React, {useContext, useEffect, useState} from 'react';
import {CCard, CCardBody, CCardText, CCarousel, CCarouselItem, CCol, CRow} from "@coreui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faStar, faStarHalf} from "@fortawesome/free-solid-svg-icons";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

function ItemList({item, likeClick}) {

  const navigator = useNavigate()
  const [isLikeHovered, setIsLikeHovered] = useState(false);

  const likeIcon = {
    color: 'red',
    cursor: 'pointer',
  }

  const disLikeIcon = {
    color: 'black',
    cursor: 'pointer',
  }


  const overflow_ellipsis = {
    whiteSpace: 'nowrap',       /* 텍스트를 한 줄에 표시합니다. */
    overflow: 'hidden',         /* 넘치는 부분을 숨깁니다. */
    textOverflow: 'ellipsis',   /* 넘치는 부분에 대해 생략 부호를 표시합니다. */
  }

  const addCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const toItemDetail = (id) => {
    navigator(`/item/${id}`)
    console.log(id)
  }

  const like = () => {
    const email = localStorage.getItem('email')
    if (!email) {
      alert('로그인이 필요한 서비스입니다.')
      return
    }
    axios.post(`http://localhost:3011/like/${item.id}/${email}`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(res => {
      // console.log(res)
      likeClick()
    })
  }

  return (
    <>
      <CCol xs={2}>
        <CCard className="mb-4">
          <CCardBody>
            <CCarousel transition="crossfade" interval={4000} onClick={() => toItemDetail(item.id)}
                       style={{cursor: 'pointer'}}>
              {
                item.images
                  .sort((a, b) => (a.isMain === 1 ? -1 : 1))
                  .map((img, img_idx) => (
                    <CCarouselItem key={img_idx}>
                      <img className="d-block w-100" src={'http://localhost:3011' + img.path}
                           height={200}/>
                    </CCarouselItem>
                  ))
              }
            </CCarousel>
            <CRow>
              <CCol xs={8}>
                <CCardText style={overflow_ellipsis} onClick={() => toItemDetail(item.id)} style={{cursor: 'pointer'}}>
                  {item.name}
                </CCardText>
              </CCol>
              <CCol style={{textAlign: 'right'}} onClick={like}>
                <strong
                  style={item.isLike ? likeIcon : disLikeIcon}
                  onMouseEnter={() => setIsLikeHovered(true)}
                  onMouseLeave={() => setIsLikeHovered(false)}
                >
                  {/*<CIcon icon={freeSet['cilHeart']}/>*/}
                  <FontAwesomeIcon icon={faHeart} size={isLikeHovered ? 'lg' : 'sm'}/>
                </strong>
              </CCol>
            </CRow>
            {
              item.isDiscounted ?
                <>
                  <CRow>
                    <CCol style={{textDecoration: 'line-through', color: 'gray'}}>
                      {addCommas(item.defaultPrice)}
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol xs={6} style={{color: 'red'}}>
                      {
                        ((1 - (item.salePrice / item.defaultPrice)) * 100).toFixed(1) + '%'
                      }
                    </CCol>
                    <CCol xs={6} style={{textAlign: 'right'}}>
                      {addCommas(item.salePrice)}
                    </CCol>
                  </CRow>
                </>
                :
                <>
                  <CRow>
                    <CCol>
                      {addCommas(item.salePrice)}
                    </CCol>
                  </CRow>
                </>
            }
            <CRow>
              <CCol style={{color: 'gold'}}>
                <FontAwesomeIcon icon={faStar}/>
                <FontAwesomeIcon icon={faStar}/>
                <FontAwesomeIcon icon={faStar}/>
                <FontAwesomeIcon icon={faStarHalf}/>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </>
  );
}

export default ItemList;
