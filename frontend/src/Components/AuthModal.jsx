import React, { useContext, useState, useEffect } from "react";
import { Modal, Notification } from "@mantine/core";
import AuthContext from "../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import UserLocationMap from "../Components/LeafletMap";

function AuthModal({ opened, onClose }) {
  const { loginUser } = useContext(AuthContext);
  const nav = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🌍 For location selection in registration
  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    city: "",
    country: "",
    full: "",
  });

  // --- 🔑 Login Handler ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginUser(e);
      nav("/home");
      onClose();
    } catch (err) {
      setError(err.message || "Login failed. Check your credentials.");
      setTimeout(() => setError(""), 3000);
    }
  };

  // --- 🧩 Register Handler (with location + more fields) ---
  const handleRegister = async (e) => {
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

      // Auto-login after register
      await loginUser({
        preventDefault: () => {},
        target: {
          email: { value: e.target.email.value },
          password: { value: e.target.password.value },
        },
      });

      nav("/home");
      onClose();
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
    <Modal opened={opened} onClose={onClose} centered size="lg">
      <div className="p-6 relative">
        {error && (
          <Notification
            color="red"
            onClose={() => setError("")}
            title={isLogin ? "Login Error" : "Registration Error"}
            className="mb-4"
          >
            {error}
          </Notification>
        )}

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isLogin ? "Login" : "Create Account"}
        </h2>

        {isLogin ? (
          // 🔹 LOGIN FORM
          <form onSubmit={handleLogin} className="flex flex-col space-y-4">
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

            <button
              type="submit"
              className="w-full py-2 bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-md text-white font-semibold transition"
            >
              Login
            </button>
          </form>
        ) : (
          // 🔹 REGISTER FORM
          <form onSubmit={handleRegister} className="flex flex-col space-y-4">
            {[
              { name: "first_name", label: "First Name", type: "text" },
              { name: "last_name", label: "Last Name", type: "text" },
              { name: "name", label: "Username", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "phone_number", label: "Phone Number", type: "text" },
            ].map((field) => (
              <label
                key={field.name}
                className="flex flex-col text-gray-700 font-medium"
              >
                {field.label}
                <input
                  type={field.type}
                  name={field.name}
                  className="mt-1 px-3 py-2 border-2 border-gray-300 rounded-md outline-none focus:border-green-500 text-gray-700"
                  required
                />
              </label>
            ))}

            {/* Password fields */}
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

            {/* Map Location Picker */}
            <div className="mb-4 w-full h-[25vh]">
              <label className="block mb-2 text-xs text-gray-500">
                Your Location
              </label>
              <div className="w-full h-full bg-gray-200 rounded-xl overflow-hidden shadow-inner">
                <UserLocationMap
                  editMode={true}
                  setLocation={setLocation}
                  location={location}
                  user={null}
                />
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {location.full || "Select your location on the map"}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !location.lat}
              className={`w-full py-2 rounded-md text-white font-semibold transition ${
                loading || !location.lat
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 active:bg-green-700"
              }`}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
        )}

        {/* Toggle Login/Register */}
        <p className="mt-4 text-center text-gray-600 text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-cyan-500 hover:underline font-medium"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </Modal>
  );
}

export default AuthModal;
