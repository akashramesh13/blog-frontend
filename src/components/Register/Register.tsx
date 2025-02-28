import React, { useState } from "react";
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

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const history = useHistory();

  const { userInfo, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(register(username, password, history));
  };

  if (userInfo) {
    return <Redirect to="/" />;
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Register</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
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
              {showPassword ? FaIcons.FaEyeSlash({}) : FaIcons.FaEye({})}
            </span>
          </div>
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? <Loading /> : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
