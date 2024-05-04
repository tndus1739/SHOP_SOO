import React, {useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {cilLockLocked, cilUser} from '@coreui/icons'
import axios from "axios";

const Signin = () => {
  const navigator = useNavigate()

  const login = (e) => {
    e.preventDefault()
    const frm = new FormData(e.target)
    const data = {}
    for (const k of frm.keys()) {
      data[k] = frm.get(k)
    }
    console.log(data)

    axios.post('http://localhost:3011/user/login', data).then((res) => {
      console.log(res)

      const {email, accessToken, refreshToken} = res.data;

      if (email && accessToken && refreshToken) {
        localStorage.setItem('accessToken', accessToken)
        // Refresh Token은 쿠키에 저장
        document.cookie = `refreshToken=${refreshToken}; Secure; HttpOnly; SameSite=Strict`
        localStorage.setItem('email', email)

        location.reload(true)
        //navigator('/')

      }

    }).catch((err) => {
      console.log(err)
      alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요')
      return
    })
  }

  useEffect(() => {
    //  로그인 후 메인 페이지로 이동
    if (localStorage.getItem('accessToken') && localStorage.getItem('email')) {
      navigator('/');
    }
  }, [navigator]);

  return (
    <CRow className="justify-content-center">
      <CCol md={8}>
        <CCardGroup>
          <CCard className="p-4">
            <CCardBody>
              <CForm onSubmit={login}>
                <h1>Login</h1>
                <p className="text-body-secondary">Sign In to your account</p>
                <CInputGroup className="mb-3">
                  <CInputGroupText>
                    <CIcon icon={cilUser}/>
                  </CInputGroupText>
                  <CFormInput
                    type={'email'}
                    placeholder="Email"
                    autoComplete="email"
                    name={'email'}/>
                </CInputGroup>
                <CInputGroup className="mb-4">
                  <CInputGroupText>
                    <CIcon icon={cilLockLocked}/>
                  </CInputGroupText>
                  <CFormInput
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    name={'pwd'}
                  />
                </CInputGroup>
                <CRow>
                  <CCol xs={6}>
                    <CButton color="primary" className="px-4" type={'submit'}>
                      Login
                    </CButton>
                  </CCol>
                  <CCol xs={6} className="text-right">
                    <CButton color="link" className="px-0">
                      Forgot password?
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
          <CCard className="text-white bg-primary py-5" style={{width: '44%'}}>
            <CCardBody className="text-center">
              <div>
                <h2>Sign up</h2>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                  tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Link to="/register">
                  <CButton color="primary" className="mt-3" active tabIndex={-1}>
                    Register Now!
                  </CButton>
                </Link>
              </div>
            </CCardBody>
          </CCard>
        </CCardGroup>
      </CCol>
    </CRow>
  )
}

export default Signin
