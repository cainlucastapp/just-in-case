// client/src/pages/HomePage.jsx

import { Link } from 'react-router-dom'
import { Carousel } from '../components/home/Carousel'
import { ReasonRow } from '../components/home/ReasonRow'
import emergency from '../assets/images/emergency.png'
import familyOne from '../assets/images/family-one.png'
import familyThree from '../assets/images/family-three.png'
import familyTwo from '../assets/images/family-two.png'
import figureItOut from '../assets/images/figure-it-out.png'
import fullLogo from '../assets/images/justincase-logo.png'
import movingOn from '../assets/images/moving-on.png'
import travel from '../assets/images/travel.png'
import '../styles/home.css'

const FAMILY_IMAGES = [
  { src: familyOne, alt: 'A family together at home' },
  { src: familyTwo, alt: 'A family together at home' },
  { src: familyThree, alt: 'A family together at home' },
]

const REASONS = [
  {
    image: travel,
    alt: 'A family traveling together',
    heading: 'Even When You’re Away',
    body: 'Whether it’s a weekend trip or an ocean away, your family can find what they need without waiting for you to answer the phone.',
  },
  {
    image: emergency,
    alt: 'A family facing a sudden emergency',
    heading: 'When the Unexpected Happens',
    body: 'A sudden emergency doesn’t wait for a good time. When you can’t be the one who knows where everything is, Just In Case already does.',
  },
  {
    image: figureItOut,
    alt: 'A family trying to figure out household accounts',
    heading: 'No More Guesswork',
    body: 'Bank logins, insurance policies, the Wi-Fi password — nobody should have to piece together your life from scratch.',
  },
  {
    image: movingOn,
    alt: 'A family moving forward together',
    heading: 'One Less Thing to Carry',
    body: 'When your family is already grieving or overwhelmed, the last thing they need is a scavenger hunt. Just In Case means they can focus on each other.',
  },
]

export function HomePage() {
  return (
    <div>
      <section className="hero">
        <Carousel images={FAMILY_IMAGES} className="hero-carousel" />
        <div className="hero-overlay" />

        <div className="container hero-content">
          <h1 className="hero-heading">
            A secure home for everything your family needs to know
          </h1>
          <p className="hero-subtext">
            Keep the household running, no matter what — bills, accounts,
            instructions, all in one place, ready for the people who need it.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-secondary">
              Log In
            </Link>
          </div>
        </div>
      </section>

      <section className="brand-strip">
        <img src={fullLogo} alt="Just In Case — A Secure Household Knowledge Repository" />
      </section>

      <section id="reasons" className="container reasons">
        {REASONS.map((reason, index) => (
          <ReasonRow
            key={reason.heading}
            image={reason.image}
            alt={reason.alt}
            heading={reason.heading}
            body={reason.body}
            reverse={index % 2 === 1}
          />
        ))}
      </section>
    </div>
  )
}
