import { CONCENTRATIONS, FAMILIES, GENDERS, SILLAGE } from '../../data/taxonomy'

/**
 * The checkbox facets of the filter bar, in display order. Notes are not
 * here: they have their own picker. `level` (projection only) drives the
 * small step meter beside each option.
 */
export const CHECKBOX_FACETS = [
  {
    facet: 'families',
    labelKey: 'catalogue.facet.families',
    options: FAMILIES.map(({ id, en, ar }) => ({ id, label: { en, ar } })),
  },
  {
    facet: 'concentrations',
    labelKey: 'catalogue.facet.concentrations',
    options: CONCENTRATIONS.map(({ id, en, ar }) => ({ id, label: { en, ar } })),
  },
  {
    facet: 'sillage',
    labelKey: 'catalogue.facet.sillage',
    options: SILLAGE.map(({ id, en, ar, level }) => ({ id, label: { en, ar }, level })),
    steps: SILLAGE.length,
  },
  {
    facet: 'genders',
    labelKey: 'catalogue.facet.genders',
    options: GENDERS.map(({ id, en, ar }) => ({ id, label: { en, ar } })),
  },
]

/** How many notes the picker lists at once. */
export const NOTE_LIMIT = 8
