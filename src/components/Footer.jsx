import { useState } from 'react'
import { ArrowRight, Check, Instagram, Mail, MapPin, Phone } from 'lucide-react'

const COLUMNS = [
  {
    title: 'Collection',
    links: ['New Arrivals', 'Bestsellers', 'Discovery Sets', 'Gifting'],
  },
  {
    title: 'The House',
    links: ['Our Story', 'Sourcing', 'Sustainability', 'Ateliers'],
  },
  {
    title: 'Client Care',
    links: ['Shipping & Returns', 'Track an Order', 'Fragrance Consultation', 'FAQ'],
  },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!/^\S+@\S+\.\S+$/.test(email)) return
    setSubscribed(true)
    setEmail('')
    setTimeout(() => setSubscribed(false), 3500)
  }

  return (
    <footer id="contact" className="scroll-mt-24 border-t hairline bg-ink-950">
      {/* Newsletter */}
      <div className="border-b hairline">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Private List</p>
            <h2 className="mt-4 font-display text-3xl font-light leading-tight text-bone-50 sm:text-4xl">
              First access to every new composition
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-bone-400">
              Two letters a year, no more. Releases, restocks of retired extraits, and invitations to
              the atelier in Grasse.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter" className="sr-only">
              Email address
            </label>
            <input id="newsletter" type="email"
              required value={email}
              onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com"
              className="field flex-1"
            />
            <button type="submit" className="btn-primary group shrink-0">
              {subscribed ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={2.5} />
                  Subscribed
                </>
              ) : (
                <>
                  Join
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                    strokeWidth={2}
                  />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <span className="font-display text-xl tracking-[0.3em] text-bone-50">NAFSAH</span>
            <p className="mt-5 max-w-xs text-[13px] leading-relaxed text-bone-400">
              Maison de parfum, founded 1974. Composed in Grasse, bottled in small batches, shipped
              worldwide.
            </p>

            <ul className="mt-6 space-y-2.5 text-[13px] text-bone-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-bone-200" strokeWidth={1.5} />
                12 Boulevard du Jeu de Ballon, Grasse
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-3.5 w-3.5 shrink-0 text-bone-200" strokeWidth={1.5} />
                atelier@nafsah.example
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-3.5 w-3.5 shrink-0 text-bone-200" strokeWidth={1.5} />
                +33 4 93 00 00 00
              </li>
            </ul>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-[10px] font-medium uppercase tracking-wider2 text-bone-200">
                {column.title}
              </h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#collection"
                      className="text-[13px] text-bone-400 transition-colors duration-300 hover:text-bone-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t hairline pt-8 sm:flex-row">
          <p className="text-[11px] tracking-wide text-bone-400">
            © {new Date().getFullYear()} Nafsah Maison de Parfum. A demonstration storefront.
          </p>
          <div className="flex items-center gap-5">
            <a href="#top" aria-label="Instagram"
              className="text-bone-400 transition-colors duration-300 hover:text-bone-200"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.5} />
            </a>
            <span className="h-3 w-px bg-white/10" />
            <a href="#collection"
              className="text-[11px] uppercase tracking-wider2 text-bone-400 transition-colors duration-300 hover:text-bone-200"
            >
              Privacy
            </a>
            <a href="#collection"
              className="text-[11px] uppercase tracking-wider2 text-bone-400 transition-colors duration-300 hover:text-bone-200"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
