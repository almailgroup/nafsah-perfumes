import DocumentPage from '../components/DocumentPage'
import { LEGAL, LEGAL_NOTE } from '../data/legal'
import { useLocale } from '../i18n/locale-context'

/** /privacy and /terms, loaded on demand: `doc` is 'privacy' or 'terms'. */
export default function LegalPage({ doc }) {
  const { t } = useLocale()
  return <DocumentPage doc={LEGAL[doc]} note={LEGAL_NOTE} eyebrow={t('legalEyebrow')} />
}
