/* Assistente da Ela me Fez — respostas a partir do conteúdo do site (sem IA, sem servidor). */
(function () {
  "use strict";
  const L = window.LOJA, PRODS = window.PRODUTOS;
  const $ = (s, el = document) => el.querySelector(s);
  const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const norm = (t) => String(t || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9$ ]/g, " ");
  const wa = (txt) => "https://wa.me/" + L.whatsapp + "?text=" + encodeURIComponent(txt);

  const TAM = ((PRODS.find((p) => p.tamanhos) || {}).tamanhos) || [];
  const estojo = PRODS.find((p) => p.id === "estojo");
  const estampas = PRODS.filter((p) => p.cat === "necessaires" && p.tamanhos).map((p) => p.nome.replace(/^Necessaire\s+/, ""));

  /* ---------- respostas ---------- */
  const tabela = () => TAM.map((t) => "• <b>" + t.nome + "</b> (" + t.medida + "): " + brl(t.preco)).join("<br>") +
    (estojo ? "<br>• <b>Estojo</b> (20 × 3 × 4 cm): " + brl(estojo.preco) : "");

  const INTENTS = [
    { id: "oi", kw: ["oi", "ola", "bom dia", "boa tarde", "boa noite", "tudo bem", "hello", "opa"],
      r: () => ({ t: "Oi! 😊 Sou a assistente da <b>Ela me Fez</b>. Posso te ajudar com preços, tamanhos, estampas, pagamento, prazo e pedidos sob medida. O que você quer saber?", chips: true }) },
    { id: "obg", kw: ["obrigad", "valeu", "agradec", "show", "perfeito", "otimo"],
      r: () => ({ t: "Imagina! 💛 Se precisar de mais alguma coisa, é só perguntar." }) },
    { id: "preco", kw: ["preco", "valor", "quanto", "custa", "custo", "barat", "caro", "tabela", "r$"],
      r: () => ({ t: "As <b>necessaires</b> têm o mesmo preço em qualquer estampa:<br>" + tabela() +
        "<br><br>Bordados, amigurumis, kits de bebê e presentes são <b>sob orçamento</b>, porque o valor depende dos detalhes.",
        b: [["Ver necessaires", "#c/necessaires"], ["Tabela de tamanhos", "#tamanhos"]] }) },
    { id: "tamanho", kw: ["tamanho", "medida", "dimens", "cm", "pp", "pequen", "media", "grande", "cabe", "caber"],
      r: () => ({ t: "Tamanhos das necessaires (Largura × Altura × Profundidade):<br>" + tabela() +
        "<br><br>Precisa de outro tamanho? Dá para fazer <b>sob medida</b>.", b: [["Pedido sob medida", "#sob-medida"]] }) },
    { id: "estampa", kw: ["estampa", "cor", "cores", "tecido", "modelo", "padrao", "desenho", "opcoes", "opcao"],
      r: () => ({ t: "No site você encontra estas estampas de necessaire: <b>" + estampas.join(", ") +
        "</b>.<br><br>Elas são uma amostra: a Wilma tem <b>muitas outras estampas e cores</b>. Na peça, escolha “Outra (combinar)” ou faça um pedido sob medida.",
        b: [["Ver necessaires", "#c/necessaires"], ["Pedido sob medida", "#sob-medida"]] }) },
    { id: "pagamento", kw: ["pagamento", "pagar", "pix", "cartao", "credito", "parcel", "vezes", "12x", "boleto", "debito"],
      r: () => ({ t: "Você pode pagar de dois jeitos, direto na sacola:<br>• <b>Pix</b>: a chave aparece na hora" +
        (L.pixExibicao ? " (" + L.pixTipo + " " + L.pixExibicao + ")" : "") + ".<br>• <b>Cartão de crédito em até 12x</b>, numa página segura da InfinitePay.<br><br>Peças <b>sob orçamento</b> são pagas depois que a Wilma confirmar o valor.",
        b: [["Abrir sacola", "@sacola"]] }) },
    { id: "prazo", kw: ["prazo", "demora", "quando", "pronto", "pronta", "tempo", "dias", "urgente", "rapido", "entrega ate"],
      r: () => ({ t: "Tudo é feito <b>sob encomenda</b>, peça por peça. O prazo depende da peça e da fila de pedidos, e a Wilma te informa no WhatsApp <b>antes</b> de você pagar.<br><br>Tem uma data especial? Coloque nas observações do pedido.",
        b: [["Perguntar o prazo", "@wa:Oi, Wilma! Qual o prazo para uma encomenda?"]] }) },
    { id: "entrega", kw: ["entrega", "entregar", "frete", "envio", "enviar", "correio", "retirar", "retirada", "buscar", "endereco", "cidade", "moro"],
      r: () => ({ t: "Você pode <b>retirar</b> ou <b>receber em casa</b>. A forma de entrega e o frete são combinados no WhatsApp, de acordo com o seu endereço.",
        b: [["Perguntar sobre entrega", "@wa:Oi, Wilma! Queria saber sobre a entrega para o meu endereço."]] }) },
    { id: "material", kw: ["material", "forro", "imperme", "lavar", "limpar", "resistent", "durav", "couro", "sintetic", "qualidade"],
      r: () => ({ t: "As necessaires são de <b>material sintético de excelente qualidade</b>: durável, resistente e fácil de limpar. Com exceção do estojo, todas têm <b>forro interno impermeável</b>. E todas levam a etiqueta de couro, a assinatura da casa." }) },
    { id: "medida", kw: ["sob medida", "personaliz", "nome", "bordar", "bordado com", "monograma", "iniciais", "data", "encomend", "diferente", "ideia", "especial"],
      r: () => ({ t: "Dá para personalizar, sim! ✂️ Cor, estampa, tamanho, nome, monograma ou data. Preencha o <b>pedido sob medida</b> e a Wilma responde com orçamento e prazo.",
        b: [["Pedido sob medida", "#sob-medida"]] }) },
    { id: "lembranca", kw: ["lembranc", "quantidade", "atacado", "evento", "festa", "casamento", "padrinho", "madrinha", "cha de bebe", "kit"],
      r: () => ({ t: "Fazemos <b>lembrancinhas e kits em quantidade</b> para casamentos, chá de bebê e outros eventos. Use o pedido sob medida informando a quantidade e a data.",
        b: [["Pedido sob medida", "#sob-medida"]] }) },
    { id: "comprar", kw: ["comprar", "como compro", "pedido", "pedir", "sacola", "carrinho", "finalizar", "como faco"],
      r: () => ({ t: "É simples:<br>1. Escolha a peça, o tamanho e a estampa e coloque na <b>sacola</b>.<br>2. Pague com Pix ou cartão.<br>3. O pedido chega detalhado no WhatsApp da Wilma, que confirma o prazo.<br>4. Receba sua peça feita à mão. 💛",
        b: [["Ver catálogo", "#catalogo"]] }) },
    { id: "insta", kw: ["instagram", "insta", "foto", "fotos", "trabalhos", "rede social"],
      r: () => ({ t: "No Instagram <b>@" + L.instagram + "</b> tem mais fotos, estampas novas e entregas.", b: [["Abrir Instagram", "https://www.instagram.com/" + L.instagram]] }) },
    { id: "contato", kw: ["whatsapp", "whats", "zap", "telefone", "contato", "falar", "atendente", "wilma", "humano", "pessoa"],
      r: () => ({ t: "Claro! Você pode falar direto com a Wilma no WhatsApp " + L.whatsappExibicao + ".", b: [["Falar com a Wilma", "@wa:Oi, Wilma! Vim pelo site da Ela me Fez 😊"]] }) },
  ];

  /* produtos citados pelo nome */
  const SIN = { "amigurumi": ["croche", "bichinho", "raposa", "ursinha", "urso de croche", "boneca"],
    "kit-panos-de-boca": ["pano de boca", "panos de boca", "bebe", "enxoval", "maternidade", "fralda"],
    "bastidor-porta-aliancas": ["bastidor", "porta alianca", "aliancas", "bordado", "bordados"],
    "caderno-de-receitas": ["caderno", "receita", "receitas"], "porta-vinho": ["vinho", "garrafa"],
    "jogo-americano": ["jogo americano", "mesa", "americano"], "estojo": ["estojo", "caneta", "escova"] };
  function produtoCitado(q) {
    let best = null, score = 0;
    PRODS.forEach((p) => {
      const termos = [norm(p.nome).replace(/^necessaire /, "")].concat(SIN[p.id] || []);
      termos.forEach((t) => { if (t.length > 2 && q.includes(t) && t.length > score) { best = p; score = t.length; } });
    });
    return best;
  }
  function respostaProduto(p) {
    let preco;
    if (p.tamanhos) preco = "de " + brl(Math.min(...p.tamanhos.map((t) => t.preco))) + " a " + brl(Math.max(...p.tamanhos.map((t) => t.preco))) + " (tamanhos PP, P, M e G)";
    else if (typeof p.preco === "number") preco = brl(p.preco);
    else preco = "<b>sob orçamento</b> (a Wilma confirma o valor no WhatsApp)";
    let t = "<b>" + p.nome + "</b>: " + p.desc + "<br><br>Preço: " + preco + ".";
    if (p.opcoes) t += "<br>" + p.opcoes.nome + ": " + p.opcoes.itens.join(", ") + ".";
    return { t, b: [["Ver esta peça", "#p/" + p.id]] };
  }

  function responder(texto) {
    const q = " " + norm(texto) + " ";
    let best = null, pts = 0;
    INTENTS.forEach((it) => {
      let s = 0; it.kw.forEach((k) => { if (q.includes(k.length <= 3 ? " " + k + " " : k)) s += k.length > 4 ? 2 : 1; });
      if (s > pts) { pts = s; best = it; }
    });
    const prod = produtoCitado(q);
    // produto citado + pergunta de preço/tamanho/estampa → resposta do produto
    if (prod && (!best || ["preco", "tamanho", "estampa", "oi", "medida"].includes(best.id) || pts <= 2)) return respostaProduto(prod);
    if (best && (best.id === "preco" || best.id === "tamanho")) {
      const t = TAM.find((x) => q.includes(" " + x.id.toLowerCase() + " ") || q.includes(" tamanho " + x.id.toLowerCase()));
      if (t) { const r = best.r(); r.t = "A necessaire <b>" + t.nome + "</b> mede " + t.medida + " e custa <b>" + brl(t.preco) + "</b>, em qualquer estampa.<br><br>Todos os tamanhos:<br>" + tabela(); return r; }
    }
    if (best) return best.r();
    return { t: "Hmm, essa eu não sei responder por aqui. 🙈 Mas a Wilma te responde rapidinho no WhatsApp!",
      b: [["Perguntar à Wilma", "@wa:Oi, Wilma! " + texto]] };
  }

  /* ---------- interface ---------- */
  const SUGEST = ["Preços e tamanhos", "Quais estampas?", "Formas de pagamento", "Qual o prazo?", "Fazem sob medida?", "Falar com a Wilma"];
  const box = $("#chat"), log = $("#chat-log"), form = $("#chat-form"), inp = $("#chat-input");

  function addMsg(quem, html, botoes, chips) {
    const m = document.createElement("div"); m.className = "cm " + quem;
    const bub = document.createElement("div"); bub.className = "cb";
    if (quem === "eu") bub.textContent = html; else bub.innerHTML = html;
    m.appendChild(bub);
    if (botoes && botoes.length) {
      const w = document.createElement("div"); w.className = "cacts";
      botoes.forEach(([rot, alvo]) => {
        const a = document.createElement("a"); a.textContent = rot; a.className = "cact";
        if (alvo.startsWith("@wa:")) { a.href = wa(alvo.slice(4)); a.target = "_blank"; a.rel = "noopener"; a.classList.add("wa"); }
        else if (alvo === "@sacola") { a.href = "#"; a.addEventListener("click", (e) => { e.preventDefault(); fechar(); $("#abrir-carrinho").click(); }); }
        else if (alvo.startsWith("#")) { a.href = alvo; a.addEventListener("click", () => fechar()); }
        else { a.href = alvo; a.target = "_blank"; a.rel = "noopener"; }
        w.appendChild(a);
      });
      m.appendChild(w);
    }
    if (chips) m.appendChild(chipsEl());
    log.appendChild(m); log.scrollTop = log.scrollHeight;
  }
  function chipsEl() {
    const w = document.createElement("div"); w.className = "cchips";
    SUGEST.forEach((s) => { const b = document.createElement("button"); b.type = "button"; b.textContent = s; b.addEventListener("click", () => perguntar(s)); w.appendChild(b); });
    return w;
  }
  function perguntar(texto) {
    texto = String(texto).trim(); if (!texto) return;
    addMsg("eu", texto);
    const dig = document.createElement("div"); dig.className = "cm bot"; dig.innerHTML = '<div class="cb typing"><i></i><i></i><i></i></div>';
    log.appendChild(dig); log.scrollTop = log.scrollHeight;
    setTimeout(() => { dig.remove(); const r = responder(texto); addMsg("bot", r.t, r.b, r.chips); }, 450);
  }
  let iniciado = false;
  function abrir() {
    box.hidden = false; $("#chat-fab").setAttribute("aria-expanded", "true");
    if (!iniciado) { iniciado = true; addMsg("bot", "Oi! 😊 Sou a assistente da <b>Ela me Fez</b>. Pergunte sobre preços, tamanhos, estampas, pagamento, prazo ou pedidos sob medida.", null, true); }
    setTimeout(() => inp.focus(), 50);
  }
  function fechar() { box.hidden = true; $("#chat-fab").setAttribute("aria-expanded", "false"); }

  $("#chat-fab").addEventListener("click", () => (box.hidden ? abrir() : fechar()));
  $("#chat-close").addEventListener("click", fechar);
  form.addEventListener("submit", (e) => { e.preventDefault(); const t = inp.value; inp.value = ""; perguntar(t); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !box.hidden) fechar(); });

  window.__chatResponder = responder; // usado nos testes
})();
