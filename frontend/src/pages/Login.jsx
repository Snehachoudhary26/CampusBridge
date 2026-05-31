import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import API from '../api/axios'
import useAuthStore from '../store/authStore'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [savedEmail, setSavedEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const lastEmail = localStorage.getItem('lastLoginEmail')
    if (lastEmail) setSavedEmail(lastEmail)
  }, [])

  const handleSubmit = async () => {
    if (!form.email) { toast.error('Enter your email'); return }
    if (!form.password) { toast.error('Enter your password'); return }
    setLoading(true)
    try {
      const res = await API.post('/users/login', {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      })
      const { access_token, user } = res.data
      localStorage.setItem('lastLoginEmail', form.email.trim().toLowerCase())
      login(user, access_token)
      toast.success('Welcome back, ' + user.name + '! 🎓')
      navigate('/')
    } catch (err) {
      const detail = err.response?.data?.detail
      if (typeof detail === 'string') toast.error(detail)
      else if (err.message === 'Network Error') toast.error('Backend offline — start it first!')
      else toast.error('Login failed')
    } finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 10,
    border: '1.5px solid #D0ECE8', outline: 'none', fontSize: 15,
    color: '#0D2B35', background: '#F8FFFE', boxSizing: 'border-box',
    transition: 'border 0.2s', fontFamily: 'inherit',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #FFFFFF 0%, #E8FDFB 50%, #D0F8F3 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: '#fff', borderRadius: 24, padding: '48px 44px', boxShadow: '0 8px 40px rgba(0,201,177,0.12)', border: '1px solid #D0F5F0', width: '100%', maxWidth: 440 }}>

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0D2B35', marginBottom: 6 }}>Welcome Back</h1>
          <p style={{ color: '#7A9BA8', fontSize: 14 }}>Sign in to your CampusBridge account</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Email with suggestion */}
          <div style={{ position: 'relative' }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#4A6572', display: 'block', marginBottom: 6 }}>Email Address</label>
            <input type="email" placeholder="your@email.com"
              value={form.email}
              onChange={e => { setForm({ ...form, email: e.target.value }); setShowSuggestion(savedEmail && e.target.value.length > 0 && savedEmail.includes(e.target.value)) }}
              onFocus={() => { if (savedEmail && !form.email) setShowSuggestion(true) }}
              onBlur={() => setTimeout(() => setShowSuggestion(false), 200)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              style={inputStyle}
              onFocus2={e => e.target.style.borderColor = '#00C9B1'}
            />
            {/* Email suggestion dropdown */}
            {showSuggestion && savedEmail && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                onClick={() => { setForm({ ...form, email: savedEmail }); setShowSuggestion(false) }}
                style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, background: '#fff', border: '1.5px solid #D0ECE8', borderRadius: 10, padding: '10px 14px', cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>👤</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#0D2B35' }}>{savedEmail}</div>
                  <div style={{ fontSize: 11, color: '#7A9BA8' }}>Last used account — tap to fill</div>
                </div>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#00A896', fontWeight: 700 }}>Use →</span>
              </motion.div>
            )}
          </div>

          {/* Password with show/hide */}
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: '#4A6572', display: 'block', marginBottom: 6 }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                style={{ ...inputStyle, paddingRight: 48 }}
                onFocus={e => e.target.style.borderColor = '#00C9B1'}
                onBlur={e => e.target.style.borderColor = '#D0ECE8'}
              />
              <button onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: '#7A9BA8' }}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <motion.button onClick={handleSubmit} disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{ width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: loading ? '#B2EFE8' : 'linear-gradient(135deg, #00C9B1, #00A896)', color: '#fff', fontWeight: 700, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: loading ? 'none' : '0 6px 20px rgba(0,201,177,0.35)', marginTop: 4 }}>
            {loading ? '⏳ Signing in...' : 'Sign In →'}
          </motion.button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#E0F0EC' }} />
            <span style={{ color: '#A0BCBB', fontSize: 13 }}>or continue with</span>
            <div style={{ flex: 1, height: 1, background: '#E0F0EC' }} />
          </div>

          {/* Google Login */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(0,0,0,0.12)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toast('Google login coming soon! Use email login for now 😊', { icon: '🔜' })}
            style={{ width: '100%', padding: '13px', borderRadius: 10, border: '1.5px solid #E0ECEE', background: '#fff', color: '#0D2B35', fontWeight: 600, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', transition: 'all 0.2s' }}>
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </motion.button>

          {/* Saved accounts section */}
          {savedEmail && (
            <div style={{ background: '#F8FFFE', borderRadius: 12, padding: '12px 16px', border: '1px solid #D0F5F0' }}>
              <p style={{ fontSize: 12, color: '#7A9BA8', fontWeight: 600, marginBottom: 8 }}>LAST USED ACCOUNT</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #00C9B1, #00A8E8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                  {savedEmail[0]?.toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#0D2B35', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{savedEmail}</div>
                  <div style={{ fontSize: 11, color: '#7A9BA8' }}>Tap to use this account</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                  onClick={() => { setForm({ email: savedEmail, password: '' }); toast('Email filled! Enter your password 🔐') }}
                  style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #00C9B1, #00A896)', color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer', flexShrink: 0 }}>
                  Use
                </motion.button>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0 0' }}>
          <div style={{ flex: 1, height: 1, background: '#E0F0EC' }} />
          <span style={{ color: '#A0BCBB', fontSize: 13 }}>New to CampusBridge?</span>
          <div style={{ flex: 1, height: 1, background: '#E0F0EC' }} />
        </div>

        <Link to="/register" style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 10, border: '1.5px solid #00C9B1', color: '#00A896', fontWeight: 700, fontSize: 15, textDecoration: 'none', marginTop: 16 }}>
          Create Account
        </Link>
      </motion.div>
    </div>
  )
}
