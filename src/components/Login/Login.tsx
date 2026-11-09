import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Redirect, useLocation } from "react-router-dom";
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
    (state: RootState) => state.auth,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login(username, password));
  };

  const location = useLocation<{ from?: string }>();
  const from = location.state?.from || "/";

  if (userInfo) {
    return <Redirect to={from} />;
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Sign in to Pixel Pursuit</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              ref={inputRef}
              onChange={(e) => setUsername(e.target.value)}
              className={error ? "input-error" : ""}
              required
            />
          </div>
          <div className="input-group password-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={error ? "input-error" : ""}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? FaIcons.FaEyeSlash({}) : FaIcons.FaEye({})}
            </span>
          </div>

          {error && (
            <div className="apple-error-callout" role="alert">
              <span className="apple-error-text">{error}</span>
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? <Loading inline /> : "Continue"}
          </button>
        </form>

        <div className="auth-footer-links">
          <p className="auth-footer-text">
            Don't have an account?{" "}
            <Link to="/register" className="apple-link">
              Create yours now <span className="arrow">↗</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
