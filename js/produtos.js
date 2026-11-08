/* =========================================================
   CATÁLOGO DA ELA ME FEZ
   ---------------------------------------------------------
   Para mudar preço, incluir peça ou foto, edite só este arquivo.
   - preco: número (ex.: 29) ou null para "sob orçamento"
   - tamanhos: lista de opções com preço próprio (opcional)
   - opcoes: escolhas extras (cor, estampa, modelo...) (opcional)
   - pagamento: link de pagamento (Mercado Pago, InfinitePay...) (opcional)
   ========================================================= */

window.LOJA = {
  whatsapp: "5561996634060",
  whatsappExibicao: "(61) 99663-4060",
  instagram: "ela.me.fez",
  // Chave Pix (opcional). Se preencher, aparece no carrinho e na mensagem.
  pix: "",
};

/* Tabela de tamanhos das necessaires (do catálogo oficial) */
const TAM_NECESSAIRE = [
  { id: "PP", nome: "PP", medida: "16 × 10 × 6 cm", preco: 25 },
  { id: "P",  nome: "P",  medida: "18 × 10 × 8 cm", preco: 29 },
  { id: "M",  nome: "M",  medida: "20 × 10 × 10 cm", preco: 39 },
  { id: "G",  nome: "G",  medida: "23 × 12 × 12 cm", preco: 54 },
];

window.CATEGORIAS = [
  { id: "todos",       nome: "Tudo" },
  { id: "necessaires", nome: "Necessaires & estojos" },
  { id: "bordados",    nome: "Bordados" },
  { id: "croche",      nome: "Amigurumi" },
  { id: "maternidade", nome: "Bebê & maternidade" },
  { id: "presentes",   nome: "Presentes" },
  { id: "casa",        nome: "Casa & mesa" },
  { id: "sob-medida",  nome: "Sob medida" },
];

window.PRODUTOS = [
  /* ---------------- NECESSAIRES ---------------- */
  {
    id: "necessaire-bordo",
    nome: "Necessaire Bordô",
    cat: "necessaires",
    selo: "mais pedida",
    desc: "Material sintético texturizado em bordô, forro interno impermeável, zíper bege e etiqueta de couro “Ela me Fez”. Elegante para o dia a dia e para viagem.",
    fotos: ["img/nec-bordo-p.jpg", "img/nec-bordo-m.jpg", "img/nec-bordo-g.jpg"],
    tamanhos: TAM_NECESSAIRE,
  },
  {
    id: "necessaire-boho",
    nome: "Necessaire Boho",
    cat: "necessaires",
    desc: "Estampa boho em tons terrosos, com zíper e etiqueta de couro. Forro interno impermeável.",
    fotos: ["img/nec-boho.jpg"],
    tamanhos: TAM_NECESSAIRE,
  },
  {
    id: "necessaire-floral",
    nome: "Necessaire Floral Delicada",
    cat: "necessaires",
    desc: "Estampa floral suave em tons de lavanda e verde. Combina com o estojo da mesma estampa e fica linda de presente.",
    fotos: ["img/nec-floral-kit.jpg", "img/nec-floral.jpg"],
    tamanhos: TAM_NECESSAIRE,
  },
  {
    id: "necessaire-coracoes",
    nome: "Necessaire Corações",
    cat: "necessaires",
    desc: "Rosa com coraçõezinhos e plaquinha dourada. Um mimo delicado para presentear.",
    fotos: ["img/nec-coracoes.jpg"],
    tamanhos: TAM_NECESSAIRE,
  },
  {
    id: "necessaire-poa",
    nome: "Necessaire Poá Cinza",
    cat: "necessaires",
    desc: "Cinza clarinho com poá branco, discreta e versátil. Forro interno impermeável.",
    fotos: ["img/nec-poa-pp.jpg"],
    tamanhos: TAM_NECESSAIRE,
  },
  {
    id: "necessaire-avioes",
    nome: "Necessaire Aviõezinhos",
    cat: "necessaires",
    desc: "Estampa divertida de aviõezinhos, com base azul. Ótima para crianças e para a mala de viagem.",
    fotos: ["img/nec-avioes.jpg"],
    tamanhos: TAM_NECESSAIRE,
  },
  {
    id: "necessaire-marrom",
    nome: "Necessaire Marrom Lisa",
    cat: "necessaires",
    desc: "Sintético marrom-escuro com alça lateral e etiqueta de couro. Um clássico que vai bem com tudo.",
    fotos: ["img/nec-couro.jpg"],
    tamanhos: TAM_NECESSAIRE,
  },
  {
    id: "necessaire-branca-alca",
    nome: "Necessaire Branca com Alça",
    cat: "necessaires",
    desc: "Branca com estampa delicada e alça de mão verde-oliva.",
    fotos: ["img/nec-branca-alca.jpg"],
    tamanhos: TAM_NECESSAIRE,
  },
  {
    id: "necessaire-cristal",
    nome: "Necessaire Cristal",
    cat: "necessaires",
    desc: "Plástico cristal transparente com acabamento bege. Ideal para viagem e inspeção de bagagem. (Modelo sem forro interno.)",
    fotos: ["img/nec-cristal.jpg"],
    tamanhos: TAM_NECESSAIRE,
  },
  {
    id: "estojo",
    nome: "Estojo",
    cat: "necessaires",
    desc: "20 × 3 × 4 cm. Porta-caneta ou porta-escova e creme dental. Escolha a estampa para combinar com a sua necessaire.",
    fotos: ["img/nec-floral-kit.jpg", "img/estojo-bordo.jpg"],
    preco: 20,
    opcoes: {
      nome: "Estampa",
      itens: ["Bordô", "Floral delicada", "Boho", "Corações", "Poá cinza", "Aviõezinhos", "Marrom", "Outra (combinar)"],
      fotos: [1, 0, null, null, null, null, null, null],
    },
  },

  /* ---------------- BORDADOS ---------------- */
  {
    id: "bastidor-porta-aliancas",
    nome: "Bastidor Porta-Alianças Bordado",
    cat: "bordados",
    selo: "personalizado",
    desc: "Bordado à mão com monograma, data e guirlanda de flores nas cores que você escolher. O presente que emociona em casamentos e noivados.",
    fotos: ["img/bordado-td.jpg", "img/bordado-mm.jpg"],
    preco: null,
    personalizar: "Iniciais, data e cores das flores",
  },

  /* ---------------- AMIGURUMI ---------------- */
  {
    id: "amigurumi",
    nome: "Amigurumi de Crochê",
    cat: "croche",
    desc: "Bichinhos de crochê feitos laçada por laçada, com roupinhas e acessórios. Escolha o modelo ou peça um personagem especial.",
    fotos: ["img/amigurumi-raposa.jpg", "img/amigurumi-ursinha.jpg"],
    preco: null,
    opcoes: { nome: "Modelo", itens: ["Raposa", "Ursinha", "Outro (combinar)"], fotos: [0, 1, null] },
    personalizar: "Cores, roupinha ou personagem",
  },

  /* ---------------- MATERNIDADE ---------------- */
  {
    id: "kit-panos-de-boca",
    nome: "Kit Panos de Boca",
    cat: "maternidade",
    desc: "Panos de boca com barrado estampado e acabamento caprichado. Temas e cores sob encomenda, perfeitos para enxoval e chá de bebê.",
    fotos: ["img/bebe-bosque.jpg", "img/bebe-urso.jpg", "img/bebe-cegonha.jpg", "img/bebe-bichinhos.jpg", "img/bebe-princesa.jpg"],
    preco: null,
    opcoes: { nome: "Tema", itens: ["Bichinhos do bosque", "Ursinhos", "Cegonha", "Bichinhos", "Princesas", "Outro (combinar)"], fotos: [0, 1, 2, 3, 4, null] },
    personalizar: "Nome do bebê, cores, quantidade de peças",
  },

  /* ---------------- PRESENTES ---------------- */
  {
    id: "caderno-de-receitas",
    nome: "Caderno de Receitas da Família",
    cat: "presentes",
    desc: "Caderno com espiral e capa personalizada, como o “Sabores da Nossa História”, para guardar as receitas que passam de geração em geração.",
    fotos: ["img/caderno-receitas.jpg"],
    preco: null,
    personalizar: "Título da capa e nome da família",
  },
  {
    id: "porta-vinho",
    nome: "Porta-Vinho em Couro",
    cat: "presentes",
    desc: "Porta-garrafa em couro sintético caramelo com alça, para presentear com estilo.",
    fotos: ["img/porta-vinho.jpg"],
    preco: null,
  },

  /* ---------------- CASA ---------------- */
  {
    id: "jogo-americano",
    nome: "Jogo Americano Dupla Face",
    cat: "casa",
    desc: "Dupla face, com estampas que conversam entre si. Monte o kit da sua mesa com a quantidade de lugares que precisar.",
    fotos: ["img/jogo-americano.jpg"],
    preco: null,
    personalizar: "Quantidade de lugares e estampas",
  },

  /* ---------------- SOB MEDIDA ---------------- */
  {
    id: "vestido-sob-medida",
    nome: "Vestido Infantil Sob Medida",
    cat: "sob-medida",
    desc: "Vestidos de princesa em tule e outras peças de costura feitas exatamente para quem vai usar.",
    fotos: ["img/vestido-tule.jpg"],
    preco: null,
    personalizar: "Idade/medidas, cor e personagem",
  },
];
