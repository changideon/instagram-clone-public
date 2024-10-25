import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
      const response = await axios.post(url, { email, password });
      console.log('Response:', response.data);
      // Handle successful response, e.g., redirect or store token
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>{isLogin ? 'Login' : 'Register'}</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Email:
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </form>
        <button onClick={handleToggle}>
          {isLogin ? 'Switch to Register' : 'Switch to Login'}
        </button>
      </header>
    </div>
  );
}

export default App;
