# Casamento Léo & Millene — site

Site de página única, sem build e sem dependências. Basta abrir `index.html`
(ou publicar a pasta) que ele funciona.

```
index.html          a página
diagnostico.html    testa a conexão com o banco (só leitura)
css/                estilos, separados por seção
  base.css          cores, tipografia e utilitários
  logo.css          monograma M&L
  hero.css          topo + capa com a foto
  contagem.css      cartões da contagem regressiva
  versiculo.css     brasão, versículo e faixa de atalhos
  secoes.css        história, o casamento, confirmação
  presentes.css     lista de presentes
  formulario.css    formulário de confirmação
  interface.css     botões, rodapé, aviso de música
  responsivo.css    ajustes de tela pequena
js/config.js        TODO o conteúdo editável
js/app.js           textos, contagem, contatos
js/musica.js        música de fundo e aviso
js/presentes.js     regras de reserva (local ou Firebase)
js/presentes-ui.js  a lista na tela
js/extra.js         menu, animações, confirmação de presença
assets/             fotos e a música
```

As cores ficam em `css/base.css`, no bloco `:root`. Foram medidas na arte
de referência: navy `#061735`, rosa de fundo `#FDF3F4`, rosa dos números
`#E08898`, rosa claro `#F7C6CC` e a faixa do rodapé `#F1A8B1`.

## 1. O que editar (só `js/config.js`)

Quase tudo que muda está lá: data, locais, traje, WhatsApp, música e a
lista de presentes. Abra o arquivo no editor e altere os textos entre aspas.

**A data** deve estar no fuso de Brasília:

```js
data: "2027-08-20T16:00:00-03:00",
```

A contagem regressiva e o "sexta-feira" se ajustam sozinhos a partir dela.

**WhatsApp:** só números, com código do país. `"5511987654321"`.
Se deixar `""`, os botões de WhatsApp somem e o formulário apenas
salva a resposta no aparelho do convidado.

## 2. A música — como fazer tocar de verdade

A lógica já está pronta e testada. Falta só o arquivo.

**Passo único:** salve a faixa como `assets/musica.mp3` (MP3, 128–192 kbps).
Recarregue a página: a música toca e o aviso "Tocando: A hora é agora"
aparece no canto.

Se o arquivo não existir, o site **não** mostra o aviso nem finge tocar —
de propósito, para não prometer o que não acontece.

**Por que às vezes não toca no primeiro segundo:** navegadores só liberam
áudio depois de uma interação. O site tenta tocar ao carregar; se for
barrado, liga no primeiro toque, clique ou rolagem do visitante. O aviso
só aparece quando há som de verdade saindo — e o botão redondo no canto
liga e desliga a qualquer momento.

**Sobre os direitos:** "A hora é agora" é faixa protegida. Para o site
ficar público, use um arquivo que você tenha direito de publicar —
comprado, ou uma versão licenciada. Se não houver, o site funciona
normalmente sem música; nada quebra.

**Testado nesta versão:** com um áudio de teste, confirmei que o arquivo
carrega, toca em loop, o botão pausa/retoma e o aviso aparece só com som
ativo. Trocando o arquivo de teste pelo seu MP3, o comportamento é o mesmo.

> A faixa "A hora é agora" é protegida por direitos autorais. Para usar o
> áudio no site público, o caminho certo é comprar o arquivo ou usar uma
> licença que permita publicação — deixar um MP3 de terceiros em um site
> aberto é uso não autorizado.

## 3. A lista de presentes

Está em `config.js`, no formato:

```js
{ id: "xicaras", categoria: "Cozinha", nome: "Jogo de xícaras" },
```

O `id` precisa ser único e sem espaços. É ele que marca a reserva.

### Como as reservas funcionam hoje

Por padrão (`infra.modo: "local"`) cada aparelho guarda as próprias escolhas.
Serve para testar e para usar a lista **num só aparelho**, por exemplo um
tablet na festa do chá de panela.

### Para todos os convidados verem a mesma lista

**1. Criar o banco (5 minutos, gratuito)**

1. Abra `console.firebase.google.com` e crie um projeto (plano Spark).
2. Menu lateral > **Realtime Database** > criar banco. Região `us-central1`.
3. Copie a URL no topo, algo como `https://leo-millene-default-rtdb.firebaseio.com`.

**2. Ligar no site**

Em `js/config.js`:

```js
infra: {
  modo: "firebase",
  firebaseUrl: "https://leo-millene-default-rtdb.firebaseio.com"
},
```

**3. As regras — este passo é o que faz a proteção funcionar**

Na aba **Regras** do banco, cole:

```json
{
  "rules": {
    "reservas": {
      ".read": true,
      ".write": true,
      "$item": {
        ".validate": "newData.hasChild('t')"
      }
    }
  }
}
```

> **Não use** `.read: true` / `.write: true` na raiz do banco. Com escrita
> livre na raiz, o Firebase recusa a transação por ETag que o site usa
> para impedir duas pessoas no mesmo presente — e a lista para de funcionar.
> Liberar a escrita só em `reservas`, como acima, é o que mantém a proteção.

**4. Conferir**

Abra `diagnostico.html` no site publicado. Ele mostra se a leitura funciona
e se a transação por ETag está disponível. Não reserva nada — é só leitura.

**Como a proteção contra duplicidade funciona**

Quando alguém toca em "Reservar", o site lê o item e guarda o `ETag` (uma
impressão digital daquele estado). Na gravação, envia esse `ETag` no
cabeçalho `If-Match`. Se outro convidado reservou no meio do caminho, o
servidor recusa com `412` e o site tenta de novo. Assim, dois cliques
simultâneos **não** reservam o mesmo item. Sem esse mecanismo, um `PUT`
simples sobrescreveria a reserva do outro.

## 4. Publicar

Qualquer hospedagem estática serve. As mais simples:

- **Netlify** — arraste a pasta em `app.netlify.com/drop`.
- **Vercel** — `vercel` na pasta.
- **GitHub Pages** — suba o repositório e ative Pages.

Como é tudo estático, não há servidor para manter.

## 5. Antes de considerar pronto

- [ ] Colocar os horários e endereços reais em `config.js`
- [ ] Preencher o `whatsapp` dos noivos
- [ ] Adicionar `assets/musica.mp3` (ou deixar sem música, de propósito)
- [ ] Criar o banco no Firebase e trocar `infra.modo` para `"firebase"`
- [ ] Abrir `diagnostico.html` e confirmar leitura + ETag
- [ ] Testar no celular de verdade: hero, lista e formulário
- [ ] Trocar a data de confirmação no texto da seção, se for outra
