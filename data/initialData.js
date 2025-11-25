export const DEFAULT_BOOKS = [
  {
    id: 1,
    title: "Legend of Korra: Guerras Territoriais Vol. 1",
    author: "Michael Dante DiMartino & Bryan Konietzko",
    collection: "Legend of Korra",
    genres: ["HQ", "Legend of Korra"],
    desc: "Primeiro volume de Guerras Territoriais, acompanhando Korra, Asami e as tensões políticas após o fim da série.",
    pages: 72,
    cover: "/covers/guerras territoriais.jpg",
    status: "reading",
    pageImages: Array.from(
      { length: 72 },
      (_, index) => `/img/GuerrasTerritoriais/1/gt (${index}).jpg`
    )
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
  bannerTitle: "The Legends of Korra",
  bannerDesc: "Korra e Asami viajam pelo Mundo Espiritual!",
  bannerCover: "/covers/guerras territoriais.jpg"
};