import React, {useEffect} from 'react';

function TokenLogout() {
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const accessTokenExp = localStorage.getItem('accessTokenExp');

    if (accessToken && accessTokenExp) {
      const tokenExp = new Date(Number(accessTokenExp));
      const currentTime = new Date();

      if (currentTime > tokenExp) {
        // 토큰 만료 시 로그아웃 처리
        localStorage.removeItem('accessToken');
        localStorage.removeItem('accessTokenExp');
        localStorage.removeItem('email');
        
      }
    }
  }, []);

  return (
    <div></div>
  );
}

export default TokenLogout;
