import {useContext, useEffect} from 'react';
import {AuthContext} from "src/context/AuthProvider";
import {useNavigate} from "react-router-dom";

function Logout() {

  const {auth, setAuth} = useContext(AuthContext);

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("accessToken");

    alert(auth + " 계정이 로그아웃 되었습니다.");
    setAuth(null);
    navigate("/");
  };

  useEffect(() => {
    logout();
  }, []);

}

export default Logout;
