export const DEFAULT_BOOKS = [
  {
    id: 1,
    title: "Chronicles of Aether",
    author: "J. Skies",
    genres: ["Fantasy", "Adventure"],
    rating: 4.8,
    cover: "https://placehold.co/200x300/1e3a8a/FFF?text=Aether",
    desc: "In a world where islands float in the sky...",
    pages: 320,
  },
  {
    id: 2,
    title: "Neon Rain",
    author: "Cyber Dreams",
    genres: ["Sci-Fi", "Noir"],
    rating: 4.5,
    cover: "https://placehold.co/200x300/0f172a/FFF?text=Neon",
    desc: "A detective story in a city that never sleeps...",
    pages: 210,
  },
  {
    id: 3,
    title: "Silent Cosmos",
    author: "Star Walker",
    genres: ["Sci-Fi"],
    rating: 5.0,
    cover: "https://placehold.co/200x300/000000/FFF?text=Cosmos",
    desc: "Silence is the loudest sound...",
    pages: 180,
  },
  
{
  id: 4,
  title: "Legend of Korra: Guerras Territoriais Vol. 1",
  author: "Michael Dante DiMartino & Bryan Konietzko",
  collection: "Legend of Korra",
  genres: ["HQ", "Legend of Korra"],
  desc: "Primeiro volume de Guerras Territoriais, acompanhando Korra, Asami e as tensões políticas após o fim da série.",
  pages: 72,
  cover: "/covers/guerras territoriais.jpg",
  status: "reading",
  // IMPORTANTE: caminhos relativos à pasta /public
  pageImages: Array.from(
    { length: 72 },
    (_, index) => `/img/GuerrasTerritoriais/1/gt (${index}).jpg`
  )
},

  // 🆕 X-Men
  {
    id: 5,
    title: "X-Men: Dinastia X Vol. 1",
    author: "Jonathan Hickman",
    genres: ["X-Men", "Marvel", "HQ"],
    collection: "X-Men",
    rating: 0,
    cover: "/covers/dinastiaX1.jpg",
    desc: "Início da revolução mutante em Krakoa, redefinindo o futuro dos X-Men.",
    pages: 58,
    pdfUrl: "/pdf/DinastiaX/DinastiaX1.pdf",
  },
];

export const DEFAULT_USERS = [
  {
    id: 'admin',
    username: "admingab",
    password: "12345admin",
    name: "Gabrdsp Admin",
    role: "admin",
    avatar: "https://placehold.co/150x150/1e3a8a/FFF?text=Admin",
    bio: "System Administrator",
    stats: { booksReadYear: 0, pagesRead: 0, currentStreak: 0, totalTime: 0 },
    weeklyGoal: { current: 0, target: 5 },
    history: [],
    favorites: []
  }
];

export const DEFAULT_TOP_PICK = {
  id: 1,
  bannerTitle: "Chronicles of Aether",
  bannerDesc: "In a world where islands float in the sky, one pilot seeks the ground.",
  bannerCover: "https://placehold.co/800x400/1e3a8a/FFF?text=Banner"
};
