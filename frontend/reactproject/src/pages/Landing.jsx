import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
  useInView,
  animate,
  AnimatePresence,
} from 'framer-motion'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

/* ─────────────────────────────────────────
   Constants
───────────────────────────────────────── */
const ease = [0.16, 1, 0.3, 1]

const STATS = [
  { value: 1250, suffix: '+', label: 'Donations Shared',   icon: '📦' },
  { value: 8400, suffix: '+', label: 'Meals Reached',      icon: '🍽️' },
  { value: 320,  suffix: '+', label: 'Active Donors',      icon: '🤝' },
  { value: 35,   suffix: '+', label: 'Receiving Homes',    icon: '🏠' },
]

const STEPS = [
  { num: '01', icon: '📝', title: 'Log what you have',      body: "Add the food type, quantity and when it's ready. Cooked meals, produce, pantry staples — all welcome." },
  { num: '02', icon: '🏘️', title: 'Choose a home',          body: 'Browse registered homes nearby and pick the one that fits your donation best.' },
  { num: '03', icon: '🔔', title: 'Stay updated',           body: 'Your dashboard tracks every step — accepted, picked up, delivered.' },
  { num: '04', icon: '✅', title: 'Food reaches people',    body: 'The home receives it, marks it complete. You see the real impact of what you shared.' },
]

const HOMES = [
  { name: 'Raja Illam',           loc: 'Velachery, Chennai',  type: "Children's Home",   count: 45,  needs: ['Rice','Vegetables','Cooked Meals'] },
  { name: 'Anbu Valar Aram',      loc: 'Adyar, Chennai',      type: 'Elderly Care Home', count: 120, needs: ['Cooked Meals','Fruits'] },
  { name: 'Arivoli Pura Parivar', loc: 'Tambaram, Chennai',   type: 'Community Kitchen', count: 65,  needs: ['Rice','Groceries'] },
  { name: 'Parthasarathy Ashram', loc: 'Mylapore, Chennai',   type: 'Orphanage',         count: 30,  needs: ['Fruits','Bakery Items'] },
]

const CATEGORIES = [
  { emoji: '🍲', label: 'Cooked Meals',    col: '#c2703a', bg: 'rgba(194,112,58,0.12)' },
  { emoji: '🍚', label: 'Rice & Grains',   col: '#2d6a4f', bg: 'rgba(45,106,79,0.12)'  },
  { emoji: '🥦', label: 'Vegetables',      col: '#1b4332', bg: 'rgba(27,67,50,0.10)'   },
  { emoji: '🍎', label: 'Fruits',          col: '#c2703a', bg: 'rgba(194,112,58,0.12)' },
  { emoji: '🛒', label: 'Groceries',       col: '#2d6a4f', bg: 'rgba(45,106,79,0.12)'  },
  { emoji: '🍞', label: 'Bakery Items',    col: '#9c5729', bg: 'rgba(156,87,41,0.12)'  },
  { emoji: '📦', label: 'Packaged Food',   col: '#1b4332', bg: 'rgba(27,67,50,0.10)'   },
]

const FEED = [
  { donor: 'Subash Kumar',  food: 'Biryani',      qty: '50 meals', home: 'Raja Illam',           date: 'Just now',    status: 'delivered' },
  { donor: 'Priya Sharma',  food: 'Basmati Rice', qty: '25 kg',    home: 'Arivoli Pura Parivar', date: '1 hr ago',    status: 'delivered' },
  { donor: 'Rajesh Menon',  food: 'Vegetables',   qty: '15 kg',    home: 'Anbu Valar Aram',      date: '3 hrs ago',   status: 'picked-up' },
  { donor: 'Anita Gupta',   food: 'Mixed Fruits', qty: '20 kg',    home: 'Parthasarathy Ashram', date: 'Yesterday',   status: 'accepted'  },
  { donor: 'Vikram Reddy',  food: 'Bread & Cake', qty: '30 pcs',   home: 'Raja Illam',           date: '2 days ago',  status: 'delivered' },
]

const STATUS = {
  delivered:  { bg: '#dcebe1', col: '#1b4332', label: 'Delivered'  },
  'picked-up':{ bg: '#fbe9d7', col: '#9c5729', label: 'Picked Up'  },
  accepted:   { bg: '#e0edff', col: '#1a4a80', label: 'Accepted'   },
}

/* ─────────────────────────────────────────
   Scroll-trigger helper
───────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────
   Animated counter
───────────────────────────────────────── */
function Counter({ value, suffix }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    if (!inView) return
    const ctrl = animate(0, value, {
      duration: 1.8,
      ease,
      onUpdate: v => setDisplay(Math.round(v)),
    })
    return () => ctrl.stop()
  }, [inView, value])
  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>
}

/* ─────────────────────────────────────────
   Live feed ticker
───────────────────────────────────────── */
function LiveTicker() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % FEED.length), 3200)
    return () => clearInterval(t)
  }, [])
  const row = FEED[idx]
  const s = STATUS[row.status]
  return (
    <div className="flex items-center gap-3 text-sm overflow-hidden min-w-0">
      <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-ink/70 min-w-0"
        >
          <strong className="text-ink">{row.donor}</strong>
          <span>donated</span>
          <span className="text-forest-700 font-semibold">{row.qty} {row.food}</span>
          <span className="text-ink/40">→</span>
          <span className="text-clay-600 font-medium truncate">{row.home}</span>
          <span
            className="rounded-full px-2 py-0.5 text-xs font-semibold"
            style={{ background: s.bg, color: s.col }}
          >{s.label}</span>
          <span className="text-ink/35 text-xs">{row.date}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────
   Journey progress
───────────────────────────────────────── */
function JourneyAnim() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % 4), 1700)
    return () => clearInterval(t)
  }, [])
  const nodes = [
    { icon: '📝', label: 'Logged'   },
    { icon: '✅', label: 'Accepted' },
    { icon: '🚗', label: 'Picked'   },
    { icon: '🏠', label: 'Delivered'},
  ]
  return (
    <div className="flex items-end gap-1">
      {nodes.map((n, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
          <div className="relative w-full flex items-center">
            {i > 0 && (
              <div className="absolute right-1/2 top-1/2 h-0.5 w-full -translate-y-1/2"
                style={{
                  background: i <= step
                    ? 'linear-gradient(90deg,#2d6a4f,#c2703a)'
                    : 'rgba(255,255,255,0.15)',
                  transition: 'background 0.5s',
                }}
              />
            )}
            <motion.div
              className="relative z-10 mx-auto flex h-9 w-9 items-center justify-center rounded-full text-base"
              animate={{
                background: i === step ? '#c2703a' : i < step ? '#2d6a4f' : 'rgba(255,255,255,0.12)',
                scale: i === step ? 1.25 : 1,
                boxShadow: i === step ? '0 0 0 6px rgba(194,112,58,0.25)' : 'none',
              }}
              transition={{ duration: 0.45 }}
            >{n.icon}</motion.div>
          </div>
          <span className="text-center text-[10px] font-medium"
            style={{ color: i <= step ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'color 0.4s' }}>
            {n.label}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════════════════ */
function Hero() {
  const cardRef = useRef(null)
  const mvX = useMotionValue(0)
  const mvY = useMotionValue(0)
  const rotX = useSpring(useTransform(mvY, [-0.5, 0.5], [8, -8]), { stiffness: 140, damping: 18 })
  const rotY = useSpring(useTransform(mvX, [-0.5, 0.5], [-8, 8]), { stiffness: 140, damping: 18 })

  function onMove(e) {
    const r = cardRef.current.getBoundingClientRect()
    mvX.set((e.clientX - r.left) / r.width - 0.5)
    mvY.set((e.clientY - r.top) / r.height - 0.5)
  }

  /* Giant word letters for Cookie-style reveal */
  const word = 'NOURISH'
  const letters = word.split('')

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0f1e16]">

      {/* ── FULL BG: Indian food spread image ── */}
      <div className="absolute inset-0">
        <img
          src="/images/indian-food-spread.jpeg"
          alt=""
          className="h-full w-full object-cover object-left"
          style={{ opacity: 0.28 }}
        />
        {/* Rich dark overlay */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(110deg, rgba(12,24,16,0.97) 0%, rgba(12,24,16,0.88) 45%, rgba(12,24,16,0.55) 100%)' }}
        />
        {/* Subtle grain */}
        <div className="absolute inset-0 bg-grain [background-size:18px_18px] opacity-20" />
      </div>

      {/* ── Ambient blobs ── */}
      <div className="blob-a pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(circle, rgba(45,106,79,0.35), transparent 70%)' }} />
      <div className="blob-b pointer-events-none absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(194,112,58,0.28), transparent 70%)' }} />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 lg:px-10 lg:pt-20">

        {/* ── COOKIE-STYLE: Giant word behind content ── */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-8 flex justify-center overflow-hidden select-none"
        >
          {letters.map((l, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.05 + i * 0.07, ease }}
              className="font-display font-black leading-none tracking-tighter"
              style={{
                fontSize: 'clamp(80px, 12vw, 160px)',
                color: 'transparent',
                WebkitTextStroke: '1.5px rgba(255,255,255,0.06)',
                letterSpacing: '-0.03em',
              }}
            >{l}</motion.span>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="relative grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:gap-12 pt-24 lg:pt-20">

          {/* LEFT: Copy */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.11, delayChildren: 0.2 } } }}
          >
            {/* Badge */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.6, ease }}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/8 px-4 py-1.5 backdrop-blur-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="pulse-ring absolute inline-flex h-2 w-2 text-emerald-400" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-white/70">
                Community Food Network · Chennai
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8, ease }}
              className="mt-6 font-display font-semibold leading-[1.05] text-white"
              style={{ fontSize: 'clamp(38px, 5.5vw, 68px)' }}
            >
              Good food deserves<br />
              a{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-clay-300">better destination.</span>
                <motion.span
                  aria-hidden
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.9, ease }}
                  className="absolute inset-x-0 bottom-1 z-0 h-2.5 origin-left rounded-full bg-clay-600/50"
                />
              </span>
            </motion.h1>

            {/* Sub */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease }}
              className="mt-6 max-w-lg text-lg leading-relaxed text-white/60"
            >
              Have extra food? Share it with a home that needs it.
              Every donation helps put a fresh meal on someone's table —
              tracked from your kitchen to theirs.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.7, ease }}
              className="mt-9 flex flex-wrap gap-4"
            >
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/signup"
                  className="btn-sheen inline-flex items-center gap-2.5 rounded-full bg-clay-600 px-8 py-4 text-base font-semibold text-white shadow-soft transition-colors hover:bg-clay-700"
                >
                  🍱 Donate Food
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-base font-semibold text-white/80 backdrop-blur-sm transition hover:border-white/40 hover:bg-white/8"
                >
                  See How It Works ↓
                </a>
              </motion.div>
            </motion.div>

            {/* Live ticker */}
            <motion.div
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-10 rounded-2xl border border-white/8 bg-white/5 px-5 py-3.5 backdrop-blur-sm"
            >
              <LiveTicker />
            </motion.div>
          </motion.div>

          {/* RIGHT: 3-D model */}
          <motion.div
            className="relative [perspective:1400px]"
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.3, ease }}
          >
            {/* Glow behind card */}
            <div
              className="pointer-events-none absolute inset-0 rounded-[2.5rem] blur-3xl"
              style={{ background: 'radial-gradient(ellipse, rgba(45,106,79,0.45), transparent 70%)' }}
            />

            {/* 3-D stage: every child sits at its own Z depth and tilts together */}
            <motion.div
              ref={cardRef}
              onMouseMove={onMove}
              onMouseLeave={() => { mvX.set(0); mvY.set(0) }}
              style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
              className="relative w-full"
            >
              {/* Orbiting food chips — float at deep/shallow Z so they visibly separate as the card tilts */}
              {[
                { emoji: '🍚', z: 70, x: '-8%', y: '6%', delay: 0 },
                { emoji: '🥦', z: 110, x: '92%', y: '14%', delay: 0.6 },
                { emoji: '🍞', z: 50, x: '88%', y: '82%', delay: 1.1 },
                { emoji: '🍎', z: 130, x: '-6%', y: '78%', delay: 1.6 },
              ].map((chip, i) => (
                <motion.div
                  key={i}
                  className="float-y pointer-events-none absolute hidden h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl shadow-soft sm:flex"
                  style={{
                    left: chip.x,
                    top: chip.y,
                    transform: `translateZ(${chip.z}px)`,
                    animationDelay: `${chip.delay}s`,
                  }}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + chip.delay * 0.3, duration: 0.5, ease }}
                >
                  {chip.emoji}
                </motion.div>
              ))}

              {/* Gradient frame, sits slightly back */}
              <div
                className="relative w-full rounded-[2.5rem] p-[1.5px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(45,106,79,0.8), rgba(27,67,50,1), rgba(194,112,58,0.7))',
                  transform: 'translateZ(0px)',
                }}
              >
                {/* Main card face, pushed forward in Z */}
                <div
                  className="rounded-[2.4rem] bg-forest-800/95 p-7 text-white"
                  style={{ transform: 'translateZ(40px)' }}
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="float-y flex h-10 w-10 items-center justify-center rounded-full bg-white/12 text-xl">🍽️</div>
                      <span className="font-display text-base font-semibold">NourishConnect</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </div>
                  </div>

                  {/* Donation journey */}
                  <div className="mt-5" style={{ transform: 'translateZ(20px)' }}>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                      Donation in progress
                    </p>
                    <JourneyAnim />
                  </div>

                  {/* Quote — pulled forward a bit more for depth contrast */}
                  <div
                    className="mt-5 rounded-2xl bg-white/7 p-5"
                    style={{ transform: 'translateZ(55px)' }}
                  >
                    <p className="font-display text-xl leading-snug text-white">
                      "Two bags of produce fed a family of five, three miles from our door."
                    </p>
                    <p className="mt-3 text-xs text-white/45">— Maple Street Pantry, receiving home</p>
                  </div>

                  {/* Mini stats */}
                  <div className="mt-4 grid grid-cols-2 gap-3" style={{ transform: 'translateZ(30px)' }}>
                    {STATS.slice(0, 2).map((s, i) => (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 + i * 0.15 }}
                        className="rounded-2xl bg-white/8 p-4"
                      >
                        <p className="font-display text-2xl font-bold">
                          <Counter value={s.value} suffix={s.suffix} />
                        </p>
                        <p className="mt-0.5 text-[11px] text-white/45">{s.label}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating badge — highest Z, reads as closest to viewer */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: -5 }}
                transition={{ delay: 1.3, duration: 0.7, ease }}
                style={{ transform: 'translateZ(90px) rotate(-5deg)' }}
                className="float-y absolute -left-8 -top-8 hidden rounded-2xl bg-white px-4 py-3 shadow-soft sm:block"
              >
                <p className="text-[10px] font-semibold uppercase tracking-widest text-clay-600">Just delivered</p>
                <p className="mt-0.5 font-display text-sm font-bold text-forest-800">50 meals · Raja Illam</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom curve transition into next section */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0,60 L0,30 Q360,0 720,30 Q1080,60 1440,30 L1440,60 Z" fill="#f6f4fb" />
        </svg>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   STATS BAR
═══════════════════════════════════════════════════════════ */
function StatsBar() {
  return (
    <section className="relative bg-haze-50 py-6">
      <div className="mx-auto -mt-2 max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.09, ease }}
              whileHover={{ y: -6, boxShadow: '0 20px 50px -16px rgba(27,67,50,0.22)' }}
              className="group relative overflow-hidden rounded-3xl border border-forest-100 bg-white px-6 py-7 text-center shadow-card"
            >
              {/* shimmer sweep on hover */}
              <motion.div
                className="pointer-events-none absolute inset-0 -translate-x-full skew-x-[-12deg] bg-gradient-to-r from-transparent via-white/60 to-transparent"
                initial={false}
                whileHover={{ translateX: ['−100%', '200%'] }}
                transition={{ duration: 0.7 }}
              />
              <div className="mb-2 text-2xl">{s.icon}</div>
              <p className="font-display text-3xl font-bold text-clay-600">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-ink/55">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   IMPACT BANNER  (uses child-meal.jpeg — Sevaroots style)
═══════════════════════════════════════════════════════════ */
function ImpactBanner() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 lg:px-10">
      <FadeUp>
        <div className="relative overflow-hidden rounded-[2.5rem]" style={{ minHeight: 420 }}>
          {/* Background: child receiving meal image */}
          <img
            src="/images/child-meal.jpeg"
            alt="Child receiving a meal"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
          {/* Dark overlay matching Sevaroots poster style */}
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(120deg, rgba(10,18,12,0.88) 0%, rgba(10,18,12,0.65) 55%, rgba(10,18,12,0.3) 100%)' }}
          />

          {/* Content */}
          <div className="relative flex h-full flex-col justify-center px-10 py-16 sm:px-16">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease }}
              className="text-sm font-bold uppercase tracking-[0.25em] text-clay-300"
            >
              One meal can change a day
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, delay: 0.1, ease }}
              className="mt-3 font-display font-black leading-[1.05] text-white"
              style={{ fontSize: 'clamp(36px, 5vw, 72px)' }}
            >
              For someone, it's not<br />
              just food.{' '}
              <span className="text-clay-300">It's hope.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25, ease }}
              className="mt-4 max-w-md text-lg text-white/60"
            >
              Every donation you make feeds someone who needed it today.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35, ease }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/signup"
                  className="btn-sheen inline-flex items-center gap-2 rounded-full bg-clay-500 px-8 py-4 text-base font-bold text-white shadow-soft"
                >
                  🍱 Donate Food Today
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }}>
                <a
                  href="#homes"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-8 py-4 text-base font-semibold text-white/80 backdrop-blur-sm transition hover:bg-white/10"
                >
                  See Receiving Homes →
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </FadeUp>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   HOW IT WORKS
═══════════════════════════════════════════════════════════ */
function HowItWorks() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] })
  const lineW = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <section id="how-it-works" ref={ref} className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <FadeUp>
        <span className="text-xs font-semibold uppercase tracking-widest text-clay-600">How it works</span>
        <h2 className="mt-3 font-display text-4xl font-semibold text-forest-800 sm:text-5xl">
          From your counter to<br />their table.
        </h2>
      </FadeUp>

      <div className="relative mt-14">
        {/* Animated route line on desktop */}
        <svg aria-hidden className="pointer-events-none absolute left-0 right-0 top-10 hidden w-full lg:block" height="4" viewBox="0 0 1200 4" preserveAspectRatio="none">
          <line x1="0" y1="2" x2="1200" y2="2" stroke="#dcebe1" strokeWidth="2" />
          <motion.line x1="0" y1="2" x2="1200" y2="2" stroke="#c2703a" strokeWidth="2.5" className="route-dash"
            style={{ pathLength: lineW, strokeDasharray: '8 12' }} />
        </svg>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.num}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.65, delay: i * 0.12, ease }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-forest-100 bg-white p-8 shadow-card transition-shadow hover:shadow-soft"
            >
              {/* Watermark number */}
              <span className="absolute -right-3 -top-3 font-display text-8xl font-black text-forest-50 select-none transition-colors duration-300 group-hover:text-clay-100">
                {s.num}
              </span>
              <div className="relative">
                <div className="mb-4 flex h-13 w-13 items-center justify-center rounded-2xl bg-forest-50 text-3xl transition-colors duration-300 group-hover:bg-clay-100">
                  {s.icon}
                </div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-clay-500">Step {s.num}</p>
                <h3 className="font-display text-xl font-semibold text-forest-800">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{s.body}</p>
              </div>
              {/* Bottom bar reveal */}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 rounded-full"
                style={{ background: 'linear-gradient(90deg, #2d6a4f, #c2703a)' }}
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.4 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <FadeUp delay={0.2} className="mt-10 text-center">
        <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
          <Link to="/signup"
            className="btn-sheen inline-flex items-center gap-2 rounded-full bg-clay-600 px-9 py-4 text-base font-semibold text-white shadow-soft">
            Start a Donation →
          </Link>
        </motion.div>
      </FadeUp>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   FOOD CATEGORIES
═══════════════════════════════════════════════════════════ */
function FoodCategories() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <FadeUp>
          <span className="text-xs font-semibold uppercase tracking-widest text-clay-600">What you can share</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-forest-800">Every kind of food<br />is welcome here.</h2>
        </FadeUp>

        <div className="mt-10 flex flex-wrap gap-3">
          {CATEGORIES.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06, ease }}
              whileHover={{ scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.96 }}
              className="flex cursor-default items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold shadow-card"
              style={{ background: c.bg, color: c.col, border: `1.5px solid ${c.col}22` }}
            >
              <span className="text-2xl">{c.emoji}</span>
              {c.label}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   TAMIL FOOD CULTURE DIVIDER (uses tamil-food-map.jpeg)
═══════════════════════════════════════════════════════════ */
function CultureDivider() {
  return (
    <section className="relative overflow-hidden py-0">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-0 overflow-hidden rounded-[2.5rem] shadow-soft">

          {/* Left: Tamil food map image */}
          <FadeUp from="left" className="relative min-h-[400px] lg:min-h-[500px]">
            <img
              src="/images/tamil-food-map.jpeg"
              alt="Tamil Nadu food culture"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-forest-800/50" />
          </FadeUp>

          {/* Right: copy on dark green */}
          <FadeUp from="right">
            <div className="flex h-full flex-col justify-center bg-forest-800 px-10 py-14 lg:px-14">
              <span className="text-xs font-bold uppercase tracking-widest text-clay-300">Our roots</span>
              <h2 className="mt-4 font-display text-3xl font-semibold leading-snug text-white sm:text-4xl">
                Built by neighbours who hated watching good food go to waste.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-white/60">
                NourishConnect started as a spreadsheet shared between three families and a local shelter.
                Today it connects hundreds of donors to receiving homes across Chennai,
                so surplus food finds a table before it spoils.
              </p>
              <p className="mt-4 text-base leading-relaxed text-white/60">
                We're not a warehouse — we're the map between what you have and who needs it.
                Every donation is tracked from pickup to plate.
              </p>
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[['100%','Transparent'],['0 ₹','Platform fee'],['35+','Homes served']].map(([v, l]) => (
                  <div key={l} className="rounded-2xl bg-white/8 p-4 text-center">
                    <p className="font-display text-2xl font-bold text-clay-300">{v}</p>
                    <p className="mt-1 text-xs text-white/45">{l}</p>
                  </div>
                ))}
              </div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} className="mt-8 self-start">
                <Link to="/signup"
                  className="btn-sheen inline-flex items-center gap-2 rounded-full bg-clay-600 px-7 py-3.5 text-sm font-semibold text-white">
                  Join as a Donor →
                </Link>
              </motion.div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   RECEIVING HOMES
═══════════════════════════════════════════════════════════ */
function ReceivingHomes() {
  return (
    <section id="homes" className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <FadeUp className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-clay-600">Receiving homes</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-forest-800">Homes you can support.</h2>
          <p className="mt-2 max-w-lg text-ink/55">Registered homes and organisations currently receiving donations through NourishConnect.</p>
        </div>
        <Link to="/login/donor"
          className="shrink-0 rounded-full border border-forest-700 px-6 py-2.5 text-sm font-semibold text-forest-700 transition hover:bg-forest-50">
          View All →
        </Link>
      </FadeUp>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {HOMES.map((h, i) => (
          <motion.div
            key={h.name}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: i * 0.1, ease }}
            whileHover={{ y: -6, boxShadow: '0 20px 50px -14px rgba(27,67,50,0.22)' }}
            className="flex flex-col gap-4 rounded-3xl border border-forest-100 bg-white p-6 shadow-card transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-display text-lg font-semibold leading-tight text-forest-800">{h.name}</h3>
                <p className="mt-1 text-xs text-ink/50">📍 {h.loc}</p>
              </div>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest-50 text-lg">🏠</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-xl border border-forest-100 bg-haze-50 px-2.5 py-1 text-xs font-medium text-forest-700">{h.type}</span>
              <span className="text-xs text-ink/45">👥 {h.count} residents</span>
            </div>
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-clay-500">Needs now</p>
              <div className="flex flex-wrap gap-1.5">
                {h.needs.map(n => (
                  <span key={n} className="rounded-full bg-clay-100 px-2.5 py-0.5 text-xs font-medium text-clay-700">{n}</span>
                ))}
              </div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link to="/login/donor"
                className="block rounded-xl bg-forest-700 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-forest-800">
                Donate to This Home
              </Link>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   RECENT DONATIONS TABLE
═══════════════════════════════════════════════════════════ */
function RecentDonations() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <FadeUp className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-clay-600">Recent activity</span>
          <h2 className="mt-3 font-display text-4xl font-semibold text-forest-800">Happening right now.</h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <div className="overflow-hidden rounded-3xl border border-forest-100 shadow-card">
            <div className="hidden grid-cols-[1.4fr_1.4fr_0.8fr_2fr_1fr_1fr] gap-4 border-b border-forest-100 bg-haze-50 px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-ink/35 sm:grid">
              <span>Donor</span><span>Food</span><span>Qty</span><span>Home</span><span>When</span><span>Status</span>
            </div>
            {FEED.map((row, i) => {
              const s = STATUS[row.status]
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease }}
                  className="grid grid-cols-1 gap-2 border-b border-forest-100 bg-white px-6 py-4 text-sm last:border-none transition hover:bg-haze-50 sm:grid-cols-[1.4fr_1.4fr_0.8fr_2fr_1fr_1fr] sm:items-center sm:gap-4"
                >
                  <span className="font-semibold text-ink">{row.donor}</span>
                  <span className="text-ink/75">{row.food}</span>
                  <span className="text-ink/55">{row.qty}</span>
                  <span className="font-medium text-forest-700">{row.home}</span>
                  <span className="text-xs text-ink/40">{row.date}</span>
                  <span className="inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold"
                    style={{ background: s.bg, color: s.col }}>
                    {s.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   FINAL CTA  (rich full-bleed with food image)
═══════════════════════════════════════════════════════════ */
function CtaBand() {
  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 pb-24 pt-12 lg:px-10">
      <FadeUp>
        <div className="relative overflow-hidden rounded-[2.5rem]">
          {/* BG: reuse indian food spread from side */}
          <div className="absolute inset-0">
            <img src="/images/indian-food-spread.jpeg" alt="" className="h-full w-full object-cover" style={{ opacity: 0.15 }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1b4332 0%, #2d6a4f 55%, #1b4332 100%)' }} />
            <div className="blob-a pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/8 blur-3xl" />
            <div className="blob-b pointer-events-none absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-clay-400/15 blur-3xl" />
          </div>

          {/* Animated rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
            {[220, 400, 580].map((size, n) => (
              <motion.div
                key={n}
                className="absolute rounded-full border border-white/8"
                style={{ width: size, height: size }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
                transition={{ duration: 5 + n * 1.5, repeat: Infinity, delay: n * 0.8 }}
              />
            ))}
          </div>

          <div className="relative px-8 py-20 text-center text-white sm:px-16">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold uppercase tracking-[0.25em] text-forest-100/50"
            >
              Ready to share?
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, ease }}
              className="mt-4 font-display font-semibold leading-tight text-white"
              style={{ fontSize: 'clamp(32px, 5vw, 58px)' }}
            >
              Have more food<br />than you need?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, ease }}
              className="mx-auto mt-5 max-w-lg text-lg text-forest-100/65"
            >
              Someone nearby may need exactly what you have.
              It takes two minutes to log a donation.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, ease }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/signup"
                  className="btn-sheen inline-flex items-center gap-2 rounded-full bg-clay-500 px-9 py-4 text-base font-bold text-white shadow-soft">
                  🍱 Make a Donation
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                <Link to="/login/admin"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-9 py-4 text-base font-semibold text-white/80 backdrop-blur-sm transition hover:bg-white/8">
                  Administrator sign in
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </FadeUp>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════
   ROOT
═══════════════════════════════════════════════════════════ */
export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <StatsBar />
      <ImpactBanner />
      <HowItWorks />
      <FoodCategories />
      <CultureDivider />
      <ReceivingHomes />
      <RecentDonations />
      <CtaBand />
      <Footer />
    </div>
  )
}
