import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '@mantine/core';
import AuthContext from '../Contexts/AuthContext';

function Login() {
  const { loginUser } = useContext(AuthContext);
  const nav = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    try {
      const data = await loginUser(e); // will throw if login fails
      // redirect after successful login
      if (data.user.role === 'admin') nav('/admin');
      else nav('/home');
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 4000); // auto-hide
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 relative">
          {error && (
            <Notification
              color="red"
              onClose={() => setError('')}
              title="Login Error"
              className="mb-4"
              disallowClose={false}
            >
              {error}
            </Notification>
          )}

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
            <label className="flex flex-col text-gray-700 font-medium">
              Email
              <input
                type="text"
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

            <button
              type="submit"
              className="w-full py-2 bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-md text-white font-semibold transition"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600 text-sm">
            Don't have an account?{' '}
            <a href="/register" className="text-cyan-500 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
