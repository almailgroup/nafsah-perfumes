/**
 * Runtime validation of the catalogue. The tests run every product through
 * here, so a typo in a note id, a family mix that does not add up or a price
 * typed in dinars instead of fils fails the build instead of the storefront.
 *
 * Both functions return a list of readable messages; an empty list is valid.
 * Messages are for the people editing src/data, so they stay in English.
 */

import { NOTES } from './notes'
import {
  CONCENTRATION_BY_ID,
  FAMILY_BY_ID,
  FORMAT_BY_ID,
  FORMATS,
  GENDER_BY_ID,
  LAYERING_KIND_BY_ID,
  OCCASION_BY_ID,
  SEASON_BY_ID,
  SILLAGE_BY_ID,
} from './taxonomy'

const ARABIC_LETTER = /[ء-ي]/
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const HEX_COLOUR = /^#[0-9a-f]{6}$/i

/** The house was founded in 1974; nothing in the catalogue predates it. */
const FIRST_YEAR = 1974
const SAMPLE_MIN_FILS = 3500
const SAMPLE_MAX_FILS = 6500
const MAX_FAMILIES = 4
const MAX_NOTES_PER_TIER = 5
const MAX_LAYERING = 3
const PALETTE_KEYS = ['from', 'via', 'to', 'glass']
const NOTE_TIERS = ['topNotes', 'heartNotes', 'baseNotes']
const ORDER_OF_FORMAT = Object.fromEntries(FORMATS.map((entry, index) => [entry.id, index]))

const REQUIRED_KEYS = [
  'id',
  'name',
  'tagline',
  'description',
  'family',
  'familyProfile',
  'concentration',
  'gender',
  'longevity',
  'projectionSillage',
  'heatResistance',
  'seasons',
  'occasions',
  ...NOTE_TIERS,
  'layering',
  'formats',
  'palette',
  'year',
  'bestseller',
  'isNew',
]
const KNOWN_KEYS = new Set(REQUIRED_KEYS)

/** Fields the house once invented; ratings now come only from real reviews. */
const RETIRED_KEYS = {
  rating: 'must not carry a rating: ratings come only from real reviews',
  reviews: 'must not carry a review count: counts come only from real reviews',
  sizes: 'uses the retired `sizes` list: use `formats`',
  notes: 'uses the retired `notes` object: use topNotes / heartNotes / baseNotes',
  intensity: 'uses the retired `intensity` field: use projectionSillage',
  ar: 'uses the retired `ar` block: every text field is an { en, ar } object',
}

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
const isText = (value) => typeof value === 'string' && value.trim() !== ''
const isPositiveInt = (value) => Number.isInteger(value) && value > 0
const show = (value) => (typeof value === 'string' ? `"${value}"` : String(value))

function checkBilingual(value, field, errors) {
  if (!isObject(value)) {
    errors.push(`${field} must be an { en, ar } object`)
    return
  }
  if (!isText(value.en)) errors.push(`${field}.en must be a non-empty string`)
  if (!isText(value.ar)) errors.push(`${field}.ar must be a non-empty string`)
  else if (!ARABIC_LETTER.test(value.ar)) errors.push(`${field}.ar must be written in Arabic`)
}

function checkEnum(value, field, map, errors) {
  if (!Object.hasOwn(map, value)) {
    errors.push(`${field} ${show(value)} is not one of: ${Object.keys(map).join(', ')}`)
  }
}

function checkEnumList(value, field, map, errors) {
  if (!Array.isArray(value) || value.length === 0) {
    errors.push(`${field} must be a non-empty list`)
    return
  }
  value.forEach((entry, index) => checkEnum(entry, `${field}[${index}]`, map, errors))
  if (new Set(value).size !== value.length) errors.push(`${field} lists the same value twice`)
}

function checkFamilyProfile(product, errors) {
  const { family, familyProfile: profile } = product
  if (!isObject(profile)) {
    errors.push('familyProfile must be an object of { familyId: percent }')
    return
  }
  const entries = Object.entries(profile)
  if (entries.length < 1 || entries.length > MAX_FAMILIES) {
    errors.push(`familyProfile must have 1–${MAX_FAMILIES} families (has ${entries.length})`)
  }
  let total = 0
  for (const [id, share] of entries) {
    checkEnum(id, 'familyProfile key', FAMILY_BY_ID, errors)
    if (!isPositiveInt(share)) {
      errors.push(`familyProfile.${id} must be a positive whole percent (got ${show(share)})`)
    } else {
      total += share
    }
  }
  if (total !== 100) errors.push(`familyProfile must add up to 100 (adds up to ${total})`)
  if (!Object.hasOwn(profile, family)) {
    errors.push(`familyProfile must include the primary family ${show(family)}`)
    return
  }
  const largest = Math.max(...entries.map(([, share]) => share))
  if (profile[family] < largest) {
    errors.push(`family ${show(family)} must be the largest share of familyProfile`)
  }
}

function checkNotes(product, errors) {
  const seen = new Set()
  for (const tier of NOTE_TIERS) {
    const list = product[tier]
    if (!Array.isArray(list) || list.length === 0 || list.length > MAX_NOTES_PER_TIER) {
      errors.push(`${tier} must list 1–${MAX_NOTES_PER_TIER} notes`)
      continue
    }
    list.forEach((note, index) => {
      if (!note || NOTES[note.id] !== note) {
        errors.push(`${tier}[${index}] is not an entry of NOTES (check the note id in notes.js)`)
        return
      }
      if (seen.has(note.id)) errors.push(`note "${note.id}" appears more than once in the pyramid`)
      seen.add(note.id)
    })
  }
}

function checkLayering(product, productsById, errors) {
  const { layering } = product
  if (!Array.isArray(layering) || layering.length === 0 || layering.length > MAX_LAYERING) {
    errors.push(`layering must list 1–${MAX_LAYERING} pairings`)
    return
  }
  const partners = new Set()
  layering.forEach((pairing, index) => {
    const field = `layering[${index}]`
    if (!isObject(pairing)) {
      errors.push(`${field} must be an object`)
      return
    }
    checkEnum(pairing.kind, `${field}.kind`, LAYERING_KIND_BY_ID, errors)
    checkBilingual(pairing.how, `${field}.how`, errors)

    if (pairing.kind === 'bukhoor') {
      checkBilingual(pairing.name, `${field}.name`, errors)
      if (pairing.productId !== undefined) {
        errors.push(`${field} is bukhoor, which is generic: it must not link a productId`)
      }
      return
    }

    const { productId } = pairing
    if (!isText(productId)) {
      errors.push(`${field}.productId must name the fragrance to layer with`)
      return
    }
    if (productId === product.id) errors.push(`${field} pairs the fragrance with itself`)
    if (partners.has(productId)) errors.push(`${field} repeats the pairing with "${productId}"`)
    partners.add(productId)
    if (!productsById) return

    const partner = productsById[productId]
    if (!partner) {
      errors.push(`${field}.productId "${productId}" is not in the catalogue`)
      return
    }
    const partnerIsOil = partner.concentration === 'attar'
    if (pairing.kind === 'attar' && !partnerIsOil) {
      errors.push(`${field} is an attar pairing but "${productId}" is a spray`)
    }
    if (pairing.kind === 'spray' && partnerIsOil) {
      errors.push(`${field} is a spray pairing but "${productId}" is an oil`)
    }
  })
}

function checkFormats(product, errors) {
  const { formats, concentration } = product
  if (!Array.isArray(formats) || formats.length === 0) {
    errors.push('formats must be a non-empty list')
    return
  }
  const ids = []
  const valid = []
  formats.forEach((entry, index) => {
    const field = `formats[${index}]`
    if (!isObject(entry)) {
      errors.push(`${field} must be an object`)
      return
    }
    const standard = FORMAT_BY_ID[entry.id]
    if (!standard) {
      checkEnum(entry.id, `${field}.id`, FORMAT_BY_ID, errors)
      return
    }
    ids.push(entry.id)
    if (entry.ml !== standard.ml) {
      errors.push(`${field} (${entry.id}) must hold ${standard.ml} ml (got ${show(entry.ml)})`)
    }
    if (!isPositiveInt(entry.priceFils)) {
      errors.push(`${field} (${entry.id}) priceFils must be a positive whole number of fils (got ${show(entry.priceFils)})`)
      return
    }
    valid.push({ ...entry, kind: standard.kind })
  })

  if (new Set(ids).size !== ids.length) errors.push('formats lists the same format twice')
  const ordered = [...ids].sort((a, b) => ORDER_OF_FORMAT[a] - ORDER_OF_FORMAT[b])
  if (ordered.join() !== ids.join()) {
    errors.push(`formats must follow the display order ${FORMATS.map((f) => f.id).join(', ')}`)
  }

  const sample = valid.find((entry) => entry.kind === 'sample')
  if (!ids.includes('sample')) errors.push('formats must include a 2 ml sample')
  else if (sample && (sample.priceFils < SAMPLE_MIN_FILS || sample.priceFils > SAMPLE_MAX_FILS)) {
    errors.push(`the sample must cost ${SAMPLE_MIN_FILS}–${SAMPLE_MAX_FILS} fils (got ${sample.priceFils})`)
  }

  if (concentration === 'attar') {
    const sprays = ids.filter((id) => FORMAT_BY_ID[id].kind === 'spray')
    if (sprays.length) errors.push(`an attar is sold as oil only, not as ${sprays.join(', ')}`)
    if (!ids.some((id) => FORMAT_BY_ID[id].kind === 'oil')) {
      errors.push('an attar must offer a tola or a quarter tola')
    }
  } else if (Object.hasOwn(CONCENTRATION_BY_ID, concentration)) {
    for (const required of ['full', 'spray50']) {
      if (!ids.includes(required)) errors.push(`a spray fragrance must offer the ${required} format`)
    }
    if (ids.includes('tola')) {
      errors.push('a spray fragrance offers oil as a quarter tola only, not a full tola')
    }
  }

  // Bigger formats cost more: a price typed in dinars or a swapped pair shows up here.
  const byVolume = [...valid].sort((a, b) => a.ml - b.ml)
  for (let i = 1; i < byVolume.length; i += 1) {
    if (byVolume[i].priceFils <= byVolume[i - 1].priceFils) {
      errors.push(`${byVolume[i].id} must cost more than the smaller ${byVolume[i - 1].id}`)
    }
  }
}

function checkPalette(palette, errors) {
  if (!isObject(palette)) {
    errors.push('palette must be an object of { from, via, to, glass }')
    return
  }
  for (const key of PALETTE_KEYS) {
    if (!HEX_COLOUR.test(palette[key] ?? '')) {
      errors.push(`palette.${key} must be a #rrggbb colour (got ${show(palette[key])})`)
    }
  }
}

/**
 * Every problem with one product, as readable messages prefixed by its id.
 * Pass `productsById` to also check that layering partners exist and are
 * the right kind (validateCatalogue does this for you).
 */
export function validateProduct(product, { productsById } = {}) {
  if (!isObject(product)) return ['product must be an object']
  const errors = []

  for (const key of REQUIRED_KEYS) {
    if (product[key] === undefined) errors.push(`is missing ${key}`)
  }
  for (const key of Object.keys(product)) {
    if (RETIRED_KEYS[key]) errors.push(RETIRED_KEYS[key])
    else if (!KNOWN_KEYS.has(key)) errors.push(`has an unknown field "${key}"`)
  }

  if (!isText(product.id) || !ID_PATTERN.test(product.id)) {
    errors.push(`id must be lowercase kebab-case (got ${show(product.id)})`)
  }
  checkBilingual(product.name, 'name', errors)
  checkBilingual(product.tagline, 'tagline', errors)
  checkBilingual(product.description, 'description', errors)

  checkEnum(product.family, 'family', FAMILY_BY_ID, errors)
  checkFamilyProfile(product, errors)
  checkEnum(product.concentration, 'concentration', CONCENTRATION_BY_ID, errors)
  checkEnum(product.gender, 'gender', GENDER_BY_ID, errors)
  checkEnum(product.projectionSillage, 'projectionSillage', SILLAGE_BY_ID, errors)
  checkEnumList(product.seasons, 'seasons', SEASON_BY_ID, errors)
  checkEnumList(product.occasions, 'occasions', OCCASION_BY_ID, errors)

  const { longevity, heatResistance } = product
  if (typeof longevity !== 'number' || !Number.isFinite(longevity) || longevity < 1 || longevity > 24) {
    errors.push(`longevity must be 1–24 hours (got ${show(longevity)})`)
  }
  if (!Number.isInteger(heatResistance) || heatResistance < 1 || heatResistance > 5) {
    errors.push(`heatResistance must be a whole number 1–5 (got ${show(heatResistance)})`)
  }

  checkNotes(product, errors)
  checkLayering(product, productsById, errors)
  checkFormats(product, errors)
  checkPalette(product.palette, errors)

  const lastYear = new Date().getFullYear() + 1
  if (!Number.isInteger(product.year) || product.year < FIRST_YEAR || product.year > lastYear) {
    errors.push(`year must be a whole year ${FIRST_YEAR}–${lastYear} (got ${show(product.year)})`)
  }
  for (const flag of ['bestseller', 'isNew']) {
    if (product[flag] !== undefined && typeof product[flag] !== 'boolean') {
      errors.push(`${flag} must be true or false`)
    }
  }

  const label = isText(product.id) ? product.id : 'product'
  return errors.map((message) => `${label}: ${message}`)
}

/** Every problem with the whole catalogue: each product, plus duplicates across products. */
export function validateCatalogue(products) {
  if (!Array.isArray(products) || products.length === 0) {
    return ['the catalogue must be a non-empty list of products']
  }
  const errors = []
  const productsById = {}
  const firstIndex = {}
  const names = { en: new Map(), ar: new Map() }

  products.forEach((product, index) => {
    const id = product?.id
    if (!isText(id)) return
    if (Object.hasOwn(firstIndex, id)) {
      errors.push(`${id}: id is used twice (products ${firstIndex[id] + 1} and ${index + 1})`)
      return
    }
    firstIndex[id] = index
    productsById[id] = product
    for (const lang of ['en', 'ar']) {
      const name = product.name?.[lang]
      if (!isText(name)) continue
      const other = names[lang].get(name)
      if (other) errors.push(`${id}: name.${lang} "${name}" is already used by ${other}`)
      else names[lang].set(name, id)
    }
  })

  products.forEach((product, index) => {
    const messages = validateProduct(product, { productsById })
    const id = product?.id
    errors.push(...(isText(id) ? messages : messages.map((m) => `products[${index}] ${m}`)))
  })
  return errors
}
