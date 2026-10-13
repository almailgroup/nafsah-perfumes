import { MapPin } from 'lucide-react'
import { REMOTE_EXTRA_DAYS, REMOTE_SURCHARGE_FILS } from '../../data/delivery'
import { areasIn, AREA_BY_ID, GOVERNORATES, isRemoteArea, OTHER_AREA_ID } from '../../data/kuwait'
import { useLocale } from '../../i18n/locale-context'
import { formatPrice } from '../../lib/format'
import { ChoiceGroup, Field, Select, TextArea, TextInput } from './fields'

/**
 * A Kuwaiti address as Kuwaitis give it: governorate, area, block (قطعة),
 * street (شارع), the optional avenue (جادة), then the building or villa —
 * and for an apartment building, the floor and the flat. The area list
 * follows the governorate; anywhere not listed is "Other area…" and typed.
 *
 * `address` is the address.js shape; `errors` holds dictionary keys.
 * onChange(patch) merges into the address.
 */
export default function AddressFields({ address, buildingType, errors = {}, onChange, onBuildingType }) {
  const { lang, t, tc, tr } = useLocale()
  const areas = address.governorate ? areasIn(address.governorate, lang) : []
  const remote = isRemoteArea(address.area)
  const set = (field) => (event) => onChange({ [field]: event.target.value })

  const chooseGovernorate = (event) => {
    const governorate = event.target.value
    // An area belongs to one governorate; a new governorate starts the area over.
    const keepArea = AREA_BY_ID[address.area]?.governorate === governorate
    onChange({ governorate, area: keepArea ? address.area : '', areaOther: '' })
  }

  return (
    <div className="grid grid-cols-6 gap-x-4 gap-y-5">
      <Field
        name="governorate"
        label={t('checkout.field.governorate')}
        error={errors.governorate}
        className="col-span-6 sm:col-span-3"
      >
        {(aria, invalid) => (
          <Select
            {...aria}
            invalid={invalid}
            autoComplete="address-level1"
            value={address.governorate}
            onChange={chooseGovernorate}
          >
            <option value="" disabled>
              {t('checkout.field.governorateChoose')}
            </option>
            {GOVERNORATES.map((governorate) => (
              <option key={governorate.id} value={governorate.id}>
                {tr(governorate)}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field name="area" label={t('checkout.field.area')} error={errors.area} className="col-span-6 sm:col-span-3">
        {(aria, invalid) => (
          <Select
            {...aria}
            invalid={invalid}
            autoComplete="address-level2"
            disabled={!address.governorate}
            value={address.area}
            onChange={(event) => onChange({ area: event.target.value, areaOther: '' })}
          >
            <option value="" disabled>
              {t(address.governorate ? 'checkout.field.areaChoose' : 'checkout.field.areaFirst')}
            </option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {tr(area)}
              </option>
            ))}
            {address.governorate && <option value={OTHER_AREA_ID}>{t('checkout.area.other')}</option>}
          </Select>
        )}
      </Field>

      {address.area === OTHER_AREA_ID && (
        <Field name="areaOther" label={t('checkout.field.areaOther')} error={errors.areaOther} className="col-span-6">
          {(aria, invalid) => (
            <TextInput
              {...aria}
              invalid={invalid}
              autoComplete="address-level3"
              value={address.areaOther}
              onChange={set('areaOther')}
            />
          )}
        </Field>
      )}

      {/* Announced when an outlying area is picked: its extra day and its fee. */}
      <div aria-live="polite" className="col-span-6 empty:hidden">
        {remote && (
          <p className="flex items-start gap-3 border-s-2 border-gold-500 bg-snow-100 px-4 py-3 font-sans text-[14px] leading-snug text-ink-950 rtl:font-sans-ar">
            <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-green-600" strokeWidth={1.5} />
            {tc('checkout.remote.note', REMOTE_EXTRA_DAYS, {
              area: tr(AREA_BY_ID[address.area]),
              fee: formatPrice(REMOTE_SURCHARGE_FILS, lang),
            })}
          </p>
        )}
      </div>

      <Field
        name="block"
        label={t('checkout.field.block')}
        help={t('checkout.field.blockHelp')}
        error={errors.block}
        className="col-span-3 sm:col-span-2"
      >
        {(aria, invalid) => (
          <TextInput
            {...aria}
            invalid={invalid}
            dir="ltr"
            inputMode="numeric"
            autoComplete="off"
            maxLength={12}
            value={address.block}
            onChange={set('block')}
            className="rtl:text-right"
          />
        )}
      </Field>

      <Field
        name="street"
        label={t('checkout.field.street')}
        help={t('checkout.field.streetHelp')}
        error={errors.street}
        className="col-span-3 sm:col-span-2"
      >
        {(aria, invalid) => (
          <TextInput
            {...aria}
            invalid={invalid}
           
            autoComplete="address-line1"
            value={address.street}
            onChange={set('street')}
          />
        )}
      </Field>

      <Field
        name="avenue"
        label={t('checkout.field.avenue')}
        optional
        error={errors.avenue}
        className="col-span-6 sm:col-span-2"
      >
        {(aria, invalid) => (
          <TextInput {...aria} invalid={invalid} autoComplete="off" value={address.avenue} onChange={set('avenue')} />
        )}
      </Field>

      <ChoiceGroup
        name="buildingType"
        variant="segmented"
        legend={t('checkout.buildingType.legend')}
        value={buildingType}
        onChange={onBuildingType}
        options={[
          { value: 'house', label: t('checkout.buildingType.house') },
          { value: 'apartment', label: t('checkout.buildingType.apartment') },
        ]}
        className="col-span-6"
      />

      <Field
        name="building"
        label={t('checkout.field.building')}
        error={errors.building}
        className="col-span-6 sm:col-span-2"
      >
        {(aria, invalid) => (
          <TextInput
            {...aria}
            invalid={invalid}
           
            autoComplete="address-line2"
            value={address.building}
            onChange={set('building')}
          />
        )}
      </Field>

      {buildingType === 'apartment' && (
        <>
          <Field
            name="floor"
            label={t('checkout.field.floor')}
            optional
            error={errors.floor}
            className="col-span-3 sm:col-span-2"
          >
            {(aria, invalid) => (
              <TextInput {...aria} invalid={invalid} autoComplete="off" value={address.floor} onChange={set('floor')} />
            )}
          </Field>
          <Field
            name="apartment"
            label={t('checkout.field.apartment')}
            optional
            error={errors.apartment}
            className="col-span-3 sm:col-span-2"
          >
            {(aria, invalid) => (
              <TextInput
                {...aria}
                invalid={invalid}
               
                autoComplete="off"
                value={address.apartment}
                onChange={set('apartment')}
              />
            )}
          </Field>
        </>
      )}

      <Field
        name="directions"
        label={t('checkout.field.directions')}
        help={t('checkout.field.directionsHelp')}
        optional
        error={errors.directions}
        className="col-span-6"
      >
        {(aria, invalid) => (
          <TextArea {...aria} invalid={invalid} value={address.directions} onChange={set('directions')} />
        )}
      </Field>
    </div>
  )
}
