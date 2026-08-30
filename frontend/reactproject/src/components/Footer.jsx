import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer id="contact" className="bg-haze-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <div>
          <p className="font-display text-xl font-semibold text-forest-700">NourishConnect</p>
          <p className="mt-2 max-w-sm text-sm text-ink/60">
            © 2024 NourishConnect. Share what you have. Help someone today.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-ink/70">
          <Link to="/privacy-policy" className="hover:text-forest-700">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-forest-700">Terms of Service</Link>
          <Link to="/faq" className="hover:text-forest-700">FAQ</Link>
          <Link to="/partner-with-us" className="hover:text-forest-700">Partner With Us</Link>
        </div>
      </div>
    </footer>
  )
}
