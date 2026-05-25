import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import API from '../api/axios'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function Messages() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    API.get('/messages/conversations').then(r => {
      setConversations(r.data)
      if (id) { const c = r.data.find(c => c.id == id); if (c) openConv(c) }
    }).catch(() => {})
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const openConv = async (conv) => {
    setActiveConv(conv)
    try {
      const r = await API.get(`/messages/${conv.id}`)
      setMessages(r.data)
    } catch { setMessages([]) }
  }

  const sendMessage = async () => {
    if (!input.trim() || !activeConv) return
    setSending(true)
    try {
      await API.post('/messages/', { conversation_id: activeConv.id, content: input })
      setMessages(prev => [...prev, { id: Date.now(), sender_id: user.id, content: input, created_at: new Date().toISOString() }])
      setInput('')
    } catch { toast.error('Failed to send') }
    finally { setSending(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5FFFE', display: 'flex', flexDirection: 'column' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px', flex: 1, width: '100%' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0D2B35', marginBottom: 24 }}>💬 Messages</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, height: '70vh' }}>

          {/* Conversation List */}
          <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #D0F5F0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #E0F5F0', fontWeight: 700, color: '#0D2B35', fontSize: 15 }}>
              Conversations
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {conversations.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center', color: '#7A9BA8' }}>
                  <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
                  <p style={{ fontSize: 14 }}>No conversations yet</p>
                </div>
              ) : conversations.map(conv => (
                <div key={conv.id} onClick={() => openConv(conv)} style={{
                  padding: '14px 20px', cursor: 'pointer', transition: 'all 0.2s',
                  background: activeConv?.id === conv.id ? 'linear-gradient(135deg, rgba(0,201,177,0.1), rgba(0,168,150,0.05))' : 'transparent',
                  borderLeft: activeConv?.id === conv.id ? '3px solid #00C9B1' : '3px solid transparent',
                  borderBottom: '1px solid #F0F8F6',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #00C9B1, #00A896)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontWeight: 800, fontSize: 16,
                    }}>{conv.other_user_name?.[0]?.toUpperCase() || '?'}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, color: '#0D2B35', fontSize: 14, marginBottom: 2 }}>{conv.other_user_name}</div>
                      <div style={{ fontSize: 12, color: '#7A9BA8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {conv.listing_title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div style={{ background: '#fff', borderRadius: 18, border: '1px solid #D0F5F0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {!activeConv ? (
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#7A9BA8' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>💬</div>
                <p style={{ fontWeight: 600, fontSize: 16, color: '#0D2B35', marginBottom: 8 }}>Select a conversation</p>
                <p style={{ fontSize: 14 }}>Choose from the left to start chatting</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #E0F5F0', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00C9B1, #00A896)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800,
                  }}>{activeConv.other_user_name?.[0]?.toUpperCase()}</div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#0D2B35' }}>{activeConv.other_user_name}</div>
                    <div style={{ fontSize: 12, color: '#00A896', fontWeight: 600 }}>Re: {activeConv.listing_title}</div>
                  </div>
                </div>

                {/* Messages */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {messages.map((m, i) => {
                    const isMine = m.sender_id === user?.id
                    return (
                      <motion.div key={m.id || i}
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                          maxWidth: '70%', padding: '10px 16px', borderRadius: 16,
                          borderBottomRightRadius: isMine ? 4 : 16,
                          borderBottomLeftRadius: isMine ? 16 : 4,
                          background: isMine ? 'linear-gradient(135deg, #00C9B1, #00A896)' : '#F5FFFE',
                          color: isMine ? '#fff' : '#0D2B35',
                          fontSize: 14, lineHeight: 1.5,
                          border: isMine ? 'none' : '1px solid #D0F5F0',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                        }}>
                          {m.content}
                          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4, textAlign: 'right' }}>
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div style={{ padding: '16px 20px', borderTop: '1px solid #E0F5F0', display: 'flex', gap: 12, alignItems: 'center' }}>
                  <input
                    value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    style={{
                      flex: 1, padding: '11px 16px', borderRadius: 20,
                      border: '1.5px solid #D0ECE8', outline: 'none',
                      fontSize: 14, color: '#0D2B35', background: '#F8FFFE',
                    }}
                    onFocus={e => e.target.style.borderColor = '#00C9B1'}
                    onBlur={e => e.target.style.borderColor = '#D0ECE8'}
                  />
                  <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}
                    onClick={sendMessage} disabled={sending}
                    style={{
                      width: 44, height: 44, borderRadius: '50%', border: 'none',
                      background: 'linear-gradient(135deg, #00C9B1, #00A896)',
                      color: '#fff', fontSize: 18, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 4px 12px rgba(0,201,177,0.4)',
                    }}>↑</motion.button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
