import { useId, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import { NOTES } from '../../data/notes'
import { useLocale } from '../../i18n/locale-context'
import { noteSuggestions } from '../../lib/catalogue'
import { classNames, formatNumber } from '../../lib/format'
import { NOTE_LIMIT } from './facets'

/**
 * The notes filter: an ARIA combobox over the note dictionary, answering in
 * the active language (with aliases and the other language as fallbacks),
 * and the chosen notes as removable chips. With nothing typed it offers the
 * notes most present in the current results. Fragrances must carry every
 * chosen note.
 *
 * Keys: ArrowDown / ArrowUp move through the list, Enter chooses, Escape
 * clears what was typed, Backspace in an empty field removes the last note.
 */
export default function NotePicker({ selected, counts, onToggle, hideLabel = false }) {
  const { lang, t, tc, tr } = useLocale()
  const id = useId()
  const listId = `${id}-list`
  const hintId = `${id}-hint`
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(-1)

  const typed = query.trim() !== ''
  const options = useMemo(() => {
    if (typed) return noteSuggestions(query, lang, NOTE_LIMIT, { exclude: selected, counts })
    // Nothing typed: the notes most worn across what is on screen.
    return Object.entries(counts ?? {})
      .filter(([noteId, count]) => count > 0 && !selected.includes(noteId))
      .sort((a, b) => b[1] - a[1] || tr(NOTES[a[0]]).localeCompare(tr(NOTES[b[0]]), lang))
      .slice(0, NOTE_LIMIT)
      .map(([noteId]) => NOTES[noteId])
  }, [typed, query, lang, selected, counts, tr])

  const choose = (note) => {
    onToggle(note.id)
    setQuery('')
    setActive(-1)
  }

  const onKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (options.length === 0) return
      event.preventDefault()
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((current) => (current + step + options.length) % options.length)
    } else if (event.key === 'Enter') {
      const note = options[active] ?? (typed ? options[0] : null)
      if (!note) return
      event.preventDefault()
      choose(note)
    } else if (event.key === 'Escape' && typed) {
      // Only what was typed; a second Escape is the dialog's or the panel's.
      event.preventDefault()
      setQuery('')
      setActive(-1)
    } else if (event.key === 'Backspace' && !query && selected.length > 0) {
      onToggle(selected[selected.length - 1])
    }
  }

  const activeId = active >= 0 && options[active] ? `${id}-opt-${options[active].id}` : undefined
  const otherLang = lang === 'ar' ? 'en' : 'ar'

  return (
    <div>
      {selected.length > 0 && (
        <ul className="mb-4 flex flex-wrap gap-2">
          {selected.map((noteId) => {
            const label = tr(NOTES[noteId])
            return (
              <li key={noteId}>
                <button
                  type="button"
                  onClick={() => onToggle(noteId)}
                  aria-label={t('catalogue.remove', { label })}
                  className="inline-flex min-h-8 items-center gap-2 border border-green-600 bg-green-600 px-3 py-1 font-sans text-[13px] text-snow-50 transition-colors hover:bg-green-700 rtl:font-sans-ar"
                >
                  {label}
                  <X aria-hidden="true" className="h-3 w-3" strokeWidth={1.75} />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      <label htmlFor={`${id}-input`} className={hideLabel ? 'sr-only' : 'ticket mb-2 block text-snow-600'}>
        {t('catalogue.notes.label')}
      </label>
      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute start-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-snow-600"
          strokeWidth={1.25}
        />
        <input
          id={`${id}-input`}
          type="text"
          role="combobox"
          aria-expanded={options.length > 0}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={activeId}
          aria-describedby={hintId}
          autoComplete="off"
          spellCheck={false}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setActive(-1)
          }}
          onKeyDown={onKeyDown}
          placeholder={t('catalogue.notes.placeholder')}
          className="h-10 w-full border-b border-snow-300 bg-transparent pe-2 ps-6 font-sans text-[16px] font-normal text-ink-950 placeholder:text-snow-600 focus:border-green-600 focus:outline-none focus:ring-0 rtl:font-sans-ar"
        />
      </div>
      <p id={hintId} className="mt-2 font-sans text-[12px] leading-relaxed text-snow-600 rtl:font-sans-ar">
        {t('catalogue.notes.hint')}
      </p>

      {!typed && options.length > 0 && (
        <p aria-hidden="true" className="ticket mt-4 text-snow-600">
          {t('catalogue.notes.common')}
        </p>
      )}
      <ul
        id={listId}
        role="listbox"
        aria-label={t('catalogue.notes.label')}
        className={classNames('flex flex-col', typed ? 'mt-3' : 'mt-1')}
      >
        {options.map((note, index) => {
          const count = counts?.[note.id] ?? 0
          return (
            <li
              key={note.id}
              id={`${id}-opt-${note.id}`}
              role="option"
              aria-selected={index === active}
              aria-label={`${tr(note)} — ${tc('catalogue.count', count)}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(note)}
              onMouseEnter={() => setActive(index)}
              className={classNames(
                'flex min-h-10 cursor-pointer items-center justify-between gap-4 border-b border-snow-200 px-1 py-2 last:border-b-0',
                index === active ? 'bg-snow-100' : '',
              )}
            >
              <span className="flex min-w-0 flex-wrap items-baseline gap-x-2.5">
                <span className={classNames('font-sans text-[15px] rtl:font-sans-ar rtl:text-[14px]', count ? 'text-ink-950' : 'text-snow-600')}>
                  {tr(note)}
                </span>
                {/* The other language's name, in its own face: shoppers here know both. */}
                <span
                  lang={otherLang}
                  dir={otherLang === 'ar' ? 'rtl' : 'ltr'}
                  className={classNames('text-[12px] text-snow-600', otherLang === 'ar' ? 'font-sans-ar' : 'font-sans')}
                >
                  {note[otherLang]}
                </span>
              </span>
              <span className="t-figure text-[13px] font-normal text-snow-600">{formatNumber(count, lang)}</span>
            </li>
          )
        })}
      </ul>
      {typed && options.length === 0 && (
        <p role="status" className="mt-3 font-sans text-[14px] text-snow-600 rtl:font-sans-ar">
          {t('catalogue.notes.none')}
        </p>
      )}
    </div>
  )
}
