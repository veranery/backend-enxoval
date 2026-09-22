import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Check, MessageCircle } from 'lucide-react';
import { getCategoryColor } from '../data/categories';
import { buildWhatsAppLinkForItems } from '../lib/whatsapp';

const formatPrice = (value) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function LayetteItem({ item, isSelected, onToggleSelect }) {
  const { updateItemQuantity, toggleItemPurchased, isReadOnly } = useAuth();
  const color = getCategoryColor(item.category);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    updateItemQuantity(item.id, value);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 border overflow-hidden ${
        item.purchased ? 'opacity-70' : ''
      } ${isSelected ? 'border-rosa ring-2 ring-rosa/20' : 'border-gray-100'}`}
      style={{ borderLeft: `5px solid ${color}` }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3 gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <input
              type="checkbox"
              checked={!!isSelected}
              onChange={() => onToggleSelect(item.id)}
              title="Selecionar para comprar junto no WhatsApp"
              className="mt-1.5 w-4 h-4 rounded border-gray-300 accent-rosa cursor-pointer shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={`text-lg font-bold leading-snug ${
                    item.purchased ? 'line-through text-gray-400' : 'text-gray-800'
                  }`}
                >
                  {item.name}
                </h3>
                {item.optional && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-gray-100 text-gray-500 border border-gray-200">
                    Opcional
                  </span>
                )}
              </div>
              <p className="text-sm font-medium mt-1" style={{ color }}>
                Recomendado: <span className="font-bold">{item.recommendedQuantity}</span>
              </p>
              {!!item.startingPrice && (
                <p className="text-sm font-semibold mt-1 text-gray-600">
                  A partir de <span className="text-gray-800">{formatPrice(item.startingPrice)}</span>
                </p>
              )}
            </div>
          </div>

          <button
            onClick={() => !isReadOnly && toggleItemPurchased(item.id)}
            disabled={isReadOnly}
            aria-label={item.purchased ? 'Marcar como não comprado' : 'Marcar como comprado'}
            className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border ${
              isReadOnly ? 'cursor-default' : ''
            } ${
              item.purchased
                ? 'text-white border-transparent'
                : 'bg-white border-gray-200 text-gray-300 hover:text-white'
            }`}
            style={{
              backgroundColor: item.purchased ? color : undefined,
              borderColor: !item.purchased ? undefined : color,
            }}
            onMouseEnter={(e) => {
              if (!item.purchased && !isReadOnly) e.currentTarget.style.backgroundColor = color;
            }}
            onMouseLeave={(e) => {
              if (!item.purchased && !isReadOnly) e.currentTarget.style.backgroundColor = '';
            }}
          >
            <Check size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
          <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">
            Qtd possuída:
          </label>
          <input
            type="number"
            min="0"
            value={item.desiredQuantity}
            onChange={handleQuantityChange}
            disabled={isReadOnly}
            className="w-20 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 text-center font-medium focus:outline-none focus:ring-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              '--tw-ring-color': color,
              borderColor: 'transparent',
            }}
            onFocus={(e) => (e.target.style.borderColor = color)}
            onBlur={(e) => (e.target.style.borderColor = 'transparent')}
          />
        </div>

        <a
          href={buildWhatsAppLinkForItems([item.name])}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1fb856] text-white text-sm font-bold shadow-sm transition-all duration-300"
        >
          <MessageCircle size={18} />
          Comprar
        </a>
      </div>
    </div>
  );
}

export default LayetteItem;
