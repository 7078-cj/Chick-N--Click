import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Notification, Loader } from "@mantine/core";
import AuthContext from "../Contexts/AuthContext";
import UserLocationMap from "../Components/LeafletMap";
import logo from "../assets/hoc_logo.png";

function Register() {
  const nav = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    city: "",
    country: "",
    full: "",
  });

  const RegisterUser = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = import.meta.env.VITE_API_URL;

    try {
      const body = {
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value,
        password_confirmation: e.target.password_confirmation.value,
        phone_number: e.target.phone_number.value,
        latitude: location.lat,
        longitude: location.lng,
        location: location.full || "",
      };

      const response = await fetch(`${url}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Registration failed");

      // Auto-login after successful registration
      await loginUser({
        preventDefault: () => {},
        target: {
          email: { value: e.target.email.value },
          password: { value: e.target.password.value },
        },
      });

      nav("/home");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setError(""), 4000);
    }
  };

  useEffect(() => {
    if (location?.lat && location?.lng) {
      console.log("📍 Location set:", location);
    }
  }, [location]);

  return (
    <div className="flex min-h-screen bg-[#FFF9F1] font-sans w-full">
      {/* LEFT PANEL */}
      <div className="flex flex-col justify-center items-start flex-1 px-24">
        <h1 className="text-[#B54719] font-extrabold text-5xl leading-none hoc_font">
          CREATE AN
        </h1>
        <h1 className="text-[#FF9119] font-extrabold text-6xl mb-6 leading-none hoc_font">
          ACCOUNT!
        </h1>
        <p className="text-gray-600 text-sm max-w-xs">
          Join Click n' Chicks — where your account clicks with endless flavor!
        </p>
      </div>

      {/* RIGHT PANEL (FORM CARD) */}
      <div className="flex justify-center items-center flex-1 relative px-6 w-full">
        <div className="bg-white rounded-2xl shadow-md p-10 w-full">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Click n' Chick" className="h-20" />
          </div>

          {error && (
            <Notification
              color="red"
              onClose={() => setError("")}
              title="Registration Error"
              className="mb-4"
            >
              {error}
            </Notification>
          )}

          {/* Registration Form */}
          <form onSubmit={RegisterUser} className="flex flex-col space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                name="first_name"
                placeholder="First Name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:border-[#FF9119] outline-none"
                required
              />
              <input
                type="text"
                name="last_name"
                placeholder="Last Name"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:border-[#FF9119] outline-none"
                required
              />
            </div>

            <input
              type="text"
              name="name"
              placeholder="Username or Email"
              className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:border-[#FF9119] outline-none"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:border-[#FF9119] outline-none"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:border-[#FF9119] outline-none"
              required
            />

            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm Password"
              className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 placeholder-gray-400 focus:border-[#FF9119] outline-none"
              required
            />

            {/* Phone Field */}
            <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 focus-within:border-[#FF9119]">
              <span className="text-gray-500 mr-2 select-none">+63</span>
              <input
                type="text"
                name="phone_number"
                placeholder="Enter your phone number"
                className="flex-1 outline-none text-gray-700 placeholder-gray-400"
                required
              />
            </div>

            {/* Map Selector */}
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2 ml-2">
                Select your location
              </p>
              <div className="w-full h-[220px] rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                <UserLocationMap
                  editMode={true}
                  setLocation={setLocation}
                  location={location}
                  user={null}
                />
              </div>
              {location.full && (
                <p className="mt-2 text-xs text-gray-600 text-center italic">
                  📍 {location.full}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !location.lat}
              className={`mt-6 w-full py-3 rounded-full text-white font-semibold transition flex justify-center items-center ${
                loading || !location.lat
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[#FFB600] hover:bg-[#ffae00]"
              }`}
            >
              {loading ? (
                <>
                  <Loader size="xs" color="white" className="mr-2" /> Signing Up...
                </>
              ) : (
                "SIGN UP"
              )}
            </button>
          </form>

          {/* Login Redirect */}
          <p className="mt-4 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#FF9119] font-semibold hover:underline"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
