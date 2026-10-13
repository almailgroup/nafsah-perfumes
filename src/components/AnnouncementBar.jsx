import { useEffect, useState } from 'react'
import { Clock, Pause, Play, TestTube, Truck } from 'lucide-react'
import { fillPolicy } from '../data/help'
import { useLocale } from '../i18n/locale-context'
import { classNames } from '../lib/format'

// One icon per line of the dictionary's `announce` list, in the same order:
// the free-delivery threshold, the same-day cut-off, Try First.
const ICONS = [Truck, Clock, TestTube]
const INTERVAL = 6000

/**
 * Rotating strip above the header, in both scripts.
 *
 * Every message is laid out in the same grid cell, so the strip is always as
 * tall as its longest message and a two-line message on a phone never shifts
 * the page as the strip turns. It stops while it is hovered or holds focus,
 * and a pause control stops it for good (WCAG 2.2.2). Screen readers get the
 * three messages once, as a list, rather than a live region that repeats
 * itself every few seconds.
 */
export default function AnnouncementBar() {
  const { lang, t, announce } = useLocale()
  const messages = (announce ?? []).map((text) => fillPolicy(text, lang))
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const rotating = playing && !hovered && !focused && messages.length > 1
  const current = messages.length ? index % messages.length : 0

  useEffect(() => {
    if (!rotating) return undefined
    const timer = setInterval(() => setIndex((i) => (i + 1) % messages.length), INTERVAL)
    return () => clearInterval(timer)
  }, [rotating, messages.length])

  if (!messages.length) return null

  return (
    <section
      aria-label={t('announceLabel')}
      className="bg-green-600"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
    >
      <div className="mx-auto flex min-h-10 max-w-[1560px] items-center gap-3 px-5 py-1.5 sm:px-9">
        {/* Balances the control at the far end, so the message stays centred.
            A phone needs the width for the message more than the symmetry. */}
        <span aria-hidden="true" className="hidden w-7 shrink-0 sm:block" />

        <div aria-hidden="true" className="grid flex-1">
          {messages.map((message, i) => {
            const Icon = ICONS[i] ?? Truck
            return (
              <p
                key={i}
                className={classNames(
                  'ticket col-start-1 row-start-1 flex items-center justify-center gap-2.5 text-center text-snow-50 transition-[opacity,visibility] duration-500',
                  i === current ? 'visible opacity-100' : 'invisible opacity-0',
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0 text-gold-300" strokeWidth={1.25} />
                <span>{message}</span>
              </p>
            )
          })}
        </div>

        <ul className="sr-only">
          {messages.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>

        {messages.length > 1 ? (
          <button
            type="button"
            onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? t('announcePause') : t('announcePlay')}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-snow-50/80 transition-colors duration-300 hover:bg-green-700 hover:text-snow-50 focus-visible:ring-snow-50 focus-visible:ring-offset-green-600"
          >
            {playing ? (
              <Pause aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
            ) : (
              <Play aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.5} />
            )}
          </button>
        ) : (
          <span aria-hidden="true" className="hidden w-7 shrink-0 sm:block" />
        )}
      </div>
    </section>
  )
}
