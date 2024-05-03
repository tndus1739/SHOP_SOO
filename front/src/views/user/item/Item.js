import React, {useEffect, useRef, useState} from 'react';
import {
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CButton, CButtonGroup,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCarousel,
  CCarouselItem,
  CCol, CFormInput,
  CFormSelect, CInputGroup, CInputGroupText,
  CRow, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow
} from "@coreui/react";
import axios from "axios";
import {json, useNavigate, useParams} from "react-router-dom";
import ItemOption from "src/views/user/item/ItemOption";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {cilBasket, cilHeart} from "@coreui/icons";
import CIcon from "@coreui/icons-react";

function Item() {
  const [group, setGroup] = useState({images: [], category: {name: ''}, items: []})
  const {itemGroupId} = useParams()
  const [itemCategory, setItemCategory] = useState([])
  const [itemOption, setItemOption] = useState([])
  const sizeRef = useRef(null)
  const [selectedItem, setSelectedItem] = useState([])
  const [total, setTotal] = useState(0)
  const [sizeInfo, setSizeInfo] = useState([[]])
  const [colors, setColors] = useState([])
  const [isLike, setIsLike] = useState('outline')
  const navigator = useNavigate()

  const addCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  const getItem = () => {
    axios.get(`http://localhost:3011/item/test/${itemGroupId}`).then((res) => {
      console.log(res.data)
      setSizeInfo(JSON.parse(res.data.sizeTable))
      setGroup(res.data)
      let colorsInfo = []
      for (const c of res.data.items) {
        colorsInfo.push(c.colors)
      }
      const arr = colorsInfo.filter((item, index, self) =>
          index === self.findIndex(obj => (
            obj.id === item.id && obj.name === item.name // 중복 여부를 판별할 조건
          ))
      )
      setColors(arr)
    })
  }

  const selectColor = (e) => {
    const sel = sizeRef.current
    sel.options[0].selected = true
    if (e.target.value != '0') {
      const items = group.items
      const sizes = []
      if (e.target.value) {
        for (const item of items) {
          if (item.colors.id == e.target.value) {
            sizes.push(item)
          }
        }
        setItemOption(sizes)
      } else {
        setItemOption([])
      }
      sel.removeAttribute('disabled')
    } else {
      sel.setAttribute('disabled', true)
    }
  }

  const selectItem = (e) => {
    const id = e.target.value
    const selItems = []
    if (id != '0') {
      for (const si of selectedItem) {
        if (si.id == id) {
          return
        } else {
          selItems.push(si)
        }
      }
      for (const it of group.items) {
        if (id == it.id) {
          it['count'] = 1
          selItems.push(it)
          calculate_total(id, 1)
        }
      }
    }
    e.target.value = 0
    setSelectedItem(selItems)
  }

  const deleteItem = async (id) => {
    let idx = 0
    let arr = []
    for (const item of selectedItem) {
      if (selectedItem[idx].id != id) {
        arr.push(selectedItem[idx])
      }
      idx++
    }
    setSelectedItem(arr)
    if (!arr.length) {
      sizeRef.current.options[0].selected = true
    }
    await calculate_total(null, null, arr)
  }

  const calculate_total = (id, count, arr) => {
    let totalPrice = 0
    if(id == null && count == null) {
      for (const item of arr) {
        totalPrice += (item.salePrice + item.optionPrice) * item.count
      }
    } else {
      for (const item of selectedItem) {
        if (id && count && item.id == id) {
          item.count = count
        }
        totalPrice += (item.salePrice + item.optionPrice) * item.count
      }
    }
    setTotal(totalPrice)
  }

  const buyNow = () => {
    if(!selectedItem.length) {
      alert('상품 옵션을 선택해주세요')
      return
    } else {
      console.log(selectedItem)
      axios.post('http://localhost:3011/item/order/test', selectedItem).then((res) => {
        console.log(res)
        const orderId = 1
        navigator(`/order/${1}`)
      })
    }
  }

  const addView = () => {
    return
    axios.put(`http://localhost:3011/item/views/${itemGroupId}`).then((res) => {
      console.log(res)
    })
  }

  const like = () => {
    const itemGroupId = group.id
    axios.post(`http://localhost:3011/test/likes/${itemGroupId}`).then((res) => {
      console.log(res)
    })
  }

  const basket = () => {
    const items = []
    for(const sel of selectedItem) {
      const item = {}
      item['email'] = localStorage.getItem('email')
      item['count'] = sel.count
      item['itemId'] = sel.id
      items.push(item)
    }
    console.log(items)
    axios.post('http://localhost:3011/cart', items).then((res) => {
      console.log(res)
    })
  }

  useEffect(() => {
    getItem()
    addView()
  }, []);

  return (
    <>
      <CRow>
        <CCol>
          <CCard>
            <CCardBody>
              <CCarousel transition="crossfade" interval={4000} controls>
                {
                  group.images.map((img, img_idx) => (
                    <CCarouselItem key={img_idx}>
                      <img className="d-block w-100" src={'http://localhost:3011' + img.path}
                           alt={img.isMain ? "slide 1" : "slide " + img_idx + 1}
                           height={700}/>
                    </CCarouselItem>
                  ))
                }
              </CCarousel>
            </CCardBody>
          </CCard>
          <CRow>
            <CCol>
              <CCard>
                <CCardHeader>
                  <strong>Size Info</strong>&nbsp;&nbsp;
                  <small>
                    <p className="text-body-secondary small" style={{display: "inline-block", marginBottom: 0}}>
                      사이즈 정보
                    </p>
                  </small>
                </CCardHeader>
                <CCardBody>
                  <CTable hover style={{textAlign: 'center'}}>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                        {
                          sizeInfo.map((it, index) => (
                            index === 0 && (
                              it.map((si, idx) => (
                                <CTableHeaderCell scope="col" key={idx}>{si.value}</CTableHeaderCell>
                              ))
                            )
                          ))
                        }
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {
                        sizeInfo.map((it, index) => (
                          <CTableRow key={index}>
                            {
                              index !== 0 && (
                                it.map((si, idx) => (
                                  <CTableDataCell key={idx}>{si.value}</CTableDataCell>
                                )))
                            }
                          </CTableRow>
                        ))
                      }
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CCol>
        <CCol>
          <CCard>
            <CCardHeader>
              <strong>Product Info</strong>&nbsp;&nbsp;
              <small><p className="text-body-secondary small" style={{display: "inline-block", marginBottom: 0}}>제품
                정보</p></small>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol xs={6}>
                  <strong><p>상품명</p></strong>
                </CCol>
                <CCol xs={6}>
                  <p>{group.name}</p>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={6}>
                  <strong><p>조회수</p></strong>
                </CCol>
                <CCol xs={6}>
                  <p>{group.views}</p>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={6}>
                  <strong><p>누적판매</p></strong>
                </CCol>
                <CCol xs={6}>
                  <p>{group.views}</p>
                </CCol>
              </CRow>
              <CRow>
                <CCol xs={6}>
                  <strong>좋아요</strong>
                </CCol>
                <CCol xs={6}>
                  {group.views}
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
          <p/>
          <CCard>
            <CCardHeader>
              <strong>Price Info</strong>&nbsp;&nbsp;
              <small>
                <p className="text-body-secondary small" style={{display: "inline-block", marginBottom: 0}}>
                  가격 정보
                </p>
              </small>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  판매가 :
                </CCol>
                {
                  group.isDiscounted ?
                    <>
                      <CCol>
                        <small style={{textDecoration: 'line-through', color: 'gray'}}>
                          {addCommas(group.defaultPrice)}
                        </small>
                        &nbsp;&nbsp;
                        <strong>
                          {addCommas(group.salePrice)}
                        </strong>
                        &nbsp;
                        <small>
                          <strong style={{color: 'red'}}>
                            {
                              `(${((1 - (group.salePrice / group.defaultPrice)) * 100).toFixed(1)}%)`
                            }
                          </strong>
                        </small>
                      </CCol>
                    </>
                    :
                    <>
                      <CCol>
                        <strong>
                          {addCommas(Number(group.defaultPrice))}
                        </strong>
                      </CCol>
                    </>
                }
              </CRow>
            </CCardBody>
          </CCard>
          <p/>
          <CCard>
            <CCardHeader>
              <strong>Product Option</strong>&nbsp;&nbsp;
              <small>
                <p className="text-body-secondary small" style={{display: "inline-block", marginBottom: 0}}>
                  상품 옵션
                </p>
              </small>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <CFormSelect size="sm" onChange={selectColor}>
                    <option value={0}>색상</option>
                    {
                      colors.map((it, index) => (
                        <option value={it.id} key={index}>
                          {it.name}
                        </option>
                      ))
                    }
                  </CFormSelect>
                </CCol>
              </CRow>
              <p/>
              <CRow>
                <CCol>
                  <CFormSelect size="sm" ref={sizeRef} onChange={selectItem} disabled>
                    <option value={'0'}>사이즈</option>
                    {
                      itemOption.map((io, index) => (
                        io.status == '판매' ?
                        <option value={io.id} key={index}>
                          {io.itemSize}&nbsp;{`(+${addCommas(io.optionPrice)})`}
                        </option>
                          :
                          <option value={io.id} key={index} disabled>
                            {io.itemSize}&nbsp;{`(+${addCommas(io.optionPrice)}) ${io.status}`}
                          </option>
                      ))
                    }
                  </CFormSelect>
                </CCol>
              </CRow>
              <p/>
              <CRow>
                <CCol>
                  <CTable hover style={{textAlign: 'center'}}>
                    {
                      selectedItem.length ?
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                            <CTableHeaderCell scope="col">색상</CTableHeaderCell>
                            <CTableHeaderCell scope="col">사이즈</CTableHeaderCell>
                            <CTableHeaderCell scope="col">옵션가</CTableHeaderCell>
                            <CTableHeaderCell scope="col">수량</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        :
                        <></>
                    }
                    <CTableBody>
                      {
                        selectedItem.map((it, index) => (
                          <ItemOption it={it} index={index} key={index} deleteItem={deleteItem}
                                      total={calculate_total}/>
                        ))
                      }
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
              {
                selectedItem.length ?
                  <CRow>
                    <CCol style={{textAlign: 'left', fontSize: '25px'}}>
                      <strong>총 금액 :</strong>
                    </CCol>
                    <CCol style={{textAlign: 'right', fontSize: '25px'}}>
                      <strong>
                        {addCommas(Number(total))}
                      </strong>
                    </CCol>
                  </CRow>
                  :
                  <></>
              }
            </CCardBody>
          </CCard>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol xs={8}>
                  <CButton color={'primary'} style={{width: '100%'}} onClick={buyNow}>바로 구매</CButton>
                </CCol>
                <CCol xs={2} style={{textAlign: 'right'}}>
                  <CButton color={'danger'} variant={'outline'} onClick={like}>
                    <CIcon icon={cilHeart}/>
                  </CButton>
                </CCol>
                <CCol xs={2} style={{textAlign: 'left'}}>
                  <CButton color={'info'} variant={isLike} onClick={basket}>
                    <CIcon icon={cilBasket} />
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <p/>
      <CRow>
        <CCol>
          <CAccordion alwaysOpen>
            <CAccordionItem itemKey={1}>
              <CAccordionHeader>상품 상세 설명</CAccordionHeader>
              <CAccordionBody>
                <div dangerouslySetInnerHTML={{__html: group.content}} style={{textAlign: 'center'}}/>
              </CAccordionBody>
            </CAccordionItem>
            <p/>
            <CAccordionItem itemKey={2}>
              <CAccordionHeader>리뷰 및 평점</CAccordionHeader>
              <CAccordionBody>
                <strong>This is the second item&#39;s accordion body.</strong> It is hidden by
                default, until the collapse plugin adds the appropriate classes that we use to
                style each element. These classes control the overall appearance, as well as the
                showing and hiding via CSS transitions. You can modify any of this with custom
                CSS or overriding our default variables. It&#39;s also worth noting that just
                about any HTML can go within the <code>.accordion-body</code>, though the
                transition does limit overflow.
              </CAccordionBody>
            </CAccordionItem>
          </CAccordion>
        </CCol>
      </CRow>
    </>
  );
}

export default Item;
