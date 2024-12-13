import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { API_BASE_URL } from '../config';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #1a1a1a;
  color: #fff;
`;

const LoginForm = styled.form`
  background: #2a2a2a;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background: #3a3a3a;
  border: 1px solid #4a4a4a;
  color: #fff;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.5rem;
  background: #4facfe;
  border: none;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #00f2fe;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #f44336;
  margin-bottom: 1rem;
`;

const Login: React.FC = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    console.log('Attempting login with password:', password);

    try {
      console.log('Sending request to:', `${API_BASE_URL}/api/auth`);
      const response = await fetch(`${API_BASE_URL}/api/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setError('密码错误');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('登录失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleSubmit}>
        <h2>管理员登录</h2>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Input
          type="password"
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? '登录中...' : '登录'}
        </Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login; 