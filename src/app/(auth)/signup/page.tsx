"use client";
import React, { useState } from "react";
import { Lock, Mail, Key, School } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function SignUp() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "/api/auth/signup",
        {
          name,
          email,
          password,
          collegeName,
        }
      );

      if (response.status === 201) {
        toast.success("User created successfully!");
        console.log("✅ User created:", response.data);
        router.push("/signin");
      } else {
        toast.error(response.data?.error || "Something went wrong");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || "Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-r from-cyan-100 to-pink-200">
      <div className="max-w-md w-full mx-4  ">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <Lock className="text-indigo-600 w-8 h-8" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">
              Welcome
            </h2>
            <p className="text-gray-500 text-center mb-8">
              Sign in to your account
            </p>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault(); // stop form from refreshing the page
                handleSubmit();
              }}
              className="space-y-6"
            >
              {/*Name */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-focus pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 transition duration-300"
                    placeholder="Jhon"
                  />
                </div>
              </div>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-focus pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 transition duration-300"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-focus pl-10 pr-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 transition duration-300"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <i data-feather={showPassword ? "eye-off" : "eye"}></i>
                    </button>
                  </div>
                </div>
              </div>

              {/*College Name */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  College Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <School className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                    className="input-focus pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-indigo-500 transition duration-300"
                    placeholder="abc convent school"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-hover w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition duration-300 ease-in-out transform"
              >
                Sign Up
              </button>
            </form>

            {/* Sign up link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an Account?{" "}
                <a
                  href="/signin"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign In
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
