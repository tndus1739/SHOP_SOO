import {useContext, useEffect} from 'react';
import {AuthContext} from "src/context/AuthProvider";
import {useNavigate} from "react-router-dom";
import axios from "axios";

function Logout() {
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        // 로그아웃 요청
        await axios.post('http://localhost:3011/user/logout', null, {
          withCredentials: true // 쿠키를 서버에게 전달할 것임을 설정
        });

        // 로컬 스토리지에서 데이터 제거
        localStorage.removeItem("email");
        localStorage.removeItem("accessToken");

        // 사용자 상태 업데이트
        setAuth(null);

        // 홈 페이지로 이동
        navigate("/");
      } catch (error) {
        console.error('로그아웃 요청 중 오류 발생:', error);
        alert('로그아웃에 실패했습니다. 다시 시도해주세요.');
      }
    };

    // 컴포넌트가 처음 렌더링될 때만 로그아웃 함수 실행
    logout();
  }, []); // 빈 배열 전달하여 처음 렌더링될 때만 실행되도록 함

  return null; // 렌더링할 내용이 없으므로 null 반환
}

export default Logout;
