import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import API from '../api/axios'

const categories = [
  { name: 'All', icon: '🏬' }, { name: 'Books', icon: '📚' },
  { name: 'Laptop', icon: '💻' }, { name: 'Calculator', icon: '🔢' },
  { name: 'Drawing Instruments', icon: '📐' }, { name: 'Stationery', icon: '✏️' },
  { name: 'Fan', icon: '🌀' }, { name: 'Cooler', icon: '❄️' },
  { name: 'Hostel Items', icon: '🏠' }, { name: 'Electronics', icon: '⚡' },
]

const listingTypes = ['All Types', 'sell', 'rent', 'borrow', 'swap']

const typeColors = {
  sell: { bg: '#E8FBF8', color: '#00A896' },
  rent: { bg: '#EBF5FF', color: '#0080CC' },
  borrow: { bg: '#FFF8E8', color: '#CC8800' },
  swap: { bg: '#F5EEFF', color: '#7B2FBE' },
}

export default function Listings() {
  const [searchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')
  const [activeType, setActiveType] = useState('All Types')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minCondition, setMinCondition] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (activeCategory !== 'All') params.category = activeCategory
    if (activeType !== 'All Types') params.listing_type = activeType
    if (minPrice) params.min_price = minPrice
    if (maxPrice) params.max_price = maxPrice
    if (minCondition) params.min_condition = minCondition
    if (search) params.search = search
    API.get('/listings/', { params })
      .then(r => setListings(r.data))
      .catch(() => setListings([]))
      .finally(() => setLoading(false))
  }, [activeCategory, activeType, minPrice, maxPrice, minCondition, search])

  const clearFilters = () => {
    setActiveCategory('All'); setActiveType('All Types')
    setMinPrice(''); setMaxPrice(''); setMinCondition(null); setSearch('')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F5FFFE' }}>

      {/* Category Bar */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #D0F5F0',
        padding: '0 32px', overflowX: 'auto',
        display: 'flex', gap: 4, alignItems: 'center', height: 56,
      }}>
        {categories.map(c => (
          <button key={c.name} onClick={() => setActiveCategory(c.name)} style={{
            padding: '6px 18px', borderRadius: 20, border: 'none',
            background: activeCategory === c.name
              ? 'linear-gradient(135deg, #00C9B1, #00A896)' : 'transparent',
            color: activeCategory === c.name ? '#fff' : '#4A6572',
            fontWeight: 600, fontSize: 14, cursor: 'pointer',
            whiteSpace: 'nowrap', transition: 'all 0.2s',
            boxShadow: activeCategory === c.name ? '0 3px 10px rgba(0,201,177,0.3)' : 'none',
          }}>{c.icon} {c.name}</button>
        ))}
      </div>

      <div style={{ display: 'flex', maxWidth: 1280, margin: '0 auto', padding: '28px 24px', gap: 24 }}>

        {/* Sidebar */}
        <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          style={{
            width: 240, flexShrink: 0, background: '#fff', borderRadius: 18,
            padding: 24, border: '1px solid #D0F5F0',
            boxShadow: '0 4px 20px rgba(0,201,177,0.07)',
            height: 'fit-content', position: 'sticky', top: 84,
          }}>
          <h2 style={{ fontWeight: 800, color: '#0D2B35', fontSize: 17, marginBottom: 24 }}>🔍 Filters</h2>

          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#A0BCBB', letterSpacing: 1, marginBottom: 10 }}>LISTING TYPE</p>
            {listingTypes.map(t => (
              <button key={t} onClick={() => setActiveType(t)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '9px 14px', borderRadius: 8, border: 'none', marginBottom: 4,
                background: activeType === t ? 'linear-gradient(135deg, #00C9B1, #00A896)' : 'transparent',
                color: activeType === t ? '#fff' : '#4A6572',
                fontWeight: activeType === t ? 700 : 500,
                fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
              }}>
                {t === 'All Types' ? '🏷 All Types' : t === 'sell' ? '💰 Sell' : t === 'rent' ? '🔑 Rent' : t === 'borrow' ? '🤝 Borrow' : '🔄 Swap'}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#A0BCBB', letterSpacing: 1, marginBottom: 10 }}>PRICE RANGE</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['Min ₹', minPrice, setMinPrice], ['Max ₹', maxPrice, setMaxPrice]].map(([ph, val, set]) => (
                <input key={ph} type="number" placeholder={ph} value={val}
                  onChange={e => set(e.target.value)}
                  style={{
                    flex: 1, padding: '9px 10px', borderRadius: 8,
                    border: '1.5px solid #D0ECE8', outline: 'none',
                    fontSize: 13, color: '#0D2B35', background: '#F8FFFE', width: 0,
                  }}
                  onFocus={e => e.target.style.borderColor = '#00C9B1'}
                  onBlur={e => e.target.style.borderColor = '#D0ECE8'}
                />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#A0BCBB', letterSpacing: 1, marginBottom: 10 }}>MIN CONDITION</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1,2,3,4,5].map(n => (
                <button key={n} onClick={() => setMinCondition(minCondition === n ? null : n)} style={{
                  width: 36, height: 36, borderRadius: 8, border: '1.5px solid',
                  borderColor: minCondition === n ? '#00C9B1' : '#D0ECE8',
                  background: minCondition === n ? 'linear-gradient(135deg, #00C9B1, #00A896)' : '#fff',
                  color: minCondition === n ? '#fff' : '#4A6572',
                  fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s',
                }}>{n}</button>
              ))}
            </div>
            <p style={{ fontSize: 11, color: '#A0BCBB', marginTop: 6 }}>1 = Poor, 5 = Like New</p>
          </div>

          <button onClick={clearFilters} style={{
            width: '100%', padding: '10px', borderRadius: 10,
            border: '1.5px solid #D0ECE8', background: '#fff',
            color: '#00A896', fontWeight: 700, fontSize: 14, cursor: 'pointer',
          }}>Clear All Filters</button>
        </motion.aside>

        {/* Main Content */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
            <p style={{ color: '#4A6572', fontWeight: 600, fontSize: 15 }}>
              {loading ? 'Loading...' : `${listings.length} listing${listings.length !== 1 ? 's' : ''} found`}
            </p>
            <input type="text" placeholder="🔍  Search listings..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                padding: '10px 18px', borderRadius: 10,
                border: '1.5px solid #D0ECE8', outline: 'none',
                fontSize: 14, color: '#0D2B35', background: '#fff', minWidth: 240,
              }}
              onFocus={e => e.target.style.borderColor = '#00C9B1'}
              onBlur={e => e.target.style.borderColor = '#D0ECE8'}
            />
          </div>

          {/* Skeleton Loading */}
          {loading && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 20 }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', border: '1px solid #E0F5F0', height: 300 }}>
                  <div style={{ height: 180, background: 'linear-gradient(90deg, #F0FFFE 25%, #E0FBF8 50%, #F0FFFE 75%)', backgroundSize: '200% 100%' }} />
                  <div style={{ padding: 16 }}>
                    <div style={{ height: 14, background: '#E0F5F0', borderRadius: 6, marginBottom: 8, width: '70%' }} />
                    <div style={{ height: 12, background: '#E0F5F0', borderRadius: 6, width: '50%' }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && listings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', background: '#fff', borderRadius: 20, border: '1px dashed #B2EFE8' }}>
              <div style={{ fontSize: 60, marginBottom: 16 }}>📭</div>
              <h3 style={{ color: '#0D2B35', fontWeight: 700, marginBottom: 8 }}>No listings found</h3>
              <p style={{ color: '#7A9BA8', marginBottom: 24 }}>Try changing your filters</p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={clearFilters} style={{
                  padding: '10px 24px', borderRadius: 10, border: '1.5px solid #00C9B1',
                  color: '#00A896', background: '#fff', fontWeight: 600, cursor: 'pointer',
                }}>Clear Filters</button>
                <Link to="/post" style={{
                  padding: '10px 24px', borderRadius: 10, textDecoration: 'none',
                  background: 'linear-gradient(135deg, #00C9B1, #00A896)',
                  color: '#fff', fontWeight: 700,
                }}>Post a Listing</Link>
              </div>
            </div>
          )}

          {/* Listings Grid — NOW CLICKABLE via Link */}
          {!loading && listings.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 20 }}>
              {listings.map((item, i) => {
                const tc = typeColors[item.listing_type] || typeColors.sell
                return (
                  <motion.div key={item.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,201,177,0.18)' }}
                    style={{ transition: 'all 0.3s' }}
                  >
                    <Link to={`/listings/${item.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        background: '#fff', borderRadius: 18, overflow: 'hidden',
                        border: '1px solid #E0F5F0',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                        cursor: 'pointer',
                      }}>
                        {item.image_url
                          ? <img src={item.image_url} alt={item.title} style={{ width: '100%', height: 175, objectFit: 'cover' }} />
                          : <div style={{ height: 175, background: 'linear-gradient(135deg, #E0FBF8, #D0F8F3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 48 }}>📦</div>
                        }
                        <div style={{ padding: 18 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                            <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: tc.bg, color: tc.color, fontWeight: 700 }}>
                              {item.listing_type?.toUpperCase()}
                            </span>
                            <span style={{ color: '#00A896', fontWeight: 800, fontSize: 17 }}>₹{item.price}</span>
                          </div>
                          <h3 style={{ fontWeight: 700, color: '#0D2B35', marginBottom: 6, fontSize: 15, lineHeight: 1.3 }}>{item.title}</h3>
                          <p style={{ color: '#7A9BA8', fontSize: 13 }}>{item.category} · ⭐ {item.condition}/5</p>
                          {item.department_name && (
                            <p style={{ color: '#A0BCBB', fontSize: 12, marginTop: 4 }}>📍 {item.department_name}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
