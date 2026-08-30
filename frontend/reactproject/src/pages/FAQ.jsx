import { useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

const faqs = [
  {
    q: 'What kind of food can I donate?',
    a: "Pretty much anything that's still genuinely good to eat: unopened pantry staples, fresh produce, bread, dairy that's within date, and home-cooked or restaurant meals that have been stored properly. If you wouldn't serve it to your own family, don't list it — receiving homes are trusting your word on condition and freshness.",
  },
  {
    q: 'How soon does a donation need to be picked up?',
    a: "That depends on what it is. When you list a donation, you'll set how soon it needs to move — same-day for anything perishable like dairy or prepared meals, and a bit more flexibility for canned or dry goods. The matching system prioritizes food that's closer to spoiling.",
  },
  {
    q: "Who decides where my donation goes?",
    a: "NourishConnect matches your donation to a nearby receiving home based on what they've told us they need and how soon your food needs to move. You'll see exactly which home it went to on your dashboard, so there's no mystery about where it ended up.",
  },
  {
    q: 'Do I need to drop food off myself?',
    a: "Usually, yes — most donations are a simple drop-off at the receiving home, and you'll get the address once you're matched. Some regions have volunteer pickup available; if that's set up near you, you'll see the option when you list your donation.",
  },
  {
    q: 'Is there a minimum amount I need to donate?',
    a: "No minimum. A single bag of groceries is just as welcome as a full box — small donations add up, and plenty of our regular donors give small amounts often rather than one big drop.",
  },
  {
    q: 'How do I sign up as a receiving home?',
    a: 'Reach out through the Partner With Us page. We\'ll ask a few questions about your capacity — how much food you can store, what kind of meals you serve, and how many people you support — so we can match donations sensibly instead of overwhelming you.',
  },
  {
    q: 'Can I see the impact my donations have made?',
    a: "Yes. Your donor dashboard tracks your donation history, roughly how many meals your donations have contributed to, and which homes received them. It's meant to actually show you the difference, not just log a transaction.",
  },
  {
    q: 'What if a donation goes wrong — food is missing or unsafe?',
    a: "Tell us. Whether you're the donor or the receiving home, flag it through your dashboard or contact us directly. We use that feedback to keep listings honest and step in when a handoff doesn't go as planned.",
  },
  {
    q: 'Is there a cost to use NourishConnect?',
    a: "No. It's free for donors and for receiving homes. We're here to move food to people who need it, not to charge anyone along the way.",
  },
  {
    q: 'What if I need to cancel a donation I already listed?',
    a: "You can cancel or edit a listing from your dashboard any time before it's picked up. If a receiving home has already been matched, it's a good idea to let them know directly too, since they may be planning around it.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="min-h-screen bg-haze-50">
      <Navbar />

      <section className="relative overflow-hidden border-b border-forest-100">
        <div className="absolute inset-0 bg-grain [background-size:18px_18px] opacity-40" />
        <div className="relative mx-auto max-w-4xl px-6 py-16 lg:px-10 lg:py-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-forest-100 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-forest-700">
            FAQ
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-forest-800 sm:text-5xl">
            Questions people actually ask us
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-ink/70">
            If your question isn't here, the Partner With Us page will get you
            to a real person.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 lg:px-10">
        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-forest-100 bg-white shadow-card"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base font-semibold text-forest-800">
                    {item.q}
                  </span>
                  <span
                    className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border border-forest-100 text-forest-700 transition-transform ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm leading-relaxed text-ink/70">
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <Footer />
    </div>
  )
}
