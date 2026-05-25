import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import API from '../api/axios'
import useAuthStore from '../store/authStore'

export default function Register() {
  const [step, setStep] = useState(1)
  const [schools, setSchools] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirm: '',
    school_id: '', department_id: '', semester: '', enrollment_no: '',
  })
  const { login } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    API.get('/categories/schools').then(r => setSchools(r.data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (form.school_id) {
      const school = schools.find(s => s.id == form.school_id)
      setDepartments(school?.departments || [])
      setForm(f => ({ ...f, department_id: '' }))
    }
  }, [form.school_id, schools])

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    setLoading(true)
    try {
      const res = await API.post('/users/register', {
        name: form.name, email: form.email, password: form.password,
        school_id: parseInt(form.school_id),
        department_id: parseInt(form.department_id),
        semester: parseInt(form.semester),
        enrollment_no: form.enrollment_no,
      })
      login(res.data.user, res.data.access_token)
      toast.success('Welcome to CampusBridge! 🎓')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: 10,
    border: '1.5px solid #D0ECE8', outline: 'none', fontSize: 15,
    color: '#0D2B35', background: '#F8FFFE', boxSizing: 'border-box',
    transition: 'border 0.2s',
  }
  const labelStyle = { fontSize: 13, fontWeight: 600, color: '#4A6572', display: 'block', marginBottom: 6 }

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
          border: '1px solid #D0F5F0', width: '100%', maxWidth: 480,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0D2B35', marginBottom: 6 }}>
            Join CampusBridge
          </h1>
          <p style={{ color: '#7A9BA8', fontSize: 14 }}>RGPV Students Only</p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: 4, borderRadius: 4,
              background: step >= s
                ? 'linear-gradient(90deg, #00C9B1, #00A896)'
                : '#E0F0EC',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: '#7A9BA8', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>STEP 1 OF 2 — Personal Details</p>

            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} placeholder="Sneha Choudhary"
                value={form.name} onChange={e => update('name', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#00C9B1'}
                onBlur={e => e.target.style.borderColor = '#D0ECE8'} />
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input style={inputStyle} type="email" placeholder="your@email.com"
                value={form.email} onChange={e => update('email', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#00C9B1'}
                onBlur={e => e.target.style.borderColor = '#D0ECE8'} />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input style={inputStyle} type="password" placeholder="••••••••"
                value={form.password} onChange={e => update('password', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#00C9B1'}
                onBlur={e => e.target.style.borderColor = '#D0ECE8'} />
            </div>

            <div>
              <label style={labelStyle}>Confirm Password</label>
              <input style={inputStyle} type="password" placeholder="••••••••"
                value={form.confirm} onChange={e => update('confirm', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#00C9B1'}
                onBlur={e => e.target.style.borderColor = '#D0ECE8'} />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!form.name || !form.email || !form.password) { toast.error('Fill all fields'); return }
                if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
                setStep(2)
              }}
              style={{
                width: '100%', padding: '14px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg, #00C9B1, #00A896)',
                color: '#fff', fontWeight: 700, fontSize: 16, cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(0,201,177,0.35)', marginTop: 4,
              }}
            >Next →</motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: '#7A9BA8', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>STEP 2 OF 2 — RGPV Details</p>

            <div>
              <label style={labelStyle}>Enrollment Number</label>
              <input style={inputStyle} placeholder="0101CS221001"
                value={form.enrollment_no} onChange={e => update('enrollment_no', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#00C9B1'}
                onBlur={e => e.target.style.borderColor = '#D0ECE8'} />
            </div>

            <div>
              <label style={labelStyle}>School</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.school_id} onChange={e => update('school_id', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#00C9B1'}
                onBlur={e => e.target.style.borderColor = '#D0ECE8'}>
                <option value="">Select your school</option>
                {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Department / Course</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.department_id} onChange={e => update('department_id', e.target.value)}
                disabled={!form.school_id}
                onFocus={e => e.target.style.borderColor = '#00C9B1'}
                onBlur={e => e.target.style.borderColor = '#D0ECE8'}>
                <option value="">Select department</option>
                {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Current Semester</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.semester} onChange={e => update('semester', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#00C9B1'}
                onBlur={e => e.target.style.borderColor = '#D0ECE8'}>
                <option value="">Select semester</option>
                {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <button onClick={() => setStep(1)} style={{
                flex: 1, padding: '13px', borderRadius: 10,
                border: '1.5px solid #D0ECE8', background: '#fff',
                color: '#4A6572', fontWeight: 600, fontSize: 15, cursor: 'pointer',
              }}>← Back</button>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleSubmit} disabled={loading}
                style={{
                  flex: 2, padding: '13px', borderRadius: 10, border: 'none',
                  background: loading ? '#B2EFE8' : 'linear-gradient(135deg, #00C9B1, #00A896)',
                  color: '#fff', fontWeight: 700, fontSize: 16,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 6px 20px rgba(0,201,177,0.35)',
                }}
              >{loading ? 'Creating Account...' : 'Create Account 🎓'}</motion.button>
            </div>
          </motion.div>
        )}

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <span style={{ color: '#7A9BA8', fontSize: 14 }}>Already have an account? </span>
          <Link to="/login" style={{ color: '#00A896', fontWeight: 700, textDecoration: 'none', fontSize: 14 }}>
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
