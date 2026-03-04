import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentions Légales | Tikeo',
  description: 'Mentions légales de la plateforme Tikeo - informations sur l\'éditeur, l\'hébergeur et les conditions d\'utilisation.',
  alternates: { canonical: 'https://tikeo.com/mentions-legales' },
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Retour à l&apos;accueil
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Mentions Légales</h1>
          </div>
          <p className="text-gray-500 text-sm">Dernière mise à jour : 15 janvier 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">

        {/* 1. Éditeur */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>1</span>
            Éditeur du site
          </h2>
          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p>Le site <strong className="text-gray-900">tikeo.com</strong> est édité par :</p>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p><strong className="text-gray-900">Tikeo SAS</strong></p>
              <p>Société par Actions Simplifiée au capital de 10 000 €</p>
              <p>Siège social : [Adresse à compléter]</p>
              <p>SIRET : [Numéro à compléter]</p>
              <p>RCS : [Ville] [Numéro à compléter]</p>
              <p>TVA intracommunautaire : [Numéro à compléter]</p>
            </div>
            <p><strong className="text-gray-900">Directeur de la publication :</strong> [Nom du directeur]</p>
            <p>
              <strong className="text-gray-900">Contact :</strong>{' '}
              <a href="mailto:contact@tikeo.com" className="text-[#5B7CFF] hover:underline">contact@tikeo.com</a>
            </p>
          </div>
        </section>

        {/* 2. Hébergement */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>2</span>
            Hébergement
          </h2>
          <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
            <div>
              <p className="font-semibold text-gray-900 mb-1">Frontend (site web) :</p>
              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                <p><strong>Vercel Inc.</strong></p>
                <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
                <p>Site : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#5B7CFF] hover:underline">vercel.com</a></p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Backend (API) :</p>
              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                <p><strong>Railway Corp.</strong></p>
                <p>548 Market St PMB 68956, San Francisco, CA 94104, États-Unis</p>
                <p>Site : <a href="https://railway.app" target="_blank" rel="noopener noreferrer" className="text-[#5B7CFF] hover:underline">railway.app</a></p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Base de données :</p>
              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                <p><strong>Supabase Inc.</strong></p>
                <p>970 Toa Payoh North #07-04, Singapore 318992</p>
                <p>Site : <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#5B7CFF] hover:underline">supabase.com</a></p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Propriété intellectuelle */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>3</span>
            Propriété intellectuelle
          </h2>
          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p>
              L&apos;ensemble du contenu du site Tikeo (textes, images, logos, icônes, vidéos, sons, données, graphiques) est protégé par le droit de la propriété intellectuelle et est la propriété exclusive de Tikeo SAS ou de ses partenaires.
            </p>
            <p>
              Toute reproduction, représentation, modification, publication, adaptation ou exploitation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l&apos;autorisation écrite préalable de Tikeo SAS.
            </p>
            <p>
              La marque <strong className="text-gray-900">Tikeo</strong> et le logo associé sont des marques déposées. Toute utilisation non autorisée constitue une contrefaçon sanctionnée par le Code de la propriété intellectuelle.
            </p>
          </div>
        </section>

        {/* 4. Données personnelles */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>4</span>
            Protection des données personnelles
          </h2>
          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p>
              Tikeo SAS collecte et traite des données personnelles dans le cadre de la fourniture de ses services. Ces traitements sont effectués conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
            </p>
            <p>
              <strong className="text-gray-900">Responsable du traitement :</strong> Tikeo SAS — <a href="mailto:privacy@tikeo.com" className="text-[#5B7CFF] hover:underline">privacy@tikeo.com</a>
            </p>
            <p>
              Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement, de portabilité et d&apos;opposition concernant vos données personnelles. Pour exercer ces droits, contactez-nous à <a href="mailto:privacy@tikeo.com" className="text-[#5B7CFF] hover:underline">privacy@tikeo.com</a>.
            </p>
            <p>
              Pour plus d&apos;informations, consultez notre{' '}
              <Link href="/privacy" className="text-[#5B7CFF] hover:underline font-medium">Politique de confidentialité</Link>.
            </p>
          </div>
        </section>

        {/* 5. Cookies */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>5</span>
            Cookies
          </h2>
          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p>
              Le site Tikeo utilise des cookies pour améliorer l&apos;expérience utilisateur, analyser le trafic et personnaliser les contenus. En naviguant sur le site, vous acceptez l&apos;utilisation de cookies conformément à notre politique.
            </p>
            <p>
              Vous pouvez à tout moment modifier vos préférences en matière de cookies via les paramètres de votre navigateur ou via notre{' '}
              <Link href="/cookies" className="text-[#5B7CFF] hover:underline font-medium">Politique de cookies</Link>.
            </p>
          </div>
        </section>

        {/* 6. Responsabilité */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>6</span>
            Limitation de responsabilité
          </h2>
          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p>
              Tikeo SAS s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations diffusées sur le site. Cependant, Tikeo SAS ne peut garantir l&apos;exactitude, la précision ou l&apos;exhaustivité des informations mises à disposition.
            </p>
            <p>
              Tikeo SAS décline toute responsabilité pour tout dommage direct ou indirect résultant de l&apos;utilisation du site ou de l&apos;impossibilité d&apos;y accéder, ainsi que de l&apos;utilisation de liens hypertextes.
            </p>
            <p>
              Les organisateurs d&apos;événements sont seuls responsables du contenu de leurs annonces et de l&apos;organisation de leurs événements. Tikeo SAS agit en qualité d&apos;intermédiaire technique.
            </p>
          </div>
        </section>

        {/* 7. Droit applicable */}
        <section className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>7</span>
            Droit applicable et juridiction
          </h2>
          <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
            <p>
              Les présentes mentions légales sont régies par les lois applicables au lieu d&apos;établissement de Tikeo SAS. En cas de litige, les parties s&apos;engagent à rechercher une solution amiable avant tout recours judiciaire.
            </p>
            <p>
              À défaut d&apos;accord amiable, tout litige relatif à l&apos;utilisation du site sera soumis aux tribunaux compétents.
            </p>
          </div>
        </section>

        {/* 8. Contact */}
        <section className="bg-gradient-to-r from-[#5B7CFF]/10 to-[#7B61FF]/10 rounded-2xl p-8 border border-[#5B7CFF]/20">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
          <p className="text-gray-600 text-sm mb-4">
            Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter :
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:legal@tikeo.com"
              className="inline-flex items-center gap-2 px-4 py-2.5 text-white text-sm font-semibold rounded-xl transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              legal@tikeo.com
            </a>
            <Link href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2.5 border-2 border-[#5B7CFF] text-[#5B7CFF] text-sm font-semibold rounded-xl transition-all hover:bg-[#5B7CFF] hover:text-white">
              Formulaire de contact
            </Link>
          </div>
        </section>

        {/* Liens légaux */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 pb-8">
          <Link href="/privacy" className="hover:text-[#5B7CFF] transition-colors">Politique de confidentialité</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-[#5B7CFF] transition-colors">Conditions d&apos;utilisation</Link>
          <span>·</span>
          <Link href="/cookies" className="hover:text-[#5B7CFF] transition-colors">Politique de cookies</Link>
          <span>·</span>
          <Link href="/cgu" className="hover:text-[#5B7CFF] transition-colors">CGU</Link>
        </div>
      </div>
    </div>
  );
}
