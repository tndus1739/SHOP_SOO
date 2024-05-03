import React, { useState } from 'react';
import { CButton, CCol, CForm, CFormGroup, CInput, CLabel, CModal, CModalBody, CModalFooter, CModalHeader } from '@coreui/react';

const MyPwdCheck = ({ isOpen, onClose, onPasswordConfirm }) => {
  const [password, setPassword] = useState('');

  const handleConfirm = () => {
    // 여기서는 임의로 비밀번호가 'password'인지 확인하는 예시를 보여주고 있습니다.
    // 실제로는 서버와 통신하여 비밀번호를 확인해야 합니다.
    if (password === 'password') {
      // 비밀번호가 일치하는 경우 정보 수정 페이지로 이동합니다.
      onPasswordConfirm();
    } else {
      // 비밀번호가 일치하지 않는 경우 팝업을 표시합니다.
      alert('비밀번호가 일치하지 않습니다. 다시 입력해주세요.');
    }
  };

  return (
    <CModal show={isOpen} onClose={onClose}>
      <CModalHeader closeButton>본인 확인</CModalHeader>
      <CModalBody>
        <CForm>
          <CFormGroup row>
            <CCol md="4">
              <CLabel>비밀번호</CLabel>
            </CCol>
            <CCol md="8">
              <CInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </CCol>
          </CFormGroup>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" onClick={handleConfirm}>확인</CButton>{' '}
        <CButton color="secondary" onClick={onClose}>취소</CButton>
      </CModalFooter>
    </CModal>
  );
};

export default MyPwdCheck;
