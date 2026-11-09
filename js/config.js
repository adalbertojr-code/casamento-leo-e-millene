/* ============================================================
   CONFIGURAÇÃO — edite apenas este arquivo.
   Tudo que muda de conteúdo no site está aqui.
   ============================================================ */

window.CONFIG = {

  casal: {
    ele: "Léo",
    ela: "Millene"
  },

  // Data e hora da cerimônia (fuso de Brasília)
  data: "2027-08-20T16:00:00-03:00",

  // WhatsApp dos noivos, só números, com DDI e DDD. Ex.: "5511999999999"
  // Deixe vazio ("") para esconder os botões de WhatsApp.
  whatsapp: "",

  cerimonia: {
    hora: "A confirmar",
    local: "Local a confirmar",
    endereco: "Endereço a confirmar"
  },

  recepcao: {
    hora: "Após a cerimônia",
    local: "Local a confirmar",
    endereco: "Endereço a confirmar"
  },

  traje: "Traje a confirmar",

  // Link do Google Maps da cerimônia (deixe "" para esconder o botão)
  mapaUrl: "",

  musica: {
    titulo: "A hora é agora",
    artista: "Jorge & Mateus",
    arquivo: "assets/musica-mobile.mp3"
  },

  /* ------------------------------------------------------------
     Reservas de presentes.
     "local"    → cada celular guarda as próprias escolhas.
                  Serve para um único aparelho (ex.: tablet no chá de panela).
     "firebase" → todos os convidados veem a mesma lista, e dois cliques
                  simultâneos não reservam o mesmo item.
                  Preencha firebaseUrl e mude modo para "firebase".
                  Passo a passo completo no LEIA-ME.md.
     ------------------------------------------------------------ */
  infra: {
    modo: "local",          // troque para "firebase" quando o banco estiver criado
    firebaseUrl: ""         // ex.: "https://leo-millene-default-rtdb.firebaseio.com"
  },

  /* ------------------------------------------------------------
     LISTA DE PRESENTES — chá de panela
     ------------------------------------------------------------ */
  presentes: [
    { id: "xicaras",            categoria: "Cozinha", nome: "Jogo de xícaras" },
    { id: "pratos",             categoria: "Cozinha", nome: "Jogo de pratos" },
    { id: "talheres",           categoria: "Cozinha", nome: "Jogo de talheres" },
    { id: "sobremesa",          categoria: "Cozinha", nome: "Jogo de sobremesa" },
    { id: "panelas",            categoria: "Cozinha", nome: "Jogo de panelas" },
    { id: "porta-temperos",     categoria: "Cozinha", nome: "Porta-temperos" },
    { id: "potes-plasticos",    categoria: "Cozinha", nome: "Kit de potes plásticos" },
    { id: "escorredor-macarrao",categoria: "Cozinha", nome: "Escorredor de macarrão" },
    { id: "tabua-cortar",       categoria: "Cozinha", nome: "Tábua de cortar" },
    { id: "facas-carne",        categoria: "Cozinha", nome: "Jogo de facas para carne" },
    { id: "panos-prato",        categoria: "Cozinha", nome: "Panos de prato" },
    { id: "acucareiro",         categoria: "Cozinha", nome: "Açucareiro" },
    { id: "saleiro",            categoria: "Cozinha", nome: "Saleiro" },
    { id: "panela-pressao",     categoria: "Cozinha", nome: "Panela de pressão" },
    { id: "forma-bolo",         categoria: "Cozinha", nome: "Formas de bolo redonda e quadrada" },
    { id: "travessas-vidro",    categoria: "Cozinha", nome: "Travessas de vidro com tampa" },
    { id: "utensilios-silicone",categoria: "Cozinha", nome: "Utensílios de servir em silicone" },
    { id: "tigela-vidro",       categoria: "Cozinha", nome: "Tigela de vidro" },
    { id: "boleira",            categoria: "Cozinha", nome: "Boleira" },
    { id: "tacas-vidro",        categoria: "Cozinha", nome: "Taças de vidro" },
    { id: "frigideira",         categoria: "Cozinha", nome: "Frigideira" },
    { id: "garrafa-cafe",       categoria: "Cozinha", nome: "Garrafa de café" },
    { id: "escorredor-louca",   categoria: "Cozinha", nome: "Escorredor de louça" },
    { id: "lixeira-pia",        categoria: "Cozinha", nome: "Lixeira de pia" },
    { id: "potes-vidro",        categoria: "Cozinha", nome: "Potes de vidro herméticos com tampa" },
    { id: "ralador-peneira",    categoria: "Cozinha", nome: "Ralador e peneira" },
    { id: "abridor-latas",      categoria: "Cozinha", nome: "Abridor de latas" },
    { id: "abridor-garrafas",   categoria: "Cozinha", nome: "Abridor de garrafas" },
    { id: "copo-medidor",       categoria: "Cozinha", nome: "Copo medidor" },
    { id: "papel-toalha",       categoria: "Cozinha", nome: "Suporte para papel-toalha" },
    { id: "organizador-geladeira", categoria: "Cozinha", nome: "Organizador de geladeira" },
    { id: "porta-frios",        categoria: "Cozinha", nome: "Porta-frios" },
    { id: "porta-detergente",   categoria: "Cozinha", nome: "Porta-detergente" },
    { id: "rodo-pia",           categoria: "Cozinha", nome: "Rodo de pia" },
    { id: "descascador",        categoria: "Cozinha", nome: "Descascador" },
    { id: "forma-pao",          categoria: "Cozinha", nome: "Forma de pão" },
    { id: "descanso-panela",    categoria: "Cozinha", nome: "Descanso de panela" },
    { id: "chaleira-eletrica",  categoria: "Cozinha", nome: "Chaleira elétrica" },
    { id: "mixer",              categoria: "Cozinha", nome: "Mixer 3 em 1" },

    { id: "organizador-hermetico", categoria: "Lavanderia", nome: "Kit organizador hermético" },
    { id: "pa-lixo",            categoria: "Lavanderia", nome: "Pá de lixo" },
    { id: "varal",              categoria: "Lavanderia", nome: "Varal" },
    { id: "vassoura-rodo",      categoria: "Lavanderia", nome: "Kit vassoura e rodo" },
    { id: "balde",              categoria: "Lavanderia", nome: "Balde" },
    { id: "pano-chao",          categoria: "Lavanderia", nome: "Pano de chão" },
    { id: "prendedores",        categoria: "Lavanderia", nome: "Prendedores" },
    { id: "ferro-passar",       categoria: "Lavanderia", nome: "Ferro de passar" },
    { id: "tabua-passar",       categoria: "Lavanderia", nome: "Tábua de passar roupa" },
    { id: "cesto-roupa",        categoria: "Lavanderia", nome: "Cesto de roupa" },
    { id: "pano-pia",           categoria: "Lavanderia", nome: "Pano de pia" },

    { id: "toalhas",            categoria: "Banheiro", nome: "Jogo de toalhas (banho e rosto)" },
    { id: "lixeira-banheiro",   categoria: "Banheiro", nome: "Lixeira de banheiro" },
    { id: "escova-vaso",        categoria: "Banheiro", nome: "Escova para vaso sanitário" },
    { id: "mop",                categoria: "Banheiro", nome: "Mop de limpeza" },
    { id: "porta-escova",       categoria: "Banheiro", nome: "Porta-escova de dentes" },

    { id: "cobertor",           categoria: "Quarto", nome: "Cobertor" },
    { id: "travesseiro",        categoria: "Quarto", nome: "Travesseiro" },
    { id: "lencol",             categoria: "Quarto", nome: "Jogo de lençol com elástico" }
  ]
};

/* ------------------------------------------------------------
   COMO LIGAR AS RESERVAS PARA TODOS OS CONVIDADOS (grátis)

   1. Abra leo-millene.firebaseio.com / console.firebase.google.com
      e crie um projeto (o plano Spark é gratuito).
   2. Menu lateral > "Realtime Database" > criar banco.
      Escolha a região mais próxima (us-central1 serve).
   3. Copie a URL que aparece no topo do banco, algo como:
      https://leo-millene-default-rtdb.firebaseio.com
   4. Cole em infra.firebaseUrl e troque infra.modo para "firebase".
   5. Abra a aba "Regras" e cole exatamente isto:

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

   ATENÇÃO: não use ".read": true / ".write": true na RAIZ do banco.
   Com escrita livre na raiz, o Firebase não aceita a transação por
   ETag que o site usa para evitar duas pessoas no mesmo presente,
   e a lista para de funcionar. A escrita liberada só em "reservas"
   (como acima) é o que faz a proteção funcionar.

   O campo "t" guarda o horário da reserva, só para diagnóstico.

   Depois do casamento, apague o banco ou volte para modo "local".
   ------------------------------------------------------------ */
