'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    companyName: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!formData.email || !formData.password) {
      setError('Please enter email and password!')
      setLoading(false)
      return
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!')
      setLoading(false)
      return
    }

    if (!isLogin && !formData.companyName) {
      setError('Please enter company name!')
      setLoading(false)
      return
    }

    setTimeout(() => {
      router.push('/dashboard')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Accounting Software</h1>
          <p className="text-black mt-2">Professional Business Accounting</p>
        </div>

        <div className="flex mb-6 border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => { setIsLogin(true); setError('') }}
            className={`flex-1 py-2 font-semibold transition ${
              isLogin
                ? 'bg-blue-600 text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => { setIsLogin(false); setError('') }}
            className={`flex-1 py-2 font-semibold transition ${
              !isLogin
                ? 'bg-blue-600 text-white'
                : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <div>
              <label className="block text-black font-semibold mb-1">
                Company Name *
              </label>
              <input
                type="text"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Enter your company name"
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              />
            </div>
          )}

          <div>
            <label className="block text-black font-semibold mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
            />
          </div>

          <div>
            <label className="block text-black font-semibold mb-1">
              Password *
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded px-3 py-2 text-black"
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-black font-semibold mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm your password"
                className="w-full border border-gray-300 rounded px-3 py-2 text-black"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded font-bold text-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </button>

        </form>

        <div className="mt-6 text-center">
          {isLogin ? (
            <p className="text-black">
              Don't have an account?{' '}
              <button
                onClick={() => { setIsLogin(false); setError('') }}
                className="text-blue-600 font-semibold hover:underline"
              >
                Register here
              </button>
            </p>
          ) : (
            <p className="text-black">
              Already have an account?{' '}
              <button
                onClick={() => { setIsLogin(true); setError('') }}
                className="text-blue-600 font-semibold hover:underline"
              >
                Login here
              </button>
            </p>
          )}
        </div>

        <div className="mt-6 border-t border-gray-200 pt-4">
          <p className="text-center text-black text-sm font-semibold mb-2">Features:</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-black text-sm">✅ Sale Invoice + GST</div>
            <div className="text-black text-sm">✅ Purchase Bill + ITC</div>
            <div className="text-black text-sm">✅ Payment + TDS</div>
            <div className="text-black text-sm">✅ Receipt Management</div>
            <div className="text-black text-sm">✅ Expense Tracking</div>
            <div className="text-black text-sm">✅ Reports & Ledger</div>
          </div>
        </div>

      </div>
    </div>
  )
}