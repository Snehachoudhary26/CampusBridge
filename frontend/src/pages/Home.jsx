import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import API from '../api/axios'
import useAuthStore from '../store/authStore'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [schools, setSchools] = useState([])
  const [semesters, setSemesters] = useState([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    school: '',
    department: '',
    semester: ''
  })

  useEffect(() => {
    API.get('/categories/schools').then(res => setSchools(res.data.schools))
  }, [])

  const handleSchoolChange = async (e) => {
    const schoolName = e.target.value
    const school = schools.find(s => s.name === schoolName)
    setForm({ ...form, school: schoolName, department: '', semester: '' })
    if (school) {
      const res = await API.get(`/categories/semesters/${school.id}`)
      setSemesters(res.data.semesters)
    }
  }

  const selectedSchool = schools.find(s => s.name === form.school)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.post('/users/register', {
        ...form,
        semester: parseInt(form.semester)
      })
      const loginRes = await API.post('/users/login', {
        email: form.email,
        password: form.password
      })
      const token = loginRes.data.access_token
      const userRes = await API.get('/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      login(userRes.data, token)
      toast.success(`Welcome to CampusBridge, ${userRes.data.name}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#00C896] rounded-2xl flex items-center justify-center text-[#0A1628] font-bold text-2xl mx-auto mb-4">CB</div>
          <h1 className="text-white text-3xl font-bold">Join CampusBridge</h1>
          <p className="text-gray-400 mt-2">RGPV Bhopal's campus marketplace</p>
        </div>

        <div className="bg-[#112240] rounded-2xl p-8 border border-[#00C896]/20">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                  required
                  className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] transition-colors placeholder-gray-500"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="10-digit number"
                  className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] transition-colors placeholder-gray-500"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                required
                className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] transition-colors placeholder-gray-500"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] transition-colors placeholder-gray-500"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">School</label>
              <select
                value={form.school}
                onChange={handleSchoolChange}
                required
                className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] transition-colors"
              >
                <option value="">Select your school</option>
                {schools.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            {selectedSchool && (
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Department / Course</label>
                <select
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  required
                  className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] transition-colors"
                >
                  <option value="">Select your course</option>
                  {selectedSchool.departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            )}

            {semesters.length > 0 && (
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Current Semester</label>
                <select
                  value={form.semester}
                  onChange={e => setForm({ ...form, semester: e.target.value })}
                  required
                  className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] transition-colors"
                >
                  <option value="">Select semester</option>
                  {semesters.map(s => (
                    <option key={s} value={s}>Semester {s}</option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00C896] text-[#0A1628] py-3 rounded-lg font-bold text-sm hover:bg-[#00b386] transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#00C896] hover:underline font-medium">Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}