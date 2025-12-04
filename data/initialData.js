export const DEFAULT_BOOKS = [
  {
    id: 1,
    title: "Legend of Korra: Guerras Territoriais Vol. 1",
    author: "Michael Dante DiMartino & Bryan Konietzko",
    collection: "Legend of Korra",
    genres: ["HQ", "Legend of Korra"],
    desc: "Primeiro volume de Guerras Territoriais, acompanhando Korra, Asami e as tensões políticas após o fim da série.",
    pages: 72,
    // CORREÇÃO: Removida a barra inicial (/) para ser resolvida corretamente pelo assetPrefix do Next.js
    cover: "covers/guerras-territoriais.jpg",
    status: "reading",
    pageImages: Array.from(
      { length: 72 },
      // CORREÇÃO: Removida a barra inicial (/)
      (_, index) => `img/guerras-territoriais/1/gt(${index}).jpg`
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
  },
  {
    id: 'user1',
    username: "leitor",
    password: "12345",
    name: "Leitor Padrão",
    role: "user",
    avatar: "https://placehold.co/150x150/f97316/FFF?text=User",
    bio: "Apenas um leitor.",
    stats: { booksReadYear: 1, pagesRead: 72, currentStreak: 5, totalTime: 3600 },
    weeklyGoal: { current: 3, target: 10 },
    history: [1],
    favorites: [1]
  }
];

export const DEFAULT_TOP_PICK = {
  id: 1,
  bannerTitle: "Foco na Coleção",
  bannerDesc: "Leia o primeiro volume da saga Guerra Territoriais hoje!",
  coverUrl: "https://placehold.co/800x200/4f46e5/FFF?text=DESTAQUE",
};