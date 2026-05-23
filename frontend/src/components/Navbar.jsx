import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/listings?search=${searchQuery}`)
    }
  }

  return (
    <nav className="bg-[#0A1628] border-b border-[#00C896]/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">

          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#00C896] rounded-lg flex items-center justify-center text-[#0A1628] font-bold text-sm">CB</div>
            <span className="text-white font-bold text-lg hidden sm:block">CampusBridge</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books, laptops, calculators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#112240] text-white placeholder-gray-400 border border-[#00C896]/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[#00C896] transition-colors"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00C896]">
                🔍
              </button>
            </div>
          </form>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/listings" className="text-gray-300 hover:text-[#00C896] text-sm transition-colors">Browse</Link>
            {isAuthenticated ? (
              <>
                <Link to="/post-listing" className="bg-[#00C896] text-[#0A1628] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00b386] transition-colors">+ Sell</Link>
                <Link to="/messages" className="text-gray-300 hover:text-[#00C896] text-sm transition-colors">Messages</Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-300 hover:text-white">
                    <div className="w-8 h-8 bg-[#00C896]/20 rounded-full flex items-center justify-center text-[#00C896] text-sm font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  <div className="absolute right-0 top-10 bg-[#112240] border border-[#00C896]/20 rounded-lg py-2 w-48 hidden group-hover:block shadow-xl">
                    <div className="px-4 py-2 border-b border-[#00C896]/10">
                      <p className="text-white text-sm font-medium">{user?.name}</p>
                      <p className="text-gray-400 text-xs">{user?.department}</p>
                    </div>
                    <Link to="/my-listings" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-[#00C896]/10 text-sm">My Listings</Link>
                    <Link to="/profile" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-[#00C896]/10 text-sm">Profile</Link>
                    <Link to="/dashboard" className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-[#00C896]/10 text-sm">Dashboard</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm">Logout</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-[#00C896] text-sm transition-colors">Login</Link>
                <Link to="/register" className="bg-[#00C896] text-[#0A1628] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#00b386] transition-colors">Join Free</Link>
              </>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white text-2xl">☰</button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-3 pb-3 border-t border-[#00C896]/20 pt-3 flex flex-col gap-3">
            <Link to="/listings" className="text-gray-300 text-sm" onClick={() => setMenuOpen(false)}>Browse</Link>
            {isAuthenticated ? (
              <>
                <Link to="/post-listing" className="text-[#00C896] text-sm font-semibold" onClick={() => setMenuOpen(false)}>+ Sell Item</Link>
                <Link to="/messages" className="text-gray-300 text-sm" onClick={() => setMenuOpen(false)}>Messages</Link>
                <Link to="/my-listings" className="text-gray-300 text-sm" onClick={() => setMenuOpen(false)}>My Listings</Link>
                <Link to="/dashboard" className="text-gray-300 text-sm" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="text-red-400 text-sm text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 text-sm" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="text-[#00C896] text-sm font-semibold" onClick={() => setMenuOpen(false)}>Join Free</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}