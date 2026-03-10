import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
      <div className="max-w-lg w-full text-center">
        <p className="text-sm font-semibold text-[#5B7CFF] mb-3">Erreur 404</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Page introuvable
        </h1>
        <p className="text-gray-600 mb-8">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-[#5B7CFF] px-5 py-3 text-white font-semibold hover:opacity-90 transition"
          >
            Retour à l&apos;accueil
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 px-5 py-3 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            Voir les événements
          </Link>
        </div>
      </div>
    </div>
  );
}
