import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import API from '../api/axios'
import useAuthStore from '../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await API.post('/users/login', form)
      const token = res.data.access_token
      const userRes = await API.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      login(userRes.data, token)
      toast.success(`Welcome back, ${userRes.data.name}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4 py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#00C896] rounded-2xl flex items-center justify-center text-[#0A1628] font-bold text-2xl mx-auto mb-4">CB</div>
          <h1 className="text-white text-3xl font-bold">Welcome back</h1>
          <p className="text-gray-400 mt-2">Login to your CampusBridge account</p>
        </div>

        <div className="bg-[#112240] rounded-2xl p-8 border border-[#00C896]/20">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] transition-colors placeholder-gray-500"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] transition-colors placeholder-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00C896] text-[#0A1628] py-3 rounded-lg font-bold text-sm hover:bg-[#00b386] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#00C896] hover:underline font-medium">
              Join free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}