import React, {useCallback, useEffect, useState} from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol, CForm, CFormCheck,
  CFormInput,
  CFormLabel, CFormSelect,
  CRow
} from "@coreui/react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {number} from "prop-types";
import AdminMemberService from "src/services/AdminMemberService";


function UnregisterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unregisterData, setUnregisterData] = useState(null);

  useEffect(() => {
    const fetchUnregisterData = async () => {
      try {
        if (!id) return;
        const response = await AdminMemberService.getAdminMember(id);

        // 생년월일 YYYYMMDD 형식으로 변환
        const birth = response.data.birth.replace(/-/g, '');
        response.data.birth = birth.substring(0, 8);
        setUnregisterData(response.data);
      } catch (error) {
        console.error('Error', error);
      }
    };

    if (id) {
      fetchUnregisterData();
    }
  }, [id]);

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
    navigate('/admin/member/unregisterList');
  }

  const handleUpdate = async () => {
    try {
      if (!unregisterData) return;

      // unregisterData를 수정한 후에 새로운 객체에 복사
      const updatedUnregisterData = { ...unregisterData };

      // 생년월일을 YYYYMMDD 형식에서 Date 객체로 변환
      const year = updatedUnregisterData.birth.substring(0, 4);
      const month = parseInt(updatedUnregisterData.birth.substring(4, 6)) -1;
      const day = updatedUnregisterData.birth.substring(6, 8);
      const birthDate = new Date(Date.UTC(year, month, day));

      if (!isNaN(birthDate.getTime())) {
        // ISO 형식으로 변환하여 새로운 객체에 반영
        updatedUnregisterData.birth = birthDate.toISOString();
      } else {
        console.error('Invalid birth date:', updatedUnregisterData.birth);
        return;
      }

      // 수정된 unregisterData를 서버로 전송
      const response = await AdminMemberService.updateAdminUnregister(id, updatedUnregisterData);

      if (response.status === 200) {
        navigate('/admin/member/adminList');
      }
      console.log("unregisterData: ", updatedUnregisterData);

    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleChange = (field, value) => {
    setUnregisterData(preUnregisterData => ({
      ...preUnregisterData,
      [field]: value // 변경된 값으로 업데이트
    }))
  }



  if (!unregisterData) {
    return <div>Loading ...</div>;
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>탈퇴 수정</strong>
          </CCardHeader>
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
                  // onInput={email}
                  required
                  defaultValue={unregisterData.email}
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
                  // onInput={pwd}
                  required
                  // value={unregisterData ? unregisterData.pwd : ''}
                  // defaultValue={unregisterData.pwd}
                  onChange={(e) => handleChange('pwd', e.target.value)}
                />
              </CCol>
            </CRow>

            {/*이름*/}
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputName" className="col-sm-2 col-form-label">이름</CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  placeholder="탈퇴 이름"
                  autoComplete="name"
                  name={'name'}
                  type={'name'}
                  // onInput={name}
                  required
                  value={unregisterData ? unregisterData.name : ''}
                  // defaultValue={unregisterData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </CCol>
            </CRow>

            {/*닉네임*/}
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputNickname" className="col-sm-2 col-form-label">닉네임</CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  placeholder="탈퇴 닉네임"
                  autoComplete="nickname"
                  name={'nickname'}
                  type={'nickname'}
                  // onInput={nickname}
                  required
                  value={unregisterData ? unregisterData.nickname : ''}
                  // defaultValue={unregisterData.nickname}
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
                  value={unregisterData ? unregisterData.phone : ''}
                  // defaultValue={unregisterData.phone}
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
                  // onInput={address}
                  required
                  value={unregisterData ? unregisterData.address : ''}
                  // defaultValue={unregisterData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </CCol>
            </CRow>

            {/*성별*/}
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputGender" className="col-sm-2 col-form-label">성별</CFormLabel>
              <CCol sm={10}>
                <CFormCheck inline type="radio" name="gender" id="inlineCheckbox1" value={'X'} label="선택안함" checked={unregisterData ? unregisterData.gender === 'X' : ''} onChange={(e) => handleChange('gender', e.target.value)}/>
                <CFormCheck inline type="radio" name="gender" id="inlineCheckbox2" value={'M'} label="남" checked={unregisterData ? unregisterData.gender === 'M' : ''} onChange={(e) => handleChange('gender', e.target.value)}/>
                <CFormCheck inline type="radio" name="gender" id="inlineCheckbox3" value={'W'} label="여" checked={unregisterData ? unregisterData.gender === 'W' : ''} onChange={(e) => handleChange('gender', e.target.value)}/>
              </CCol>
            </CRow>

            {/*생년월일*/}
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputBirth" className="col-sm-2 col-form-label">생년월일</CFormLabel>
              <CCol sm={10}>
                <CFormInput
                  placeholder="탈퇴 생년월일"
                  autoComplete="birth"
                  name={'birth'}
                  maxLength={8}
                  onChange={number}
                  required
                  value={unregisterData ? unregisterData.birth : ''}
                  // defaultValue={unregisterData.birth}
                  onChange={(e) => handleChange('birth', e.target.value)}
                />
              </CCol>
            </CRow>

            {/*권한*/}
            <CRow className="mb-3">
              <CFormLabel htmlFor="inputRole" className="col-sm-2 col-form-label">권한</CFormLabel>
              <CCol sm={10}>
                <CFormSelect
                  aria-label="Default select example"
                  options={[
                    { label: '회원', value: 'USER' },
                    { label: '관리자', value: 'ADMIN' },
                    { label: '탈퇴', value: 'UNREGISTER' }
                  ]}
                  style={{ width: 'fit-content' }}
                  className="me-2"
                  value={unregisterData ? unregisterData.role : ''} // 상태값과 연결
                  onChange={(e) => handleChange('role', e.target.value)}
                />
              </CCol>
            </CRow>

            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton type="submit" color="primary" className="me-md-2" onClick={handleUpdate}>수정</CButton>
              <CButton color="primary" variant="outline" onClick={handleCancel}>취소</CButton>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  );
}


export default UnregisterDetail;
