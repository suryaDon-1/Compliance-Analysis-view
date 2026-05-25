import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/api.js";

function Signup() {
  const navigate = useNavigate();

  const [formdata, setformdata] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handlechange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", formdata);
      if (res.status === 201) {
        alert("Register Success");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
      bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">

      <div className="w-full max-w-lg rounded-2xl shadow-2xl p-10
        bg-white text-gray-800
        dark:bg-white/10 dark:text-white backdrop-blur-xl border border-gray-200 dark:border-white/20">

        <h1 className="text-4xl font-bold text-center mb-2">
          Create Account 🚀
        </h1>

        <p className="text-center mb-8 text-gray-600 dark:text-gray-300">
          Join us and get started today
        </p>

        <form onSubmit={handlesubmit} className="space-y-6">

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handlechange}
            required
            className="w-full px-5 py-3 rounded-lg border
              bg-gray-50 text-gray-800 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              dark:bg-white/20 dark:text-white dark:placeholder-gray-300 dark:border-transparent"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handlechange}
            required
            className="w-full px-5 py-3 rounded-lg border
              bg-gray-50 text-gray-800 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              dark:bg-white/20 dark:text-white dark:placeholder-gray-300 dark:border-transparent"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handlechange}
            required
            className="w-full px-5 py-3 rounded-lg border
              bg-gray-50 text-gray-800 placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500
              dark:bg-white/20 dark:text-white dark:placeholder-gray-300 dark:border-transparent"
          />

          <button
            type="submit"
            className="w-full py-3 rounded-lg font-semibold transition
              bg-indigo-600 text-white hover:bg-indigo-700
              dark:bg-white dark:text-indigo-600 dark:hover:bg-gray-200"
          >
            Sign Up
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-indigo-600 hover:underline
              dark:text-white"
          >
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Signup;