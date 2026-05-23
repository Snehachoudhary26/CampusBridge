import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import API from '../api/axios'
import useAuthStore from '../store/authStore'

const categories = ['Books', 'Laptop', 'Calculator', 'Drawing Instruments', 'Stationery', 'Fan', 'Cooler', 'Hostel Items', 'Electronics', 'Other']
const listingTypes = ['sell', 'rent', 'borrow', 'swap']

export default function PostListing() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuthStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [predicting, setPredicting] = useState(false)
  const [priceData, setPriceData] = useState(null)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    condition: 3,
    category: '',
    listing_type: 'sell',
    department_tag: '',
    semester_tag: '',
    original_price: '',
    months_used: '',
  })

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to post a listing')
      navigate('/login')
    }
  }, [isAuthenticated])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const predictPrice = async () => {
    if (!form.category || !form.original_price || !form.months_used) {
      toast.error('Fill category, original price and months used first')
      return
    }
    setPredicting(true)
    try {
      const res = await API.post('/predict/price', {
        category: form.category,
        original_price: parseFloat(form.original_price),
        condition: form.condition,
        months_used: parseInt(form.months_used),
        demand_score: 0.5
      })
      setPriceData(res.data)
      setForm(prev => ({ ...prev, price: res.data.predicted_price }))
      toast.success('AI price prediction ready!')
    } catch (err) {
      toast.error('Price prediction failed')
    } finally {
      setPredicting(false)
    }
  }

  const handleSubmit = async () => {
    if (!form.title || !form.price || !form.category) {
      toast.error('Please fill all required fields')
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('price', form.price)
      formData.append('condition', form.condition)
      formData.append('category', form.category)
      formData.append('listing_type', form.listing_type)
      if (form.department_tag) formData.append('department_tag', form.department_tag)
      if (form.semester_tag) formData.append('semester_tag', form.semester_tag)
      if (image) formData.append('image', image)

      await API.post('/listings/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Listing posted successfully!')
      navigate('/listings')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to post listing')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-white text-2xl font-bold mb-2">Post a Listing</h1>
          <p className="text-gray-400 text-sm mb-6">Share your item with RGPV students</p>

          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? 'bg-[#00C896] text-[#0A1628]' : 'bg-[#112240] text-gray-400 border border-[#00C896]/20'}`}>{s}</div>
                {s < 3 && <div className={`h-0.5 w-12 transition-all ${step > s ? 'bg-[#00C896]' : 'bg-[#112240]'}`} />}
              </div>
            ))}
            <div className="ml-2 text-gray-400 text-sm">
              {step === 1 ? 'Basic Info' : step === 2 ? 'Upload Image' : 'Pricing'}
            </div>
          </div>

          <div className="bg-[#112240] rounded-2xl border border-[#00C896]/20 p-6">

            {step === 1 && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Data Structures book by Cormen"
                    className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] placeholder-gray-500"
                  />
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the condition, edition, any damage..."
                    rows={3}
                    className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] placeholder-gray-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Category *</label>
                    <select
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896]"
                    >
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Listing Type *</label>
                    <select
                      value={form.listing_type}
                      onChange={e => setForm({ ...form, listing_type: e.target.value })}
                      className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896]"
                    >
                      {listingTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Condition</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button
                        key={n}
                        onClick={() => setForm({ ...form, condition: n })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${form.condition === n ? 'bg-[#00C896] text-[#0A1628]' : 'bg-[#0A1628] text-gray-400 border border-[#00C896]/20 hover:border-[#00C896]'}`}
                      >
                        {n}★
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">1 = Poor condition, 5 = Like new</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Department Tag</label>
                    <input
                      type="text"
                      value={form.department_tag}
                      onChange={e => setForm({ ...form, department_tag: e.target.value })}
                      placeholder="e.g. B.Tech CSE"
                      className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Semester Tag</label>
                    <input
                      type="number"
                      value={form.semester_tag}
                      onChange={e => setForm({ ...form, semester_tag: e.target.value })}
                      placeholder="e.g. 3"
                      min="1" max="10"
                      className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] placeholder-gray-500"
                    />
                  </div>
                </div>

                <button onClick={() => setStep(2)} className="w-full bg-[#00C896] text-[#0A1628] py-3 rounded-lg font-bold text-sm hover:bg-[#00b386] transition-colors mt-2">
                  Next — Upload Image →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Item Photo</label>
                  <div
                    onClick={() => document.getElementById('imageInput').click()}
                    className="border-2 border-dashed border-[#00C896]/30 rounded-xl p-8 text-center cursor-pointer hover:border-[#00C896] transition-colors"
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" className="max-h-48 mx-auto rounded-lg object-contain" />
                    ) : (
                      <div>
                        <div className="text-4xl mb-3">📸</div>
                        <p className="text-gray-400 text-sm">Click to upload a photo of your item</p>
                        <p className="text-gray-500 text-xs mt-1">JPG, PNG up to 5MB</p>
                      </div>
                    )}
                  </div>
                  <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </div>

                <div className="flex gap-3 mt-2">
                  <button onClick={() => setStep(1)} className="flex-1 border border-[#00C896]/30 text-gray-300 py-3 rounded-lg font-medium text-sm hover:border-[#00C896] transition-colors">
                    ← Back
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-[#00C896] text-[#0A1628] py-3 rounded-lg font-bold text-sm hover:bg-[#00b386] transition-colors">
                    Next — Set Price →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Original Price (₹)</label>
                    <input
                      type="number"
                      value={form.original_price}
                      onChange={e => setForm({ ...form, original_price: e.target.value })}
                      placeholder="What you paid"
                      className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] placeholder-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm mb-2 block">Months Used</label>
                    <input
                      type="number"
                      value={form.months_used}
                      onChange={e => setForm({ ...form, months_used: e.target.value })}
                      placeholder="How long used"
                      className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] placeholder-gray-500"
                    />
                  </div>
                </div>

                <button
                  onClick={predictPrice}
                  disabled={predicting}
                  className="w-full border border-[#00C896] text-[#00C896] py-3 rounded-lg font-medium text-sm hover:bg-[#00C896]/10 transition-colors disabled:opacity-50"
                >
                  {predicting ? 'Predicting...' : '🤖 Get AI Price Suggestion'}
                </button>

                {priceData && (
                  <div className="bg-[#0A1628] rounded-xl p-4 border border-[#00C896]/20">
                    <p className="text-[#00C896] font-semibold text-sm mb-2">AI Suggested Price Range</p>
                    <p className="text-white text-lg font-bold">₹{priceData.lower_bound.toLocaleString()} — ₹{priceData.upper_bound.toLocaleString()}</p>
                    {priceData.chart && (
                      <img src={priceData.chart} alt="price chart" className="w-full mt-3 rounded-lg" />
                    )}
                  </div>
                )}

                <div>
                  <label className="text-gray-300 text-sm mb-2 block">Your Asking Price (₹) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                    placeholder="Enter your price"
                    className="w-full bg-[#0A1628] text-white border border-[#00C896]/20 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#00C896] placeholder-gray-500"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button onClick={() => setStep(2)} className="flex-1 border border-[#00C896]/30 text-gray-300 py-3 rounded-lg font-medium text-sm hover:border-[#00C896] transition-colors">
                    ← Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-1 bg-[#00C896] text-[#0A1628] py-3 rounded-lg font-bold text-sm hover:bg-[#00b386] transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Posting...' : '🚀 Post Listing'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}