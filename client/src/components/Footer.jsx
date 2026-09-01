// client/src/components/Footer.jsx

import '../styles/footer.css'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <p>© {year} Just In Case. All rights reserved.</p>
      </div>
    </footer>
  )
}
