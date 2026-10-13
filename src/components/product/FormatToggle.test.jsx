import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import FormatToggle from './FormatToggle'
import { PRODUCTS_BY_ID } from '../../data/products'
import { LocaleContext, translate, translateValue } from '../../i18n/locale-context'

function render(lang, props) {
  const value = {
    lang,
    isRtl: lang === 'ar',
    t: (key, vars) => translate(lang, key, vars),
    tr: (v) => translateValue(lang, v),
  }
  return renderToStaticMarkup(
    <LocaleContext.Provider value={value}>
      <FormatToggle {...props} />
    </LocaleContext.Provider>,
  )
}

const radios = (html) => [...html.matchAll(/<button[^>]*role="radio"[^>]*>/g)].map(([tag]) => tag)
const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

describe('FormatToggle', () => {
  const oudNoir = PRODUCTS_BY_ID['oud-noir']

  it('is a radiogroup with one radio per format and a single tab stop on the selected one', () => {
    const html = render('en', { product: oudNoir, value: 'spray50' })
    expect(html).toMatch(/role="radiogroup"[^>]*aria-label="Choose a size or format"/)
    const tags = radios(html)
    expect(tags).toHaveLength(oudNoir.formats.length)
    expect(tags.filter((tag) => tag.includes('tabindex="0"'))).toHaveLength(1)
    expect(tags[1]).toContain('aria-checked="true"')
    expect(tags[1]).toContain('tabindex="0"')
    expect(tags.filter((tag) => tag.includes('aria-checked="true"'))).toHaveLength(1)
  })

  it('puts the tab stop on the first option when nothing matches', () => {
    const tags = radios(render('en', { product: oudNoir, value: 'nope' }))
    expect(tags[0]).toContain('tabindex="0"')
    expect(tags.some((tag) => tag.includes('aria-checked="true"'))).toBe(false)
  })

  it('shows label, volume and price for every option', () => {
    expect(text(render('en', { product: oudNoir, value: 'full' }))).toBe(
      'Full Bottle 100 ml · with a free 2 ml test vial KWD 119.000 50ml Spray 50 ml · with a free 2 ml test vial KWD 75.000 Quarter Tola Oil 3 ml KWD 29.000 2ml Sample Vial 2 ml KWD 4.500',
    )
  })

  it('writes Arabic labels, volumes and prices in Arabic-Indic digits', () => {
    const shown = text(render('ar', { product: PRODUCTS_BY_ID['dehn-al-oud'], value: 'tola', variant: 'compact' }))
    expect(shown).toContain('تولة دهن ١٢ مل د.ك. ١٢٠٫٠٠٠')
    expect(shown).not.toMatch(/[0-9]/)
  })

  it('is labelled by the given element when there is one', () => {
    const html = render('en', { product: oudNoir, value: 'full', variant: 'compact', labelledBy: 'name-1' })
    expect(html).toMatch(/role="radiogroup"[^>]*aria-labelledby="name-1"/)
    expect(html).not.toMatch(/aria-label="/)
  })
})
