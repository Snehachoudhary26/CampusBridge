import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../api/axios'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

// Smart reply engine — detects what buyer asked and suggests relevant replies
function getSmartReplies(messages, currentUserId) {
  const lastMsg = [...messages].reverse().find(m => m.sender_id !== currentUserId)
  if (!lastMsg) return getDefaultReplies()

  const text = lastMsg.content.toLowerCase()

  if (text.includes('negotia') || text.includes('price') || text.includes('discount') || text.includes('rate') || text.includes('kitna')) {
    return {
      label: '💰 Price Replies',
      replies: [
        { icon: '🤝', text: 'Price is slightly negotiable. You can contact me directly after 7 PM, we can discuss!' },
        { icon: '💰', text: 'Price is fixed at the listed amount. Best quality at this price!' },
        { icon: '📉', text: 'For quick pickup today, I can do a small discount. Come meet me after 8 PM.' },
        { icon: '📞', text: 'Let\'s talk about price in person. I am available after 7 PM in hostel.' },
      ]
    }
  }

  if (text.includes('available') || text.includes('still') || text.includes('baki') || text.includes('sold')) {
    return {
      label: '📦 Availability Replies',
      replies: [
        { icon: '✅', text: 'Yes, still available! You can come and collect it. I am available after 7 PM.' },
        { icon: '⚡', text: 'Available right now! Come to my hostel room anytime today.' },
        { icon: '⏳', text: 'One person is already interested. First come first served. Contact me before 6 PM!' },
        { icon: '❌', text: 'Sorry, this item has been sold already. Check other listings!' },
      ]
    }
  }

  if (text.includes('where') || text.includes('location') || text.includes('hostel') || text.includes('block') || text.includes('collect') || text.includes('kahan')) {
    return {
      label: '📍 Location Replies',
      replies: [
        { icon: '🏠', text: 'I am in Boys Hostel Block B, Room 204. Come after 7 PM on any weekday.' },
        { icon: '🏠', text: 'I am in Girls Hostel Block A, Room 102. Available after 6 PM.' },
        { icon: '🏫', text: 'We can meet near the RGPV main gate. I am free after 5 PM today.' },
        { icon: '☕', text: 'Let\'s meet at the college canteen tomorrow between 1-2 PM during lunch break.' },
        { icon: '📍', text: 'I stay near campus. Share your location and I will suggest a meeting point.' },
      ]
    }
  }

  if (text.includes('condition') || text.includes('working') || text.includes('damage') || text.includes('scratch') || text.includes('photo') || text.includes('pic')) {
    return {
      label: '⭐ Condition Replies',
      replies: [
        { icon: '✅', text: 'Item is in excellent condition, works perfectly. No damage at all. You can inspect before buying!' },
        { icon: '📸', text: 'I will send more photos on WhatsApp. Share your number and I will send clear pics.' },
        { icon: '🔍', text: 'Minor wear and tear but fully functional. You can come and check it yourself before deciding.' },
        { icon: '⭐', text: 'Condition is exactly as shown. Barely used, like new. Come see it in person after 7 PM.' },
      ]
    }
  }

  if (text.includes('when') || text.includes('time') || text.includes('today') || text.includes('tomorrow') || text.includes('kab')) {
    return {
      label: '📅 Timing Replies',
      replies: [
        { icon: '🌙', text: 'I am free today after 7 PM. Come to my hostel and we can finalize the deal!' },
        { icon: '📅', text: 'Available tomorrow evening after 6 PM. Does that work for you?' },
        { icon: '⚡', text: 'I am free right now! Come whenever you want today.' },
        { icon: '🗓️', text: 'This weekend works best for me — Saturday or Sunday afternoon after 2 PM.' },
        { icon: '📞', text: 'My schedule is flexible. Just message me an hour before coming, I will be ready.' },
      ]
    }
  }

  if (text.includes('interest') || text.includes('buy') || text.includes('lena') || text.includes('want') || text.includes('need')) {
    return {
      label: '🎉 Interested Buyer Replies',
      replies: [
        { icon: '🎉', text: 'Great! Come meet me after 7 PM today and we can finalize the deal in person.' },
        { icon: '✅', text: 'Awesome! Item is ready. Just come and collect it whenever you are free today.' },
        { icon: '🤝', text: 'Perfect! Let\'s meet near the campus canteen tomorrow at 1 PM for the handover.' },
        { icon: '📞', text: 'Glad to hear! Share your number, I will call you to coordinate the pickup.' },
      ]
    }
  }

  if (text.includes('borrow') || text.includes('rent') || text.includes('return') || text.includes('kitne din')) {
    return {
      label: '🤝 Borrow/Rent Replies',
      replies: [
        { icon: '📅', text: 'You can borrow it for up to 3 days. Return in same condition. Come after 7 PM.' },
        { icon: '✅', text: 'Sure! Borrow for your exam. Just return it within 2 days. No charges if returned on time.' },
        { icon: '🔑', text: 'Rental available. Minimum 1 week. Come collect it today evening after 6 PM.' },
        { icon: '🤝', text: 'Happy to lend! Just take care of it and return in same condition. Come meet me today.' },
      ]
    }
  }

  return getDefaultReplies()
}

function getDefaultReplies() {
  return {
    label: '💬 Quick Replies',
    replies: [
      { icon: '✅', text: 'Yes, still available! Come meet me after 7 PM today.' },
      { icon: '🤝', text: 'Price is slightly negotiable. Let\'s discuss in person after 7 PM.' },
      { icon: '📍', text: 'I am in hostel Block B. Come after 7 PM any weekday.' },
      { icon: '👍', text: 'Sounds good! Let\'s finalize the deal today evening.' },
      { icon: '📸', text: 'I will send more photos. Share your WhatsApp number.' },
      { icon: '⏰', text: 'I am available after 7 PM daily. Come whenever suits you.' },
      { icon: '🙏', text: 'Thank you for your interest! Feel free to ask anything.' },
      { icon: '✅', text: 'Deal confirmed! See you soon. 🎉' },
    ]
  }
}

export default function Messages() {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [smartReplies, setSmartReplies] = useState(getDefaultReplies())
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    fetchConversations()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (messages.length > 0 && user) {
      setSmartReplies(getSmartReplies(messages, user.id))
    }
  }, [messages])

  const fetchConversations = async () => {
    setLoading(true)
    try {
      const res = await API.get('/messages/conversations')
      const data = res.data?.conversations || res.data || []
      setConversations(Array.isArray(data) ? data : [])
    } catch { setConversations([]) }
    finally { setLoading(false) }
  }

  const openConversation = async (conv) => {
    setActiveConv(conv)
    setShowQuickReplies(false)
    try {
      const res = await API.get(`/messages/${conv.listing_id}/${conv.other_user_id}`)
      const msgs = Array.isArray(res.data) ? res.data : []
      setMessages(msgs)
      if (msgs.length > 0 && user) {
        setSmartReplies(getSmartReplies(msgs, user.id))
      }
    } catch { setMessages([]) }
  }

  const sendMessage = async (text) => {
    const msgText = text || input.trim()
    if (!msgText || !activeConv) return
    setInput('')
    setShowQuickReplies(false)
    setSending(true)

    const tempMsg = {
      id: Date.now(),
      content: msgText,
      sender_id: user.id,
      receiver_id: activeConv.other_user_id,
      listing_id: activeConv.listing_id,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempMsg])

    try {
      await API.post('/messages/', {
        content: msgText,
        listing_id: activeConv.listing_id,
        receiver_id: activeConv.other_user_id,
      })
      fetchConversations()
    } catch {
      toast.error('Failed to send')
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id))
    } finally { setSending(false) }
  }

  if (!isAuthenticated) return null

  const lastReceivedMsg = [...messages].reverse().find(m => m.sender_id !== user?.id)

  return (
    <div style={{ minHeight: '100vh', background: '#F5FFFE' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>

        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 26, fontWeight: 900, color: '#0D2B35', marginBottom: 24 }}>
          💬 Messages
        </motion.h1>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, height: '78vh' }}>

          {/* Conversations List */}
          <div style={{
            background: '#fff', borderRadius: 20, border: '1px solid #D0F5F0',
            overflow: 'hidden', display: 'flex', flexDirection: 'column',
            boxShadow: '0 4px 20px rgba(0,201,177,0.07)',
          }}>
            <div style={{
              padding: '18px 20px', borderBottom: '1px solid #E0F5F0',
              fontWeight: 800, color: '#0D2B35', fontSize: 15,
              background: 'linear-gradient(135deg, #F8FFFE, #F0FFFE)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              Conversations
              {conversations.length > 0 && (
                <span style={{
                  background: 'linear-gradient(135deg, #00C9B1, #00A896)',
                  color: '#fff', borderRadius: 20, padding: '2px 8px', fontSize: 12, fontWeight: 700,
                }}>{conversations.length}</span>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {loading ? (
                <div style={{ padding: 20 }}>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid #F0F8F6' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E0F5F0', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ height: 13, background: '#E0F5F0', borderRadius: 6, marginBottom: 6, width: '70%' }} />
                        <div style={{ height: 11, background: '#E0F5F0', borderRadius: 6, width: '50%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                  <p style={{ color: '#7A9BA8', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>No messages yet</p>
                  <p style={{ color: '#A0BCBB', fontSize: 13, marginBottom: 16 }}>Browse listings and contact sellers</p>
                  <Link to="/listings" style={{
                    display: 'inline-block', padding: '8px 18px', borderRadius: 10,
                    background: 'linear-gradient(135deg, #00C9B1, #00A896)',
                    color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none',
                  }}>Browse Listings</Link>
                </div>
              ) : conversations.map((conv, i) => (
                <motion.div key={conv.conversation_id || i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => openConversation(conv)}
                  style={{
                    padding: '14px 18px', cursor: 'pointer',
                    background: activeConv?.conversation_id === conv.conversation_id ? 'rgba(0,201,177,0.08)' : 'transparent',
                    borderLeft: activeConv?.conversation_id === conv.conversation_id ? '3px solid #00C9B1' : '3px solid transparent',
                    borderBottom: '1px solid #F5FFFE', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #00C9B1, #00A8E8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 800, fontSize: 17,
                    }}>{conv.other_user_name?.[0]?.toUpperCase() || '?'}</div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#0D2B35', fontSize: 14, marginBottom: 2 }}>{conv.other_user_name}</div>
                      <div style={{ fontSize: 12, color: '#00A896', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        📦 {conv.listing_title}
                      </div>
                      {conv.last_message && (
                        <div style={{ fontSize: 12, color: '#A0BCBB', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {conv.last_message}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div style={{
            background: '#fff', borderRadius: 20, border: '1px solid #D0F5F0',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,201,177,0.07)',
          }}>
            {!activeConv ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.4 }}>💬</div>
                <h3 style={{ color: '#0D2B35', fontWeight: 800, marginBottom: 8 }}>Select a conversation</h3>
                <p style={{ color: '#7A9BA8', fontSize: 14 }}>Choose from the left to start chatting</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div style={{
                  padding: '16px 24px', borderBottom: '1px solid #E0F5F0',
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'linear-gradient(135deg, #F8FFFE, #F0FFFE)',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00C9B1, #00A8E8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 18,
                  }}>{activeConv.other_user_name?.[0]?.toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: '#0D2B35', fontSize: 15 }}>{activeConv.other_user_name}</div>
                    <div style={{ fontSize: 12, color: '#00A896', fontWeight: 600 }}>📦 {activeConv.listing_title}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#00C9B1' }} />
                    <span style={{ fontSize: 12, color: '#7A9BA8' }}>Online</span>
                  </div>
                </div>

                {/* Messages */}
                <div style={{
                  flex: 1, overflowY: 'auto', padding: '20px',
                  display: 'flex', flexDirection: 'column', gap: 12,
                  background: 'linear-gradient(180deg, #FAFFFE 0%, #F5FFFE 100%)',
                }}>
                  {messages.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', color: '#A0BCBB' }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>👋</div>
                      <p style={{ fontSize: 14 }}>Start the conversation!</p>
                    </div>
                  ) : messages.map((m, i) => {
                    const isMine = m.sender_id === user?.id
                    return (
                      <motion.div key={m.id || i}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}
                      >
                        {!isMine && (
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                            background: 'linear-gradient(135deg, #00C9B1, #00A8E8)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 800, fontSize: 13,
                          }}>{activeConv.other_user_name?.[0]?.toUpperCase()}</div>
                        )}
                        <div style={{
                          maxWidth: '65%', padding: '11px 16px', borderRadius: 18,
                          borderBottomRightRadius: isMine ? 4 : 18,
                          borderBottomLeftRadius: isMine ? 18 : 4,
                          background: isMine ? 'linear-gradient(135deg, #00C9B1, #00A896)' : '#fff',
                          color: isMine ? '#fff' : '#0D2B35',
                          fontSize: 14, lineHeight: 1.5,
                          border: isMine ? 'none' : '1px solid #E0F5F0',
                          boxShadow: isMine ? '0 4px 12px rgba(0,201,177,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                        }}>
                          {m.content}
                          <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: 'right' }}>
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMine && ' ✓'}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Smart Quick Replies Panel */}
                <AnimatePresence>
                  {showQuickReplies && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      style={{ borderTop: '1px solid #E0F5F0', background: '#F8FFFE', overflow: 'hidden' }}
                    >
                      {/* Smart context label */}
                      <div style={{
                        padding: '10px 16px 6px',
                        display: 'flex', alignItems: 'center', gap: 8,
                        borderBottom: '1px solid #E0F5F0',
                      }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#00A896' }}>
                          ⚡ {smartReplies.label}
                        </span>
                        {lastReceivedMsg && (
                          <span style={{
                            fontSize: 11, color: '#A0BCBB', background: '#F0FFFE',
                            padding: '2px 10px', borderRadius: 20, border: '1px solid #E0F5F0',
                            maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            Re: "{lastReceivedMsg.content.substring(0, 30)}..."
                          </span>
                        )}
                      </div>

                      {/* Reply buttons */}
                      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 200, overflowY: 'auto' }}>
                        {smartReplies.replies.map((reply, i) => (
                          <motion.button key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.01, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => sendMessage(reply.text)}
                            style={{
                              padding: '10px 16px', borderRadius: 12,
                              border: '1.5px solid #D0ECE8',
                              background: '#fff', color: '#0D2B35',
                              fontSize: 13, cursor: 'pointer', fontWeight: 500,
                              textAlign: 'left', transition: 'all 0.2s',
                              display: 'flex', alignItems: 'center', gap: 10,
                              boxShadow: '0 2px 8px rgba(0,201,177,0.05)',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#00C9B1'; e.currentTarget.style.background = '#F0FFFE' }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#D0ECE8'; e.currentTarget.style.background = '#fff' }}
                          >
                            <span style={{ fontSize: 18, flexShrink: 0 }}>{reply.icon}</span>
                            <span style={{ flex: 1, lineHeight: 1.4 }}>{reply.text}</span>
                            <span style={{ fontSize: 11, color: '#00C9B1', flexShrink: 0, fontWeight: 700 }}>Send →</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input Bar */}
                <div style={{
                  padding: '12px 16px', borderTop: '1px solid #E0F5F0',
                  display: 'flex', gap: 10, alignItems: 'center', background: '#fff',
                }}>
                  <motion.button
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setShowQuickReplies(!showQuickReplies)}
                    title="Smart Quick Replies"
                    style={{
                      width: 42, height: 42, borderRadius: '50%', border: 'none',
                      background: showQuickReplies
                        ? 'linear-gradient(135deg, #00C9B1, #00A896)'
                        : '#F0FFFE',
                      color: showQuickReplies ? '#fff' : '#00A896',
                      fontSize: 18, cursor: 'pointer', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                      boxShadow: showQuickReplies ? '0 4px 12px rgba(0,201,177,0.4)' : 'none',
                      border: showQuickReplies ? 'none' : '1.5px solid #D0ECE8',
                    }}
                  >⚡</motion.button>

                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type a message or tap ⚡ for smart replies..."
                    style={{
                      flex: 1, padding: '12px 16px', borderRadius: 24,
                      border: '1.5px solid #D0ECE8', outline: 'none',
                      fontSize: 14, color: '#0D2B35', background: '#F8FFFE',
                      transition: 'all 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#00C9B1'}
                    onBlur={e => e.target.style.borderColor = '#D0ECE8'}
                  />

                  <motion.button
                    whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                    onClick={() => sendMessage()}
                    disabled={sending || !input.trim()}
                    style={{
                      width: 44, height: 44, borderRadius: '50%', border: 'none',
                      background: input.trim() ? 'linear-gradient(135deg, #00C9B1, #00A896)' : '#E0F5F0',
                      color: input.trim() ? '#fff' : '#A0BCBB',
                      fontSize: 18, cursor: input.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: input.trim() ? '0 4px 12px rgba(0,201,177,0.4)' : 'none',
                      transition: 'all 0.2s', flexShrink: 0,
                    }}
                  >↑</motion.button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
