// pages/index.js
import React, { useState, useEffect } from 'react';
import { Plus, Edit3 } from 'lucide-react';
import { saveToStorage, loadFromStorage } from '../lib/storage';
import { DEFAULT_BOOKS, DEFAULT_USERS, DEFAULT_TOP_PICK } from '../data/initialData';

import { TopNavbar, Sidebar } from '../components/Navigation';
import { BookGridItem, BookDetail, Reader } from '../components/Book';
import { ProfileView } from '../components/Profile';
import { LoginView } from '../components/Auth';
import {
  AdminBookModal,
  AdminNotificationModal,
  AdminTopPickModal,
} from '../components/Modals';

function AirApp() {
  // --- ESTADOS GLOBAIS (com defaults para SSR/export) ---
  const [books, setBooks] = useState(DEFAULT_BOOKS);
  const [users, setUsers] = useState(DEFAULT_USERS);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: 'Bem-vindo ao Air!',
      date: new Date().toLocaleDateString(),
      read: false,
    },
  ]);
  const [topPick, setTopPick] = useState(DEFAULT_TOP_PICK);

  // --- ESTADOS DE SESSÃO / UI ---
  const [currentUser, setCurrentUser] = useState(null);
  const [view, setView] = useState('login'); // 'login', 'home', 'detail', 'reader', 'profile'
  const [selectedBook, setSelectedBook] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  // --- MODAIS ---
  const [isBookModalOpen, setBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [isNotifModalOpen, setNotifModalOpen] = useState(false);
  const [isTopPickModalOpen, setTopPickModalOpen] = useState(false);

  // --- CARREGAR DADOS DO LOCALSTORAGE NO CLIENTE ---
  useEffect(() => {
    const loadedBooks = loadFromStorage('books', DEFAULT_BOOKS);
    const loadedUsers = loadFromStorage('users', DEFAULT_USERS);
    const loadedNotifications = loadFromStorage(
      'notifications',
      notifications
    );
    const loadedTopPick = loadFromStorage('topPick', DEFAULT_TOP_PICK);

    setBooks(loadedBooks);
    setUsers(loadedUsers);
    setNotifications(loadedNotifications);
    setTopPick(loadedTopPick);

    if (typeof window !== 'undefined') {
      const savedSessionId = localStorage.getItem('air_session');
      if (savedSessionId) {
        const found = loadedUsers.find((u) => u.id === savedSessionId);
        if (found) {
          setCurrentUser(found);
          setView('home');
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- PERSISTÊNCIA ---
  useEffect(() => {
    saveToStorage('books', books);
  }, [books]);

  useEffect(() => {
    saveToStorage('users', users);
  }, [users]);

  useEffect(() => {
    saveToStorage('notifications', notifications);
  }, [notifications]);

  useEffect(() => {
    saveToStorage('topPick', topPick);
  }, [topPick]);

  // --- AUTENTICAÇÃO ---

  const handleLogin = (username, password, onError) => {
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
    if (user) {
      setCurrentUser(user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('air_session', user.id);
      }
      setView('home');
    } else {
      onError('Credenciais inválidas');
    }
  };

  const handleRegister = (formData, onError) => {
    if (users.find((u) => u.username === formData.username)) {
      return onError('Usuário já existe');
    }

    const newUser = {
      id: Date.now().toString(),
      ...formData,
      role: 'user',
      avatar: 'https://placehold.co/150x150?text=User',
      bio: 'Leitor dedicado.',
      stats: {
        booksReadYear: 0,
        pagesRead: 0,
        currentStreak: 1,
        totalTime: 0,
      },
      weeklyGoal: { current: 0, target: 5 },
      history: [],
      favorites: [],
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);

    if (typeof window !== 'undefined') {
      localStorage.setItem('air_session', newUser.id);
    }

    setView('home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('air_session');
    }
    setView('login');
  };

  // --- LIVROS ---

  const handleSaveBook = (bookData) => {
    setBooks((prevBooks) => {
      if (editingBook) {
        // editar
        return prevBooks.map((b) =>
          b.id === editingBook.id ? { ...b, ...bookData, id: b.id } : b
        );
      } else {
        // novo
        return [
          ...prevBooks,
          {
            ...bookData,
            id: Date.now(),
            rating: 0,
          },
        ];
      }
    });

    setBookModalOpen(false);
    setEditingBook(null);
  };

  const handleDeleteBook = (id) => {
    console.log('Livro excluído com ID:', id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
    setView('home');
  };

  const handleFinishBook = () => {
    if (!selectedBook || !currentUser) return;

    const updatedUser = { ...currentUser };

    updatedUser.stats = {
      ...updatedUser.stats,
      booksReadYear: updatedUser.stats.booksReadYear + 1,
      pagesRead:
        updatedUser.stats.pagesRead +
        (parseInt(selectedBook.pages, 10) || 100),
      totalTime: updatedUser.stats.totalTime + 120,
    };

    updatedUser.weeklyGoal = {
      ...updatedUser.weeklyGoal,
      current: updatedUser.weeklyGoal.current + 1,
    };

    updatedUser.history = [
      selectedBook.id,
      ...updatedUser.history.filter((id) => id !== selectedBook.id),
    ];

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );
    setCurrentUser(updatedUser);
    setView('home');
  };

  const handleToggleFavorite = (bookId) => {
    if (!currentUser) return;

    let favs = [...currentUser.favorites];
    if (favs.includes(bookId)) {
      favs = favs.filter((id) => id !== bookId);
    } else {
      if (favs.length >= 3) {
        console.log('Limite de 3 favoritos atingido!');
        return;
      }
      favs.push(bookId);
    }

    const updatedUser = { ...currentUser, favorites: favs };

    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updatedUser : u))
    );
    setCurrentUser(updatedUser);
  };

  // --- PERFIL / ADMIN ---

  const handleUpdateProfile = (data) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? updated : u))
    );
    setCurrentUser(updated);
  };

  const handleSendNotification = (text) => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        text,
        date: new Date().toLocaleDateString(),
        read: false,
      },
      ...prev,
    ]);
  };

  const markNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // --- FILTRO ---

  const uniqueGenres = Array.from(
    new Set(books.flatMap((b) => b.genres || []))
  ).sort();

  const filteredBooks = books.filter((b) => {
    const matchSearch = b.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchGenre =
      filter === 'All' || (b.genres && b.genres.includes(filter));
    return matchSearch && matchGenre;
  });

  const isAdmin = currentUser?.role === 'admin';

  // --- RENDERS ESPECIAIS ---

  if (view === 'reader') {
    return (
      <Reader
        book={selectedBook}
        onBack={() => setView('detail')}
        onFinish={handleFinishBook}
      />
    );
  }

  if (!currentUser) {
    return (
      <LoginView
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  // --- RENDER PADRÃO ---

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-slate-900">
      {/* Modais */}
      <AdminBookModal
        isOpen={isBookModalOpen}
        onClose={() => setBookModalOpen(false)}
        book={editingBook}
        onSave={handleSaveBook}
      />

      <AdminNotificationModal
        isOpen={isNotifModalOpen}
        onClose={() => setNotifModalOpen(false)}
        onSend={handleSendNotification}
      />

      <AdminTopPickModal
        isOpen={isTopPickModalOpen}
        onClose={() => setTopPickModalOpen(false)}
        topPick={topPick}
        onSave={setTopPick}
      />

      {/* Navbar */}
      <TopNavbar
        user={currentUser}
        setView={setView}
        search={search}
        onSearch={setSearch}
        onLogout={handleLogout}
        notifications={notifications}
        onReadNotifications={markNotificationsRead}
        isAdmin={isAdmin}
        onOpenNotifyModal={() => setNotifModalOpen(true)}
      />

      <div className="flex max-w-[1600px] mx-auto pt-6">
        {/* Sidebar */}
        <Sidebar
          user={currentUser}
          activeFilter={filter}
          setActiveFilter={setFilter}
          setView={setView}
          genresList={uniqueGenres}
          filter={filter}
        />

        <main className="flex-1 lg:ml-64 px-6 pb-10 w-full">
          {/* HOME */}
          {view === 'home' && (
            <>
              {/* Banner Top Pick */}
              {!search && topPick && (
                <div className="mb-10 bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center gap-8">
                  <div className="relative z-10 flex-1">
                    <h2 className="text-3xl font-bold mb-2">
                      {topPick.bannerTitle}
                    </h2>
                    <p className="text-slate-400 text-sm mb-6 max-w-lg">
                      {topPick.bannerDesc}
                    </p>
                    <button
                      onClick={() => {
                        const targetBook =
                          books.find((b) => b.id === topPick.id) ||
                          books[0];
                        setSelectedBook(targetBook);
                        setView('detail');
                      }}
                      className="px-6 py-2.5 bg-white text-slate-900 rounded-full text-sm font-bold hover:bg-blue-50 transition"
                    >
                      Ler Agora
                    </button>
                  </div>
                  <div className="relative z-10 w-32 shrink-0 rotate-3">
                    <img
                      src={topPick.bannerCover}
                      className="rounded-lg shadow-2xl border border-white/10 w-full"
                      alt="Capa"
                    />
                  </div>
                  {isAdmin && (
                    <button
                      onClick={() => setTopPickModalOpen(true)}
                      className="absolute top-4 right-4 bg-white/10 p-2 rounded-full hover:bg-white/20 transition"
                    >
                      <Edit3 size={16} />
                    </button>
                  )}
                </div>
              )}

              {/* Cabeçalho da grade */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">
                  {search ? `Resultados: "${search}"` : 'Biblioteca'}
                </h2>
                {isAdmin && (
                  <button
                    onClick={() => {
                      setEditingBook(null);
                      setBookModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700"
                  >
                    <Plus size={16} /> Adicionar
                  </button>
                )}
              </div>

              {/* Grade de livros */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8">
                {filteredBooks.map((book) => (
                  <BookGridItem
                    key={book.id}
                    book={book}
                    onClick={(b) => {
                      setSelectedBook(b);
                      setView('detail');
                    }}
                  />
                ))}
              </div>
            </>
          )}

          {/* DETALHE DO LIVRO */}
          {view === 'detail' && selectedBook && (
            <BookDetail
              book={selectedBook}
              onRead={() => setView('reader')}
              onBack={() => setView('home')}
              user={currentUser}
              onToggleFavorite={handleToggleFavorite}
              isAdmin={isAdmin}
              onDelete={handleDeleteBook}
              onEdit={(b) => {
                setEditingBook(b);
                setBookModalOpen(true);
              }}
            />
          )}

          {/* PERFIL */}
          {view === 'profile' && (
            <ProfileView
              user={currentUser}
              updateUser={handleUpdateProfile}
              onBookClick={(b) => {
                setSelectedBook(b);
                setView('detail');
              }}
              books={books}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default AirApp;
