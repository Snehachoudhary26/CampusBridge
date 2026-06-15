import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../api/axios'
import useAuthStore from '../store/authStore'

const suggestions = [
  'What books do I need for IT Sem 3?',
  'Who is selling a calculator near me?',
  'How does price prediction work?',
  'What is the borrow feature?',
]

export default function ARIAChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'aria', text: "Hi! I'm ARIA 🤖 — your RGPV campus AI assistant. Ask me anything about listings, books, departments, or campus life!" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)
    try {
      const endpoint = isAuthenticated ? '/chat/' : '/chat/guest'
      const res = await API.post(endpoint, { message: msg })
      setMessages(prev => [...prev, { role: 'aria', text: res.data.response }])
    } catch {
      setMessages(prev => [...prev, { role: 'aria', text: "Sorry, I'm having trouble connecting right now. Please try again!" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: 'fixed', bottom: 20, right: 16, zIndex: 9999,
          width: 60, height: 60, borderRadius: '50%', border: 'none',
          background: 'linear-gradient(135deg, #00C9B1, #00A896)',
          boxShadow: '0 6px 24px rgba(0,201,177,0.5)',
          cursor: 'pointer', fontSize: 26,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {open ? '✕' : '🤖'}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{
              position: 'fixed', bottom: 100, right: 12, zIndex: 9998,
              width: 'min(360px, calc(100vw - 24px))', height: 'min(520px, calc(100vh - 140px))', borderRadius: 24,
              background: '#fff', border: '1px solid #D0F5F0',
              boxShadow: '0 20px 60px rgba(0,201,177,0.2)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{
              background: 'linear-gradient(135deg, #00C9B1, #00A896)',
              padding: '18px 20px',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'rgba(255,255,255,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>🤖</div>
              <div>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: 16 }}>ARIA</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>RGPV Campus AI • Online</div>
              </div>
              <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#7DFFEA' }} />
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {messages.map((m, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  <div style={{
                    maxWidth: '82%', padding: '10px 14px', borderRadius: 16,
                    borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                    borderBottomLeftRadius: m.role === 'aria' ? 4 : 16,
                    background: m.role === 'user'
                      ? 'linear-gradient(135deg, #00C9B1, #00A896)'
                      : '#F5FFFE',
                    color: m.role === 'user' ? '#fff' : '#0D2B35',
                    fontSize: 14, lineHeight: 1.5,
                    border: m.role === 'aria' ? '1px solid #D0F5F0' : 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}>
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div style={{ display: 'flex', gap: 6, padding: '10px 14px', background: '#F5FFFE', borderRadius: 16, width: 'fit-content', border: '1px solid #D0F5F0' }}>
                  {[0,1,2].map(i => (
                    <motion.div key={i}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                      style={{ width: 7, height: 7, borderRadius: '50%', background: '#00C9B1' }}
                    />
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div style={{ padding: '0 12px 8px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {suggestions.map(s => (
                  <button key={s} onClick={() => send(s)} style={{
                    padding: '5px 12px', borderRadius: 20, border: '1px solid #B2EFE8',
                    background: '#F0FFFE', color: '#00A896', fontSize: 12,
                    fontWeight: 500, cursor: 'pointer',
                  }}>{s}</button>
                ))}
              </div>
            )}

            {/* Input */}
            <div style={{
              padding: '12px 16px', borderTop: '1px solid #E0F5F0',
              display: 'flex', gap: 10, alignItems: 'center',
              background: '#fff',
            }}>
              <input
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask ARIA anything..."
                style={{
                  flex: 1, padding: '10px 14px', borderRadius: 20,
                  border: '1.5px solid #D0ECE8', outline: 'none',
                  fontSize: 14, color: '#0D2B35', background: '#F8FFFE',
                }}
                onFocus={e => e.target.style.borderColor = '#00C9B1'}
                onBlur={e => e.target.style.borderColor = '#D0ECE8'}
              />
              <motion.button
                whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                onClick={() => send()}
                style={{
                  width: 40, height: 40, borderRadius: '50%', border: 'none',
                  background: 'linear-gradient(135deg, #00C9B1, #00A896)',
                  color: '#fff', fontSize: 18, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 3px 10px rgba(0,201,177,0.4)',
                }}
              >↑</motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
