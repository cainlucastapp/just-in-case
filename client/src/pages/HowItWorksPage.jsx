// client/src/pages/HowItWorksPage.jsx

import { Bookmark, CirclePlus, ShieldCheck } from 'lucide-react'
import howItWorksImage from '../assets/images/how-it-works.webp'
import '../styles/how-it-works.css'

const FEATURES = [
  {
    heading: 'Add what matters most',
    body: 'From insurance details and utility accounts to emergency contacts and home information.',
    icon: CirclePlus,
  },
  {
    heading: 'Keep everything clear',
    body: 'Each item is saved as its own entry, so information is easy to find and manage.',
    icon: Bookmark,
  },
  {
    heading: 'Stay ready',
    body: 'When the time comes, the right details are already in place for the people who need them.',
    icon: ShieldCheck,
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
                <feature.icon />
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
