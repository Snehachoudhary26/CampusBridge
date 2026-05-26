import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import API from '../api/axios'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function Messages() {
  const { isAuthenticated, user } = useAuthStore()
  const navigate = useNavigate()
  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return }
    fetchConversations()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
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
    try {
      const res = await API.get(`/messages/${conv.listing_id}/${conv.other_user_id}`)
      setMessages(Array.isArray(res.data) ? res.data : [])
    } catch { setMessages([]) }
  }

  const sendMessage = async () => {
    if (!input.trim() || !activeConv) return
    const text = input.trim()
    setInput('')
    setSending(true)

    // Optimistic update
    const tempMsg = {
      id: Date.now(),
      content: text,
      sender_id: user.id,
      receiver_id: activeConv.other_user_id,
      listing_id: activeConv.listing_id,
      created_at: new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempMsg])

    try {
      await API.post('/messages/', {
        content: text,
        listing_id: activeConv.listing_id,
        receiver_id: activeConv.other_user_id,
      })
      fetchConversations()
    } catch {
      toast.error('Failed to send message')
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id))
      setInput(text)
    } finally { setSending(false) }
  }

  if (!isAuthenticated) return null

  return (
    <div style={{ minHeight: '100vh', background: '#F5FFFE' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 26, fontWeight: 900, color: '#0D2B35', marginBottom: 24 }}>
          💬 Messages
        </motion.h1>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, height: '72vh' }}>

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
            }}>
              Conversations
              {conversations.length > 0 && (
                <span style={{
                  marginLeft: 8, background: 'linear-gradient(135deg, #00C9B1, #00A896)',
                  color: '#fff', borderRadius: 20, padding: '2px 8px', fontSize: 12,
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
                  <p style={{ color: '#A0BCBB', fontSize: 13 }}>Browse listings and contact sellers to start chatting</p>
                  <Link to="/listings" style={{
                    display: 'inline-block', marginTop: 16, padding: '8px 18px',
                    borderRadius: 10, background: 'linear-gradient(135deg, #00C9B1, #00A896)',
                    color: '#fff', fontWeight: 700, fontSize: 13, textDecoration: 'none',
                  }}>Browse Listings</Link>
                </div>
              ) : (
                conversations.map((conv, i) => (
                  <motion.div key={conv.conversation_id || i}
                    initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => openConversation(conv)}
                    style={{
                      padding: '14px 18px', cursor: 'pointer',
                      background: activeConv?.conversation_id === conv.conversation_id
                        ? 'linear-gradient(135deg, rgba(0,201,177,0.08), rgba(0,168,150,0.04))'
                        : 'transparent',
                      borderLeft: activeConv?.conversation_id === conv.conversation_id
                        ? '3px solid #00C9B1' : '3px solid transparent',
                      borderBottom: '1px solid #F5FFFE',
                      transition: 'all 0.2s',
                    }}
                    whileHover={{ backgroundColor: 'rgba(0,201,177,0.04)' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                        background: 'linear-gradient(135deg, #00C9B1, #00A8E8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 800, fontSize: 17,
                      }}>{conv.other_user_name?.[0]?.toUpperCase() || '?'}</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#0D2B35', fontSize: 14, marginBottom: 3 }}>
                          {conv.other_user_name}
                        </div>
                        <div style={{
                          fontSize: 12, color: '#00A896', fontWeight: 600,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>📦 {conv.listing_title}</div>
                        {conv.last_message && (
                          <div style={{
                            fontSize: 12, color: '#A0BCBB', marginTop: 2,
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>{conv.last_message}</div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div style={{
            background: '#fff', borderRadius: 20, border: '1px solid #D0F5F0',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,201,177,0.07)',
          }}>
            {!activeConv ? (
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexDirection: 'column',
              }}>
                <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>💬</div>
                <h3 style={{ color: '#0D2B35', fontWeight: 800, marginBottom: 8 }}>Select a conversation</h3>
                <p style={{ color: '#7A9BA8', fontSize: 14 }}>Choose from the left to start chatting</p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
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
                  <div>
                    <div style={{ fontWeight: 800, color: '#0D2B35', fontSize: 15 }}>
                      {activeConv.other_user_name}
                    </div>
                    <div style={{ fontSize: 12, color: '#00A896', fontWeight: 600 }}>
                      📦 {activeConv.listing_title}
                    </div>
                  </div>
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
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
                  ) : (
                    messages.map((m, i) => {
                      const isMine = m.sender_id === user?.id
                      return (
                        <motion.div key={m.id || i}
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}
                        >
                          <div style={{
                            maxWidth: '70%', padding: '11px 16px', borderRadius: 18,
                            borderBottomRightRadius: isMine ? 4 : 18,
                            borderBottomLeftRadius: isMine ? 18 : 4,
                            background: isMine
                              ? 'linear-gradient(135deg, #00C9B1, #00A896)'
                              : '#fff',
                            color: isMine ? '#fff' : '#0D2B35',
                            fontSize: 14, lineHeight: 1.5,
                            border: isMine ? 'none' : '1px solid #E0F5F0',
                            boxShadow: isMine
                              ? '0 4px 12px rgba(0,201,177,0.3)'
                              : '0 2px 8px rgba(0,0,0,0.05)',
                          }}>
                            {m.content}
                            <div style={{
                              fontSize: 10, opacity: 0.7, marginTop: 4,
                              textAlign: 'right',
                            }}>
                              {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Input */}
                <div style={{
                  padding: '14px 18px', borderTop: '1px solid #E0F5F0',
                  display: 'flex', gap: 10, alignItems: 'center',
                  background: '#fff',
                }}>
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type a message..."
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
                    onClick={sendMessage} disabled={sending || !input.trim()}
                    style={{
                      width: 46, height: 46, borderRadius: '50%', border: 'none',
                      background: input.trim()
                        ? 'linear-gradient(135deg, #00C9B1, #00A896)'
                        : '#E0F5F0',
                      color: input.trim() ? '#fff' : '#A0BCBB',
                      fontSize: 18, cursor: input.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: input.trim() ? '0 4px 12px rgba(0,201,177,0.4)' : 'none',
                      transition: 'all 0.2s',
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
