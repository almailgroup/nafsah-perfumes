import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import FinderQuestion from './FinderQuestion'
import FinderResults from './FinderResults'
import FinderTeaser from './FinderTeaser'
import { CartContext } from '../../context/cart-context'
import { LocaleContext, translate, translateCount, translateValue } from '../../i18n/locale-context'
import { QUESTIONS } from '../../lib/scent-finder'
import { RouterContext } from '../../router/router-context'

const noop = () => {}

function render(lang, element) {
  const locale = {
    lang,
    isRtl: lang === 'ar',
    t: (key, vars) => translate(lang, key, vars),
    tc: (key, count, vars) => translateCount(lang, key, count, vars),
    tr: (v) => translateValue(lang, v),
  }
  const router = { path: '/scent-finder', search: '', hash: '', key: 0, navigate: noop, replaceSearch: noop }
  return renderToStaticMarkup(
    <LocaleContext.Provider value={locale}>
      <RouterContext.Provider value={router}>
        <CartContext.Provider value={{ addItem: noop }}>{element}</CartContext.Provider>
      </RouterContext.Provider>
    </LocaleContext.Provider>,
  )
}

// Visible text, without the vials' SVG labels (decorative, Latin by design).
const text = (html) =>
  html
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
const radios = (html) => [...html.matchAll(/<button[^>]*role="radio"[^>]*>/g)].map(([tag]) => tag)

const ANSWERS = { occasion: 'wedding', vibe: 'floral', season: 'all-year', projection: 'noticeable', wearer: 'her' }

function question(lang, index, value) {
  return render(
    lang,
    <FinderQuestion
      question={QUESTIONS[index]}
      index={index}
      total={QUESTIONS.length}
      value={value}
      onChoose={noop}
      onBack={noop}
      onNext={noop}
      nextLabel="Next"
    />,
  )
}

describe('FinderQuestion', () => {
  it('is a radiogroup of option cards with one tab stop, on the chosen card', () => {
    const html = question('en', 1, 'floral')
    expect(html).toMatch(/role="radiogroup"[^>]*aria-labelledby="[^"]+"[^>]*aria-describedby="[^"]+"/)
    const tags = radios(html)
    expect(tags).toHaveLength(4)
    expect(tags.filter((tag) => tag.includes('tabindex="0"'))).toHaveLength(1)
    expect(tags[2]).toContain('aria-checked="true"')
    expect(tags[2]).toContain('tabindex="0"')
  })

  it('puts the tab stop on the first card and disables Next until a choice', () => {
    const html = question('en', 0, undefined)
    expect(radios(html)[0]).toContain('tabindex="0"')
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*class="btn-green/)
    expect(text(html)).toContain('Choose one to continue.')
  })

  it('reports progress as text and as a progressbar', () => {
    const html = question('en', 1, 'floral')
    expect(text(html)).toContain('Step 2 of 5')
    // The question is the page's one h1, described by the step it is on, so
    // focusing it announces "Step 2 of 5" (a remounted live region would not).
    expect([...html.matchAll(/<h1[\s>]/g)]).toHaveLength(1)
    const [, stepId] = html.match(/<h1[^>]*aria-describedby="([^"]+)"/)
    expect(html).toMatch(new RegExp(`<p id="${stepId}"[^>]*>Step 2 of 5</p>`))
    expect(html).not.toContain('aria-live')
    expect(html).toMatch(/role="progressbar"[^>]*aria-valuemin="1"[^>]*aria-valuemax="5"[^>]*aria-valuenow="2"[^>]*aria-valuetext="Step 2 of 5"/)
  })

  it('counts in Arabic-Indic digits in Arabic', () => {
    const html = question('ar', 3, 'beast')
    expect(text(html)).toContain('الخطوة ٤ من ٥')
    expect(text(html)).not.toMatch(/[0-9]/)
  })
})

describe('FinderResults', () => {
  const results = (lang) =>
    render(
      lang,
      <FinderResults answers={ANSWERS} onEdit={noop} onRestart={noop} onSeeAll={noop} onOpenProduct={noop} />,
    )

  it('shows three matches and three more, each with a meter whose value is also text', () => {
    const html = results('en')
    expect([...html.matchAll(/<article/g)]).toHaveLength(6)
    const meters = [...html.matchAll(/role="meter"[^>]*/g)].map(([tag]) => tag)
    expect(meters).toHaveLength(6)
    for (const tag of meters) {
      const [, now] = tag.match(/aria-valuenow="(\d+)"/)
      expect(tag).toContain(`aria-valuetext="${now}% match"`)
      expect(text(html)).toContain(`${now}% match`)
    }
    expect(text(html)).toContain('Rose Impériale')
    expect(text(html)).toContain('Why it suits you')
  })

  it('fills every reason, and lets each answer be changed', () => {
    const html = results('en')
    expect(text(html)).not.toMatch(/\{\w+\}/)
    expect(text(html)).not.toMatch(/finder\./)
    expect(html).toContain('aria-label="Change Occasion: Weddings &amp; occasions"')
    expect(text(html)).toContain('See your top matches in the catalogue')
    // The families of the three shown (two roses and Ward Taifi, a rose oil), not only the character's.
    expect(text(html)).toContain(
      'Opens the catalogue on Rose & Florals and Bukhoor & Oils, the families of your three closest matches.',
    )
  })

  it('prints every figure in Arabic-Indic digits in Arabic', () => {
    const html = results('ar')
    const visible = text(html)
    expect(visible).toContain('د.ك.')
    expect(visible).toMatch(/توافق [٠-٩]+٪/)
    expect(visible).not.toMatch(/[0-9]/)
    expect(visible).not.toMatch(/\{\w+\}/)
    // A comma between format and volume: a middle dot beside ١٠٠ reads as another digit.
    expect(visible).toContain('الزجاجة الكاملة، ١٠٠ مل')
    expect(visible).not.toMatch(/[٠-٩] ·|· [٠-٩]/)
    expect(visible).not.toMatch(/· د\.ك\./)
    expect(visible).toMatch(/أولاً ?، د\.ك\. [٠-٩]/)
  })
})

describe('FinderTeaser', () => {
  it('links to the finder and lists the five questions', () => {
    const html = render('en', <FinderTeaser />)
    expect(html).toMatch(/<a href="\/scent-finder"[^>]*>/)
    expect([...html.matchAll(/<li /g)]).toHaveLength(5)
  })
})
