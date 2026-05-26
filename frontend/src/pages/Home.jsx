import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import API from '../api/axios'

const categories = [
  { name: 'All', icon: '🏬' }, { name: 'Books', icon: '📚' },
  { name: 'Laptop', icon: '💻' }, { name: 'Calculator', icon: '🔢' },
  { name: 'Drawing Instruments', icon: '📐' }, { name: 'Stationery', icon: '✏️' },
  { name: 'Fan', icon: '🌀' }, { name: 'Cooler', icon: '❄️' },
  { name: 'Hostel Items', icon: '🏠' }, { name: 'Electronics', icon: '⚡' },
]

const features = [
  { icon: '🤖', title: 'ARIA AI Chatbot', desc: 'Ask anything about RGPV — books, sellers, departments, semester queries', color: '#E0FBF8' },
  { icon: '💰', title: 'Fair Price AI', desc: 'ML model (R²=96.76%) predicts the right price for your item instantly', color: '#E8F8FF' },
  { icon: '🔄', title: '4 Trade Modes', desc: 'Buy · Sell · Rent · Borrow · Skill-Swap all in one campus platform', color: '#F0FFF4' },
  { icon: '🎓', title: 'RGPV Exclusive', desc: 'Verified RGPV students only — safe, trusted, campus-specific', color: '#FFF8E8' },
]

const stats = [
  { val: '8+', label: 'Schools' },
  { val: '27+', label: 'Courses' },
  { val: '4', label: 'Trade Modes' },
  { val: '96.76%', label: 'AI Accuracy' },
]

export default function Home() {
  const [listings, setListings] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    API.get('/listings/').then(r => setListings(r.data)).catch(() => {})
  }, [])

  const filtered = activeCategory === 'All'
    ? listings
    : listings.filter(l => l.category === activeCategory)

  return (
    <div style={{ minHeight: '100vh', background: '#F5FFFE' }}>

      {/* ── HERO ── */}
      <section style={{
        padding: '90px 48px 70px',
        background: 'linear-gradient(160deg, #FFFFFF 0%, #E8FDFB 50%, #D0F8F3 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 40, flexWrap: 'wrap',
      }}>
        <motion.div
          style={{ maxWidth: 580 }}
          initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}
        >
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#E0FBF8', border: '1px solid #B2EFE8',
            borderRadius: 24, padding: '6px 16px', fontSize: 13,
            color: '#00A896', fontWeight: 600, marginBottom: 28,
          }}>
            🎓 Exclusively for RGPV Bhopal Students
          </div>

          <h1 style={{ fontSize: 'clamp(36px,5vw,62px)', fontWeight: 900, lineHeight: 1.1, color: '#0D2B35', marginBottom: 20 }}>
            Smart Campus<br />
            <span style={{
              background: 'linear-gradient(135deg, #00C9B1 0%, #00A8E8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Economy & AI
            </span>
          </h1>

          <p style={{ fontSize: 18, color: '#4A6572', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
            Buy, Sell, Rent, Borrow & Skill-Swap within your campus — powered by AI price prediction, ARIA chatbot, and smart recommendations.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/listings" style={{
              textDecoration: 'none', padding: '14px 32px', borderRadius: 10,
              background: 'linear-gradient(135deg, #00C9B1, #00A896)',
              color: '#fff', fontWeight: 700, fontSize: 16,
              boxShadow: '0 6px 20px rgba(0,201,177,0.4)',
            }}>Browse Listings →</Link>
            <Link to="/post" style={{
              textDecoration: 'none', padding: '14px 32px', borderRadius: 10,
              border: '2px solid #00C9B1', color: '#00A896',
              fontWeight: 600, fontSize: 16, background: '#fff',
            }}>Post a Listing</Link>
          </div>
        </motion.div>

        {/* Right — Stats panel */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}
          style={{
            background: '#fff', borderRadius: 24, padding: '36px 40px',
            boxShadow: '0 8px 40px rgba(0,201,177,0.15)',
            border: '1px solid #D0F5F0',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, minWidth: 280,
          }}
        >
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 32, fontWeight: 900,
                background: 'linear-gradient(135deg, #00C9B1, #00A8E8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>{s.val}</div>
              <div style={{ color: '#7A9BA8', fontSize: 13, fontWeight: 500, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '70px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ fontSize: 32, fontWeight: 800, color: '#0D2B35', textAlign: 'center', marginBottom: 12 }}
        >Why CampusBridge?</motion.h2>
        <p style={{ textAlign: 'center', color: '#6A8A96', marginBottom: 48, fontSize: 16 }}>
          Built by an RGPV student, for RGPV students
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 24 }}>
          {features.map((f, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              style={{
                background: '#fff', borderRadius: 18, padding: 32,
                border: '1px solid #E0F8F4',
                boxShadow: '0 4px 20px rgba(0,201,177,0.07)',
                transition: 'all 0.3s',
              }}
              whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(0,201,177,0.18)' }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: f.color, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 26, marginBottom: 18,
              }}>{f.icon}</div>
              <h3 style={{ fontWeight: 700, color: '#0D2B35', marginBottom: 10, fontSize: 17 }}>{f.title}</h3>
              <p style={{ color: '#6A8A96', fontSize: 14, lineHeight: 1.65 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BROWSE SECTION ── */}
      <section style={{ padding: '0 48px 80px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#0D2B35', marginBottom: 24 }}>Browse Listings</h2>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
          {categories.map(c => (
            <button key={c.name} onClick={() => setActiveCategory(c.name)} style={{
              padding: '8px 20px', borderRadius: 50, border: '1.5px solid',
              borderColor: activeCategory === c.name ? '#00C9B1' : '#D0ECE8',
              background: activeCategory === c.name
                ? 'linear-gradient(135deg, #00C9B1, #00A896)'
                : '#fff',
              color: activeCategory === c.name ? '#fff' : '#4A6572',
              cursor: 'pointer', fontSize: 14, fontWeight: 600,
              transition: 'all 0.2s',
              boxShadow: activeCategory === c.name ? '0 4px 12px rgba(0,201,177,0.3)' : 'none',
            }}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '80px 0',
            background: '#fff', borderRadius: 20,
            border: '1px dashed #B2EFE8',
          }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>📭</div>
            <p style={{ color: '#7A9BA8', fontSize: 16 }}>
              No listings yet. {' '}
              <Link to="/post" style={{ color: '#00C9B1', fontWeight: 600 }}>Be the first to post!</Link>
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: 22 }}>
            {filtered.map((item, i) => (
              <motion.div key={item.id}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                whileHover={{ y: -5, boxShadow: '0 12px 35px rgba(0,201,177,0.15)' }}
                style={{
                  background: '#fff', borderRadius: 18, overflow: 'hidden',
                  border: '1px solid #E0F5F0',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s', cursor: 'pointer',
                }}
              >
                {item.image_url
                  ? <img src={item.image_url} alt={item.title} style={{ width: '100%', height: 180, objectFit: 'contain', background: '#F8FFFE', padding: '8px' }} />
                  : <div style={{ height: 180, background: 'linear-gradient(135deg, #E0FBF8, #D0F8F3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>📦</div>
                }
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20,
                      background: 'linear-gradient(135deg, #E0FBF8, #C8F5EF)',
                      color: '#00A896', fontWeight: 700, letterSpacing: 0.5,
                    }}>{item.listing_type?.toUpperCase()}</span>
                    <span style={{ color: '#00A896', fontWeight: 800, fontSize: 17 }}>₹{item.price}</span>
                  </div>
                  <h3 style={{ fontWeight: 700, color: '#0D2B35', marginBottom: 6, fontSize: 15 }}>{item.title}</h3>
                  <p style={{ color: '#7A9BA8', fontSize: 13 }}>{item.category} · ⭐ {item.condition}/5</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* ── FOOTER STRIP ── */}
      <footer style={{
        background: 'linear-gradient(135deg, #00C9B1, #00A8E8)',
        padding: '48px', textAlign: 'center', color: '#fff',
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>🎓 CampusBridge</div>
        <p style={{ opacity: 0.85, fontSize: 14 }}>Built with ❤️ for RGPV students by an RGPV student · Sneha Choudhary</p>
      </footer>
    </div>
  )
}
