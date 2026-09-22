// Número de WhatsApp da loja (com DDI 55 + DDD, só números).
// Para trocar o número, edite só o valor abaixo.
export const WHATSAPP_NUMBER = '5574999706311';

// Monta o link do WhatsApp já com a mensagem preenchida para um item
// específico da lista.
export const buildWhatsAppLink = (itemName) => {
  const message = `Olá! Tenho interesse em comprar: ${itemName}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
