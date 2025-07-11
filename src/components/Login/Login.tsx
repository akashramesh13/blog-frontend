import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import "./Login.scss";
import { RootState } from "../../redux/reducers";
import { login } from "../../redux/actions/authActions";
import Loading from "../Loading/Loading";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import useInputRef from "../../hooks/useInputRef";
type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;
const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const inputRef = useInputRef();

  const { userInfo, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login(username, password));
  };

  if (userInfo) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login-container">
      {loading ? (
        <Loading />
      ) : (
        <div className="login-card">
          <h1>Login</h1>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                ref={inputRef}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? FaIcons.FaEyeSlash({}) : FaIcons.FaEye({})}{" "}
              </span>
            </div>
            <button type="submit" className="login-button" disabled={loading}>
              {"Login"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Login;
