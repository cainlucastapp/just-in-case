// client/src/pages/HowItWorksPage.jsx

import howItWorksImage from '../assets/images/how-it-works.png'
import '../styles/how-it-works.css'

const FEATURES = [
  {
    heading: 'Add what matters most',
    body: 'From insurance details and utility accounts to emergency contacts and home information.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v8M8 12h8" />
      </>
    ),
  },
  {
    heading: 'Keep everything clear',
    body: 'Each item is saved as its own entry, so information is easy to find and manage.',
    icon: (
      <>
        <path d="M9 3h6a2 2 0 0 1 2 2v14l-5-3-5 3V5a2 2 0 0 1 2-2Z" />
      </>
    ),
  },
  {
    heading: 'Stay ready',
    body: 'When the time comes, the right details are already in place for the people who need them.',
    icon: (
      <>
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
  },
]

export function HowItWorksPage() {
  return (
    <div className="container how-it-works-page">
      <div className="how-it-works-intro">
        <h1>How It Works</h1>
        <img
          src={howItWorksImage}
          alt="Overview of Just In Case: cases organized by category, each holding individual items"
          className="how-it-works-image"
        />
      </div>

      <div className="how-it-works-copy">
        <p className="lead">
          Items are the individual pieces of information that keep a household running.
          Add logins, account numbers, contact details, payment information, or
          step-by-step instructions, then update them anytime as life changes.
        </p>

        <div className="how-it-works-features">
          {FEATURES.map((feature) => (
            <div key={feature.heading} className="how-it-works-feature">
              <div className="how-it-works-feature-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {feature.icon}
                </svg>
              </div>
              <h3>{feature.heading}</h3>
              <p>{feature.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
