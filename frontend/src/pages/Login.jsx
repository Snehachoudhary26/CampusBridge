import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import API from '../api/axios'
import useAuthStore from '../store/authStore'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.append('username', form.email)
      params.append('password', form.password)
      const res = await API.post('/users/login', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
      login(res.data.user, res.data.access_token)
      toast.success('Welcome back! 🎓')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #FFFFFF 0%, #E8FDFB 50%, #D0F8F3 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '40px 20px',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{
          background: '#fff', borderRadius: 24, padding: '48px 44px',
          boxShadow: '0 8px 40px rgba(0,201,177,0.12)',
          border: '1px solid #D0F5F0', width: '100%', maxWidth: 440,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎓</div>
          <h1 style={{
            fontSize: 26, fontWeight: 900, color: '#0D2B35', marginBottom: 6,
          }}>Welcome Back</h1>
          <p style={{ color: '#7A9BA8', fontSize: 14 }}>Sign in to your CampusBridge account</p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#4A6572', display: 'block', marginBottom: 6 }}>
              Email Address
            </label>
            <input
              type="email" placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 10,
                border: '1.5px solid #D0ECE8', outline: 'none', fontSize: 15,
                color: '#0D2B35', background: '#F8FFFE',
                transition: 'border 0.2s', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#00C9B1'}
              onBlur={e => e.target.style.borderColor = '#D0ECE8'}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#4A6572', display: 'block', marginBottom: 6 }}>
              Password
            </label>
            <input
              type="password" placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 10,
                border: '1.5px solid #D0ECE8', outline: 'none', fontSize: 15,
                color: '#0D2B35', background: '#F8FFFE',
                transition: 'border 0.2s', boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#00C9B1'}
              onBlur={e => e.target.style.borderColor = '#D0ECE8'}
            />
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{
              width: '100%', padding: '14px', borderRadius: 10, border: 'none',
              background: loading ? '#B2EFE8' : 'linear-gradient(135deg, #00C9B1, #00A896)',
              color: '#fff', fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 6px 20px rgba(0,201,177,0.35)', marginTop: 4,
            }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </motion.button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0' }}>
          <div style={{ flex: 1, height: 1, background: '#E0F0EC' }} />
          <span style={{ color: '#A0BCBB', fontSize: 13 }}>New to CampusBridge?</span>
          <div style={{ flex: 1, height: 1, background: '#E0F0EC' }} />
        </div>

        <Link to="/register" style={{
          display: 'block', textAlign: 'center', padding: '13px',
          borderRadius: 10, border: '1.5px solid #00C9B1',
          color: '#00A896', fontWeight: 700, fontSize: 15, textDecoration: 'none',
          transition: 'all 0.2s',
        }}>
          Create Account
        </Link>
      </motion.div>
    </div>
  )
}
