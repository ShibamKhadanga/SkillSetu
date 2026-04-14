/**
 * FeedbackModal.jsx
 * Place in: frontend/src/components/common/FeedbackModal.jsx
 *
 * Usage in StudentLayout.jsx / RecruiterLayout.jsx sidebar:
 *   import FeedbackModal from '@/components/common/FeedbackModal'
 *   <FeedbackModal />
 */

import { useState } from 'react'
import { Star, X, Send, MessageSquare } from 'lucide-react'
import api from '@/services/api'
import toast from 'react-hot-toast'

export default function FeedbackModal() {
  const [open,    setOpen]    = useState(false)
  const [rating,  setRating]  = useState(0)
  const [hovered, setHovered] = useState(0)
  const [message, setMessage] = useState('')
  const [isPublic,setIsPublic]= useState(true)
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)

  const submit = async () => {
    if (rating === 0)          { toast.error('Please select a star rating'); return }
    if (message.trim().length < 10) { toast.error('Please write at least 10 characters'); return }

    setLoading(true)
    try {
      await api.post('/feedback/submit', { rating, message: message.trim(), is_public: isPublic })
      setDone(true)
      toast.success('Thank you for your feedback! 🙏')
      setTimeout(() => { setOpen(false); setDone(false); setRating(0); setMessage('') }, 2000)
    } catch {
      toast.error('Failed to submit. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Trigger button — add this in sidebar */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-body text-sm w-full transition-all duration-200"
        style={{ color: 'var(--text-secondary)' }}
        onMouseOver={e => { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.color = 'var(--text-primary)' }}
        onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
        <Star size={17} />
        Rate SkillSetu
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b"
              style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <h3 className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                  Rate SkillSetu ⭐
                </h3>
                <p className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>
                  Your feedback helps us improve
                </p>
              </div>
              <button onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {done ? (
                <div className="text-center py-6">
                  <p className="text-5xl mb-3">🙏</p>
                  <p className="font-display font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                    Thank you!
                  </p>
                  <p className="font-body text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                    Your feedback has been submitted.
                  </p>
                </div>
              ) : (
                <>
                  {/* Star rating */}
                  <div>
                    <p className="font-body text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                      How would you rate your experience?
                    </p>
                    <div className="flex gap-2 justify-center">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHovered(star)}
                          onMouseLeave={() => setHovered(0)}
                          className="transition-transform duration-150 hover:scale-125">
                          <Star
                            size={36}
                            className={(hovered || rating) >= star ? 'fill-current' : ''}
                            style={{ color: (hovered || rating) >= star ? 'var(--accent)' : 'var(--border)' }}
                          />
                        </button>
                      ))}
                    </div>
                    {rating > 0 && (
                      <p className="text-center font-body text-sm mt-2" style={{ color: 'var(--accent)' }}>
                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][rating]}
                      </p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block font-body text-sm font-medium mb-1.5" style={{ color: 'var(--text-primary)' }}>
                      What do you think? (min 10 characters)
                    </label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={4}
                      className="input-field resize-none text-sm"
                      placeholder="Tell us what you liked, what can be improved, or how SkillSetu helped you..."
                    />
                    <p className="font-body text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                      {message.length} characters
                    </p>
                  </div>

                  {/* Public toggle */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setIsPublic(p => !p)}
                      className="w-10 h-6 rounded-full relative transition-colors duration-200 cursor-pointer"
                      style={{ background: isPublic ? 'var(--accent)' : 'var(--bg-input)', border: '1px solid var(--border)' }}>
                      <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform duration-200"
                        style={{ transform: isPublic ? 'translateX(22px)' : 'translateX(2px)' }} />
                    </div>
                    <span className="font-body text-sm" style={{ color: 'var(--text-secondary)' }}>
                      Show my feedback on the landing page as a testimonial
                    </span>
                  </label>

                  {/* Submit */}
                  <button onClick={submit} disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60">
                    {loading
                      ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <Send size={16} />}
                    Submit Feedback
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
