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
      clearSession();
      store.dispatch({ type: LOGOUT });
      
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

function clearSession() {
  sessionStorage.clear();
  localStorage.clear();
}

export default axios;
