import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain,
  MessageSquareText,
  Camera,
  BarChart3,
  FileText,
  ShieldCheck,
  Sparkles,
  Heart,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Users,
} from 'lucide-react'

/**
 * Landing Page — Hero, Features, How It Works, Why Serenity AI, CTA
 */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
}

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    desc: 'Advanced multimodal AI analyzes both your words and facial expressions for a comprehensive emotional assessment.',
  },
  {
    icon: BarChart3,
    title: 'Structured Reports',
    desc: 'Receive clear, organized wellness reports with stress levels, burnout risk, and actionable insights — not generic chatbot replies.',
  },
  {
    icon: ShieldCheck,
    title: 'Private & Safe',
    desc: 'No sign-ups, no data storage, no tracking. Your emotional data stays with you and is never saved.',
  },
  {
    icon: AlertTriangle,
    title: 'Crisis Detection',
    desc: 'Built-in crisis detection surfaces emergency helpline information immediately when severe distress is identified.',
  },
  {
    icon: Sparkles,
    title: 'Personalized Suggestions',
    desc: 'Get tailored coping strategies based on your specific situation, not one-size-fits-all advice.',
  },
  {
    icon: Heart,
    title: 'Empathetic Design',
    desc: 'Warm, human-centered interface designed to feel grounding and supportive, not clinical or sterile.',
  },
]

const steps = [
  {
    icon: MessageSquareText,
    title: 'Describe',
    desc: 'Share how you\'re feeling in your own words — as much or as little as you\'d like.',
    color: 'var(--color-clay)',
  },
  {
    icon: Camera,
    title: 'Selfie (Optional)',
    desc: 'Upload a selfie for additional emotional context through facial expression analysis.',
    color: 'var(--color-brand)',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    desc: 'Our AI processes your inputs to understand your emotional state using multimodal analysis.',
    color: 'var(--color-espresso)',
  },
  {
    icon: FileText,
    title: 'Wellness Report',
    desc: 'Receive a structured assessment with stress levels, coping strategies, and professional recommendations.',
    color: 'var(--color-brand)',
  },
]

const whyReasons = [
  'Not a chatbot — produces structured, actionable wellness reports',
  'Combines text and facial analysis for deeper understanding',
  'No login, no subscriptions, no data stored',
  'Crisis-aware with emergency response integration',
  'Personalized insights, not generic motivational quotes',
]

export default function LandingPage() {
  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
        {/* Background decorative elements */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(139,91,41,0.06) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(166,124,93,0.06) 0%, transparent 50%)',
          }}
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                backgroundColor: 'var(--color-sand)',
                color: 'var(--color-brand)',
              }}
            >
              <Sparkles size={16} />
              AI-Powered Emotional Wellness
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6"
              style={{ color: 'var(--color-espresso)' }}
            >
              Understand your emotions{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(135deg, var(--color-brand), var(--color-clay))',
                }}
              >
                before they overwhelm you
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-lg sm:text-xl mb-4 leading-relaxed"
              style={{ color: 'var(--color-clay)' }}
            >
              A private first step when therapy feels out of reach — not a replacement for it.
            </motion.p>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="text-sm mb-10 max-w-xl mx-auto"
              style={{ color: 'var(--color-espresso)', opacity: 0.7 }}
            >
              Describe how you feel, optionally share a selfie, and receive a structured AI-powered
              wellness report with stress analysis, burnout risk assessment, and personalized coping strategies.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/assess">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 40px rgba(139,91,41,0.25)' }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary text-lg px-8 py-4 rounded-2xl"
                  id="hero-start-assessment"
                >
                  Start Assessment
                  <ArrowRight size={20} />
                </motion.button>
              </Link>
              <a href="#how-it-works">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary text-lg px-8 py-4 rounded-2xl"
                >
                  How It Works
                </motion.button>
              </a>
            </motion.div>
          </div>
        </div>

        {/* Decorative floating shapes */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 rounded-full opacity-10"
          style={{ backgroundColor: 'var(--color-brand)' }}
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-32 h-32 rounded-full opacity-5"
          style={{ backgroundColor: 'var(--color-clay)' }}
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </section>

      {/* ========== FEATURES ========== */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-sand)', opacity: 0.95 }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--color-espresso)' }}>
              Why Serenity AI?
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-espresso)', opacity: 0.8 }}>
              Most wellness apps give you motivational quotes or generic chatbot responses.
              We give you structured, AI-powered emotional insights.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass-card p-6 sm:p-8"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: 'var(--color-brand)', color: 'var(--color-cream)' }}
                >
                  <feature.icon size={24} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-espresso)' }}>
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-espresso)', opacity: 0.8 }}>
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--color-espresso)' }}>
              How It Works
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-clay)' }}>
              Four simple steps to understand your emotional well-being
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <div className="relative inline-block mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                    style={{ backgroundColor: step.color, color: 'var(--color-cream)' }}
                  >
                    <step.icon size={28} />
                  </motion.div>
                  <span
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: 'var(--color-cream)', color: step.color, border: `2px solid ${step.color}` }}
                  >
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-espresso)' }}>
                  {step.title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-clay)' }}>
                  {step.desc}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2">
                    <ArrowRight size={20} style={{ color: 'var(--color-sand)' }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== VS COMPARISON ========== */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-sand)', opacity: 0.95 }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--color-espresso)' }}>
              Not Just Another Chatbot
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-espresso)', opacity: 0.8 }}>
              Here's what makes Serenity AI different
            </p>
          </motion.div>

          <div className="space-y-4">
            {whyReasons.map((reason, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="glass-card p-5 flex items-start gap-4"
              >
                <CheckCircle2
                  size={22}
                  className="flex-shrink-0 mt-0.5"
                  style={{ color: 'var(--color-brand)' }}
                />
                <span className="text-base font-medium" style={{ color: 'var(--color-espresso)' }}>
                  {reason}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== BOTTOM CTA ========== */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Users size={40} className="mx-auto mb-6" style={{ color: 'var(--color-brand)' }} />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--color-espresso)' }}>
              Take the First Step
            </h2>
            <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--color-clay)' }}>
              Your emotional well-being matters. Start your free, private wellness assessment today.
            </p>
            <Link to="/assess">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 8px 40px rgba(139,91,41,0.25)' }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary text-lg px-10 py-4 rounded-2xl"
                id="bottom-start-assessment"
              >
                Start Your Assessment
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
