import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../Contexts/AuthContext';


function Register() {
  const nav = useNavigate()
  let { loginUser } = useContext(AuthContext)

  var RegisterUser = async (e) => {
    e.preventDefault();
    const url = import.meta.env.VITE_API_URL

    let response = await fetch(`${url}/api/register`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
        password_confirmation: e.target.password_confirmation.value, 
      }),credentials: 'include'
    });

    let data = await response.json();

    if (response.ok) {
      // optional: directly log user in after registration
      loginUser(e);
      nav('/');
    } else {
      console.error("Registration failed", data);
    }
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register</h2>
        <form onSubmit={RegisterUser} className="flex flex-col space-y-4">

          <label className="flex flex-col text-gray-700 font-medium">
            Name
            <input
              type="text"
              name="name"
              className="mt-1 px-3 py-2 border-2 border-gray-300 rounded-md outline-none focus:border-green-500 text-gray-700"
              required
            />
          </label>

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

          <label className="flex flex-col text-gray-700 font-medium">
            Confirm Password
            <input
              type="password"
              name="password_confirmation" 
              className="mt-1 px-3 py-2 border-2 border-gray-300 rounded-md outline-none focus:border-green-500 text-gray-700"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full py-2 bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-md text-white font-semibold transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-cyan-500 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

export default Register
