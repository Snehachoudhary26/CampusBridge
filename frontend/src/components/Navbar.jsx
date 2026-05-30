import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import useAuthStore from '../store/authStore'
import Logo from './Logo'
import API from '../api/axios'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [unreadCount, setUnreadCount] = useState(0)

  const handleLogout = () => { logout(); navigate('/') }

  // Poll for unread messages every 15 seconds
  useEffect(() => {
    if (!isAuthenticated) return
    const fetchUnread = async () => {
      try {
        const res = await API.get('/messages/unread-count')
        setUnreadCount(res.data.unread_count || 0)
      } catch {}
    }
    fetchUnread()
    const interval = setInterval(fetchUnread, 15000)
    return () => clearInterval(interval)
  }, [isAuthenticated])

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/listings', label: 'Browse' },
    { to: '/messages', label: 'Messages', badge: unreadCount },
    { to: '/analytics', label: 'Analytics' },
  ]

  return (
    <motion.nav
      initial={{ y: -70 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}
      style={{
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #D0F5F0',
        position: 'sticky', top: 0, zIndex: 1000,
        padding: '0 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: '68px',
        boxShadow: '0 2px 20px rgba(0,201,177,0.08)',
      }}
    >
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
        <Logo size={36} />
        <span style={{
          fontSize: 20, fontWeight: 800,
          background: 'linear-gradient(135deg, #00C9B1, #00A896)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>CampusBridge</span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {navLinks.map(link => (
          <Link key={link.to} to={link.to} style={{
            padding: '8px 18px', borderRadius: 8,
            textDecoration: 'none', fontSize: 15, fontWeight: 500,
            color: location.pathname === link.to ? '#00C9B1' : '#4A6572',
            background: location.pathname === link.to ? 'rgba(0,201,177,0.08)' : 'transparent',
            transition: 'all 0.2s',
            position: 'relative',
          }}>
            {link.label}
            {/* Unread badge */}
            {link.badge > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                style={{
                  position: 'absolute', top: 2, right: 2,
                  background: 'linear-gradient(135deg, #FF6B6B, #FF4444)',
                  color: '#fff', borderRadius: '50%',
                  width: 18, height: 18, fontSize: 10, fontWeight: 800,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(255,68,68,0.4)',
                }}
              >{link.badge > 9 ? '9+' : link.badge}</motion.span>
            )}
          </Link>
        ))}

        <Link to="/post" style={{
          padding: '8px 20px', borderRadius: 8, textDecoration: 'none',
          border: '1.5px solid #00C9B1', color: '#00A896',
          fontWeight: 600, fontSize: 15, marginLeft: 8, transition: 'all 0.2s',
        }}>+ List Item</Link>

        {isAuthenticated ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginLeft: 8 }}>
            <Link to="/profile" style={{
              padding: '8px 18px', borderRadius: 8,
              background: 'rgba(0,201,177,0.1)', color: '#00A896',
              textDecoration: 'none', fontWeight: 600, fontSize: 15,
            }}>👤 {user?.name?.split(' ')[0] || 'Profile'}</Link>
            <button onClick={handleLogout} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: '#FFF0F0', color: '#E05555',
              cursor: 'pointer', fontSize: 14, fontWeight: 500,
            }}>Logout</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 10, marginLeft: 8 }}>
            <Link to="/login" style={{
              padding: '9px 22px', borderRadius: 8, textDecoration: 'none',
              border: '1.5px solid #D0F5F0', color: '#00A896', fontWeight: 600, fontSize: 15,
            }}>Login</Link>
            <Link to="/register" style={{
              padding: '9px 22px', borderRadius: 8, textDecoration: 'none',
              background: 'linear-gradient(135deg, #00C9B1, #00A896)',
              color: '#fff', fontWeight: 700, fontSize: 15,
              boxShadow: '0 4px 15px rgba(0,201,177,0.35)',
            }}>Sign Up</Link>
          </div>
        )}
      </div>
    </motion.nav>
  )
}
