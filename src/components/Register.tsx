import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "../helpers/axios";
import "./Register.scss";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("/register", { username, password });
      console.log("Registration successful", response.data);
      history.push("/login");
    } catch (err) {
      console.error("Registration failed", err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="register">
      <h1>Register</h1>
      {error && <p className="register__error">{error}</p>}
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
