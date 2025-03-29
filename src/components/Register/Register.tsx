import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import { Redirect, useHistory } from "react-router-dom";
import * as FaIcons from "react-icons/fa";

import { register } from "../../redux/actions/authActions";
import "./Register.scss";
import Loading from "../Loading/Loading";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

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
    { isValid: false, message: "" }
  );
  const [passwordValidation, setPasswordValidation] = useState<ValidationState>(
    { isValid: false, message: "" }
  );
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

  const { userInfo, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameValidation.isValid && passwordValidation.isValid) {
      await dispatch(register(username, password, history));
      setRegistrationSuccess(true);
      setTimeout(() => {
        history.push("/login");
      }, 2000);
    }
  };

  if (userInfo) {
    return <Redirect to="/" />;
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Register</h1>
        {error && <p className="error">{error}</p>}
        {registrationSuccess && (
          <p className="success">
            Registration successful! Redirecting to login...
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={
                username && (usernameValidation.isValid ? "valid" : "invalid")
              }
              required
            />
            {username && (
              <p
                className={`validation-message ${usernameValidation.isValid ? "valid" : "invalid"}`}
              >
                {usernameValidation.message}
              </p>
            )}
          </div>
          <div className="input-group">
            <div className="password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={
                  password && (passwordValidation.isValid ? "valid" : "invalid")
                }
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? FaIcons.FaEyeSlash({}) : FaIcons.FaEye({})}
              </span>
            </div>
            {password && (
              <p
                className={`validation-message ${passwordValidation.isValid ? "valid" : "invalid"}`}
              >
                {passwordValidation.message}
              </p>
            )}
          </div>

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
            {loading ? <Loading /> : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
