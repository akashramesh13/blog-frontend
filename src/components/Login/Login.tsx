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
          <div className={`apple-field ${username ? "has-value" : ""} ${error ? "has-error" : ""}`}>
            <input
              id="login-username"
              type="text"
              value={username}
              ref={inputRef}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              required
              autoComplete="username"
            />
            <label htmlFor="login-username">Username</label>
          </div>

          <div className={`apple-field password-field ${password ? "has-value" : ""} ${error ? "has-error" : ""}`}>
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              autoComplete="current-password"
            />
            <label htmlFor="login-password">Password</label>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? FaIcons.FaEyeSlash({}) : FaIcons.FaEye({})}
            </button>
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
