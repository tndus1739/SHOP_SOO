import React, {useState} from 'react';
import {CCard, CCardBody, CCardText, CCarousel, CCarouselItem, CCol, CRow} from "@coreui/react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faStar, faStarHalf} from "@fortawesome/free-solid-svg-icons";
import {useNavigate, useParams} from "react-router-dom";

function ItemList({item}) {
  const navigator = useNavigate()
  const [isLikeHovered, setIsLikeHovered] = useState(false);

  const likeIcon = {
    color: 'red',
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

  return (
    <>
      <CCol xs={2}>
        <CCard className="mb-4" onClick={() => toItemDetail(item.id)} style={{cursor: 'pointer'}}>
          <CCardBody>
            <CCarousel transition="crossfade" interval={4000}>
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
                <CCardText style={overflow_ellipsis}>
                  {item.name}
                </CCardText>
              </CCol>
              <CCol style={{textAlign: 'right'}}>
                {/*<strong*/}
                {/*    style={basketIcon}*/}
                {/*    onMouseEnter={() => setIsBaskHovered(true)}*/}
                {/*    onMouseLeave={() => setIsBaskHovered(false)}*/}
                {/*>*/}
                {/*    <CIcon icon={freeSet['cilBasket']} size={isBaskHovered ? 'lg' : 'sm'}/>*/}
                {/*</strong>*/}
                <strong
                  style={likeIcon}
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
