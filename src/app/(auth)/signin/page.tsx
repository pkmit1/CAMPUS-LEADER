"use client"
import React, { useState } from "react"
import { Lock,Mail,Key  } from 'lucide-react';
import {toast} from "react-hot-toast"
import axios from "axios";
import { useRouter } from 'next/navigation'


function SignIn() {
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const router=useRouter();


 const handleSubmit = async () => {
     try {
      const response = await axios.post("/api/auth/signin", {
        email,
        password,
      });

      if (response.status === 200) {
        const user = response.data.user;

        toast.success("Login successful!");
        router.push("/dashboard")
      } else {
        toast.error(response.data?.error || "Login failed");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } 
  };

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-r from-cyan-100 to-pink-200">

      <div className="max-w-md w-full mx-4x">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden ">
          <div className="p-8">
            
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <Lock className="text-indigo-600 w-8 h-8"/>
              </div>
            </div>

            
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-1">
              Welcome Back
            </h2>
            <p className="text-gray-500 text-center mb-8">Sign in to your account</p>

            {/* Form */}
            <form  onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
           className="space-y-6">
            
              {/* Email */}
              <div>
                <label htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    < Mail className="text-gray-400"/>
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="text-gray-400"/>
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

              <div className="flex items-center justify-end">
                
                <a href="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="btn-hover w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition duration-300 ease-in-out transform"
              >
                Sign In
              </button>
            </form>

            

            {/* Sign up link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <a href="signup" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Sign up
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
