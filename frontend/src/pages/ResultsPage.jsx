import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart,
  Gauge,
  Flame,
  Lightbulb,
  Stethoscope,
  FileText,
  AlertTriangle,
  Phone,
  ArrowLeft,
  Download,
  Copy,
  CheckCircle2,
  Activity,
  RefreshCw,
} from 'lucide-react'
import { useState } from 'react'
import html2pdf from 'html2pdf.js'

/**
 * Results Page — Displays structured wellness assessment from AI.
 * Renders crisis alert, emotional state, stress/burnout bars, indicators,
 * suggestions, professional help recommendation, and summary.
 */

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
}

/**
 * Map emotional state to appropriate emoji
 */
function getMoodEmoji(state) {
  const lower = (state || '').toLowerCase()
  if (lower.includes('happy') || lower.includes('joy') || lower.includes('positive') || lower.includes('content'))
    return '😊'
  if (lower.includes('sad') || lower.includes('depress') || lower.includes('down') || lower.includes('low'))
    return '😔'
  if (lower.includes('anxious') || lower.includes('anxiety') || lower.includes('worry') || lower.includes('nervous'))
    return '😰'
  if (lower.includes('anger') || lower.includes('angry') || lower.includes('frustrated') || lower.includes('irritat'))
    return '😤'
  if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('pressure'))
    return '😫'
  if (lower.includes('calm') || lower.includes('peace') || lower.includes('relax'))
    return '😌'
  if (lower.includes('exhaust') || lower.includes('tired') || lower.includes('fatigue') || lower.includes('burnout'))
    return '😴'
  if (lower.includes('fear') || lower.includes('scared') || lower.includes('afraid'))
    return '😨'
  if (lower.includes('confused') || lower.includes('uncertain') || lower.includes('lost'))
    return '🤔'
  if (lower.includes('hopeful') || lower.includes('optimistic'))
    return '🌟'
  return '🧠'
}

/**
 * Get severity label and color from a 0-100 value
 */
function getSeverity(value) {
  if (value <= 25) return { label: 'Low', color: '#A67C5D' }
  if (value <= 50) return { label: 'Moderate', color: '#8B5B29' }
  if (value <= 75) return { label: 'High', color: '#7A4820' }
  return { label: 'Severe', color: '#6B4F3A' }
}

/**
 * Progress Bar Component
 */
function ProgressBar({ value, label }) {
  const severity = getSeverity(value)
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium" style={{ color: 'var(--color-espresso)' }}>{label}</span>
        <span className="text-sm font-bold" style={{ color: severity.color }}>
          {value}% — {severity.label}
        </span>
      </div>
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
    </div>
  )
}

/**
 * Result Card Component
 */
function ResultCard({ icon: Icon, title, children, index, accent = false }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      custom={index}
      className="glass-card p-6"
      style={accent ? { borderLeft: '4px solid var(--color-brand)' } : {}}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: 'var(--color-brand)', color: 'var(--color-cream)' }}
        >
          <Icon size={20} />
        </div>
        <h3 className="text-base font-bold" style={{ color: 'var(--color-espresso)' }}>
          {title}
        </h3>
      </div>
      {children}
    </motion.div>
  )
}

export default function ResultsPage({ results }) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  // Redirect if no results
  if (!results) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <FileText size={48} className="mx-auto mb-4" style={{ color: 'var(--color-clay)' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-espresso)' }}>
            No Assessment Found
          </h2>
          <p className="text-base mb-6" style={{ color: 'var(--color-clay)' }}>
            Please complete an assessment first to see your results.
          </p>
          <Link to="/assess">
            <button className="btn-primary">
              <ArrowLeft size={18} />
              Take Assessment
            </button>
          </Link>
        </motion.div>
      </div>
    )
  }

  const {
    emotional_state,
    stress_level,
    burnout_risk,
    possible_indicators,
    suggestions,
    professional_help,
    summary,
    crisis_flag,
  } = results

  const emoji = getMoodEmoji(emotional_state)

  // Copy results to clipboard
  const handleCopy = async () => {
    const text = `Serenity AI — Wellness Assessment Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Emotional State: ${emotional_state}
Stress Level: ${stress_level}%
Burnout Risk: ${burnout_risk}%
Possible Indicators: ${possible_indicators}

Suggestions:
${suggestions?.map((s, i) => `${i + 1}. ${s}`).join('\n')}

Professional Help: ${professional_help}

Summary: ${summary}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚕️ Disclaimer: This is not a medical diagnosis. Please consult a licensed mental health professional.`

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Download as PDF using html2pdf
  const handleDownload = () => {
    const element = document.getElementById('report-content');
    if (!element) return;
    
    const opt = {
      margin:       0.3,
      filename:     `Serenity_AI_Report_${new Date().toISOString().slice(0, 10)}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, windowWidth: 800 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  }

  return (
    <div className="min-h-[80vh] py-12 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="report-content" className="p-2 -m-2">
        {/* Disclaimer Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl text-center text-sm"
          style={{ backgroundColor: 'var(--color-sand)', color: 'var(--color-espresso)' }}
        >
          ⚕️ This is not a medical diagnosis. These insights are meant for emotional awareness only.
        </motion.div>

        {/* CRISIS ALERT — Shown prominently at top when crisis_flag is true */}
        {crisis_flag && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="crisis-alert mb-8"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle size={28} className="flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold mb-2">
                  You Don't Have to Face This Alone
                </h2>
                <p className="text-sm mb-4 opacity-90">
                  Our analysis detected signs of severe distress. Please reach out to someone who can help.
                  You are not alone, and support is available right now.
                </p>
                <div className="space-y-3">
                  <a
                    href="tel:988"
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors duration-200"
                    style={{ backgroundColor: 'rgba(240,237,229,0.15)' }}
                  >
                    <Phone size={20} />
                    <div>
                      <p className="font-bold text-sm">988 Suicide & Crisis Lifeline</p>
                      <p className="text-xs opacity-80">Call or text 988 — Available 24/7</p>
                    </div>
                  </a>
                  <a
                    href="tel:9152987821"
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors duration-200"
                    style={{ backgroundColor: 'rgba(240,237,229,0.15)' }}
                  >
                    <Phone size={20} />
                    <div>
                      <p className="font-bold text-sm">iCall — 9152987821</p>
                      <p className="text-xs opacity-80">Mon–Sat, 8 AM – 10 PM IST</p>
                    </div>
                  </a>
                  <a
                    href="tel:18602662345"
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors duration-200"
                    style={{ backgroundColor: 'rgba(240,237,229,0.15)' }}
                  >
                    <Phone size={20} />
                    <div>
                      <p className="font-bold text-sm">Vandrevala Foundation — 1860-2662-345</p>
                      <p className="text-xs opacity-80">24/7 multilingual support</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-3">{emoji}</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--color-espresso)' }}>
            Your Wellness Report
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-clay)' }}>
            Generated on {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>

        {/* Result Cards */}
        <div className="space-y-5">
          {/* Emotional State */}
          <ResultCard icon={Heart} title="Emotional State" index={0} accent>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-espresso)', opacity: 0.9 }}>
              {emotional_state}
            </p>
          </ResultCard>

          {/* Stress & Burnout */}
          <ResultCard icon={Gauge} title="Stress & Burnout Levels" index={1}>
            <div className="space-y-5">
              <ProgressBar value={stress_level} label="Stress Level" />
              <ProgressBar value={burnout_risk} label="Burnout Risk" />
            </div>
          </ResultCard>

          {/* Possible Indicators */}
          <ResultCard icon={Activity} title="Possible Emotional Indicators" index={2}>
            <div className="flex flex-wrap gap-2">
              {(possible_indicators || '').split(',').map((indicator, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: 'var(--color-sand)',
                    color: 'var(--color-brand)',
                    border: '1px solid var(--color-clay)',
                  }}
                >
                  {indicator.trim()}
                </span>
              ))}
            </div>
          </ResultCard>

          {/* Personalized Suggestions */}
          <ResultCard icon={Lightbulb} title="Personalized Suggestions" index={3} accent>
            <ul className="space-y-3">
              {suggestions?.map((suggestion, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle2
                    size={18}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: 'var(--color-brand)' }}
                  />
                  <span className="text-sm leading-relaxed" style={{ color: 'var(--color-espresso)', opacity: 0.9 }}>
                    {suggestion}
                  </span>
                </motion.li>
              ))}
            </ul>
          </ResultCard>

          {/* Professional Help */}
          <ResultCard icon={Stethoscope} title="Professional Help Recommendation" index={4}>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-espresso)', opacity: 0.9 }}>
              {professional_help}
            </p>
          </ResultCard>

          {/* Overall Summary */}
          <ResultCard icon={FileText} title="Overall Wellness Summary" index={5} accent>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-espresso)', opacity: 0.9 }}>
              {summary}
            </p>
          </ResultCard>
        </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleCopy}
            className="btn-secondary w-full sm:w-auto justify-center"
            id="copy-results"
          >
            {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
            {copied ? 'Copied!' : 'Copy Report'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDownload}
            className="btn-secondary w-full sm:w-auto justify-center"
            id="download-results"
          >
            <Download size={18} />
            Download Report
          </motion.button>

          <Link to="/assess" className="w-full sm:w-auto">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary w-full justify-center"
              id="new-assessment"
            >
              <RefreshCw size={18} />
              New Assessment
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
