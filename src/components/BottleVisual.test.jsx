import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import BottleVisual from './BottleVisual'
import { PRODUCTS_BY_ID } from '../data/products'
import { LocaleContext, translate, translateCount, translateValue } from '../i18n/locale-context'

function render(lang) {
  const value = {
    lang,
    t: (key, vars) => translate(lang, key, vars),
    tc: (key, count, vars) => translateCount(lang, key, count, vars),
    tr: (v) => translateValue(lang, v),
  }
  return renderToStaticMarkup(
    <LocaleContext.Provider value={value}>
      <BottleVisual palette={PRODUCTS_BY_ID['ambre-royale'].palette} catalogue="04" label="EDP" />
    </LocaleContext.Provider>,
  )
}

const catalogueText = (html) => html.match(/<text[^>]*y="219"[^>]*>([\s\S]*?)<\/text>/)
const textOf = (match) => match[1].replace(/<!-- -->/g, '')

describe('BottleVisual', () => {
  it('prints the catalogue number in Jost in English', () => {
    const match = catalogueText(render('en'))
    expect(textOf(match)).toBe('No. 04')
    expect(match[0]).toContain('font-family="Jost, Futura, sans-serif"')
  })

  it('prints it in Arabic words and digits, in the Arabic face, in Arabic', () => {
    const match = catalogueText(render('ar'))
    expect(textOf(match)).toBe('رقم ٠٤')
    expect(match[0]).toContain('IBM Plex Sans Arabic')
    expect(match[0]).toContain('letter-spacing="0"')
  })
})
