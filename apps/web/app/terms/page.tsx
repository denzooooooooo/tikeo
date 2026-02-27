export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Conditions générales</h1>
          <p className="text-gray-600 mt-2">Dernière mise à jour : février 2026</p>
        </div>

        <article className="prose prose-lg mx-auto">
          <h2>1. Acceptation des conditions</h2>
          <p>
            En utilisant la plateforme Tikeo, vous acceptez nos conditions générales. Ces règles encadrent l'utilisation des services proposés.
          </p>

          <h2>2. Services</h2>
          <p>
            Tikeo met à disposition une plateforme de création, promotion et billetterie d'événements. Les organisateurs sont responsables du contenu publié.
          </p>

          <h2>3. Paiements</h2>
          <p>
            Les paiements sont traités via des prestataires externes (Stripe, etc.). Les frais éventuels sont indiqués lors de la souscription.
          </p>

          <h2>4. Propriété intellectuelle</h2>
          <p>
            Les contenus disponibles sur la plateforme sont protégés. Toute reproduction sans accord est interdite.
          </p>

          <h2>5. Contact</h2>
          <p>
            Pour toute question concernant ces conditions, voir la page <a href="/contact">Contact</a>.
          </p>
        </article>
      </div>
    </div>
  );
}
