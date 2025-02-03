import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/reducers";
import { Redirect, useHistory } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Register.scss";
import axios from "axios";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const history = useHistory();
  const [error, setError] = useState("");

  const { userInfo, loading } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/register", { username, password });
      console.log("Registration successful", response.data);
      history.push("/login");
    } catch (err) {
      console.error("Registration failed", err);
      setError("Registration failed. Please try again.");
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
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? "Logging in..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
