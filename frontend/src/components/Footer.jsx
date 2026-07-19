import { Heart, Brain } from 'lucide-react'

/**
 * Footer with disclaimer, branding, and links.
 * Disclaimer is always visible per requirements.
 */
export default function Footer() {
  return (
    <footer
      className="border-t mt-auto"
      style={{
        borderColor: 'var(--color-sand)',
        backgroundColor: 'var(--color-cream)',
      }}
    >
      {/* Disclaimer Banner */}
      <div
        className="py-3 px-4 text-center text-xs font-medium"
        style={{
          backgroundColor: 'var(--color-sand)',
          color: 'var(--color-espresso)',
        }}
      >
        ⚕️ This application provides emotional wellness insights using AI. It is not a medical
        diagnosis and should not replace consultation with a licensed mental health professional.
      </div>

      {/* Footer Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Brain size={20} style={{ color: 'var(--color-brand)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--color-espresso)' }}>
              Serenity AI
            </span>
          </div>

          {/* Tagline */}
          <p className="text-xs text-center" style={{ color: 'var(--color-clay)' }}>
            Built with{' '}
            <Heart size={12} className="inline" style={{ color: 'var(--color-brand)' }} />{' '}
            for emotional wellness awareness
          </p>

          {/* Copyright */}
          <p className="text-xs" style={{ color: 'var(--color-clay)' }}>
            © {new Date().getFullYear()} Serenity AI. All rights reserved.
          </p>
        </div>

        {/* Emergency Info — always visible */}
        <div className="mt-6 pt-4 border-t text-center" style={{ borderColor: 'var(--color-sand)' }}>
          <p className="text-xs" style={{ color: 'var(--color-clay)' }}>
            <strong>In a crisis?</strong> National Suicide Prevention Lifeline:{' '}
            <a href="tel:988" className="font-bold underline" style={{ color: 'var(--color-brand)' }}>
              988
            </a>{' '}
            | iCall:{' '}
            <a href="tel:9152987821" className="font-bold underline" style={{ color: 'var(--color-brand)' }}>
              9152987821
            </a>{' '}
            | Vandrevala Foundation:{' '}
            <a href="tel:18602662345" className="font-bold underline" style={{ color: 'var(--color-brand)' }}>
              1860-2662-345
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
