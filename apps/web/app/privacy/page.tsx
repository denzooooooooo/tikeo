import { LockIcon, CheckCircleIcon, MailIcon } from '@tikeo/ui';
import Link from 'next/link';

export default function PrivacyPage() {
	return (
		<div className="min-h-screen bg-white py-16">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-4 mb-8">
					<div className="p-3 rounded-lg bg-[#F0F4FF]">
						<LockIcon size={28} className="text-[#4C6FFF]" />
					</div>
					<div>
						<h1 className="text-3xl font-bold">Politique de confidentialité</h1>
						<p className="text-sm text-gray-600">Comment nous collectons, utilisons et protégeons vos données.</p>
					</div>
				</div>

				<section className="prose prose-lg text-gray-700">
					<p className="text-sm text-gray-500 mb-8">
						Dernière mise à jour : Mars 2024 | Version 2.0
					</p>

					<h2>Résumé</h2>
					<p>
						Nous respectons votre vie privée. Cette page explique les types de données que nous collectons,
						pourquoi nous les utilisons et les choix dont vous disposez. Conformément au RGPD (Règlement Général 
						sur la Protection des Données), nous nous engageons à protéger vos données personnelles.
					</p>

					<div className="my-8 p-6 bg-blue-50 rounded-lg border border-blue-100">
						<h3 className="text-lg font-semibold text-blue-900 mb-3">Vos droits RGPD</h3>
						<ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-blue-800">
							<li>✓ Droit d'accès à vos données</li>
							<li>✓ Droit de rectification</li>
							<li>✓ Droit à l'effacement ("droit à l'oubli")</li>
							<li>✓ Droit à la portabilité</li>
							<li>✓ Droit d'opposition</li>
							<li>✓ Droit de limitation du traitement</li>
						</ul>
					</div>

					<h2>1. Données que nous collectons</h2>
					<h3>1.1 Données que vous fournissez</h3>
					<ul>
						<li><strong>Compte utilisateur :</strong> nom, prénom, adresse email, numéro de téléphone</li>
						<li><strong>Informations de paiement :</strong> traitées de manière sécurisée par nos prestataires (Stripe)</li>
						<li><strong>Préférences :</strong> langue, devise, notifications</li>
						<li><strong>Contenu utilisateur :</strong> photos, commentaires, évaluations</li>
					</ul>

					<h3>1.2 Données collectées automatiquement</h3>
					<ul>
						<li><strong>Données de navigation :</strong> adresse IP, type de navigateur, pages visitées</li>
						<li><strong>Données d'appareil :</strong> type d'appareil, système d'exploitation</li>
						<li><strong>Cookies :</strong> voir notre <Link href="/cookies" className="text-[#5B7CFF] hover:underline">Politique de cookies</Link></li>
					</ul>

					<h3>1.3 Données reçues de tiers</h3>
					<ul>
						<li>Informations de fournisseurs d'authentification (Google, Facebook)</li>
						<li>Données de partenaires analytiques</li>
						<li>Informations de paiement sécurisées</li>
					</ul>

					<h2>2. Pourquoi nous utilisons vos données</h2>
					<p>
						Nous utilisons vos données pour les finalités suivantes :
					</p>
					<ul>
						<li><strong>Exécution du contrat :</strong> traitement des commandes, livraison des billets</li>
						<li><strong>Amélioration du service :</strong> analyse des usages, statistiques</li>
						<li><strong>Communication :</strong> confirmations, notifications, support client</li>
						<li><strong>Sécurité :</strong> prévention des fraudes, authentification</li>
						<li><strong>Marketing :</strong> recommandations personnalisées (avec votre consentement)</li>
					</ul>

					<h2>3. Base légale du traitement</h2>
					<p>Vos données sont traitées sur les bases légales suivantes :</p>
					<ul>
						<li><strong>Exécution d'un contrat :</strong> pour traiter vos achats de billets</li>
						<li><strong>Intérêt légitime :</strong> pour la sécurité et l'amélioration de nos services</li>
						<li><strong>Consentement :</strong> pour les cookies analytiques et marketing</li>
						<li><strong>Obligation légale :</strong> pour les exigences comptables et fiscales</li>
					</ul>

					<h2>4. Partage et stockage</h2>
					<h3>4.1 Destinataires de vos données</h3>
					<p>
						Nous ne vendons pas vos données. Certaines informations sont partagées avec des prestataires 
						uniquement pour exécuter le service :
					</p>
					<ul>
						<li><strong>Stripe :</strong> traitement des paiements</li>
						<li><strong>Services d'emailing :</strong> envoi des confirmations</li>
						<li><strong>Analytics :</strong> Google Analytics (avec votre consentement)</li>
						<li><strong>Support client :</strong> Zendesk ou équivalent</li>
					</ul>

					<h3>4.2 Transferts internationaux</h3>
					<p>
						Vos données peuvent être transférées vers des pays hors de l'Union Européenne. 
						Ces transferts sont encadrés par des clauses contractuelles types ou des décisions 
						d'adéquation de la Commission Européenne.
					</p>

					<h3>4.3 Durée de conservation</h3>
					<ul>
						<li><strong>Données du compte :</strong> supprimées 3 ans après la dernière activité</li>
						<li><strong>Données de commande :</strong> conservées 10 ans pour obligations légales</li>
						<li><strong>Cookies analytiques :</strong> voir <Link href="/cookies" className="text-[#5B7CFF] hover:underline">Politique de cookies</Link></li>
						<li><strong>Données de marketing :</strong> supprimées si vous retirez votre consentement</li>
					</ul>

					<h2>5. Vos droits</h2>
					<p>
						Vous pouvez exercer vos droits à tout moment en nous contactant :
					</p>
					<ul>
						<li>Accéder à vos données personnelles</li>
						<li>Rectifier des données inexactes</li>
						<li>Demander la suppression de vos données</li>
						<li>Exporter vos données dans un format lisible</li>
						<li>Vous opposer au traitement de vos données</li>
					</ul>
					
					<div className="my-8 p-6 bg-gray-50 rounded-lg">
						<h3 className="text-lg font-semibold mb-4">Exercer vos droits</h3>
						<p className="mb-4">
							Pour exercer vos droits ou poser des questions sur le traitement de vos données :
						</p>
						<div className="flex flex-col gap-2">
							<div className="flex items-center gap-2">
								<MailIcon size={18} className="text-[#5B7CFF]" />
								<span>Email : dpo@tikeo.com</span>
							</div>
							<Link 
								href="/contact" 
								className="inline-flex items-center gap-2 text-[#5B7CFF] hover:underline mt-2"
							>
								Formulaire de contact
							</Link>
						</div>
						<p className="text-sm text-gray-600 mt-4">
							Nous répondrons à votre demande dans un délai maximum de 30 jours.
						</p>
					</div>

					<h2>6. Sécurité</h2>
					<p>
						Nous appliquons des mesures techniques et organisationnelles pour protéger vos données :
					</p>
					<ul>
						<li>Chiffrement des données en transit (TLS)</li>
						<li>Stockage sécurisé avec chiffrement</li>
						<li>Authentification à deux facteurs</li>
						<li>Accès restreint aux données</li>
						<li>Audits de sécurité réguliers</li>
					</ul>

					<h2>7. Cookies</h2>
					<p>
						Nous utilisons des cookies pour améliorer votre expérience. Pour en savoir plus, 
						consultez notre <Link href="/cookies" className="text-[#5B7CFF] hover:underline">Politique de cookies</Link> 
						où vous pouvez gérer vos préférences.
					</p>

					<h2>8. Modifications</h2>
					<p>
						Nous pouvons modifier cette politique de temps à autre. En cas de modification substantielle, 
						nous vous en informerons par email ou par un avis sur notre site. 
						La présente version date de Mars 2024.
					</p>

					<h2>9. Droit de réclamation</h2>
					<p>
						Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation 
						auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) :
					</p>
					<ul>
						<li><strong>Site web :</strong> www.cnil.fr</li>
						<li><strong>Adresse :</strong> 3 Place de Fontenoy, 75007 Paris</li>
						<li><strong>Téléphone :</strong> 01 53 73 22 22</li>
					</ul>

					<div className="mt-8 p-6 bg-green-50 rounded-lg border">
						<div className="flex items-center gap-3">
							<CheckCircleIcon size={20} className="text-green-600" />
							<div>
								<p className="font-semibold">Protection par conception</p>
								<p className="text-sm text-gray-600">Nous minimisons la collecte et chiffrons les données sensibles.</p>
							</div>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
