(function () {
  "use strict";

  const L = window.LOJA, PRODS = window.PRODUTOS, CATS = window.CATEGORIAS;
  const $ = (s, el = document) => el.querySelector(s);
  const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const fmt = (n) => brl.format(n);
  const catNome = (id) => (CATS.find((c) => c.id === id) || {}).nome || "";
  const byId = (id) => PRODS.find((p) => p.id === id);
  const waLink = (texto) => "https://wa.me/" + L.whatsapp + "?text=" + encodeURIComponent(texto);
  const siteUrl = () => location.origin + location.pathname;

  function precoBase(p) {
    if (p.tamanhos) return Math.min(...p.tamanhos.map((t) => t.preco));
    return typeof p.preco === "number" ? p.preco : null;
  }
  function precoLabel(p) {
    const b = precoBase(p);
    if (b === null) return { html: "Sob orçamento", orc: true };
    return { html: (p.tamanhos ? "<small>a partir de</small>" : "") + fmt(b), orc: false };
  }

  /* ---------- Catálogo ---------- */
  const grid = $("#grid"), chips = $("#chips");
  let catAtual = "todos";

  function renderChips() {
    chips.innerHTML = "";
    CATS.forEach((c) => {
      if (c.id !== "todos" && !PRODS.some((p) => p.cat === c.id)) return;
      const b = document.createElement("button");
      b.className = "chip"; b.type = "button"; b.setAttribute("role", "tab");
      b.textContent = c.nome;
      b.setAttribute("aria-selected", String(c.id === catAtual));
      b.addEventListener("click", () => filtrar(c.id, true));
      chips.appendChild(b);
    });
  }

  function renderGrid() {
    grid.innerHTML = "";
    PRODS.filter((p) => catAtual === "todos" || p.cat === catAtual).forEach((p, i) => {
      const a = document.createElement("a");
      a.className = "card prod"; a.href = "#p/" + p.id;
      a.style.animationDelay = Math.min(i * 30, 300) + "ms";
      const pl = precoLabel(p);
      a.innerHTML =
        '<div class="prod-img"><img loading="lazy" alt=""></div>' +
        '<div class="prod-body"><span class="prod-cat"></span><h3></h3>' +
        '<span class="prod-price' + (pl.orc ? " orc" : "") + '">' + pl.html + "</span></div>";
      const img = $("img", a); img.src = p.fotos[0]; img.alt = p.nome;
      $(".prod-cat", a).textContent = catNome(p.cat);
      $("h3", a).textContent = p.nome;
      if (p.selo) { const s = document.createElement("span"); s.className = "badge"; s.textContent = p.selo; $(".prod-img", a).appendChild(s); }
      if (p.fotos.length > 1) { const s = document.createElement("span"); s.className = "prod-count"; s.textContent = p.fotos.length + " fotos"; $(".prod-img", a).appendChild(s); }
      grid.appendChild(a);
    });
  }

  function filtrar(cat, scroll) {
    catAtual = CATS.some((c) => c.id === cat) ? cat : "todos";
    renderChips(); renderGrid();
    history.replaceState(null, "", catAtual === "todos" ? location.pathname : "#c/" + catAtual);
    if (scroll) $("#catalogo").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* Tabela de tamanhos */
  const tam = (byId("necessaire-bordo") || {}).tamanhos || [];
  $("#size-rows").innerHTML = tam.map((t) =>
    '<div class="size-row" role="row"><span role="cell"><b>' + t.nome + '</b></span><span role="cell">' + t.medida +
    '</span><span role="cell" class="price">' + fmt(t.preco) + "</span></div>").join("");

  /* ---------- Modal de produto ---------- */
  const pmOv = $("#produto-overlay");
  let atual = null, ultimoFoco = null;

  function pillGroup(container, name, itens) {
    const list = $(".opt-list", container);
    list.innerHTML = "";
    itens.forEach((it, i) => {
      const l = document.createElement("label"); l.className = "pill";
      const inp = document.createElement("input"); inp.type = "radio"; inp.name = name; inp.value = it.value; if (i === 0 && it.preselect) inp.checked = true;
      const s = document.createElement("span"); s.textContent = it.label;
      if (it.sub) { const sm = document.createElement("small"); sm.textContent = it.sub; s.appendChild(sm); }
      l.append(inp, s); list.appendChild(l);
    });
  }

  function abrirProduto(id) {
    const p = byId(id); if (!p) return;
    atual = p; ultimoFoco = document.activeElement;
    $("#pm-cat").textContent = catNome(p.cat);
    $("#pm-nome").textContent = p.nome;
    $("#pm-desc").textContent = p.desc;
    $("#pm-err").hidden = true;
    $("#pm-qtd").value = 1;
    $("#pm-personal").value = "";
    $("#pm-personal-label").textContent = p.personalizar ? p.personalizar + " (opcional)" : "Observação (opcional)";
    $("#pm-personal").placeholder = p.personalizar ? "Conte como quer a sua" : "Cor do zíper, outra estampa, nome…";

    // fotos
    const th = $("#pm-thumbs"); th.innerHTML = "";
    const setFoto = (i) => {
      $("#pm-foto").src = p.fotos[i]; $("#pm-foto").alt = p.nome;
      [...th.children].forEach((b, j) => b.setAttribute("aria-current", String(i === j)));
    };
    if (p.fotos.length > 1) p.fotos.forEach((f, i) => {
      const b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "Foto " + (i + 1));
      b.innerHTML = '<img alt="">'; $("img", b).src = f;
      b.addEventListener("click", () => setFoto(i)); th.appendChild(b);
    });
    setFoto(0); pmOv._setFoto = setFoto;

    // tamanhos
    const ft = $("#pm-tamanhos");
    if (p.tamanhos) {
      ft.hidden = false;
      pillGroup(ft, "tam", p.tamanhos.map((t) => ({ value: t.id, label: t.nome + " · " + fmt(t.preco), sub: t.medida })));
    } else ft.hidden = true;

    // opções
    const fo = $("#pm-opcoes");
    if (p.opcoes) {
      fo.hidden = false; $("legend", fo).textContent = p.opcoes.nome;
      pillGroup(fo, "opc", p.opcoes.itens.map((x) => ({ value: x, label: x })));
    } else fo.hidden = true;

    atualizarPrecoModal();
    $("#pm-perguntar").href = waLink("Oi, Wilma! Tenho uma dúvida sobre: " + p.nome + "\n" + siteUrl() + "#p/" + p.id);
    pmOv.hidden = false; document.body.style.overflow = "hidden";
    $(".modal", pmOv).scrollTop = 0;
    if (location.hash !== "#p/" + p.id) history.replaceState(null, "", "#p/" + p.id);
    $(".x", pmOv).focus();
  }

  function atualizarPrecoModal() {
    const p = atual, el = $("#pm-preco");
    const sel = $('input[name="tam"]:checked', pmOv);
    el.classList.remove("orc");
    if (p.tamanhos) {
      const t = sel && p.tamanhos.find((x) => x.id === sel.value);
      el.innerHTML = t ? fmt(t.preco) : '<span style="font-weight:400;font-size:.9rem;color:var(--muted)">a partir de </span>' + fmt(precoBase(p));
    } else if (typeof p.preco === "number") el.textContent = fmt(p.preco);
    else { el.textContent = "Sob orçamento: valor confirmado no WhatsApp"; el.classList.add("orc"); }
  }

  function fecharOverlays() {
    pmOv.hidden = true; cartOv.hidden = true; document.body.style.overflow = "";
    if (location.hash.startsWith("#p/")) history.replaceState(null, "", catAtual === "todos" ? location.pathname : "#c/" + catAtual);
    if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
  }

  pmOv.addEventListener("change", (e) => {
    $("#pm-err").hidden = true;
    if (e.target.name === "tam") atualizarPrecoModal();
    if (e.target.name === "opc" && atual.opcoes.fotos) {
      const i = atual.opcoes.itens.indexOf(e.target.value), f = atual.opcoes.fotos[i];
      if (f != null && pmOv._setFoto) pmOv._setFoto(f);
    }
  });
  pmOv.addEventListener("click", (e) => {
    if (e.target === pmOv || e.target.closest("[data-fechar]")) fecharOverlays();
    const q = e.target.closest("[data-q]");
    if (q) { const i = $("#pm-qtd"); i.value = Math.max(1, (parseInt(i.value, 10) || 1) + Number(q.dataset.q)); }
  });

  $("#pm-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const p = atual, err = $("#pm-err");
    const tamSel = $('input[name="tam"]:checked', pmOv);
    const opcSel = $('input[name="opc"]:checked', pmOv);
    if (p.tamanhos && !tamSel) { err.textContent = "Escolha o tamanho."; err.hidden = false; return; }
    if (p.opcoes && !opcSel) { err.textContent = "Escolha " + p.opcoes.nome.toLowerCase() + "."; err.hidden = false; return; }
    const t = tamSel ? p.tamanhos.find((x) => x.id === tamSel.value) : null;
    addCarrinho({
      id: p.id,
      tam: t ? t.id : "",
      tamMedida: t ? t.medida : "",
      opc: opcSel ? opcSel.value : "",
      opcNome: p.opcoes ? p.opcoes.nome : "",
      obs: $("#pm-personal").value.trim(),
      qtd: Math.max(1, parseInt($("#pm-qtd").value, 10) || 1),
      preco: t ? t.preco : (typeof p.preco === "number" ? p.preco : null),
    });
    fecharOverlays();
    toast("Adicionado à sacola ✓");
  });

  $("#pm-compartilhar").addEventListener("click", async () => {
    const url = siteUrl() + "#p/" + atual.id;
    if (navigator.share) { try { await navigator.share({ title: atual.nome + " · Ela me Fez", url }); return; } catch (_) { /* cancelado */ } }
    try { await navigator.clipboard.writeText(url); toast("Link copiado!"); }
    catch (_) { prompt("Copie o link:", url); }
  });

  /* ---------- Sacola ---------- */
  const KEY = "elamefez-sacola";
  let carrinho = [];
  try { carrinho = JSON.parse(localStorage.getItem(KEY) || "[]").filter((i) => byId(i.id)); } catch (_) { carrinho = []; }
  const salvar = () => { try { localStorage.setItem(KEY, JSON.stringify(carrinho)); } catch (_) {} };
  const cartOv = $("#cart-overlay");

  function addCarrinho(item) {
    const igual = carrinho.find((i) => i.id === item.id && i.tam === item.tam && i.opc === item.opc && i.obs === item.obs);
    if (igual) igual.qtd += item.qtd; else carrinho.push(item);
    salvar(); renderCarrinho();
    const c = $("#cart-count"); c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump");
  }

  function totais() {
    let sub = 0, orc = false, n = 0;
    carrinho.forEach((i) => { n += i.qtd; if (i.preco === null) orc = true; else sub += i.preco * i.qtd; });
    return { sub, orc, n };
  }

  function descItem(i) {
    const d = [];
    if (i.tam) d.push("Tamanho " + i.tam + " (" + i.tamMedida + ")");
    if (i.opc) d.push(i.opcNome + ": " + i.opc);
    return d.join(" · ");
  }

  function renderCarrinho() {
    const { sub, orc, n } = totais();
    const cc = $("#cart-count"); cc.textContent = n; cc.hidden = n === 0;
    $("#cart-bar").hidden = n === 0;
    $("#cart-bar-text").textContent = "Ver sacola (" + n + ")";
    $("#cart-bar-total").textContent = sub ? fmt(sub) + (orc ? " +" : "") : "";
    $("#cart-empty").hidden = n > 0;
    $("#checkout").hidden = n === 0;
    $("#cart-subtotal").textContent = fmt(sub);
    $("#cart-orc-note").hidden = !orc;

    const ul = $("#cart-list"); ul.innerHTML = "";
    carrinho.forEach((i, idx) => {
      const p = byId(i.id);
      const li = document.createElement("li"); li.className = "ci";
      li.innerHTML = '<img alt=""><div><h4></h4><p class="d"></p><p class="o"></p>' +
        '<div class="ci-actions"><button type="button" data-a="-" aria-label="Diminuir">−</button><span></span>' +
        '<button type="button" data-a="+" aria-label="Aumentar">+</button><button type="button" class="rm" data-a="x">remover</button></div></div>' +
        '<div class="ci-price"></div>';
      const fi = p.opcoes && p.opcoes.fotos ? p.opcoes.fotos[p.opcoes.itens.indexOf(i.opc)] : null;
      $("img", li).src = p.fotos[fi != null ? fi : 0];
      $("h4", li).textContent = p.nome;
      $(".d", li).textContent = descItem(i);
      $(".o", li).textContent = i.obs ? "Obs.: " + i.obs : "";
      $(".ci-actions span", li).textContent = i.qtd;
      const pr = $(".ci-price", li);
      if (i.preco === null) { pr.textContent = "orçamento"; pr.classList.add("orc"); } else pr.textContent = fmt(i.preco * i.qtd);
      li.addEventListener("click", (e) => {
        const a = e.target.dataset.a; if (!a) return;
        if (a === "+") i.qtd++;
        if (a === "-") i.qtd = Math.max(1, i.qtd - 1);
        if (a === "x") carrinho.splice(idx, 1);
        salvar(); renderCarrinho();
      });
      ul.appendChild(li);
    });
  }

  function abrirCarrinho() {
    ultimoFoco = document.activeElement;
    cartOv.hidden = false; document.body.style.overflow = "hidden";
    $(".x", cartOv).focus();
  }
  $("#abrir-carrinho").addEventListener("click", abrirCarrinho);
  $("#cart-bar").addEventListener("click", abrirCarrinho);
  cartOv.addEventListener("click", (e) => {
    const f = e.target.closest("[data-fechar]");
    if (e.target === cartOv || f) {
      fecharOverlays();
      if (f && f.dataset.ir) $(f.dataset.ir).scrollIntoView({ behavior: "smooth" });
    }
  });

  $("#checkout").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, err = $("#checkout-err");
    const nome = f.nome.value.trim();
    if (!nome) { err.textContent = "Coloque seu nome para a Wilma saber quem é."; err.hidden = false; f.nome.focus(); return; }
    err.hidden = true;
    const { sub, orc } = totais();
    const num = "EMF-" + Date.now().toString(36).slice(-5).toUpperCase();
    const linhas = ["Olá, Wilma! Quero fazer um pedido pelo site 🧵", "", "*Pedido " + num + "*", ""];
    carrinho.forEach((i, k) => {
      const p = byId(i.id);
      linhas.push((k + 1) + ") *" + p.nome + "*" + " (" + i.qtd + "x)");
      const d = descItem(i); if (d) linhas.push("   " + d);
      if (i.obs) linhas.push("   Obs.: " + i.obs);
      linhas.push("   " + (i.preco === null ? "Valor: sob orçamento" : "Valor: " + fmt(i.preco * i.qtd)));
    });
    linhas.push("", "*Subtotal:* " + fmt(sub) + (orc ? " + itens sob orçamento" : ""));
    linhas.push("", "*Nome:* " + nome);
    if (f.local.value.trim()) linhas.push("*Cidade/bairro:* " + f.local.value.trim());
    linhas.push("*Entrega:* " + f.entrega.value);
    linhas.push("*Pagamento:* " + f.pagamento.value);
    if (f.obs.value.trim()) linhas.push("*Observações:* " + f.obs.value.trim());
    linhas.push("", "Aguardo a confirmação de prazo e frete. Obrigada! 💛");
    window.open(waLink(linhas.join("\n")), "_blank", "noopener");
    toast("Abrindo o WhatsApp…");
  });

  /* ---------- Pix ---------- */
  const pixBox = $("#pix-box"), ck = $("#checkout");
  function atualizarPix() {
    pixBox.hidden = !L.pix || ck.pagamento.value !== "Pix";
  }
  if (L.pix) {
    $("#pix-tipo").textContent = L.pixTipo || "chave";
    $("#pix-chave").textContent = L.pixExibicao || L.pix;
    $("#pix-nome").textContent = L.pixNome ? "em nome de " + L.pixNome : "";
    $("#pix-copiar").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(L.pix); toast("Chave Pix copiada!"); }
      catch (_) { prompt("Copie a chave Pix:", L.pix); }
    });
  }
  ck.addEventListener("change", (e) => { if (e.target.name === "pagamento") atualizarPix(); });
  atualizarPix();

  /* ---------- Sob medida ---------- */
  $("#form-medida").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, err = $("#medida-err");
    if (!f.peca.value) { err.textContent = "Escolha que peça você quer."; err.hidden = false; f.peca.focus(); return; }
    if (!f.nome.value.trim()) { err.textContent = "Coloque seu nome."; err.hidden = false; f.nome.focus(); return; }
    err.hidden = true;
    const l = ["Olá, Wilma! Quero um *pedido sob medida* ✂️", "", "*Peça:* " + f.peca.value];
    const add = (rot, v) => { v = String(v || "").trim(); if (v) l.push("*" + rot + ":* " + v); };
    add("Tamanho/medidas", f.tamanho.value);
    add("Quantidade", f.qtd.value);
    add("Cores/estampa", f.cores.value);
    add("Personalização", f.personal.value);
    add("Para quando", f.data.value);
    add("Detalhes", f.obs.value);
    l.push("", "*Nome:* " + f.nome.value.trim(), "", "Pode me passar o orçamento? Obrigada! 💛");
    window.open(waLink(l.join("\n")), "_blank", "noopener");
  });

  /* ---------- Rotas (#p/produto, #c/categoria) ---------- */
  function rota() {
    const h = decodeURIComponent(location.hash.slice(1));
    if (h.startsWith("p/")) { const p = byId(h.slice(2)); if (p) { if (catAtual !== "todos" && p.cat !== catAtual) filtrar("todos"); abrirProduto(p.id); } }
    else if (h.startsWith("c/")) { filtrar(h.slice(2)); $("#catalogo").scrollIntoView(); }
  }
  window.addEventListener("hashchange", rota);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && (!pmOv.hidden || !cartOv.hidden)) fecharOverlays(); });

  /* ---------- Toast ---------- */
  let tt;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.hidden = false;
    clearTimeout(tt); tt = setTimeout(() => (t.hidden = true), 2200);
  }

  renderChips(); renderGrid(); renderCarrinho(); rota();
})();
