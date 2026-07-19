import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  X,
  Image as ImageIcon,
  Send,
  Loader2,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  CheckCircle2
} from 'lucide-react'
import axios from 'axios'

const QUESTIONS = [
  {
    id: 'q1_mood',
    question: "Overall, how would you rate your mood today?",
    options: ["Very Low", "Low", "Neutral", "Good", "Very Good"],
  },
  {
    id: 'q2_stress',
    question: "How often have you felt overwhelmed by stress in the past two weeks?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Almost Always"],
  },
  {
    id: 'q3_sleep',
    question: "How has your sleep been lately?",
    options: ["Much worse than usual", "Slightly worse", "Normal", "Better than usual"],
  },
  {
    id: 'q4_energy',
    question: "How are your energy levels?",
    options: ["Constantly drained", "Often tired", "Normal", "Energetic"],
  },
  {
    id: 'q5_appetite',
    question: "Have you noticed any change in appetite recently?",
    options: ["Eating much less", "Eating less", "No change", "Eating more"],
  },
  {
    id: 'q6_concentration',
    question: "How easy is it to concentrate on tasks right now?",
    options: ["Very difficult", "Somewhat difficult", "Normal", "Easy"],
  },
  {
    id: 'q7_interest',
    question: "How much interest do you have in things you usually enjoy?",
    options: ["None at all", "Less than usual", "Normal", "More than usual"],
  },
  {
    id: 'q8_anxiety',
    question: "How often do you feel anxious, nervous, or on edge?",
    options: ["Never", "Rarely", "Sometimes", "Often", "Almost Always"],
  },
  {
    id: 'q9_connection',
    question: "How connected do you feel to the people around you?",
    options: ["Very isolated", "Somewhat isolated", "Normal", "Well connected"],
  },
  {
    id: 'q10_hopelessness',
    question: "Have you had thoughts of hopelessness or that things won't get better?",
    options: ["Never", "Rarely", "Sometimes", "Often"],
  }
];

export default function AssessmentPage({ setResults }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [additionalContext, setAdditionalContext] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)
  const navigate = useNavigate()

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''
  const totalSteps = QUESTIONS.length + 2 // 10 questions + context + selfie/submit

  // Handle image selection
  const handleImageSelect = (file) => {
    if (!file) return
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPEG, PNG, WebP, or GIF image.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5 MB.')
      return
    }
    setError('')
    setImage(file)
    const reader = new FileReader()
    reader.onload = (e) => setImagePreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Drag & Drop handlers
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true)
    if (e.type === 'dragleave') setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      handleImageSelect(e.dataTransfer.files[0])
    }
  }

  const handleOptionSelect = (qId, option) => {
    setAnswers(prev => ({ ...prev, [qId]: option }))
    setError('')
  }

  const handleNext = () => {
    if (currentStep < QUESTIONS.length) {
      if (!answers[QUESTIONS[currentStep].id]) {
        setError('Please select an option to continue.')
        return
      }
    }
    setError('')
    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    setError('')
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  // Submit assessment
  const handleSubmit = async () => {
    setError('')
    setLoading(true)

    try {
      const formData = new FormData()
      
      // Append all structured answers
      QUESTIONS.forEach(q => {
        formData.append(q.id, answers[q.id])
      })
      
      // Append additional context if present
      if (additionalContext.trim()) {
        formData.append('additional_context', additionalContext.trim())
      }

      if (image) {
        formData.append('image', image)
      }

      const response = await axios.post(`${BACKEND_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      })

      setResults(response.data)
      navigate('/results')
    } catch (err) {
      console.error("Full /analyze error:", err, err.response?.data);
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else if (err.code === 'ECONNABORTED') {
        setError('The analysis is taking longer than expected. Please try again.')
      } else if (!err.response) {
        setError('Unable to connect to the server. Please check if the backend is running.')
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const renderProgressBar = () => {
    const progress = ((currentStep) / (totalSteps - 1)) * 100
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8 mt-4" style={{ backgroundColor: 'var(--color-sand)' }}>
        <div 
          className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: 'var(--color-brand)' }}
        ></div>
      </div>
    )
  }

  const renderQuestion = (qIndex) => {
    const q = QUESTIONS[qIndex]
    
    return (
      <motion.div
        key={q.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: 'var(--color-espresso)' }}>
          {q.question}
        </h2>
        <div className="space-y-3">
          {q.options.map((option, idx) => {
            const isSelected = answers[q.id] === option
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(q.id, option)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${isSelected ? 'ring-2' : 'hover:bg-opacity-50'}`}
                style={{
                  backgroundColor: isSelected ? 'rgba(139,91,41,0.1)' : 'rgba(240,237,229,0.3)',
                  borderColor: isSelected ? 'var(--color-brand)' : 'var(--color-sand)',
                  color: 'var(--color-espresso)',
                  '--tw-ring-color': 'var(--color-brand)'
                }}
              >
                <span className="text-lg">{option}</span>
                {isSelected && <CheckCircle2 size={20} style={{ color: 'var(--color-brand)' }} />}
              </button>
            )
          })}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="min-h-[80vh] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3" style={{ color: 'var(--color-espresso)' }}>
            Wellness Assessment
          </h1>
          <p className="text-base" style={{ color: 'var(--color-clay)' }}>
            Share how you're feeling and receive a personalized AI-powered wellness report.
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-6 sm:p-8"
        >
          {renderProgressBar()}

          <div className="min-h-[350px]">
            <AnimatePresence mode="wait">
              {currentStep < QUESTIONS.length && renderQuestion(currentStep)}

              {currentStep === QUESTIONS.length && (
                <motion.div
                  key="additional-context"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full"
                >
                  <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: 'var(--color-espresso)' }}>
                    Anything else you'd like to share?
                  </h2>
                  <p className="text-sm mb-4" style={{ color: 'var(--color-clay)' }}>
                    Optional: Share what's on your mind, what's causing stress, or anything you'd like the AI to understand about your situation.
                  </p>
                  <textarea
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="Describe how you're feeling today..."
                    className="w-full min-h-[180px] p-4 rounded-xl border text-base leading-relaxed resize-y focus:outline-none focus:ring-2 transition-all"
                    style={{
                      backgroundColor: 'rgba(240,237,229,0.5)',
                      borderColor: 'var(--color-sand)',
                      color: 'var(--color-espresso)',
                      '--tw-ring-color': 'var(--color-brand)',
                    }}
                    maxLength={5000}
                  />
                  <div className="text-right mt-2 text-xs" style={{ color: 'var(--color-clay)' }}>
                    {additionalContext.length}/5000
                  </div>
                </motion.div>
              )}

              {currentStep === QUESTIONS.length + 1 && (
                <motion.div
                  key="selfie-upload"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full"
                >
                  <h2 className="text-xl sm:text-2xl font-bold mb-6" style={{ color: 'var(--color-espresso)' }}>
                    Upload a Selfie
                  </h2>
                  <p className="text-sm mb-6" style={{ color: 'var(--color-clay)' }}>
                    Optional: Providing a picture of your face can help the AI understand your emotional state better through facial expression analysis.
                  </p>
                  
                  <AnimatePresence mode="wait">
                    {!imagePreview ? (
                      <motion.div
                        key="dropzone"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300"
                        style={{
                          borderColor: dragActive ? 'var(--color-brand)' : 'var(--color-sand)',
                          backgroundColor: dragActive ? 'rgba(139,91,41,0.05)' : 'transparent',
                        }}
                      >
                        <Upload size={32} className="mx-auto mb-3" style={{ color: 'var(--color-clay)' }} />
                        <p className="text-sm font-medium" style={{ color: 'var(--color-espresso)' }}>
                          Drag & drop a selfie here, or click to browse
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--color-clay)' }}>
                          JPEG, PNG, WebP, or GIF — Max 5 MB
                        </p>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          onChange={(e) => handleImageSelect(e.target.files?.[0])}
                          className="hidden"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative rounded-xl overflow-hidden border"
                        style={{ borderColor: 'var(--color-sand)' }}
                      >
                        <img
                          src={imagePreview}
                          alt="Uploaded selfie preview"
                          className="w-full max-h-64 object-cover"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute top-3 right-3 p-2 rounded-full hover:bg-black/80 transition-colors bg-black/60 text-white"
                        >
                          <X size={16} />
                        </button>
                        <div className="p-3 text-xs" style={{ backgroundColor: 'var(--color-sand)', color: 'var(--color-espresso)' }}>
                          📷 {image?.name}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <div className="mt-6 p-4 rounded-xl flex items-start gap-3" style={{ backgroundColor: 'rgba(139,91,41,0.1)', border: '1px solid var(--color-brand)' }}>
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-brand)' }} />
              <p className="text-sm" style={{ color: 'var(--color-brand)' }}>{error}</p>
            </div>
          )}

          <div className="mt-8 flex justify-between items-center pt-6 border-t" style={{ borderColor: 'var(--color-sand)' }}>
            <button
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${currentStep === 0 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
              style={{ color: 'var(--color-espresso)' }}
            >
              <ChevronLeft size={20} />
              Back
            </button>

            {currentStep < QUESTIONS.length + 1 ? (
              <button
                onClick={handleNext}
                disabled={currentStep < QUESTIONS.length && !answers[QUESTIONS[currentStep].id]}
                className="btn-primary flex items-center gap-2 px-6 py-2 rounded-lg font-medium"
              >
                Next
                <ChevronRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center gap-2 px-8 py-3 rounded-xl text-lg font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Analyze Wellness
                  </>
                )}
              </button>
            )}
          </div>

          <p className="text-xs text-center mt-6" style={{ color: 'var(--color-clay)' }}>
            🔒 Your data is processed in real-time and never stored. Complete privacy guaranteed.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
