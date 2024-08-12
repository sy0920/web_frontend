import React, { useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const loginUser = (userInfo) => {
    localStorage.setItem('user', JSON.stringify(userInfo));
  };
  const navigate = useNavigate(); // 初始化 useNavigate
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Attempting to login with:', { username, password });
    try {
      const response = await axios.post('http://127.0.0.1:7001/api/user/login', { username, password },
        {
          headers: { 'Content-Type': 'application/json' }
        });
      if (response.status === 200 || response.data.user) {
        console.log(response.data);
        loginUser(response.data);
        navigate('/home');
      } else {
        setError('Username and password cannot be empty');
      }
    } catch (err) {
      setError('error! Please try again.');
    }
  }
  return (
    <div className="box">
      <h2>用户登录</h2>
      <form onSubmit={handleLogin}>
        <div className="input-box">
          <label htmlFor="username">用户名</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <label htmlFor="password">密码</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="btn-box" style={{ color: 'white' }}>
          忘记密码?
          <div>
            <button type="submit">登录</button>
            <button type="button">注册</button>
          </div>
        </div>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;