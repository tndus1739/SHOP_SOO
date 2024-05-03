import axios from "axios";

const SHOP_USER_MYPAGE_MEMBER_API_URL = "http://localhost:3011/user"

class UserMyPageMemberService {

  getMember(id) {
    const token = localStorage.getItem('accessToken');
    return axios.get(SHOP_USER_MYPAGE_MEMBER_API_URL + '/mypage/' + id, {
      headers: {
        Authorization: token
      }
    });
  }

  updateUser(id, req) {
    const token = localStorage.getItem('accessToken');
    if (!id) {
      console.error('Invalid id:', id);
      return;
    }

    return axios.put(SHOP_USER_MYPAGE_MEMBER_API_URL + '/mypage/update/' + id, req, {
      headers: {
        Authorization: token
      }
    });
  }

}

export default new UserMyPageMemberService();
