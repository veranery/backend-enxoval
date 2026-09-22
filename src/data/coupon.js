// Cupom de desconto que aparece automaticamente quando a pessoa está perto
// de completar a lista de itens essenciais (não conta os opcionais).
//
// Para ajustar, edite só os valores abaixo:
// - enabled: true/false para ligar ou desligar o aviso do cupom
// - thresholdPercentage: a partir de quantos % da lista completa o aviso aparece
// - pixCode / pixDiscount: cupom e desconto para pagamento no Pix ou dinheiro
// - cardCode / cardDiscount / cardInstallments: cupom, desconto e parcelamento no cartão
export const COUPON = {
  enabled: true,
  thresholdPercentage: 85,
  pixCode: 'ENXOVAL15',
  pixDiscount: '15%',
  cardCode: 'ENXOVAL5',
  cardDiscount: '5%',
  cardInstallments: 'em até 10x sem juros',
};
