import Link from 'next/link';
import { TicketIcon, MoneyIcon, CalendarIcon, CheckCircleIcon } from '@tikeo/ui';

export default function OrdersPage() {
	// Page currently uses placeholder data; real orders will come from the API.
	const sampleOrders = [
		{
			id: 'ORD-001',
			event: 'Soirée Jazz • Le Trianon',
			date: '12 mars 2026',
			amount: '35 €',
			status: 'Validée',
		},
		{
			id: 'ORD-002',
			event: 'Conférence Product • Paris',
			date: '23 avril 2026',
			amount: '120 €',
			status: 'Remboursée',
		},
	];

	return (
		<div className="min-h-screen bg-white py-12">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between mb-8">
					<div>
						<h1 className="text-3xl font-bold">Mes commandes</h1>
						<p className="text-sm text-gray-600">Historique de vos achats et billets.</p>
					</div>
					<Link href="/tickets" className="inline-flex items-center gap-2 px-4 py-2 bg-[#5B7CFF] text-white rounded-lg">
						<TicketIcon size={18} /> Mes billets
					</Link>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{sampleOrders.map((o) => (
						<article key={o.id} className="p-6 border rounded-2xl bg-gray-50">
							<div className="flex items-start justify-between">
								<div>
									<h3 className="font-semibold">{o.event}</h3>
									<p className="text-sm text-gray-600 mt-1">Commande <span className="font-medium">{o.id}</span></p>
								</div>
								<div className="text-right">
									<div className="text-lg font-bold">{o.amount}</div>
									<div className="text-sm text-gray-500">{o.date}</div>
								</div>
							</div>

							<div className="mt-4 flex items-center justify-between">
								<div className="flex items-center gap-3 text-sm">
									<CalendarIcon size={16} className="text-gray-600" />
									<span className="text-gray-700">{o.date}</span>
								</div>
								<div className="flex items-center gap-3">
									{o.status === 'Validée' ? (
										<span className="inline-flex items-center gap-2 text-green-600 font-semibold">
											<CheckCircleIcon size={18} /> {o.status}
										</span>
									) : (
										<span className="text-sm text-gray-600">{o.status}</span>
									)}
								</div>
							</div>

							<div className="mt-4 flex items-center gap-3">
								<button className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-white text-sm">
									<TicketIcon size={16} /> Voir le billet
								</button>
								<button className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-white text-sm">
									<MoneyIcon size={16} /> Reçu
								</button>
							</div>
						</article>
					))}

					<div className="p-6 border rounded-2xl flex flex-col items-center justify-center bg-white">
						<div className="text-2xl font-bold mb-2">Pas de plus anciennes commandes ?</div>
						<p className="text-sm text-gray-600 mb-4 text-center">Lorsque vous achetez des billets, vos commandes apparaîtront ici avec les reçus et billets téléchargeables.</p>
						<Link href="/events" className="inline-flex items-center gap-2 px-4 py-2 bg-[#7B61FF] text-white rounded-lg">
							Découvrir des événements
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
