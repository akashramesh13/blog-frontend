import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "https://blog-backend-spring.onrender.com";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      clearSession();
    }
    return Promise.reject(error);
  }
);

function clearSession() {
  sessionStorage.clear();
  localStorage.clear();
}

export default axios;
