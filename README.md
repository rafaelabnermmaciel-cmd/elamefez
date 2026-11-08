# Ela me Fez · Ateliê Wilma Virgínia

Site de vitrine (link da bio do Instagram [@ela.me.fez](https://www.instagram.com/ela.me.fez)) com as peças feitas à mão pela Wilma: nécessaires, kits de maternidade, bordados, amigurumi e presentes personalizados. Todo contato é pelo WhatsApp.

Publicado em: https://elamefez.com.br/

## Estrutura

```
index.html     página única (HTML + CSS + JS, sem build)
favicon.png    ícone da aba
img/           fotos das peças e og-image.jpg (prévia ao compartilhar o link)
netlify.toml   configuração do deploy no Netlify
```

## Como editar

- **Textos, número do WhatsApp e depoimentos:** direto no `index.html`.
- **Adicionar foto a uma categoria:** coloque o `.jpg` em `img/` e acrescente uma linha na lista `images` da categoria, dentro do objeto `galleries` no final do `index.html`. A foto aparece na galeria que abre ao tocar nas fotos do cartão.
- Prefira fotos com no máximo ~1200 px de largura e até ~150 KB para o site carregar rápido no celular.

## Como ver localmente

Abra o `index.html` no navegador, ou rode `python3 -m http.server` nesta pasta e acesse http://localhost:8000.

## Deploy

Hospedado no **GitHub Pages** (Settings → Pages → *Deploy from a branch* → `main` / `(root)`). Cada push na `main` publica o site em 1–2 minutos.

- `CNAME` define o domínio `elamefez.com.br`.
- `.nojekyll` faz o GitHub servir os arquivos como estão.
- DNS no Registro.br: registro `A` do domínio apontando para `185.199.108.153` (GitHub Pages).
