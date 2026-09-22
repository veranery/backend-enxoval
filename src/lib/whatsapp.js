// Número de WhatsApp da loja (com DDI 55 + DDD, só números).
// Para trocar o número, edite só o valor abaixo.
export const WHATSAPP_NUMBER = '5574999706311';

const buildLink = (message) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// Monta o link do WhatsApp já com a mensagem preenchida para um ou mais
// itens da lista (um item só, ou vários selecionados de uma vez).
export const buildWhatsAppLinkForItems = (itemNames) => {
  if (itemNames.length === 1) {
    return buildLink(`Olá! Tenho interesse em comprar: ${itemNames[0]}`);
  }
  const list = itemNames.map((name) => `- ${name}`).join('\n');
  return buildLink(`Olá! Tenho interesse em comprar estes itens:\n${list}`);
};

// Link genérico, sem nenhum item específico (botão do topo da lista).
export const buildWhatsAppGeneralLink = () =>
  buildLink('Olá! Estou com dúvidas sobre a minha lista de enxoval, pode me ajudar?');
