import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import TrustBadges from './TrustBadges'
import { LocaleContext, translate, translateCount, translateValue } from '../i18n/locale-context'

function render(lang) {
  const value = {
    lang,
    isRtl: lang === 'ar',
    t: (key, vars) => translate(lang, key, vars),
    tc: (key, count, vars) => translateCount(lang, key, count, vars),
    tr: (v) => translateValue(lang, v),
  }
  const html = renderToStaticMarkup(
    <LocaleContext.Provider value={value}>
      <TrustBadges />
    </LocaleContext.Provider>,
  )
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

describe('TrustBadges', () => {
  it('names the rest days and the Try First formats from the policy data', () => {
    const en = render('en')
    expect(en).toContain('for delivery today — except on Fridays and in outlying areas.')
    expect(en).toContain('A free 2 ml vial of the same scent with every Full Bottle, 50ml Spray, and Tola Oil.')
    expect(en).not.toContain('{')
  })

  it('in Arabic, with Arabic-Indic digits', () => {
    const ar = render('ar')
    expect(ar).toContain('ما عدا الجمعة والمناطق البعيدة.')
    expect(ar).toContain('عيّنة مجانية بحجم ٢ مل من العطر نفسه.')
    expect(ar).not.toContain('{')
  })
})
