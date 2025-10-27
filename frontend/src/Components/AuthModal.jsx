import React, { useContext, useState } from 'react';
import { Modal, Button, Notification } from '@mantine/core';
import AuthContext from '../Contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function AuthModal({ opened, onClose }) {
  const { loginUser } = useContext(AuthContext);
  const nav = useNavigate();
  const [isLogin, setIsLogin] = useState(true); // toggle between login & register
  const [error, setError] = useState('');

  // --- Login handler ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(e); // assume loginUser throws on failure
      nav('/');
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
      setTimeout(() => setError(''), 3000); // auto-hide
    }
  };

  // --- Register handler ---
  const handleRegister = async (e) => {
    e.preventDefault();
    const url = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(`${url}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          password: e.target.password.value,
          password_confirmation: e.target.password_confirmation.value,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registration failed');

      // login after registration
      await loginUser({
        preventDefault: () => {},
        target: {
          email: { value: e.target.email.value },
          password: { value: e.target.password.value },
        },
      });

      nav('/');
      onClose();
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 4000);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} centered size="md">
      <div className="p-6 relative">
        {error && (
          <Notification
            color="red"
            onClose={() => setError('')}
            title={isLogin ? 'Login Error' : 'Registration Error'}
            className="mb-4"
          >
            {error}
          </Notification>
        )}

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? 'Login' : 'Register'}
        </h2>

        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          className="flex flex-col space-y-4"
        >
          {!isLogin && (
            <label className="flex flex-col text-gray-700 font-medium">
              Name
              <input
                type="text"
                name="name"
                className="mt-1 px-3 py-2 border-2 border-gray-300 rounded-md outline-none focus:border-green-500 text-gray-700"
                required
              />
            </label>
          )}

          <label className="flex flex-col text-gray-700 font-medium">
            Email
            <input
              type="email"
              name="email"
              className="mt-1 px-3 py-2 border-2 border-gray-300 rounded-md outline-none focus:border-green-500 text-gray-700"
              required
            />
          </label>

          <label className="flex flex-col text-gray-700 font-medium">
            Password
            <input
              type="password"
              name="password"
              className="mt-1 px-3 py-2 border-2 border-gray-300 rounded-md outline-none focus:border-green-500 text-gray-700"
              required
            />
          </label>

          {!isLogin && (
            <label className="flex flex-col text-gray-700 font-medium">
              Confirm Password
              <input
                type="password"
                name="password_confirmation"
                className="mt-1 px-3 py-2 border-2 border-gray-300 rounded-md outline-none focus:border-green-500 text-gray-700"
                required
              />
            </label>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-md text-white font-semibold transition"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyan-500 hover:underline font-medium"
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </Modal>
  );
}

export default AuthModal;
