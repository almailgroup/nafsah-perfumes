import DocumentPage from '../components/DocumentPage'
import { SHIPPING_DOC } from '../data/help'
import { useLocale } from '../i18n/locale-context'

/** /shipping, loaded on demand. */
export default function ShippingPage() {
  const { t } = useLocale()
  return <DocumentPage doc={SHIPPING_DOC} eyebrow={t('helpEyebrow')} />
}
