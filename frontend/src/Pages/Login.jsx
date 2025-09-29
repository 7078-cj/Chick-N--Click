import React, { useContext } from 'react'

import { useNavigate } from 'react-router-dom'
import AuthContext from '../Contexts/AuthContext'

function Login() {
  let { loginUser } = useContext(AuthContext)
  const nav = useNavigate()

  return (
    <div className="flex min-h-screen bg-gray-100">
     

      {/* Main content */}
      <div className="flex-1 flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 ">Login</h2>
          <form onSubmit={loginUser} className="flex flex-col space-y-4">
            <label className="flex flex-col text-gray-700 font-medium">
              Email
              <input
                type="text"
                name="email"
                className="mt-1 px-3 py-2 border-2 border-gray-300 rounded-md outline-none focus:border-green-500 text-gray-700"
              />
            </label>

            <label className="flex flex-col text-gray-700 font-medium">
              Password
              <input
                type="password"
                name="password"
                className="mt-1 px-3 py-2 border-2 border-gray-300 rounded-md outline-none focus:border-green-500 text-gray-700"
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
  )
}

export default Login