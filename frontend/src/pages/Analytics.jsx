import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import API from '../api/axios'
import useAuthStore from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function Analytics() {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const [trending, setTrending] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const t = await API.get('/analytics/trending')
        setTrending(t.data)
        if (isAuthenticated && user?.id) {
          const r = await API.get(`/analytics/recommendations/${user.id}`)
          setRecommendations(r.data)
        }
      } catch {}
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const maxCount = Math.max(...trending.map(t => t.count || 0), 1)

  const categoryEmojis = {
    Books: '📚', Laptop: '💻', Calculator: '🔢',
    'Drawing Instruments': '📐', Stationery: '✏️',
    Fan: '🌀', Cooler: '❄️', 'Hostel Items': '🏠',
    Electronics: '⚡', Other: '📦',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5FFFE', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0D2B35', marginBottom: 8 }}>📊 Analytics Dashboard</h1>
          <p style={{ color: '#7A9BA8', fontSize: 15 }}>Campus marketplace insights powered by ML</p>
        </motion.div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#7A9BA8' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <p>Loading analytics...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Trending Categories */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #D0F5F0', boxShadow: '0 4px 20px rgba(0,201,177,0.07)' }}>
              <h2 style={{ fontWeight: 800, color: '#0D2B35', marginBottom: 24, fontSize: 20 }}>🔥 Trending Categories</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {trending.length === 0 ? (
                  <p style={{ color: '#7A9BA8', textAlign: 'center', padding: '20px 0' }}>No data yet — listings will appear here</p>
                ) : trending.map((item, i) => (
                  <motion.div key={item.category}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 36, textAlign: 'center', fontSize: 22 }}>
                      {categoryEmojis[item.category] || '📦'}
                    </div>
                    <div style={{ width: 140, fontSize: 14, fontWeight: 600, color: '#0D2B35', flexShrink: 0 }}>
                      {item.category}
                    </div>
                    <div style={{ flex: 1, height: 10, background: '#F0FFFE', borderRadius: 5, overflow: 'hidden', border: '1px solid #D0F5F0' }}>
                      <motion.div
                        initial={{ width: 0 }} animate={{ width: `${(item.count / maxCount) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.07 }}
                        style={{
                          height: '100%', borderRadius: 5,
                          background: `linear-gradient(90deg, #00C9B1, #00A8E8)`,
                        }}
                      />
                    </div>
                    <div style={{ width: 60, textAlign: 'right', fontSize: 14, fontWeight: 700, color: '#00A896' }}>
                      {item.count} items
                    </div>
                    {i === 0 && <span style={{ fontSize: 12, padding: '2px 10px', background: '#FFF8E8', color: '#CC8800', borderRadius: 20, fontWeight: 700 }}>🏆 Top</span>}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Stats Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
              {[
                { icon: '📈', label: 'Price AI Accuracy', value: '96.76%', sub: 'Random Forest R²', color: '#E8FBF8' },
                { icon: '🛡️', label: 'Spam Detection', value: '100%', sub: 'TF-IDF + Logistic', color: '#EBF5FF' },
                { icon: '🤖', label: 'AI Features', value: '3 Models', sub: 'Price · Spam · Recommend', color: '#F5EEFF' },
                { icon: '🎓', label: 'RGPV Schools', value: '8+', sub: '27 courses covered', color: '#FFF8E8' },
              ].map((s, i) => (
                <motion.div key={s.label}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  style={{
                    background: '#fff', borderRadius: 18, padding: 24,
                    border: '1px solid #D0F5F0', boxShadow: '0 4px 20px rgba(0,201,177,0.06)',
                  }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14 }}>
                    {s.icon}
                  </div>
                  <div style={{ fontSize: 28, fontWeight: 900, background: 'linear-gradient(135deg, #00C9B1, #00A8E8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 4 }}>
                    {s.value}
                  </div>
                  <div style={{ fontWeight: 700, color: '#0D2B35', fontSize: 14, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ color: '#7A9BA8', fontSize: 12 }}>{s.sub}</div>
                </motion.div>
              ))}
            </div>

            {/* Recommendations */}
            {isAuthenticated && recommendations.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid #D0F5F0', boxShadow: '0 4px 20px rgba(0,201,177,0.07)' }}>
                <h2 style={{ fontWeight: 800, color: '#0D2B35', marginBottom: 6, fontSize: 20 }}>✨ Recommended for You</h2>
                <p style={{ color: '#7A9BA8', fontSize: 14, marginBottom: 24 }}>Based on your department and semester</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                  {recommendations.map((item, i) => (
                    <motion.div key={item.id}
                      whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,201,177,0.15)' }}
                      onClick={() => navigate(`/listings/${item.id}`)}
                      style={{
                        background: '#F8FFFE', borderRadius: 14, padding: 18,
                        border: '1px solid #D0F5F0', cursor: 'pointer', transition: 'all 0.3s',
                      }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                        <span style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, background: '#E8FBF8', color: '#00A896', fontWeight: 700 }}>
                          {item.listing_type?.toUpperCase()}
                        </span>
                        <span style={{ fontWeight: 800, color: '#00A896' }}>₹{item.price}</span>
                      </div>
                      <div style={{ fontWeight: 700, color: '#0D2B35', fontSize: 14, marginBottom: 4 }}>{item.title}</div>
                      <div style={{ color: '#7A9BA8', fontSize: 12 }}>{item.category}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
