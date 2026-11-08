# Ela me Fez · Ateliê Wilma Virgínia

Loja on-line das peças feitas à mão pela Wilma: necessaires (PP, P, M, G), estojos, bordados, amigurumis, kits de bebê e presentes personalizados.
O cliente escolhe tamanho e estampa, coloca na sacola e envia o pedido **pronto pelo WhatsApp**. Também há formulário de **pedido sob medida**.

Site: https://elamefez.com.br/

## Estrutura

```
index.html        página da loja
css/style.css     visual
js/produtos.js    CATÁLOGO: produtos, preços, fotos, tamanhos, WhatsApp e Pix
js/loja.js        funcionamento (catálogo, sacola, pedido no WhatsApp)
img/              fotos (até ~1100 px, ~100 KB cada)
CNAME             domínio elamefez.com.br (GitHub Pages)
```

## Como editar o catálogo

Tudo fica em `js/produtos.js`:

- **Mudar preço das necessaires:** altere `TAM_NECESSAIRE` (vale para todas as estampas).
- **Nova peça:** copie um bloco `{ ... }` da lista `PRODUTOS`, troque `id` (sem espaço/acento), `nome`, `cat`, `desc`, `fotos`.
  - Com preço fixo: `preco: 35`. Sob orçamento: `preco: null`. Com tamanhos: `tamanhos: TAM_NECESSAIRE`.
  - Escolhas (estampa, modelo, tema): `opcoes: { nome: "Estampa", itens: ["A", "B"] }`.
  - Campo de personalização: `personalizar: "Nome e data"`.
  - Selo no cartão: `selo: "novidade"`.
- **Pix:** preencha `pix` em `window.LOJA`.

## Links para divulgar

- Uma peça: `https://elamefez.com.br/#p/necessaire-bordo` (o final é o `id` do produto)
- Uma categoria: `https://elamefez.com.br/#c/necessaires` (`bordados`, `croche`, `maternidade`, `presentes`, `casa`, `sob-medida`)
- Dentro de cada peça há o botão **"Copiar link desta peça"**.

## Publicação

GitHub Pages (Settings → Pages → `main` / root). Cada push na `main` publica em 1–2 minutos.
DNS no Registro.br: `A` → `185.199.108.153`.

Para ver localmente: `python3 -m http.server` nesta pasta e abra http://localhost:8000.
