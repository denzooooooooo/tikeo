'use client';

interface TicketType {
  name: string;
  description: string;
  price: string;
  quantity: string;
}

interface Props {
  tickets: TicketType[];
  isFree: boolean;
  onUpdate: (i: number, field: keyof TicketType, value: string) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
}

const inputCls =
  'w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-[#5B7CFF] focus:ring-2 focus:ring-[#5B7CFF]/20 outline-none text-sm bg-white';

export function TicketSection({ tickets, isFree, onUpdate, onAdd, onRemove }: Props) {
  return (
    <div className="space-y-3">
      {tickets.map((ticket, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 text-sm">🎟️ Billet {i + 1}</h3>
            {tickets.length > 1 && (
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-red-400 hover:text-red-600 text-xs font-semibold"
              >
                Supprimer
              </button>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={ticket.name}
              onChange={(e) => onUpdate(i, 'name', e.target.value)}
              placeholder="Ex: Standard, VIP, Early Bird…"
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <input
              type="text"
              value={ticket.description}
              onChange={(e) => onUpdate(i, 'description', e.target.value)}
              placeholder="Avantages inclus…"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {!isFree && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Prix (FCFA)
                </label>
                <input
                  type="number"
                  value={ticket.price}
                  onChange={(e) => onUpdate(i, 'price', e.target.value)}
                  min="0"
                  placeholder="0"
                  className={inputCls}
                />
              </div>
            )}
            <div className={isFree ? 'col-span-2' : ''}>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Quantité <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={ticket.quantity}
                onChange={(e) => onUpdate(i, 'quantity', e.target.value)}
                min="1"
                placeholder="100"
                className={inputCls}
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="w-full py-3 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#5B7CFF] text-gray-500 hover:text-[#5B7CFF] text-sm font-semibold transition-all flex items-center justify-center gap-2"
      >
        <span className="text-lg">+</span> Ajouter un type de billet
      </button>
    </div>
  );
}
