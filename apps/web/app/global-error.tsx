'use client';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  console.error('Global error boundary:', error);

  return (
    <html lang="fr">
      <body>
        <div className="min-h-screen flex items-center justify-center px-6 py-16 bg-white">
          <div className="max-w-lg w-full text-center">
            <p className="text-sm font-semibold text-red-600 mb-3">Erreur critique</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Une erreur globale est survenue
            </h2>
            <p className="text-gray-600 mb-8">
              Nous rencontrons un problème technique temporaire.
            </p>
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center rounded-xl bg-[#5B7CFF] px-5 py-3 text-white font-semibold hover:opacity-90 transition"
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
