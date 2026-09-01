// client/src/pages/HomePage.jsx

import { Link } from 'react-router-dom'
import { Carousel } from '../components/home/Carousel'
import familyOne from '../assets/images/family-one.png'
import familyThree from '../assets/images/family-three.png'
import familyTwo from '../assets/images/family-two.png'
import fullLogo from '../assets/images/justincase-logo.png'
import '../styles/home.css'

const FAMILY_IMAGES = [
  { src: familyOne, alt: 'A family together at home' },
  { src: familyTwo, alt: 'A family together at home' },
  { src: familyThree, alt: 'A family together at home' },
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

      {/* next section: still being designed */}
    </div>
  )
}
