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

  /* ================= CONVERSA GUIADA ================= */
  const box = $("#chat"), log = $("#chat-log"), form = $("#chat-form"), inp = $("#chat-input");
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const PROD = (id) => PRODS.find((p) => p.id === id);
  const NEC = PRODS.filter((p) => p.cat === "necessaires" && p.tamanhos);
  let S = {};            // estado da conversa
  let passo = null;      // função que trata a próxima resposta escrita

  /* ---- mensagens ---- */
  function bolha(quem, html) {
    const m = document.createElement("div"); m.className = "cm " + quem;
    const b = document.createElement("div"); b.className = "cb";
    if (quem === "eu") b.textContent = html; else b.innerHTML = html;
    m.appendChild(b); log.appendChild(m); rolar(); return m;
  }
  function rolar() { log.scrollTop = log.scrollHeight; }
  function digitando(ms) {
    const d = document.createElement("div"); d.className = "cm bot"; d.innerHTML = '<div class="cb typing"><i></i><i></i><i></i></div>';
    log.appendChild(d); rolar();
    return new Promise((r) => setTimeout(() => { d.remove(); r(); }, ms));
  }
  /* bot fala uma ou mais mensagens, com "digitando…" proporcional ao tamanho */
  async function diz(...msgs) {
    for (const t of msgs) {
      if (!t) continue;
      await digitando(Math.min(1300, 350 + t.replace(/<[^>]+>/g, "").length * 9));
      bolha("bot", t);
    }
  }
  /* opções clicáveis (some depois de escolher) */
  function opcoes(lista, onPick) {
    const w = document.createElement("div"); w.className = "cm bot"; const c = document.createElement("div"); c.className = "cchips";
    lista.forEach((o) => {
      const [rot, val] = Array.isArray(o) ? o : [o, o];
      const b = document.createElement("button"); b.type = "button"; b.textContent = rot;
      b.addEventListener("click", () => { w.remove(); bolha("eu", rot); onPick(val, rot); });
      c.appendChild(b);
    });
    w.appendChild(c); log.appendChild(w); rolar(); return w;
  }
  /* cartões com foto (estampas/modelos) */
  function cartoes(itens, onPick) {
    const w = document.createElement("div"); w.className = "cm bot ccards-w"; const c = document.createElement("div"); c.className = "ccards";
    itens.forEach((it) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "ccard";
      b.innerHTML = '<img alt="" loading="lazy"><span></span>'; $("img", b).src = it.foto; $("span", b).textContent = it.nome;
      b.addEventListener("click", () => { w.remove(); bolha("eu", it.nome); onPick(it); });
      c.appendChild(b);
    });
    w.appendChild(c); log.appendChild(w); rolar();
  }
  function botoes(lista) {
    const m = document.createElement("div"); m.className = "cm bot"; const w = document.createElement("div"); w.className = "cacts";
    lista.forEach(([rot, alvo]) => {
      const a = document.createElement("a"); a.textContent = rot; a.className = "cact";
      if (alvo.startsWith("@wa:")) { a.href = wa(alvo.slice(4)); a.target = "_blank"; a.rel = "noopener"; a.classList.add("wa"); }
      else if (alvo === "@sacola") { a.href = "#"; a.classList.add("go"); a.addEventListener("click", (e) => { e.preventDefault(); fechar(); window.__loja && window.__loja.abrirCarrinho(); }); }
      else if (alvo.startsWith("#")) { a.href = alvo; a.addEventListener("click", () => fechar()); }
      else { a.href = alvo; a.target = "_blank"; a.rel = "noopener"; }
      w.appendChild(a);
    });
    m.appendChild(w); log.appendChild(m); rolar();
  }
  const limparOpcoes = () => log.querySelectorAll(".cchips,.ccards").forEach((e) => e.closest(".cm").remove());

  /* ---- roteiro ---- */
  async function inicio() {
    S = {}; passo = null;
    await diz(pick(["Oi! 😊 Que bom te ver por aqui.", "Oi, tudo bem? 😊 Seja bem-vinda ao ateliê!", "Olá! 💛 Que alegria ter você aqui."]),
      "Eu ajudo a Wilma a atender por aqui. Me conta: a peça é <b>pra você</b> ou é <b>pra presentear</b> alguém?");
    opcoes([["Pra mim", "eu"], ["É presente 🎁", "presente"], ["Só tirar uma dúvida", "duvida"]], async (v) => {
      S.para = v;
      if (v === "duvida") { await diz("Claro! Pode perguntar o que quiser: preço, tamanho, estampa, pagamento, prazo… ✍️"); passo = null; return; }
      if (v === "presente") {
        await diz(pick(["Que delícia dar presente feito à mão! 🎁", "Ah, presente feito à mão é outro nível de carinho! 🎁"]), "Tem alguma ocasião especial?");
        opcoes([["Aniversário", "aniversário"], ["Casamento / noivado", "casamento"], ["Chá de bebê", "bebê"], ["Só um mimo", "mimo"]], async (o) => {
          S.ocasiao = o;
          if (o === "casamento") { await diz("Que lindo! 💍 Para casamento, o mais pedido é o <b>bastidor porta-alianças bordado</b>, com as iniciais e a data do casal."); return personalizada("bastidor-porta-aliancas"); }
          if (o === "bebê") { await diz("Ai, que fofura! 👶 Para chá de bebê, os <b>kits de panos de boca</b> fazem o maior sucesso, e dá pra colocar o tema do enxoval."); return personalizada("kit-panos-de-boca"); }
          await diz(pick(["Boa! Deixa eu te mostrar o que sai daqui.", "Perfeito! Olha o que a Wilma faz:"]));
          tipo();
        });
      } else { await diz(pick(["Adoro! Você merece. 😄", "Ótimo, presente pra gente mesma é o melhor! 😄"])); tipo(); }
    });
  }
  function tipo() {
    diz("O que você está procurando?").then(() => opcoes([["👜 Necessaire", "nec"], ["✏️ Estojo", "estojo"], ["🧵 Bordado", "bastidor-porta-aliancas"], ["🦊 Amigurumi", "amigurumi"], ["👶 Bebê", "kit-panos-de-boca"], ["📖 Caderno de receitas", "caderno-de-receitas"], ["🍷 Porta-vinho", "porta-vinho"], ["🍽️ Jogo americano", "jogo-americano"], ["💡 Tenho outra ideia", "ideia"]], (v) => {
      if (v === "nec") return necessaire();
      if (v === "estojo") return estojoFlow();
      if (v === "ideia") return ideia();
      personalizada(v);
    }));
  }

  /* necessaire: uso → tamanho → estampa → estojo → sacola */
  async function necessaire() {
    S.prod = null;
    await diz(pick(["Boa escolha! As necessaires são o xodó do ateliê. 💛", "Ah, as necessaires! São as mais pedidas. 💛"]),
      "Pra eu te indicar o tamanho certinho: você vai usar mais pra quê?");
    opcoes([["Maquiagem", "M"], ["Viagem / mala", "G"], ["Levar na bolsa", "P"], ["Coisinhas miúdas", "PP"], ["Não sei ainda", "?"]], async (v) => {
      const sug = v === "?" ? null : TAM.find((t) => t.id === v);
      if (sug) await diz("Pra isso eu iria de <b>" + sug.nome + "</b> (" + sug.medida + "), que sai por <b>" + brl(sug.preco) + "</b>. Mas olha todos os tamanhos:");
      else await diz("Sem problema! Olha os tamanhos. O preço vale pra qualquer estampa:");
      opcoes(TAM.map((t) => [t.nome + " · " + t.medida + " · " + brl(t.preco), t.id]), async (id) => {
        S.tam = TAM.find((t) => t.id === id);
        await diz(pick(["Anotado! ✍️", "Perfeito!", "Ótimo!"]) + " Agora a parte mais gostosa: <b>a estampa</b>. Toque na que você mais gostou:");
        cartoes(NEC.map((p) => ({ id: p.id, nome: p.nome.replace(/^Necessaire /, ""), foto: p.fotos[0] })).concat([{ id: "outra", nome: "Outra estampa", foto: "img/nec-floral.jpg" }]), async (it) => {
          if (it.id === "outra") {
            S.prod = PROD("necessaire-boho"); S.outra = true;
            await diz("Tem muitas outras estampas no ateliê! 😍 Me conta o que você imagina (cor, tema, desenho):");
            passo = async (txt) => { S.obs = "Estampa desejada: " + txt; passo = null; await diz("Que ideia boa! A Wilma te mostra as opções parecidas no WhatsApp."); oferecerEstojo(); };
            return;
          }
          S.prod = PROD(it.id);
          await diz(pick(["Linda demais! 😍", "Essa é uma graça! 😍", "Ótimo gosto! ✨"]) + " <b>" + S.prod.nome + "</b> no tamanho <b>" + S.tam.nome + "</b>.");
          oferecerEstojo();
        });
      });
    });
  }
  async function oferecerEstojo() {
    const est = PROD("estojo");
    await diz("Quer levar o <b>estojo combinando</b> por mais <b>" + brl(est.preco) + "</b>? Fica um kit lindo, ótimo pra presente. 🎀");
    opcoes([["Quero o kit!", "sim"], ["Só a necessaire", "nao"]], async (v) => {
      S.kit = v === "sim";
      await diz(S.kit ? "Ebaa, vai ficar um charme! 💛" : "Tudo bem! 💛", "Quer personalizar algo? Por exemplo: cor do zíper, um nome… Se não, é só tocar em <b>Não, obrigada</b>.");
      opcoes([["Não, obrigada", ""], ["Quero personalizar", "p"]], async (o) => {
        if (o === "p") { await diz("Me conta como você quer:"); passo = async (txt) => { S.obs = [S.obs, txt].filter(Boolean).join(" · "); passo = null; fecharNecessaire(); }; return; }
        fecharNecessaire();
      });
    });
  }
  async function fecharNecessaire() {
    const L2 = window.__loja; if (!L2) return;
    L2.add({ id: S.prod.id, tam: S.tam.id, tamMedida: S.tam.medida, opc: "", opcNome: "", obs: S.obs || "", qtd: 1, preco: S.tam.preco });
    let total = S.tam.preco;
    if (S.kit) { const e = PROD("estojo"); L2.add({ id: "estojo", tam: "", tamMedida: "", opc: S.outra ? "Outra (combinar)" : (S.prod.nome.replace(/^Necessaire /, "")), opcNome: "Estampa", obs: "Combinando com a necessaire", qtd: 1, preco: e.preco }); total += e.preco; }
    finalizar(total);
  }

  /* estojo sozinho */
  async function estojoFlow() {
    const e = PROD("estojo");
    await diz("O estojo mede 20 × 3 × 4 cm e custa <b>" + brl(e.preco) + "</b>. Serve pra caneta ou pra escova e creme dental. ✏️🪥", "Qual estampa?");
    opcoes(e.opcoes.itens, async (v) => {
      window.__loja && window.__loja.add({ id: "estojo", tam: "", tamMedida: "", opc: v, opcNome: "Estampa", obs: "", qtd: 1, preco: e.preco });
      await diz(pick(["Boa! 😍", "Amei! ✨"]));
      finalizar(e.preco);
    });
  }

  /* peças sob orçamento: pede detalhes → sacola */
  async function personalizada(id) {
    const p = PROD(id); S.prod = p;
    await diz("<b>" + p.nome + "</b>: " + p.desc, "Essa peça é <b>sob orçamento</b>, porque o valor depende dos detalhes. Coloco na sacola e a Wilma te passa o valor certinho antes de você pagar qualquer coisa. 😉");
    const seguir = async () => {
      await diz("Me conta os detalhes: " + (p.personalizar ? p.personalizar.toLowerCase() : "como você imagina a peça") + (S.ocasiao ? ", e a data do evento, se tiver" : "") + ".");
      passo = async (txt) => {
        passo = null;
        window.__loja && window.__loja.add({ id: p.id, tam: "", tamMedida: "", opc: S.opc || "", opcNome: p.opcoes ? p.opcoes.nome : "", obs: txt, qtd: 1, preco: null });
        await diz(pick(["Que lindo, vai ficar especial! 💛", "Anotadinho! 💛"]));
        finalizar(null);
      };
    };
    if (p.opcoes) {
      await diz(p.opcoes.nome + ":");
      opcoes(p.opcoes.itens, async (v) => { S.opc = v; seguir(); });
    } else seguir();
  }

  /* outra ideia → sob medida */
  async function ideia() {
    await diz("Amo ideias novas! ✂️ Me descreve o que você quer: a peça, tamanho, cores e pra quando precisa.");
    passo = async (txt) => {
      passo = null;
      await diz("Que ideia boa! A Wilma vai adorar. Vou montar a mensagem pra você mandar pra ela pelo WhatsApp com tudo explicadinho:");
      botoes([["Enviar minha ideia à Wilma", "@wa:Olá, Wilma! Vim pelo site e quero um pedido sob medida ✂️\n\n" + txt]]);
    };
  }

  /* encerramento: leva à sacola */
  async function finalizar(total) {
    const n = window.__loja ? window.__loja.itens() : 1;
    await diz("Pronto, coloquei na sua <b>sacola</b>! 🛍️" + (total ? " Por enquanto, <b>" + brl(total) + "</b>." : ""),
      "Pra finalizar é rapidinho: você coloca seu nome, escolhe <b>Pix</b> ou <b>cartão em até 12x</b>, e o pedido chega direto pra Wilma. " + (total === null ? "Como tem item sob orçamento, ela te confirma o valor antes. 😉" : ""));
    botoes([["Finalizar pedido", "@sacola"]]);
    opcoes([["Quero ver mais peças", "mais"], ["Tenho uma dúvida", "duvida"]], async (v) => {
      if (v === "mais") return tipo();
      await diz("Claro, pode perguntar! ✍️");
    });
  }

  /* ---- texto livre: responde a dúvida e retoma ---- */
  const GANCHO = ["Posso te ajudar a escolher a sua? 😊", "Quer que eu te ajude a montar o seu pedido?", "Bora escolher a sua peça? 💛"];
  async function textoLivre(t) {
    if (passo) return passo(t);
    const r = responder(t);
    const intro = /^(Oi|Imagina)/.test(r.t) ? "" : pick(["Boa pergunta! ", "Claro! ", "Te explico: ", ""]);
    await diz(intro + r.t);
    if (r.b && r.b.length) botoes(r.b);
    limparOpcoes();
    const temSacola = window.__loja && window.__loja.itens() > 0;
    if (/^(Oi|Imagina)/.test(r.t)) return;
    if (temSacola) {
      await diz(pick(["Sua sacola já está separadinha. Quando quiser, é só finalizar! 😉", "Seu pedido está te esperando na sacola. 🛍️"]));
      botoes([["Finalizar pedido", "@sacola"]]);
      opcoes([["Ver mais peças", "mais"], ["Tenho outra dúvida", "d"]], async (v) => { if (v === "mais") return tipo(); await diz("Pode mandar! ✍️"); });
      return;
    }
    await diz(pick(GANCHO));
    opcoes([["Sim, me ajuda!", "s"], ["Tenho outra dúvida", "d"]], async (v) => {
      if (v === "s") { if (!S.para) return inicio(); return tipo(); }
      await diz("Pode mandar! ✍️");
    });
  }

  /* ---- abrir/fechar ---- */
  let iniciado = false;
  const hint = $("#chat-hint");
  try { if (!sessionStorage.getItem("emf-hint")) setTimeout(() => { if (box.hidden && !iniciado) hint.hidden = false; }, 6000); } catch (_) {}
  const tirarHint = () => { hint.hidden = true; try { sessionStorage.setItem("emf-hint", "1"); } catch (_) {} };
  $("button", hint).addEventListener("click", (e) => { e.stopPropagation(); tirarHint(); });
  hint.addEventListener("click", () => { tirarHint(); abrir(); });
  function abrir() {
    tirarHint();
    box.hidden = false; $("#chat-fab").setAttribute("aria-expanded", "true");
    if (!iniciado) { iniciado = true; inicio(); }
    setTimeout(() => inp.focus({ preventScroll: true }), 50);
  }
  function fechar() { box.hidden = true; $("#chat-fab").setAttribute("aria-expanded", "false"); }
  $("#chat-fab").addEventListener("click", () => (box.hidden ? abrir() : fechar()));
  $("#chat-close").addEventListener("click", fechar);
  form.addEventListener("submit", (e) => { e.preventDefault(); const t = inp.value.trim(); if (!t) return; inp.value = ""; bolha("eu", t); textoLivre(t); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !box.hidden) fechar(); });

  window.__chatResponder = responder;
})();
