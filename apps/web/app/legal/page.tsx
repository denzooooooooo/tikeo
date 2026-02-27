'use client';

import Link from 'next/link';
import {
  ShieldIcon,
  BuildingIcon,
  FileIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
} from '@tikeo/ui';

const companyInfo = {
  name: 'Tikeo',
  legalName: 'TIKEO SAS',
  siret: '123 456 789 00012',
  tva: 'FR12 123456789',
  address: '10 Rue de la Innovation',
  city: '75001 Paris',
  country: 'France',
  phone: '+33 1 23 45 67 89',
  email: 'legal@tikeo.com',
  ceo: 'Marie Dupont',
  createdAt: '2022',
};

const legalDocuments = [
  { title: 'Conditions Générales d\'Utilisation', url: '/cgu', icon: '📋' },
  { title: 'Politique de Confidentialité', url: '/privacy', icon: '🔒' },
  { title: 'Politique de Cookies', url: '/cookies', icon: '🍪' },
  { title: 'Conditions de Vente', url: '/terms', icon: '💳' },
];

const regulators = [
  { name: 'CNIL', description: 'Commission Nationale de l\'Informatique et des Libertés', url: 'https://www.cnil.fr' },
  { name: 'DGCCRF', description: 'Direction Générale de la Concurrence, de la Consommation et de la Répression des Fraudes', url: 'https://www.economie.gouv.fr' },
];

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <ShieldIcon className="text-white" size={48} />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Mentions Légales
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Informations légales et conformité réglementaire de Tikeo
            </p>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Company Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <BuildingIcon className="text-[#5B7CFF]" size={32} />
            Identité de l&apos;entreprise
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Raison sociale
                </h3>
                <p className="text-gray-900 font-medium">{companyInfo.legalName}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Marque
                </h3>
                <p className="text-gray-900 font-medium">{companyInfo.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Siège social
                </h3>
                <p className="text-gray-900 font-medium">
                  {companyInfo.address}<br />
                  {companyInfo.city}<br />
                  {companyInfo.country}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Capital social
                </h3>
                <p className="text-gray-900 font-medium">100 000 €</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  SIRET
                </h3>
                <p className="text-gray-900 font-medium">{companyInfo.siret}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  N° TVA intracommunautaire
                </h3>
                <p className="text-gray-900 font-medium">{companyInfo.tva}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Dirigeant
                </h3>
                <p className="text-gray-900 font-medium">{companyInfo.ceo}, Présidente</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Date de création
                </h3>
                <p className="text-gray-900 font-medium">{companyInfo.createdAt}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <PhoneIcon className="text-[#5B7CFF]" size={32} />
            Coordonnées
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <PhoneIcon className="text-[#5B7CFF]" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Téléphone</h3>
                  <p className="text-sm text-gray-500">Du lundi au vendredi 9h-18h</p>
                </div>
              </div>
              <p className="text-[#5B7CFF] font-medium">{companyInfo.phone}</p>
            </div>
            <div className="p-6 bg-gray-50 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <MailIcon className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-sm text-gray-500">Réponse sous 48h</p>
                </div>
              </div>
              <p className="text-gray-900 font-medium">{companyInfo.email}</p>
            </div>
          </div>
        </section>

        {/* Legal Documents */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FileIcon className="text-[#5B7CFF]" size={32} />
            Documents juridiques
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {legalDocuments.map((doc) => (
              <Link
                key={doc.url}
                href={doc.url}
                className="flex items-center gap-4 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors group"
              >
                <span className="text-3xl">{doc.icon}</span>
                <span className="flex-1 font-medium text-gray-900 group-hover:text-[#5B7CFF] transition-colors">
                  {doc.title}
                </span>
                <span className="text-[#5B7CFF]">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Hosting */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <ShieldIcon className="text-[#5B7CFF]" size={32} />
            Hébergement
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="font-semibold text-gray-900 mb-4">Hébergement du site</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Prestataire</p>
                <p className="text-gray-900 font-medium">Vercel Inc.</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Adresse</p>
                <p className="text-gray-900 font-medium">
                  440 N Barranca Ave #4133<br />
                  Covina, CA 91723<br />
                  États-Unis
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Site web</p>
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#5B7CFF] hover:underline">
                  vercel.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Regulators */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <ShieldIcon className="text-[#5B7CFF]" size={32} />
            Autorités de contrôle
          </h2>
          <div className="bg-blue-50 rounded-2xl p-8">
            <p className="text-gray-700 mb-6">
              Tikeo est enregistré auprès des autorités françaises et européennes suivantes :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regulators.map((regulator) => (
                <div key={regulator.name} className="p-4 bg-white rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-1">{regulator.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{regulator.description}</p>
                  <a href={regulator.url} target="_blank" rel="noopener noreferrer" className="text-[#5B7CFF] text-sm hover:underline">
                    Visiter le site →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FileIcon className="text-[#5B7CFF]" size={32} />
            Propriété intellectuelle
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, etc.) 
              est la propriété exclusive de Tikeo SAS, sauf mention contraire. Toute reproduction, 
              représentation, modification, publication, transmission, ou plus généralement toute 
              exploitation non autorisée du site ou de l&apos;un de ses éléments sera considérée comme 
              constitutive d&apos;une contrefaçon et poursuivie conformément aux dispositions du Code 
              de la propriété intellectuelle.
            </p>
            <p>
              Les marques et logos Tikeo sont des marques déposées. Toute utilisation de ces marques 
              sans autorisation préalable écrite est strictement interdite.
            </p>
          </div>
        </section>

        {/* Liability */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <ShieldIcon className="text-[#5B7CFF]" size={32} />
            Responsabilité
          </h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p>
              Tikeo s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations 
              diffusées sur ce site. Toutefois, Tikeo ne peut garantir l&apos;exactitude, la précision 
              ou l&apos;exhaustivité des informations mises à disposition sur ce site. En conséquence, 
              Tikeo décline toute responsabilité pour toute imprécision, inexactitude ou omission 
              portant sur des informations disponibles sur ce site.
            </p>
            <p>
              Tikeo se réserve le droit de modifier, à tout moment et sans préavis, le contenu de ce 
              site. Nous déclinons toute responsabilité quant aux conséquences de telles modifications.
            </p>
          </div>
        </section>

        {/* Applicable Law */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <FileIcon className="text-[#5B7CFF]" size={32} />
            Droit applicable
          </h2>
          <div className="bg-gray-50 rounded-2xl p-8">
            <p className="text-gray-600 mb-4">
              Les présentes mentions légales sont soumises au droit français.
            </p>
            <p className="text-gray-600 mb-4">
              En cas de litige, les tribunaux de Paris seront seuls compétents.
            </p>
            <p className="text-gray-600">
              <strong>Dernière mise à jour :</strong> Mars 2024
            </p>
          </div>
        </section>

        {/* Contact CTA */}
        <div className="bg-gradient-to-br from-[#5B7CFF] to-[#7B61FF] rounded-3xl p-8 lg:p-12 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Une question juridique ?</h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Pour toute question concernant ces mentions légales, notre équipe juridique est à votre disposition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={`mailto:${companyInfo.email}`}
                className="px-8 py-4 bg-white text-[#5B7CFF] rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                Contacter le service juridique
              </a>
              <Link
                href="/contact"
                className="px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Nous contacter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

