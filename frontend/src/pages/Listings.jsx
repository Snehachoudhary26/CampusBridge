import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import API from '../api/axios'

const categories = [
  { name: 'All', icon: '🏪' },
  { name: 'Books', icon: '📚' },
  { name: 'Laptop', icon: '💻' },
  { name: 'Calculator', icon: '🔢' },
  { name: 'Drawing Instruments', icon: '📐' },
  { name: 'Stationery', icon: '✏️' },
  { name: 'Fan', icon: '🌀' },
  { name: 'Cooler', icon: '❄️' },
  { name: 'Hostel Items', icon: '🏠' },
  { name: 'Electronics', icon: '🔌' },
  { name: 'Other', icon: '📦' },
]

const listingTypes = ['All', 'sell', 'rent', 'borrow', 'swap']

const typeColors = {
  sell: 'bg-green-500/20 text-green-400',
  rent: 'bg-blue-500/20 text-blue-400',
  borrow: 'bg-purple-500/20 text-purple-400',
  swap: 'bg-orange-500/20 text-orange-400',
}

export default function Listings() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    listing_type: '',
    min_price: '',
    max_price: '',
    condition: '',
    search: searchParams.get('search') || '',
  })

  useEffect(() => {
    fetchListings()
  }, [filters])

  const fetchListings = async () => {
    setLoading(true)
    try {
      const params = {}
      if (filters.category) params.category = filters.category
      if (filters.listing_type) params.listing_type = filters.listing_type
      if (filters.min_price) params.min_price = filters.min_price
      if (filters.max_price) params.max_price = filters.max_price
      if (filters.condition) params.condition = filters.condition
      if (filters.search) params.search = filters.search
      const res = await API.get('/listings/', { params })
      setListings(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-[#0A1628]">
      <div className="bg-[#112240] border-b border-[#00C896]/10 px-4 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.name}
                onClick={() => updateFilter('category', cat.name === 'All' ? '' : cat.name)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  (cat.name === 'All' && !filters.category) || filters.category === cat.name
                    ? 'bg-[#00C896] text-[#0A1628] font-semibold'
                    : 'bg-[#0A1628] text-gray-400 hover:text-white border border-[#00C896]/20'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
        <div className="hidden md:block w-64 flex-shrink-0">
          <div className="bg-[#112240] rounded-xl border border-[#00C896]/10 p-5 sticky top-20">
            <h3 className="text-white font-semibold mb-4">Filters</h3>

            <div className="mb-5">
              <label className="text-gray-400 text-xs uppercase font-semibold mb-2 block">Listing Type</label>
              <div className="flex flex-col gap-2">
                {listingTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => updateFilter('listing_type', type === 'All' ? '' : type)}
                    className={`text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      (type === 'All' && !filters.listing_type) || filters.listing_type === type
                        ? 'bg-[#00C896]/20 text-[#00C896] font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-[#00C896]/5'
                    }`}
                  >
                    {type === 'All' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="text-gray-400 text-xs uppercase font-semibold mb-2 block">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={filters.min_price}
                  onChange={e => updateFilter('min_price', e.target.value)}
                  className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C896]"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={filters.max_price}
                  onChange={e => updateFilter('max_price', e.target.value)}
                  className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00C896]"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="text-gray-400 text-xs uppercase font-semibold mb-2 block">Min Condition</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => updateFilter('condition', filters.condition == n ? '' : n)}
                    className={`w-8 h-8 rounded-lg text-sm transition-all ${
                      filters.condition == n
                        ? 'bg-[#00C896] text-[#0A1628] font-bold'
                        : 'bg-[#0A1628] text-gray-400 border border-[#00C896]/20 hover:border-[#00C896]'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-1">1 = Poor, 5 = Like New</p>
            </div>

            <button
              onClick={() => setFilters({ category: '', listing_type: '', min_price: '', max_price: '', condition: '', search: '' })}
              className="w-full text-center text-[#00C896] text-sm hover:underline"
            >
              Clear all filters
            </button>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">
              {loading ? 'Loading...' : `${listings.length} listings found`}
            </p>
            <div className="relative">
              <input
                type="text"
                placeholder="Search listings..."
                value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
                className="bg-[#112240] text-white border border-[#00C896]/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#00C896] w-48 md:w-64 placeholder-gray-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#112240] rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">📭</div>
              <p className="text-gray-400 text-lg">No listings found</p>
              <p className="text-gray-500 text-sm mt-2">Try changing your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {listings.map((listing, i) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link to={`/listings/${listing.id}`}>
                    <div className="bg-[#112240] border border-[#00C896]/10 rounded-xl overflow-hidden hover:border-[#00C896]/40 transition-all duration-300 group">
                      <div className="h-44 bg-[#0A1628] flex items-center justify-center overflow-hidden">
                        {listing.image_url ? (
                          <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="text-4xl">
                            {categories.find(c => c.name === listing.category)?.icon || '📦'}
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase ${typeColors[listing.listing_type] || typeColors.sell}`}>
                            {listing.listing_type}
                          </span>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-xs ${i < listing.condition ? 'text-[#00C896]' : 'text-gray-600'}`}>★</span>
                            ))}
                          </div>
                        </div>
                        <h3 className="text-white font-medium text-sm mt-2 truncate">{listing.title}</h3>
                        <p className="text-[#00C896] font-bold text-base mt-1">₹{listing.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}