import React, { useState, useEffect } from 'react';
import { Plus, Edit3 } from 'lucide-react';
import { saveToStorage, loadFromStorage } from '../lib/storage';
import { DEFAULT_BOOKS, DEFAULT_USERS, DEFAULT_TOP_PICK } from '../data/initialData';

// --- IMPORTAÇÃO DIRETA E NOMINADA DOS COMPONENTES (MAIS SEGURA) ---
import { TopNavbar, Sidebar } from '../components/Navigation';
import { BookGridItem, BookDetail, Reader } from '../components/Book';
import { ProfileView } from '../components/Profile';
import { LoginView } from '../components/Auth';
import { AdminBookModal, AdminNotificationModal, AdminTopPickModal } from '../components/Modals';

export default function AirApp() {
    const [isClient, setIsClient] = useState(false);
    
    // --- ESTADOS GLOBAIS (ARMAZENAMENTO) ---
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [topPick, setTopPick] = useState(null);
    
    // --- ESTADOS DE SESSÃO E UI ---
    const [currentUser, setCurrentUser] = useState(null);
    const [view, setView] = useState('login'); // 'login', 'home', 'detail', 'reader', 'profile'
    const [selectedBook, setSelectedBook] = useState(null);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    // --- ESTADOS DE MODAIS ---
    const [isBookModalOpen, setBookModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [isNotifModalOpen, setNotifModalOpen] = useState(false);
    const [isTopPickModalOpen, setTopPickModalOpen] = useState(false);

    // Efeito: Carregar dados iniciais e estado de autenticação do LocalStorage
    useEffect(() => {
        setIsClient(true);
        // Carregar dados ou usar defaults
        setBooks(loadFromStorage('books', DEFAULT_BOOKS));
        setUsers(loadFromStorage('users', DEFAULT_USERS));
        setNotifications(loadFromStorage('notifications', [{ id: 1, text: "Bem-vindo ao Air!", date: new Date().toLocaleDateString(), read: false }]));
        setTopPick(loadFromStorage('topPick', DEFAULT_TOP_PICK));
        
        // Verificar sessão salva
        const savedSessionId = localStorage.getItem('air_session');
        if (savedSessionId) {
            const allUsers = loadFromStorage('users', DEFAULT_USERS);
            const found = allUsers.find(u => u.id === savedSessionId);
            if (found) { setCurrentUser(found); setView('home'); }
        }
    }, []);

    // Efeitos: Persistir dados no LocalStorage sempre que mudarem
    useEffect(() => { if(isClient) saveToStorage('books', books); }, [books, isClient]);
    useEffect(() => { if(isClient) saveToStorage('users', users); }, [users, isClient]);
    useEffect(() => { if(isClient) saveToStorage('notifications', notifications); }, [notifications, isClient]);
    useEffect(() => { if(isClient) saveToStorage('topPick', topPick); }, [topPick, isClient]);

    // --- FUNÇÕES DE AUTENTICAÇÃO ---

    const handleLogin = (username, password, onError) => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) { 
            setCurrentUser(user); 
            localStorage.setItem('air_session', user.id); 
            setView('home'); 
        } else {
            onError('Credenciais inválidas'); 
        }
    };

    const handleRegister = (formData, onError) => {
        if (users.find(u => u.username === formData.username)) return onError('Usuário já existe');
        
        const newUser = { 
            id: Date.now().toString(), 
            ...formData, 
            role: 'user', 
            avatar: "https://placehold.co/150x150?text=User", 
            bio: 'Leitor dedicado.', 
            stats: { booksReadYear: 0, pagesRead: 0, currentStreak: 1, totalTime: 0 }, 
            weeklyGoal: { current: 0, target: 5 }, 
            history: [], 
            favorites: [] 
        };
        setUsers([...users, newUser]); 
        setCurrentUser(newUser); 
        localStorage.setItem('air_session', newUser.id); 
        setView('home');
    };

    const handleLogout = () => { 
        setCurrentUser(null); 
        localStorage.removeItem('air_session'); 
        setView('login'); 
    };

    // --- FUNÇÕES DE LIVROS ---

    const handleSaveBook = (bookData) => {
        // bookData agora pode conter, por exemplo, bookData.pdfUrl (PDF anexado)
        setBooks((prevBooks) => {
            if (editingBook) {
                // Edição – preserva campos antigos (incluindo pdfUrl) e sobrescreve com o que veio do form
                return prevBooks.map((b) =>
                    b.id === editingBook.id
                        ? { ...b, ...bookData, id: b.id }
                        : b
                );
            } else {
                // Adição de novo livro
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
        console.log("Livro excluído com ID:", id);
        setBooks(books.filter(b => b.id !== id)); 
        setView('home'); 
    };

    const handleFinishBook = () => {
        if (!selectedBook || !currentUser) return;
        
        const updatedUser = { ...currentUser };
        updatedUser.stats.booksReadYear += 1; 
        updatedUser.stats.pagesRead += (parseInt(selectedBook.pages) || 100); 
        updatedUser.stats.totalTime += 120; // 2 horas de leitura fictícia
        updatedUser.weeklyGoal.current += 1; 
        
        // Adiciona ao histórico (e remove duplicatas se o livro já estiver lá)
        updatedUser.history = [selectedBook.id, ...updatedUser.history.filter(id => id !== selectedBook.id)];

        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u)); 
        setCurrentUser(updatedUser); 
        setView('home');
    };

    const handleToggleFavorite = (bookId) => {
        let favs = [...currentUser.favorites];
        if (favs.includes(bookId)) {
            favs = favs.filter(id => id !== bookId); 
        } else {
            // Limite de 3 favoritos
            if (favs.length < 3) {
                favs.push(bookId); 
            } else {
                console.log("Limite de 3 favoritos atingido!");
                return;
            }
        }
        const updatedUser = { ...currentUser, favorites: favs };
        setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u)); 
        setCurrentUser(updatedUser);
    };
    
    // --- FUNÇÕES DE ADMIN/PERFIL ---

    const handleUpdateProfile = (data) => { 
        const updated = { ...currentUser, ...data }; 
        setUsers(users.map(u => u.id === currentUser.id ? updated : u)); 
        setCurrentUser(updated); 
    };

    const handleSendNotification = (text) => {
        setNotifications([{ id: Date.now(), text, date: new Date().toLocaleDateString(), read: false }, ...notifications]);
    }

    const markNotificationsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
    
    // --- LÓGICA DE FILTRAGEM E RENDERIZAÇÃO ---

    const uniqueGenres = Array.from(new Set(books.flatMap(b => b.genres || []))).sort();
    
    const filteredBooks = books.filter(b => {
        const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
        const matchGenre = filter === 'All' || (b.genres && b.genres.includes(filter));
        return matchSearch && matchGenre;
    });

    const isAdmin = currentUser?.role === 'admin';

    // Guard Clauses para carregamento e autenticação
    if (!isClient) return null;
    if (view === 'reader') return <Reader book={selectedBook} onBack={() => setView('detail')} onFinish={handleFinishBook} />;
    if (!currentUser) return <LoginView onLogin={handleLogin} onRegister={handleRegister} />;

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

             {/* Top Navbar */}
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
                    
                    {/* Visualização de Home (Biblioteca e Banner) */}
                    {view === 'home' && (
                        <>
                           {/* Banner de Top Pick */}
                           {!search && topPick && (
                               <div className="mb-10 bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row items-center gap-8">
                                    <div className="relative z-10 flex-1">
                                        <h2 className="text-3xl font-bold mb-2">{topPick.bannerTitle}</h2>
                                        <p className="text-slate-400 text-sm mb-6 max-w-lg">{topPick.bannerDesc}</p>
                                        <button 
                                            onClick={() => { 
                                                setSelectedBook(books.find(b => b.id === topPick.id) || books[0]); 
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
                                            <Edit3 size={16}/>
                                        </button>
                                    )}
                               </div>
                           )}

                           {/* Cabeçalho da Grade de Livros */}
                           <div className="flex items-center justify-between mb-6">
                               <h2 className="text-lg font-bold text-slate-900">
                                   {search ? `Resultados: "${search}"` : "Biblioteca"}
                               </h2>
                               {isAdmin && (
                                   <button 
                                       onClick={() => { setEditingBook(null); setBookModalOpen(true); }} 
                                       className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700"
                                   >
                                       <Plus size={16}/> Adicionar
                                   </button>
                               )}
                           </div>

                           {/* Grade de Livros */}
                           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-5 gap-y-8">
                               {filteredBooks.map(book => (
                                   <BookGridItem 
                                       key={book.id} 
                                       book={book} 
                                       onClick={() => { setSelectedBook(book); setView('detail'); }} 
                                   />
                               ))}
                           </div>
                        </>
                    )}

                    {/* Visualização de Detalhes do Livro */}
                    {view === 'detail' && selectedBook && (
                        <BookDetail 
                            book={selectedBook} 
                            onRead={() => setView('reader')} 
                            onBack={() => setView('home')} 
                            user={currentUser} 
                            onToggleFavorite={handleToggleFavorite} 
                            isAdmin={isAdmin} 
                            onDelete={handleDeleteBook} 
                            onEdit={(b) => { setEditingBook(b); setBookModalOpen(true); }} 
                        />
                    )}

                    {/* Visualização de Perfil */}
                    {view === 'profile' && (
                        <ProfileView 
                            user={currentUser} 
                            updateUser={handleUpdateProfile} 
                            onBookClick={(b) => { setSelectedBook(b); setView('detail'); }} 
                            books={books} 
                        />
                    )}
                </main>
             </div>
        </div>
    );
}
