import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import API from '../api/axios'
import useAuthStore from '../store/authStore'

const typeColors = {
  sell:   { bg: '#E8FBF8', color: '#00A896' },
  rent:   { bg: '#EBF5FF', color: '#0080CC' },
  borrow: { bg: '#FFF8E8', color: '#CC8800' },
  swap:   { bg: '#F5EEFF', color: '#7B2FBE' },
}

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    API.get(`/listings/${id}`)
      .then(r => setListing(r.data))
      .catch(() => {
        toast.error('Listing not found')
        navigate('/listings')
      })
      .finally(() => setLoading(false))
  }, [id])

  const sendMessage = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to contact seller')
      navigate('/login')
      return
    }
    if (!message.trim()) {
      toast.error('Write a message first')
      return
    }
    if (user?.id === listing?.seller_id) {
      toast.error('You cannot message yourself!')
      return
    }
    setSending(true)
    try {
      await API.post('/messages/', {
        content: message.trim(),
        listing_id: parseInt(id),
        receiver_id: listing.seller_id,
      })
      toast.success('Message sent! 🎉')
      setMessage('')
      navigate('/messages')
    } catch (err) {
      const detail = err.response?.data?.detail
      if (typeof detail === 'string') {
        toast.error(detail)
      } else if (Array.isArray(detail)) {
        toast.error(detail[0]?.msg || 'Failed to send')
      } else {
        toast.error('Failed to send message')
      }
    } finally {
      setSending(false) }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F5FFFE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>⏳</div>
        <p style={{ color: '#7A9BA8', fontWeight: 600 }}>Loading listing...</p>
      </div>
    </div>
  )

  if (!listing) return null
  const tc = typeColors[listing.listing_type] || typeColors.sell
  const isOwner = user?.id === listing.seller_id
  const conditionLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Like New']

  return (
    <div style={{ minHeight: '100vh', background: '#F5FFFE', padding: '32px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28, fontSize: 14, color: '#7A9BA8' }}>
          <Link to="/listings" style={{ color: '#00A896', textDecoration: 'none', fontWeight: 600 }}>← Browse</Link>
          <span>/</span>
          <span>{listing.category}</span>
          <span>/</span>
          <span style={{ color: '#0D2B35', fontWeight: 600, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {listing.title}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28, alignItems: 'start' }}>

          {/* LEFT */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>

            {/* Image */}
            <div style={{
              borderRadius: 20, overflow: 'hidden', marginBottom: 24,
              border: '1px solid #D0F5F0',
              background: '#F8FFFE',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              minHeight: 320,
            }}>
              {!imgError && listing.image_url ? (
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  onError={() => setImgError(true)}
                  style={{ width: '100%', maxHeight: 420, objectFit: 'contain', padding: 16 }}
                />
              ) : (
                <div style={{ fontSize: 80, opacity: 0.3 }}>📦</div>
              )}
            </div>

            {/* Description */}
            <div style={{
              background: '#fff', borderRadius: 18, padding: 28,
              border: '1px solid #D0F5F0',
              boxShadow: '0 4px 20px rgba(0,201,177,0.06)',
            }}>
              <h2 style={{ fontWeight: 800, color: '#0D2B35', marginBottom: 14, fontSize: 18 }}>
                About this item
              </h2>
              <p style={{ color: '#4A6572', lineHeight: 1.8, fontSize: 15 }}>
                {listing.description || 'No description provided.'}
              </p>

              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 20 }}>
                {[listing.category, listing.department_tag, listing.semester_tag ? `Sem ${listing.semester_tag}` : null]
                  .filter(Boolean).map(tag => (
                  <span key={tag} style={{
                    padding: '5px 14px', borderRadius: 20,
                    background: '#F0FFFE', border: '1px solid #B2EFE8',
                    color: '#00A896', fontSize: 13, fontWeight: 600,
                  }}>#{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {/* Main Info */}
            <div style={{
              background: '#fff', borderRadius: 20, padding: 28,
              border: '1px solid #D0F5F0',
              boxShadow: '0 4px 20px rgba(0,201,177,0.08)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <span style={{
                  padding: '4px 14px', borderRadius: 20,
                  background: tc.bg, color: tc.color, fontWeight: 700, fontSize: 13,
                }}>{listing.listing_type?.toUpperCase()}</span>
              </div>

              <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0D2B35', marginBottom: 12, lineHeight: 1.3 }}>
                {listing.title}
              </h1>

              <div style={{
                fontSize: 36, fontWeight: 900, marginBottom: 20,
                background: 'linear-gradient(135deg, #00C9B1, #00A8E8)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                {listing.price === 1 ? 'Negotiable' : `₹${listing.price}`}
                {listing.listing_type === 'rent' && <span style={{ fontSize: 14, WebkitTextFillColor: '#7A9BA8' }}>/month</span>}
                {listing.listing_type === 'borrow' && <span style={{ fontSize: 14, WebkitTextFillColor: '#7A9BA8' }}>/day</span>}
              </div>

              {[
                ['📦 Category', listing.category],
                ['⭐ Condition', `${listing.condition}/5 — ${conditionLabels[listing.condition] || ''}`],
                ['🎓 Department', listing.department_tag || 'RGPV'],
                ['📚 Semester', listing.semester_tag ? `Sem ${listing.semester_tag}` : 'All semesters'],
              ].map(([label, value]) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '10px 0', borderBottom: '1px solid #F0F8F6',
                }}>
                  <span style={{ color: '#7A9BA8', fontSize: 14 }}>{label}</span>
                  <span style={{ color: '#0D2B35', fontWeight: 600, fontSize: 14 }}>{value}</span>
                </div>
              ))}
            </div>

            {/* Seller Card */}
            <div style={{
              background: '#fff', borderRadius: 20, padding: 24,
              border: '1px solid #D0F5F0',
            }}>
              <h3 style={{ fontWeight: 700, color: '#0D2B35', marginBottom: 16, fontSize: 15 }}>👤 Seller</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00C9B1, #00A896)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 20,
                }}>
                  {listing.seller_name?.[0]?.toUpperCase() || '?'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0D2B35', fontSize: 15 }}>
                    {listing.seller_name || 'RGPV Student'}
                  </div>
                  <div style={{ fontSize: 13, color: '#7A9BA8', marginTop: 2 }}>
                    {listing.seller_school || 'RGPV Bhopal'}
                  </div>
                  {listing.seller_department && (
                    <div style={{ fontSize: 12, color: '#00A896', marginTop: 2 }}>
                      {listing.seller_department}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact / Action */}
            {isOwner ? (
              <div style={{
                background: '#F0FFFE', borderRadius: 16, padding: 20,
                border: '1px solid #B2EFE8', textAlign: 'center',
              }}>
                <p style={{ color: '#00A896', fontWeight: 700, marginBottom: 12 }}>
                  ✅ This is your listing
                </p>
                <button onClick={() => navigate('/profile')} style={{
                  width: '100%', padding: '12px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #00C9B1, #00A896)',
                  color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 15,
                }}>Manage in Profile →</button>
              </div>
            ) : (
              <div style={{
                background: '#fff', borderRadius: 20, padding: 24,
                border: '1px solid #D0F5F0',
              }}>
                <h3 style={{ fontWeight: 700, color: '#0D2B35', marginBottom: 14, fontSize: 15 }}>
                  💬 Contact Seller
                </h3>
                {!isAuthenticated && (
                  <div style={{
                    background: '#FFF8E8', borderRadius: 10, padding: 12,
                    marginBottom: 14, border: '1px solid #F5DFA0',
                  }}>
                    <p style={{ color: '#CC8800', fontSize: 13, fontWeight: 600 }}>
                      ⚠️ Please <Link to="/login" style={{ color: '#00A896' }}>login</Link> to contact the seller
                    </p>
                  </div>
                )}
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder={`Hi, I'm interested in your ${listing.title}...`}
                  rows={4}
                  style={{
                    width: '100%', padding: '12px', borderRadius: 10,
                    border: '1.5px solid #D0ECE8', outline: 'none', fontSize: 14,
                    color: '#0D2B35', background: '#F8FFFE', resize: 'vertical',
                    boxSizing: 'border-box', marginBottom: 12, fontFamily: 'inherit',
                    lineHeight: 1.5,
                  }}
                  onFocus={e => e.target.style.borderColor = '#00C9B1'}
                  onBlur={e => e.target.style.borderColor = '#D0ECE8'}
                />
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={sendMessage}
                  disabled={sending || !message.trim()}
                  style={{
                    width: '100%', padding: '13px', borderRadius: 10, border: 'none',
                    background: sending || !message.trim()
                      ? '#B2EFE8'
                      : 'linear-gradient(135deg, #00C9B1, #00A896)',
                    color: '#fff', fontWeight: 700, fontSize: 15,
                    cursor: sending || !message.trim() ? 'not-allowed' : 'pointer',
                    boxShadow: sending ? 'none' : '0 6px 20px rgba(0,201,177,0.3)',
                    transition: 'all 0.2s',
                  }}
                >
                  {sending ? '⏳ Sending...' : '📩 Send Message'}
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
