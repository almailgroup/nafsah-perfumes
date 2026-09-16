import { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'

const COLUMNS = [
  { title: 'Catalogue', links: ['New Arrivals', 'Bestsellers', 'Discovery Sets', 'Gifting'] },
  { title: 'The House', links: ['Our Story', 'Sourcing', 'Sustainability', 'Ateliers'] },
  { title: 'Client Care', links: ['Shipping & Returns', 'Track an Order', 'Consultation', 'FAQ'] },
]

/** Noir bookend to the hero, closing the page on the same surface it opened. */
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
    <footer id="contact" className="scroll-mt-24 bg-noir-950">
      <div className="border-b border-paper-50/15">
        <div className="mx-auto grid max-w-[1560px] gap-10 px-5 py-16 sm:px-9 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="ticket text-oxblood-300">Private List</p>
            <h2 className="t-display-sm mt-5 text-paper-50">
              First access to
              <br />
              <em className="font-medium italic">every new composition</em>
            </h2>
          </div>

          <div className="lg:pl-10">
            <p className="t-body-noir max-w-md text-paper-400">
              Two letters a year, no more. Releases, restocks of retired extraits, and invitations
              to the atelier in Grasse.
            </p>
            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="field-noir flex-1"
              />
              <button type="submit" className="btn-paper group shrink-0">
                {subscribed ? (
                  <>
                    <Check className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Subscribed
                  </>
                ) : (
                  <>
                    Join
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1560px] px-5 py-14 sm:px-9">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <span className="font-display text-[28px] font-medium tracking-[0.2em] text-paper-50">
              NAFSAH
            </span>
            <p className="mt-6 max-w-xs font-display text-[1.0625rem] font-medium leading-relaxed text-paper-400">
              Maison de parfum, founded 1974. Composed in Grasse, bottled in small batches, shipped
              worldwide.
            </p>
            <ul className="mt-6 space-y-2">
              {[
                '12 Boulevard du Jeu de Ballon, Grasse',
                'atelier@nafsah.example',
                '+33 4 93 00 00 00',
              ].map((line) => (
                <li key={line} className="font-sans text-[13px] font-light text-paper-400">
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="ticket text-paper-200">{column.title}</h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#collection"
                      className="font-sans text-[13px] font-light text-paper-400 transition-colors duration-300 hover:text-paper-50"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-paper-50/15 pt-8 sm:flex-row">
          <p className="ticket text-paper-400">
            © {new Date().getFullYear()} Nafsah — A demonstration storefront
          </p>
          <div className="flex items-center gap-6">
            <a href="#collection" className="ticket text-paper-400 hover:text-paper-50">
              Privacy
            </a>
            <a href="#collection" className="ticket text-paper-400 hover:text-paper-50">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
