import axios from "axios";
import store from "../redux/store";
import { LOGOUT } from "../redux/constants/authConstants";

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  process.env.REACT_APP_BACKEND_URL || "https://blog-backend.akashramesh.in";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Only handle session timeout if we have a userInfo in storage
      const userInfo = sessionStorage.getItem("userInfo");
      if (userInfo) {
        clearSession();
        // Dispatch logout action to update Redux state
        store.dispatch({ type: LOGOUT });
        // Redirect to login page
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

function clearSession() {
  sessionStorage.clear();
  localStorage.clear();
}

export default axios;
