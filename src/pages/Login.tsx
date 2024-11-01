import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../actions/userActions";
import { AppDispatch } from "../store";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Login: React.FC = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const userInfo = useSelector((state: any) => state.user.userInfo);

  useEffect(() => {
    if (userInfo?.isAuthenticated) {
      history.push("/home");
    }
  }, [userInfo, history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser(username, password));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
