import axios from "axios";

const SHOP_USER_MYPAGE_MEMBER_API_URL = "http://localhost:3011/user"

class UserMyPageMemberService {

  //user 정보 조회
  getMember(id) {
    const token = localStorage.getItem('accessToken');
    return axios.get(SHOP_USER_MYPAGE_MEMBER_API_URL + '/mypage/' + id, {
      headers: {
        Authorization: token
      }
    });
  }

  //user 수정
  updateUser(email, req) {
    const token = localStorage.getItem('accessToken');
    if (!email) {
      console.error('Invalid id:', email);
      return;
    }
    return axios.put(SHOP_USER_MYPAGE_MEMBER_API_URL + '/mypage/update/' + email, req, {
      headers: {
        Authorization: token
      }
    });
  }

  // user 탈퇴
  withdrawUser(email) {
    return axios.patch(SHOP_USER_MYPAGE_MEMBER_API_URL + '/mypage/withdraw/' + email);
  }

  //user 비밀번호 일치 확인
  checkPassword(pwd) {
    const token = localStorage.getItem('accessToken');

    console.log("서비스에서 비밀번호: ", pwd);

    return axios.post(SHOP_USER_MYPAGE_MEMBER_API_URL + '/checkPwd',
    { insertPwd: pwd }, // 데이터를 JSON 형식으로 보냄
    {
      headers: {
        Authorization: token
      }
    }
  );
  }

}

export default new UserMyPageMemberService();
