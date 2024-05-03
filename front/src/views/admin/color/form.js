import React, {useEffect, useRef, useState} from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol, CForm,
  CFormInput,
  CFormLabel, CInputGroup,
  CInputGroupText,
  CRow
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilBell} from '@coreui/icons'
import {DocsExample} from 'src/components'
import axios from "axios";

const Buttons = () => {
  const [r, setR] = useState(255);
  const [g, setG] = useState(255);
  const [b, setB] = useState(255);

  const [HEX, setHEX] = useState('');
  // const [RGB, setRGB] = useState([255, 255, 255]);
  const res = (e) => {
    const rgb = getRGB(e.target.value);
    setR(rgb[0])
    setG(rgb[1])
    setB(rgb[2])
    setHEX(e.target.value)
  }

  const getHEX = (r, g, b) => {
    const rgb = [r, g, b]

    rgb.forEach(function (str, x, arr) {
      str = String(str)
      if (str.indexOf("%") > -1) str = Math.round(parseFloat(str) * 2.55);
      str = parseInt(str, 10).toString(16);
      if (str.length === 1) str = "0" + str;

      arr[x] = str;
    });

    return "#" + rgb.join("");
  }

  const getRGB = (HEX) => {
    // # 제거
    HEX = HEX.replace(/^#/, '');
    // 16진수를 10진수로 변환하여 R, G, B 값 추출
    const bigint = parseInt(HEX, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
  }


  const inputR = (e) => {
    let val = e.target.value
    val = val.replace(/[^0-9]/g, '');
    if (!val) {
      val = 0
    } else if (val > 255) {
      val = 255
    }
    setR(val)
  }
  const inputG = (e) => {
    let val = e.target.value
    val = val.replace(/[^0-9]/g, '');
    if (!val) {
      val = 0
    } else if (val > 255) {
      val = 255
    }
    setG(val)
  }
  const inputB = (e) => {
    let val = e.target.value
    val = val.replace(/[^0-9]/g, '');
    if (!val) {
      val = 0
    } else if (val > 255) {
      val = 255
    }
    setB(val)
  }

  const post = (e) => {
    e.preventDefault();
    const rgb = [r, g, b].join(',')
    const data = {
      rgb: rgb,
      hex: HEX,
      name: new FormData(e.target).get('name')
    }
    axios.post('http://localhost:3011/admin/colors', data).then((res) => {
      console.log(res)
      alert('등록되었습니다.')
    }).catch(err => {
      alert('이미 등록된 색상입니다.')
      location.reload()
    })
  }

  useEffect(() => {
    setHEX(getHEX(r, g, b))
  }, []);

  useEffect(() => {
    setHEX(getHEX(r, g, b))
  }, [r, g, b])

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>React Button</strong> <small>Pill</small>
            </CCardHeader>
            <CCardBody>
              {[
                'primary',
                'secondary',
                'success',
                'danger',
                'warning',
                'info',
                'light',
                'dark',
              ].map((color, index) => (
                <CButton color={color} shape="rounded-pill" key={index}>
                  &nbsp;
                </CButton>
              ))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              색상 등록
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={(e) => post(e)}>
                <CInputGroup className="mb-3">
                  <CInputGroupText id="basic-addon1">색상명</CInputGroupText>
                  <CFormInput
                    aria-label="item-name"
                    name={'name'}
                  />
                </CInputGroup>
                <CFormInput type={'color'} value={HEX} onChange={(e) => res(e)}/>
                <br/>
                <CRow>
                  <CCol xs={4}>
                    <CRow>
                      <p className="text-body-secondary small">
                        rgb
                      </p>
                      <CCol xs={4}>
                        <CInputGroup className="mb-3">
                          <CInputGroupText id="basic-addon1">R</CInputGroupText>
                          <CFormInput
                            aria-label="item-name"
                            value={r}
                            onChange={(e) => inputR(e)}
                          />
                        </CInputGroup>
                      </CCol>
                      <CCol>
                        <CInputGroup className="mb-3">
                          <CInputGroupText id="basic-addon1">G</CInputGroupText>
                          <CFormInput
                            aria-label="item-name"
                            value={g}
                            onChange={(e) => inputG(e)}
                          />
                        </CInputGroup>
                      </CCol>
                      <CCol>
                        <CInputGroup className="mb-3">
                          <CInputGroupText id="basic-addon1">B</CInputGroupText>
                          <CFormInput
                            aria-label="item-name"
                            value={b}
                            onChange={(e) => inputB(e)}
                          />
                        </CInputGroup>
                      </CCol>
                    </CRow>
                  </CCol>
                </CRow>
                <CButton color={'primary'} type={'submit'} >등록</CButton>
              </CForm>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Buttons
