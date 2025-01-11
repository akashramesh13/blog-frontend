import axios from "axios";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:8090";

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
  sessionStorage.clear(); // If using sessionStorage for the session

  window.location.href = "/login";
}

export default axios;
