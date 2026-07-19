import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Sun, Moon, Menu, X } from 'lucide-react'
import { useState } from 'react'

/**
 * Responsive Navbar with dark mode toggle, mobile menu, and brand identity.
 */
export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/assess', label: 'Assessment' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav
      className="sticky top-0 z-50 backdrop-blur-xl border-b"
      style={{
        backgroundColor: darkMode ? 'rgba(42,37,32,0.85)' : 'rgba(240,237,229,0.85)',
        borderColor: darkMode ? 'rgba(61,53,41,0.5)' : 'rgba(217,203,170,0.5)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="Serenity AI Home">
            <motion.div
              whileHover={{ rotate: 15 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Brain
                size={28}
                className="transition-colors duration-300"
                style={{ color: 'var(--color-brand)' }}
              />
            </motion.div>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ color: 'var(--color-espresso)' }}
            >
              Serenity<span style={{ color: 'var(--color-brand)' }}> AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-3 py-2 text-sm font-medium transition-colors duration-300"
                style={{
                  color: isActive(link.to) ? 'var(--color-brand)' : (darkMode ? 'var(--color-sand)' : 'var(--color-espresso)'),
                }}
              >
                {link.label}
                {isActive(link.to) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ backgroundColor: 'var(--color-brand)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Dark mode toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full transition-colors duration-300 cursor-pointer"
              style={{
                backgroundColor: darkMode ? 'var(--color-sand-dark)' : 'var(--color-sand)',
                color: darkMode ? 'var(--color-sand)' : 'var(--color-espresso)',
              }}
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <AnimatePresence mode="wait">
                {darkMode ? (
                  <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Sun size={18} />
                  </motion.div>
                ) : (
                  <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Moon size={18} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full cursor-pointer"
              style={{
                backgroundColor: darkMode ? 'var(--color-sand-dark)' : 'var(--color-sand)',
                color: darkMode ? 'var(--color-sand)' : 'var(--color-espresso)',
              }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 cursor-pointer"
              style={{ color: 'var(--color-espresso)' }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t"
            style={{ borderColor: darkMode ? 'rgba(61,53,41,0.5)' : 'rgba(217,203,170,0.5)' }}
          >
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  style={{
                    color: isActive(link.to) ? 'var(--color-cream)' : (darkMode ? 'var(--color-sand)' : 'var(--color-espresso)'),
                    backgroundColor: isActive(link.to) ? 'var(--color-brand)' : 'transparent',
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
