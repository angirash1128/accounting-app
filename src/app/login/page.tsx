"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // SIGN UP - New Account
  const handleSignUp = async () => {
    setLoading(true);
    setMessage("");

    if (formData.password.length < 6) {
      setMessage("❌ Password must be at least 6 characters!");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
        },
      },
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Account Created! Redirecting...");
      setTimeout(() => {
        router.push("/company-setup");
      }, 1500);
    }
    setLoading(false);
  };

  // LOGIN - Existing Account
  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setMessage("❌ " + error.message);
    } else {
      setMessage("✅ Login Successful! Redirecting...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      handleSignUp();
    } else {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">📊</div>
          <h1 className="text-2xl font-bold text-black">
            {isSignUp ? "Create Your Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            {isSignUp
              ? "Sign up to start managing your business"
              : "Login to your accounting dashboard"}
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-lg mb-4 text-center text-sm font-medium ${
            message.includes("✅")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Full Name - Only for Sign Up */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                👤 Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              📧 Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              🔒 Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-black"
              required
              minLength={6}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white text-lg transition-all shadow-lg ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading
              ? "⏳ Please Wait..."
              : isSignUp
              ? "🚀 Create Account"
              : "🔓 Login"}
          </button>
        </form>

        {/* Toggle Login / Sign Up */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {isSignUp ? "Already have an account?" : "New user?"}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage("");
              }}
              className="text-blue-600 font-semibold ml-1 hover:underline"
            >
              {isSignUp ? "Login Here" : "Create Account"}
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            🔒 Your data is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
}