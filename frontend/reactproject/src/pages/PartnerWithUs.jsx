import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const partners = [
  {
    title: 'Shelters & receiving homes',
    body: "If you run a shelter, pantry, or transitional home and could use a steady stream of donated food, we'd like to hear about your capacity — how much you can store, what you're set up to serve, and how many people you support.",
  },
  {
    title: 'Restaurants & grocers',
    body: "Unsold prepared meals and surplus stock at the end of the day don't have to go in the bin. We work with kitchens and grocers who'd rather see that food fed to someone than thrown out.",
  },
  {
    title: 'Corporate & community groups',
    body: 'Offices, schools, and community groups often have the numbers to make a real dent — a coordinated food drive through NourishConnect turns a one-off effort into an ongoing donation pipeline.',
  },
  {
    title: 'Delivery volunteers',
    body: "Not everyone has time to donate food, but plenty of people have a car and a free hour. If you'd like to help move donations from doorstep to shelter, let us know your area and availability.",
  },
]

export default function PartnerWithUs() {
  const [form, setForm] = useState({ name: '', organization: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-haze-50">
      <Navbar />

      <section className="relative overflow-hidden border-b border-forest-100">
        <div className="absolute inset-0 bg-grain [background-size:18px_18px] opacity-40" />
        <div className="relative mx-auto max-w-4xl px-6 py-16 lg:px-10 lg:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-forest-100 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-forest-700">
            Partner with us
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-forest-800 sm:text-5xl">
            Bring your kitchen, shelter, or team into the network.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink/70">
            NourishConnect grows one relationship at a time — a restaurant
            here, a shelter there, a workplace food drive somewhere else.
            Tell us where you fit in and we'll take it from there.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-6 md:grid-cols-2">
          {partners.map((p) => (
            <div key={p.title} className="rounded-3xl border border-forest-100 bg-white p-8 shadow-card">
              <h3 className="font-display text-lg font-semibold text-forest-800">{p.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/70">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24 lg:px-10">
        <div className="rounded-[2rem] border border-forest-100 bg-white p-8 shadow-card sm:p-12">
          <h2 className="font-display text-2xl font-semibold text-forest-800">
            Tell us about you
          </h2>
          <p className="mt-2 text-sm text-ink/60">
            A couple of lines is plenty to get started — we'll follow up by
            email.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-2xl bg-forest-50 p-6 text-forest-800">
              <p className="font-semibold">Thanks — that's in our inbox.</p>
              <p className="mt-1 text-sm text-forest-700/80">
                We read every message ourselves and usually get back within a
                couple of days.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-ink/70">Your name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-forest-100 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
                    placeholder="Jordan Lee"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink/70">Organization (if any)</label>
                  <input
                    name="organization"
                    value={form.organization}
                    onChange={handleChange}
                    className="mt-1.5 w-full rounded-xl border border-forest-100 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
                    placeholder="Maple Street Pantry"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-ink/70">Email</label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1.5 w-full rounded-xl border border-forest-100 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-ink/70">How would you like to partner?</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1.5 w-full rounded-xl border border-forest-100 px-4 py-2.5 text-sm outline-none focus:border-forest-400"
                  placeholder="We run a shelter that serves about 60 people a week and could use..."
                />
              </div>
              <button
                onClick={handleSubmit}
                className="rounded-full bg-clay-600 px-7 py-3 text-sm font-semibold text-white shadow-soft transition hover:bg-clay-700"
              >
                Send it over
              </button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
