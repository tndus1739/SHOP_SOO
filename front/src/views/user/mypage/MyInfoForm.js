import React, {useEffect, useState} from 'react';
import {CButton, CCard, CCardBody, CCol, CFormCheck, CFormInput, CFormLabel, CRow} from "@coreui/react";
import MyPageTabs from "src/views/user/mypage/MyPageTabs";
import {useNavigate, useParams} from "react-router-dom";
import UserMyPageMemberService from "src/services/UserMyPageMemberService";
import MyPwdCheck from "src/views/user/mypage/MyPwdCheck";

const MyInfoForm = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const email = localStorage.getItem('email');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!email) return;
        const response = await UserMyPageMemberService.getMember(email);

        // 생년월일 YYYYMMDD 형식으로 변환
        const birth = response.data.birth.replace(/-/g, '');
        response.data.birth = birth.substring(0, 8);
        setUserData(response.data);

      } catch (error) {
        console.error('Error', error);
      }
    };

    if (email) {
      fetchUserData();
    }
  }, [email])

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

  const handleCancel = () => {
    navigate(`/mypage/MyHome`);
  }

  const handleUpdate = async () => {
    try {
      if (!userData) return;

      // userData를 수정한 후에 새로운 객체에 복사
      const updatedUserData = {...userData};

      // 생년월일을 YYYYMMDD 형식에서 Date 객체로 변환
      const year = updatedUserData.birth.substring(0, 4);
      const month = parseInt(updatedUserData.birth.substring(4, 6)) - 1;
      const day = updatedUserData.birth.substring(6, 8);
      const birthDate = new Date(Date.UTC(year, month, day));

      if (!isNaN(birthDate.getTime())) {
        // ISO 형식으로 변환하여 새로운 객체에 반영
        updatedUserData.birth = birthDate.toISOString();
      } else {
        console.error('Invalid birth date:', updatedUserData.birth);
        return;
      }

      // 수정된 userData를 서버로 전송
      const response = await UserMyPageMemberService.updateUser(email, updatedUserData);

      if (response && response.status === 200) {
        navigate(`/mypage/MyHome`);
      }
      console.log("userData: ", updatedUserData);

    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleChange = (field, value) => {
    setUserData(preUserData => ({
      ...preUserData,
      [field]: value // 변경된 값으로 업데이트
    }))
  }

  if (!userData) {
    return <div>Loading ...</div>;
  }

  return (
    <CCol xs={12}>
        <CCardBody>
            {/*이메일: 수정 불가*/}
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputEmail" className="col-sm-2 col-form-label">이메일</CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  placeholder="이메일"
                  autoComplete="email"
                  readOnly plainText
                  name={'email'}
                  type={'email'}
                  required
                  defaultValue={userData.email}
                />
              </CCol>
            </CRow>

            {/*비밀번호*/}
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputPassword" className="col-sm-2 col-form-label">비밀번호</CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  placeholder="비밀번호"
                  autoComplete="pwd"
                  name={'pwd'}
                  type={'password'}
                  required
                  value={userData ? userData.pwd : ''}
                  onChange={(e) => handleChange('pwd', e.target.value)}
                />
              </CCol>
            </CRow>

            {/*이름: 수정 불가*/}
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputName" className="col-sm-2 col-form-label">이름</CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  placeholder={'회원 이름'}
                  autoComplete="name"
                  readOnly plainText
                  name={'name'}
                  type={'name'}
                  required
                  defaultValue={userData ? userData.name : ''}
                />
              </CCol>
            </CRow>

            {/*닉네임*/}
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputNickname" className="col-sm-2 col-form-label">닉네임</CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  placeholder={'회원 닉네임'}
                  autoComplete="nickname"
                  name={'nickname'}
                  type={'nickname'}
                  required
                  value={userData ? userData.nickname : ''}
                  onChange={(e) => handleChange('nickname', e.target.value)}
                />
              </CCol>
            </CRow>

            {/*전화번호*/}
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputPhone" className="col-sm-2 col-form-label">전화번호</CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  placeholder="전화번호"
                  autoComplete="phone"
                  name={'phone'}
                  type={'phone'}
                  maxLength={13}
                  onInput={phone}
                  required
                  value={userData ? userData.phone : ''}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
              </CCol>
            </CRow>

            {/*주소*/}
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputAddress" className="col-sm-2 col-form-label">주소</CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  placeholder="주소"
                  autoComplete="address"
                  name={'address'}
                  type={'address'}
                  maxLength={13}
                  required
                  value={userData ? userData.address : ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </CCol>
            </CRow>

            {/*성별*/}
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputGender" className="col-sm-2 col-form-label">성별</CFormLabel>
              <CCol sm={10}>
                <CFormCheck inline type="radio" name="gender" id="inlineCheckbox1" value={'X'} label="선택안함"
                            checked={userData ? userData.gender === 'X' : ''}
                            onChange={(e) => handleChange('gender', e.target.value)}/>
                <CFormCheck inline type="radio" name="gender" id="inlineCheckbox2" value={'M'} label="남"
                            checked={userData ? userData.gender === 'M' : ''}
                            onChange={(e) => handleChange('gender', e.target.value)}/>
                <CFormCheck inline type="radio" name="gender" id="inlineCheckbox3" value={'W'} label="여"
                            checked={userData ? userData.gender === 'W' : ''}
                            onChange={(e) => handleChange('gender', e.target.value)}/>
              </CCol>
            </CRow>

            {/*생년월일*/}
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputBirth" className="col-sm-2 col-form-label">생년월일</CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  placeholder={'회원 생년월일'}
                  autoComplete="birth"
                  name={'birth'}
                  maxLength={8}
                  onChange={number}
                  required
                  value={userData ? userData.birth : ''}
                  onChange={(e) => handleChange('birth', e.target.value)}
                />
              </CCol>
            </CRow>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end" style={{marginTop: '80px'}}>
              <CButton type="submit" color="primary" className="me-md-2" onClick={handleUpdate}>수정</CButton>
              <CButton color="primary" variant="outline" onClick={handleCancel}>취소</CButton>
            </div>

        </CCardBody>
    </CCol>
  );
};


export default MyInfoForm;
