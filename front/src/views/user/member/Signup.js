import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm, CFormCheck,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilLockLocked, cilUser} from '@coreui/icons'
import axios from "axios";
import {useNavigate} from "react-router-dom";

const Signup = () => {
  const navigator = useNavigate()
  const number = (e) => {
    const val = e.target.value
    e.target.value = val.replace(/\D/gi, '')
  }

  const phone = (e) => {
    const val = e.target.value
    e.target.value = val.replace(/\D/gi, '')
    if (e.target.value.length >= 9) {
      let numbers = val.replace(/[^0-9]/g, "")
        .replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, `$1-$2-$3`);
      e.target.value = numbers
    }
  }

  const postMember = (e) => {
    e.preventDefault()
    const frm = new FormData(e.target)
    const data = {}
    for (const k of frm.keys()) {
      data[k] = frm.get(k)
    }
    data.phone = data.phone.replace(/\D/g, '')

    if (data.pwd != data.checkPwd) {
      alert('비밀번호를 확인해주세요')
      document.querySelector('input[name="pwd"]').focus()
      return

    }

    if (data.phone.length < 9) {
      alert("전화번호를 확인해주세요")
      return
    }

    if (data.birth.length != 8) {
      alert('생년월일을 확인해주세요')
      return
    } else {
      const year = data.birth.slice(0, 4)
      const month = data.birth.slice(4, 6)
      const day = data.birth.slice(6, 8)

      if (Number(year) > Number(new Date().getFullYear()) || Number(year) < 1900 || Number(month) == 0 || Number(month) > 12 || Number(day) == 0 || Number(day) > 31) {
        alert('생년월일을 확인해주세요')
        return
      }

      const birth = new Date(year, month - 1, day)
      data['birthString'] = data['birth']
      // data['birth'] = birth
      delete data.birth

    }
    console.log(data)
    // return

    axios.post('http://localhost:3011/user/join', data).then((res) => {
      console.log(res)
      alert('회원가입이 완료되었습니다.')
      navigator('/login')
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <CRow className="justify-content-center">
      <CCol md={9} lg={7} xl={6}>
        <CCard className="mx-4">
          <CCardBody className="p-4">
            <CForm onSubmit={postMember}>
              <h1>Register</h1>
              <p className="text-body-secondary">Create your account</p>
              <CInputGroup className="mb-3">
                <CInputGroupText>@</CInputGroupText>
                <CFormInput
                  placeholder="Email"
                  autoComplete="email"
                  type={'email'}
                  name={'email'}
                  required
                  // defaultValue={'test@test.com'}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilLockLocked}/>
                </CInputGroupText>
                <CFormInput
                  type="password"
                  placeholder="Password"
                  autoComplete="new-password"
                  name={'pwd'}
                  required
                  // defaultValue={'pwd'}
                />
              </CInputGroup>
              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilLockLocked}/>
                </CInputGroupText>
                <CFormInput
                  type="password"
                  placeholder="Repeat password"
                  autoComplete="new-password"
                  name={'checkPwd'}
                  required
                  // defaultValue={'pwd'}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilUser}/>
                </CInputGroupText>
                <CFormInput
                  placeholder="이름"
                  autoComplete="name"
                  name={'name'}
                  required
                  // defaultValue={'방민혁'}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilUser}/>
                </CInputGroupText>
                <CFormInput
                  placeholder="닉네임"
                  autoComplete="nickname"
                  name={'nickname'}
                  required
                  // defaultValue={'nickname'}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilUser}/>
                </CInputGroupText>
                <CFormInput
                  placeholder="전화번호"
                  autoComplete="phone"
                  name={'phone'}
                  type={'phone'}
                  maxLength={13}
                  onInput={phone}
                  required
                  // defaultValue={'010-2065-5900'}
                />
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CRow>
                  <CCol xs={6}>
                    <CFormCheck
                      type="radio"
                      name="gender"
                      label="선택안함"
                      defaultChecked
                      value={'X'}
                    /></CCol>
                  <CCol xs={3}>
                    <CFormCheck
                      type="radio"
                      name="gender"
                      label="남"
                      value={'M'}
                    /></CCol>
                  <CCol xs={3}>
                    <CFormCheck
                      type="radio"
                      name="gender"
                      label="여"
                      value={'W'}
                    /></CCol>
                </CRow>
              </CInputGroup>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilUser}/>
                </CInputGroupText>
                <CFormInput
                  placeholder="생년월일 8자리"
                  autoComplete="birth"
                  name={'birth'}
                  maxLength={8}
                  onChange={number}
                  required
                  // defaultValue={'19951023'}
                />
              </CInputGroup>
              <div className="d-grid">
                <CButton color="success" type={'submit'}>Create Account</CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Signup
