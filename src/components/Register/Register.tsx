import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { Link, Redirect, useHistory, useLocation } from "react-router-dom";
import * as FaIcons from "react-icons/fa";

import { register } from "../../redux/actions/authActions";
import "./Register.scss";
import Loading from "../Loading/Loading";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";
import useInputRef from "../../hooks/useInputRef";

type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

interface ValidationState {
  isValid: boolean;
  message: string;
}

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [usernameValidation, setUsernameValidation] = useState<ValidationState>(
    { isValid: false, message: "" },
  );
  const [passwordValidation, setPasswordValidation] = useState<ValidationState>(
    { isValid: false, message: "" },
  );
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

  const { userInfo, loading, error } = useSelector(
    (state: RootState) => state.auth,
  );

  const inputRef = useInputRef();

  const validateUsername = (value: string) => {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,19}$/;
    if (!value) {
      return { isValid: false, message: "Username is required" };
    }
    if (!usernameRegex.test(value)) {
      return {
        isValid: false,
        message:
          "Username must be 3-20 characters, start with a letter, and contain only letters, numbers, underscores, or hyphens",
      };
    }
    return { isValid: true, message: "Username is valid" };
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return { isValid: false, message: "Password is required" };
    }
    if (value.length < 8) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters long",
      };
    }
    if (!/[A-Z]/.test(value)) {
      return {
        isValid: false,
        message: "Password must contain at least one uppercase letter",
      };
    }
    if (!/[a-z]/.test(value)) {
      return {
        isValid: false,
        message: "Password must contain at least one lowercase letter",
      };
    }
    if (!/[0-9]/.test(value)) {
      return {
        isValid: false,
        message: "Password must contain at least one number",
      };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return {
        isValid: false,
        message: "Password must contain at least one special character",
      };
    }
    return { isValid: true, message: "Password is valid" };
  };

  useEffect(() => {
    setUsernameValidation(validateUsername(username));
  }, [username]);

  useEffect(() => {
    setPasswordValidation(validatePassword(password));
  }, [password]);

  const location = useLocation<{ from?: string }>();
  const from = location.state?.from || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameValidation.isValid && passwordValidation.isValid) {
      const isSuccess = await dispatch(register(username, password) as any);
      if (isSuccess) {
        setRegistrationSuccess(true);
        setTimeout(() => {
          history.push({ pathname: "/login", state: { from } });
        }, 2000);
      }
    }
  };

  if (userInfo) {
    return <Redirect to={from} />;
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="auth-brand-badge">
          <span className="badge-sparkle">✦</span>
          <span>Pixel Pursuit</span>
        </div>
        <h1>Create Your Account</h1>
        <p className="auth-subtitle">
          Your space to explore perspectives, read deep-dives, and share ideas that matter.
        </p>

        {registrationSuccess && (
          <p className="success">
            Registration successful! Redirecting to login...
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div
            className={`apple-field ${username ? "has-value" : ""} ${
              username
                ? usernameValidation.isValid
                  ? "is-valid"
                  : "has-error"
                : error
                ? "has-error"
                : ""
            }`}
          >
            <input
              id="register-username"
              type="text"
              value={username}
              ref={inputRef}
              onChange={(e) => setUsername(e.target.value)}
              placeholder=" "
              required
              autoComplete="username"
            />
            <label htmlFor="register-username">Username</label>
          </div>
          {username && (
            <p
              className={`validation-message ${
                usernameValidation.isValid ? "valid" : "invalid"
              }`}
            >
              {usernameValidation.message}
            </p>
          )}

          <div
            className={`apple-field password-field ${password ? "has-value" : ""} ${
              password
                ? passwordValidation.isValid
                  ? "is-valid"
                  : "has-error"
                : error
                ? "has-error"
                : ""
            }`}
          >
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              autoComplete="new-password"
            />
            <label htmlFor="register-password">Password</label>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? FaIcons.FaEyeSlash({}) : FaIcons.FaEye({})}
            </button>
          </div>
          {password && (
            <p
              className={`validation-message ${
                passwordValidation.isValid ? "valid" : "invalid"
              }`}
            >
              {passwordValidation.message}
            </p>
          )}

          {error && (
            <div className="apple-error-callout" role="alert">
              <span className="apple-error-text">{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="register-button"
            disabled={
              loading ||
              registrationSuccess ||
              !usernameValidation.isValid ||
              !passwordValidation.isValid
            }
          >
            {loading ? <Loading inline /> : "Create Account"}
          </button>
        </form>

        <div className="auth-privacy-note">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span>Privacy-first. No tracking, no spam, always yours.</span>
        </div>

        <div className="auth-footer-links">
          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link to="/login" className="apple-link">
              Sign in <span className="arrow">↗</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
