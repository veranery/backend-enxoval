import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import LayetteItem from '../components/Layetteitem';
import Notices from '../components/Notices';
import { RotateCcw, Search, Info, Loader2, ListFilter, MessageCircle, X, ExternalLink, Tag, TriangleAlert } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import { CATEGORIES, getCategoryColor } from '../data/categories';
import { buildWhatsAppLinkForItems, buildWhatsAppGeneralLink } from '../lib/whatsapp';
import { COUPON } from '../data/coupon';

const MAGIA_KIDS_STORE_URL = 'https://www.lojamagiakids.com.br/';

function LayetteList() {
  const { layetteItems, resetList, isLoadingList, isReadOnly } = useAuth();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyMissing, setShowOnlyMissing] = useState(false);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showCoupon, setShowCoupon] = useState(true);

  const handleConfirmReset = () => {
    resetList();
    setShowResetConfirm(false);
    toast({
      title: 'Lista resetada!',
      description: 'Todas as quantidades foram restauradas aos valores recomendados.',
    });
  };

  const toggleSelectItem = (itemId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const selectedItems = useMemo(
    () => layetteItems.filter((item) => selectedIds.has(item.id)),
    [layetteItems, selectedIds]
  );

  const filteredItems = useMemo(() => {
    return layetteItems.filter((item) => {
      const matchesCategory = selectedCategory === 'Todas' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMissing = !showOnlyMissing || !item.purchased;
      return matchesCategory && matchesSearch && matchesMissing;
    });
  }, [layetteItems, selectedCategory, searchTerm, showOnlyMissing]);

  const groupedItems = useMemo(() => {
    const groups = {};

    CATEGORIES.filter((c) => c !== 'Todas').forEach((cat) => {
      groups[cat] = [];
    });

    filteredItems.forEach((item) => {
      if (groups[item.category]) {
        groups[item.category].push(item);
      }
    });

    const populatedGroups = {};
    CATEGORIES.filter((c) => c !== 'Todas').forEach((cat) => {
      if (groups[cat] && groups[cat].length > 0) {
        populatedGroups[cat] = groups[cat];
      }
    });

    return populatedGroups;
  }, [filteredItems]);

  // Itens opcionais (marcados com optional: true) não entram na conta da
  // porcentagem mostrada no topo — só os itens essenciais contam.
  const stats = useMemo(() => {
    const requiredItems = layetteItems.filter((item) => !item.optional);
    const total = requiredItems.length;
    const purchased = requiredItems.filter((item) => item.purchased).length;
    const percentage = total > 0 ? Math.round((purchased / total) * 100) : 0;
    const optionalCount = layetteItems.length - total;
    return { total, purchased, percentage, optionalCount };
  }, [layetteItems]);

  // Mesmo cálculo, mas separado por categoria (também ignorando opcionais),
  // para mostrar o progresso de cada categoria no cabeçalho dela.
  const categoryStats = useMemo(() => {
    const map = {};
    CATEGORIES.filter((c) => c !== 'Todas').forEach((cat) => {
      const requiredItems = layetteItems.filter((item) => item.category === cat && !item.optional);
      const total = requiredItems.length;
      const purchased = requiredItems.filter((item) => item.purchased).length;
      const percentage = total > 0 ? Math.round((purchased / total) * 100) : 0;
      map[cat] = { total, purchased, percentage };
    });
    return map;
  }, [layetteItems]);

  return (
    <>
      <Helmet>
        <title>Lista de Enxoval - Magia Kids</title>
        <meta name="description" content="Gerencie sua lista completa de enxoval do bebê" />
      </Helmet>

      <div className="min-h-screen pb-20 bg-gradient-to-b from-rosa/5 via-white to-white text-gray-800">
        <Header />

        <div className="container mx-auto px-4 py-8">
          {isReadOnly && (
            <div className="mb-6 px-5 py-3 bg-azul/10 border border-azul/20 text-azul rounded-xl text-sm font-medium text-center">
              Você está acompanhando esta lista em modo visualização — não é possível fazer alterações aqui.
            </div>
          )}

          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 mb-8 shadow-lg border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  Minha Lista de Enxoval
                </h2>
                <p className="text-gray-500">
                  <span className="font-semibold text-rosa">{stats.purchased}</span> de {stats.total} itens essenciais comprados ({stats.percentage}%)
                </p>
                {stats.optionalCount > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    + {stats.optionalCount} {stats.optionalCount === 1 ? 'item opcional' : 'itens opcionais'} (não contam na porcentagem)
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={MAGIA_KIDS_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2.5 bg-azul/10 hover:bg-azul/20 text-azul rounded-xl transition-all duration-300 font-medium border border-azul/20"
                >
                  <ExternalLink size={18} />
                  Ver Loja Magia Kids
                </a>

                <a
                  href={buildWhatsAppGeneralLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#25D366] hover:bg-[#1fb856] text-white rounded-xl transition-all duration-300 font-medium shadow-sm"
                >
                  <MessageCircle size={18} />
                  Falar no WhatsApp
                </a>

                {!isReadOnly && (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-orange-50 hover:bg-orange-100 text-laranja border border-laranja/30 rounded-xl transition-all duration-300 font-medium"
                  >
                    <RotateCcw size={18} />
                    Resetar Lista
                  </button>
                )}
              </div>
            </div>

            <div className="mt-6 bg-gray-100 rounded-full h-4 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-rosa via-amarelo to-verde rounded-full"
              />
            </div>
          </motion.div>

          {COUPON.enabled && stats.percentage >= COUPON.thresholdPercentage && showCoupon && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative mb-8 p-6 rounded-3xl border border-amarelo/30 bg-gradient-to-r from-rosa/10 via-amarelo/10 to-verde/10 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setShowCoupon(false)}
                aria-label="Fechar aviso do cupom"
                title="Fechar"
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-white/60 transition-colors"
              >
                <X size={18} />
              </button>

              <div className="flex items-start gap-4 pr-8">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                  <Tag className="text-rosa" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Você está quase lá! Faltam poucos itens 🎉
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Aproveite os cupons especiais para fechar o que falta da sua lista:
                  </p>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="px-4 py-2.5 rounded-xl bg-white shadow-sm border border-gray-100">
                      <p className="text-xs text-gray-400 font-medium">No Pix ou dinheiro</p>
                      <p className="text-sm font-bold text-gray-800">
                        {COUPON.pixDiscount} OFF <span className="font-normal text-gray-400">com o cupom</span>{' '}
                        <span className="text-rosa">{COUPON.pixCode}</span>
                      </p>
                    </div>
                    <div className="px-4 py-2.5 rounded-xl bg-white shadow-sm border border-gray-100">
                      <p className="text-xs text-gray-400 font-medium">No cartão {COUPON.cardInstallments}</p>
                      <p className="text-sm font-bold text-gray-800">
                        {COUPON.cardDiscount} OFF <span className="font-normal text-gray-400">com o cupom</span>{' '}
                        <span className="text-azul">{COUPON.cardCode}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <Notices />

          {isLoadingList ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Loader2 className="animate-spin mb-3" size={32} />
              <p className="font-medium">Carregando sua lista...</p>
            </div>
          ) : (
            <>
              {/* Search and Filters */}
              <div className="mb-10 space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Search className="text-gray-400" size={20} />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar item..."
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 hover:bg-white border border-gray-200 focus:border-rosa focus:ring-4 focus:ring-rosa/10 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none transition-all shadow-sm"
                    />
                  </div>

                  <button
                    onClick={() => setShowOnlyMissing((value) => !value)}
                    className={`flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-bold border transition-all duration-300 shadow-sm shrink-0 ${
                      showOnlyMissing
                        ? 'bg-rosa text-white border-rosa'
                        : 'bg-gray-50 hover:bg-white text-gray-500 border-gray-200'
                    }`}
                  >
                    <ListFilter size={18} />
                    Faltando comprar
                  </button>
                </div>

                <p className="flex items-center justify-center gap-2 text-center text-xs sm:text-sm text-gray-400 max-w-xl mx-auto">
                  <MessageCircle size={16} className="text-[#25D366] shrink-0" />
                  Dica: marque a caixinha dos itens que você quer comprar e envie todos juntos em uma única mensagem pelo WhatsApp.
                </p>

                <div className="flex flex-wrap gap-2 justify-center">
                  {CATEGORIES.map((category) => {
                    const isSelected = selectedCategory === category;
                    const catColor = getCategoryColor(category);

                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${
                          isSelected ? 'shadow-md transform scale-105 text-white' : 'bg-white text-gray-500 border-gray-200'
                        }`}
                        style={{
                          backgroundColor: isSelected && category !== 'Todas' ? catColor : (isSelected ? '#333' : undefined),
                          borderColor: isSelected && category !== 'Todas' ? catColor : (isSelected ? '#333' : undefined),
                        }}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* List Items */}
              <div className="space-y-12">
                {Object.entries(groupedItems).map(([category, items]) => {
                  const catColor = getCategoryColor(category);
                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex flex-wrap items-center gap-3 mb-2 pb-2 border-b border-gray-100">
                        <div
                          className="h-8 w-1.5 rounded-full"
                          style={{ backgroundColor: catColor }}
                        />
                        <h3 className="text-2xl font-bold text-gray-800 uppercase tracking-wide">
                          {category}
                        </h3>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-bold text-white"
                          style={{ backgroundColor: catColor }}
                        >
                          {items.length}
                        </span>

                        {categoryStats[category] && categoryStats[category].total > 0 && (
                          <div className="flex items-center gap-2 ml-auto">
                            <span className="text-xs font-semibold text-gray-400">
                              {categoryStats[category].purchased}/{categoryStats[category].total} ({categoryStats[category].percentage}%)
                            </span>
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${categoryStats[category].percentage}%`,
                                  backgroundColor: catColor,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {category === 'MALA DA MATERNIDADE' && (
                        <p className="text-sm text-gray-800 font-bold mb-6 leading-relaxed max-w-3xl">
                          Quantidades dos itens para levar ao hospital, é uma ajuda para montar sua mala maternidade e tornar o parto mais fácil e prático.
                        </p>
                      )}

                      {category === 'QUARTO' && (
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                          Temos os móveis para o quarto perfeito do seu bebê
                        </p>
                      )}

                      {category !== 'MALA DA MATERNIDADE' && category !== 'QUARTO' && <div className="mb-6"></div>}

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {items.map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <LayetteItem
                              item={item}
                              isSelected={selectedIds.has(item.id)}
                              onToggleSelect={toggleSelectItem}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}

                {Object.keys(groupedItems).length === 0 && (
                  <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <Search className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">
                      Nenhum item encontrado.
                    </p>
                    <button
                      onClick={() => { setSearchTerm(''); setSelectedCategory('Todas'); setShowOnlyMissing(false); }}
                      className="mt-4 text-rosa hover:underline font-medium"
                    >
                      Limpar filtros
                    </button>
                  </div>
                )}

                {/* Note Section */}
                <div className="mt-12 p-6 bg-purple-50 rounded-2xl border border-purple-100 flex items-start gap-4">
                  <Info className="text-purple-500 shrink-0 mt-1" size={24} />
                  <div>
                    <p className="text-purple-800 font-bold text-lg">
                      OBSERVAÇÃO IMPORTANTE:
                    </p>
                    <p className="text-purple-700 mt-1">
                      VENDEMOS BERÇO QUE VIRA CAMA OU MINI SOFÁ COM CONDIÇÕES ESPECIAIS DE PAGAMENTO.
                      20% DE DESCONTO Á VISTA OU EM ATÉ 2X NO CARTÃO OU EM 12X SEM JUROS NO CARTÃO.
                    </p>
                    <a
                      href="https://www.canva.com/design/DAHBbgToxmw/t6uu3T3Tud58AwJ2mz1EtQ/view"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      VER CATÁLOGO DOS MÓVEIS
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 inset-x-0 z-40 flex justify-center px-4"
          >
            <div className="flex items-center gap-3 bg-white shadow-xl border border-gray-100 rounded-2xl pl-5 pr-3 py-3 max-w-lg w-full sm:w-auto">
              <span className="text-sm font-semibold text-gray-700 flex-1 sm:flex-none">
                {selectedItems.length} {selectedItems.length === 1 ? 'item selecionado' : 'itens selecionados'}
              </span>

              <a
                href={buildWhatsAppLinkForItems(selectedItems.map((item) => item.name))}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1fb856] text-white text-sm font-bold shadow-sm shrink-0"
              >
                <MessageCircle size={16} />
                Comprar no WhatsApp
              </a>

              <button
                onClick={clearSelection}
                aria-label="Limpar seleção"
                title="Limpar seleção"
                className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl max-w-sm w-full p-6"
            >
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-11 h-11 rounded-full bg-orange-50 flex items-center justify-center">
                  <TriangleAlert className="text-laranja" size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">Resetar a lista?</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Todas as quantidades vão voltar para os valores recomendados e os itens marcados como comprados vão ficar como não comprados. Essa ação não pode ser desfeita.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmReset}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-laranja hover:opacity-90 text-white font-bold transition-opacity"
                >
                  Sim, resetar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
}

export default LayetteList;
