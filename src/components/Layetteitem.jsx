import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Check } from 'lucide-react';

const CATEGORY_COLORS = {
  'ROUPINHAS': '#FF6B6B',           // Red
  'ENXOVAL': '#FFA500',             // Orange
  'HIGIENE': '#FFD93D',             // Yellow
  'ACESSÓRIO': '#6BCB77',           // Green
  'MALA DA MATERNIDADE': '#4D96FF', // Blue
  'QUARTO': '#9D4EDD',              // Purple (Renamed from BERÇO)
};

function LayetteItem({ item }) {
  const { updateItemQuantity, toggleItemPurchased } = useAuth();
  const color = CATEGORY_COLORS[item.category] || '#CCCCCC';

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    updateItemQuantity(item.id, value);
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-gray-100 overflow-hidden"
      style={{ borderLeft: `5px solid ${color}` }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3
              className={`text-lg font-bold ${
                item.purchased ? 'line-through text-gray-400' : 'text-gray-800'
              }`}
            >
              {item.name}
            </h3>
            <p className="text-sm font-medium mt-1" style={{ color: color }}>
              Recomendado: <span className="font-bold">{item.recommendedQuantity}</span>
            </p>
          </div>
          
          <button
            onClick={() => toggleItemPurchased(item.id)}
            className={`ml-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm border ${
              item.purchased
                ? 'text-white border-transparent'
                : 'bg-white border-gray-200 text-gray-300 hover:text-white'
            }`}
            style={{ 
              backgroundColor: item.purchased ? color : undefined,
              borderColor: !item.purchased ? undefined : color,
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
            className="w-20 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 text-center font-medium focus:outline-none focus:ring-2 transition-all"
            style={{ 
              '--tw-ring-color': color, 
              borderColor: 'transparent'
            }} 
            onFocus={(e) => e.target.style.borderColor = color}
            onBlur={(e) => e.target.style.borderColor = 'transparent'}
          />
        </div>
      </div>
    </div>
  );
}

export default LayetteItem;