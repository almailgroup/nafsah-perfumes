import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import ProductCard from './ProductCard'
import { CartContext } from '../context/cart-context'
import { PRODUCTS_BY_ID } from '../data/products'
import { LocaleContext, translate, translateCount, translateValue } from '../i18n/locale-context'

/*
 * The card as the collection first renders it, filters and all. Rendered on
 * the server (no DOM in this test run), so what is checked is the format it
 * opens on and the prices it shows.
 */
function render(id, props = {}, lang = 'en') {
  const locale = {
    lang,
    isRtl: lang === 'ar',
    t: (key, vars) => translate(lang, key, vars),
    tc: (key, count, vars) => translateCount(lang, key, count, vars),
    tr: (v) => translateValue(lang, v),
  }
  return renderToStaticMarkup(
    <LocaleContext.Provider value={locale}>
      <CartContext.Provider value={{ addItem: () => true, maxQty: 10 }}>
        <ProductCard product={PRODUCTS_BY_ID[id]} {...props} />
      </CartContext.Provider>
    </LocaleContext.Provider>,
  )
}

const text = (html) => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
// The headline price beside the name: "from KWD 29.000", or just the price.
const headline = (html) => text(html.match(/<p class="flex shrink-0[^"]*">.*?<\/p>/)[0])
const label = (html) => html.match(/<text[^>]*fill-opacity="0.72"[^>]*>([^<]*)<\/text>/i)?.[1]
const checked = (html) => text(html.match(/<button[^>]*aria-checked="true"[^>]*>.*?<\/button>/)[0])
const addButton = (html) => text(html.match(/<button[^>]*class="mt-2 flex w-full[^>]*>.*?<\/button>/)[0])

describe('ProductCard', () => {
  it('with no filters, opens on the full bottle and quotes the cheapest bottle as "from"', () => {
    const html = render('oud-noir')
    expect(label(html)).toBe('EXTRAIT')
    expect(headline(html)).toBe('from KWD 29.000')
    expect(checked(html)).toContain('Full Bottle')
    expect(addButton(html)).toContain('KWD 119.000')
  })

  it('under Attar, opens on the oil and prices it alone', () => {
    const html = render('oud-noir', { concentrations: ['attar'] })
    expect(label(html)).toBe('ATTAR')
    expect(headline(html)).toBe('KWD 29.000')
    expect(checked(html)).toContain('Quarter Tola Oil')
    expect(addButton(html)).toContain('KWD 29.000')
  })

  it('leaves an oil fragrance as it was under Attar', () => {
    expect(render('ward-taifi', { concentrations: ['attar'] })).toBe(render('ward-taifi'))
  })

  it('honours the concentration and the price range together', () => {
    const html = render('ambre-royale', { concentrations: ['extrait'], priceRange: [24000, 100000] })
    expect(label(html)).toBe('EXTRAIT')
    expect(headline(html)).toBe('KWD 89.000')
    expect(checked(html)).toContain('50ml Spray')
  })

  it('says "from" over more than one matching bottle', () => {
    const html = render('ambre-royale', { concentrations: ['extrait', 'attar'], priceRange: [24000, 100000] })
    expect(headline(html)).toBe('from KWD 34.000')
    expect(checked(html)).toContain('50ml Spray')
  })
})
