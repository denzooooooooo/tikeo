import Link from 'next/link';
import { TeamIcon, RocketIcon, BriefcaseIcon } from '@tikeo/ui';

export default function AboutPage() {
	return (
		<div className="min-h-screen bg-white">
			<div className="relative bg-gradient-to-br from-[#5B7CFF] via-[#7B61FF] to-[#9D4EDD] py-24">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
					<div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-white/10 mb-6">
						<RocketIcon className="text-white" size={48} />
					</div>
					<h1 className="text-4xl lg:text-5xl font-bold text-white">Qui sommes‑nous</h1>
					<p className="mt-4 text-lg text-white/90 max-w-3xl mx-auto">
						Tikeo facilite la création, la promotion et la billetterie d'événements. Nous aidons
						les organisateurs à atteindre leur public et à vendre plus facilement des billets.
					</p>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2 space-y-8">
						<section>
							<h2 className="text-2xl font-semibold mb-3">Notre mission</h2>
							<p className="text-gray-700 leading-relaxed">
								Rendre l'organisation d'événements simple, transparente et rentable. Nous construisons des
								outils puissants qui permettent aux organisateurs de se concentrer sur l'expérience, pas sur la
								technique.
							</p>
						</section>

						<section>
							<h3 className="text-xl font-semibold mb-4">Nos valeurs</h3>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="p-4 border rounded-lg flex items-start gap-4">
									<BriefcaseIcon size={28} className="text-[#5B7CFF]" />
									<div>
										<p className="font-semibold">Professionnalisme</p>
										<p className="text-sm text-gray-600">Nous livrons des produits fiables et bien conçus.</p>
									</div>
								</div>
								<div className="p-4 border rounded-lg flex items-start gap-4">
									<TeamIcon size={28} className="text-[#7B61FF]" />
									<div>
										<p className="font-semibold">Collaboration</p>
										<p className="text-sm text-gray-600">Les meilleures idées viennent du terrain et des utilisateurs.</p>
									</div>
								</div>
							</div>
						</section>

						<section>
							<h3 className="text-xl font-semibold mb-4">Nos chiffres</h3>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
								<div className="p-6 bg-gray-50 rounded-2xl text-center">
									<div className="text-3xl font-bold">10M+</div>
									<div className="text-sm text-gray-600 mt-1">Billets vendus</div>
								</div>
								<div className="p-6 bg-gray-50 rounded-2xl text-center">
									<div className="text-3xl font-bold">50+</div>
									<div className="text-sm text-gray-600 mt-1">Organisateurs actifs</div>
								</div>
								<div className="p-6 bg-gray-50 rounded-2xl text-center">
									<div className="text-3xl font-bold">4.9</div>
									<div className="text-sm text-gray-600 mt-1">Note moyenne</div>
								</div>
							</div>
						</section>
					</div>

					<aside className="space-y-6">
						<div className="p-6 bg-gradient-to-br from-[#F6F8FF] to-white rounded-2xl border">
							<h4 className="font-semibold mb-2">Rejoignez‑nous</h4>
							<p className="text-sm text-gray-600 mb-4">Vous êtes organisateur ? Lancez votre premier événement en quelques minutes.</p>
							<Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B7CFF] text-white rounded-lg">
								Créer un événement
							</Link>
						</div>

						<div className="p-6 bg-white rounded-2xl border">
							<h4 className="font-semibold mb-2">Nous contacter</h4>
							<p className="text-sm text-gray-600">Questions générales ou presse ?</p>
							<Link href="/contact" className="mt-3 inline-block text-[#5B7CFF] hover:underline">Voir la page contact</Link>
						</div>
					</aside>
				</div>
			</div>
		</div>
	);
}
