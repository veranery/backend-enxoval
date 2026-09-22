// Cupom de desconto que aparece automaticamente quando a pessoa está perto
// de completar a lista de itens essenciais (não conta os opcionais).
//
// O desconto é dividido por CANAL de compra (site ou loja física), e não
// por forma de pagamento — assim funciona certinho com o Nuvemshop, que só
// permite um cupom por compra, sem diferenciar Pix de cartão.
//
// Para ajustar, edite só os valores abaixo:
// - enabled: true/false para ligar ou desligar o aviso do cupom
// - thresholdPercentage: a partir de quantos % da lista completa o aviso aparece
// - siteCode / siteDiscount: cupom e desconto para quem compra pelo site (Nuvemshop)
// - presencialDiscount: desconto para quem compra na loja física (não precisa
//   de cupom digitado, é só mostrar a tela ou avisar na hora da compra)
export const COUPON = {
  enabled: true,
  thresholdPercentage: 85,
  siteCode: 'ENXOVAL10',
  siteDiscount: '10%',
  presencialDiscount: '10%',
};
