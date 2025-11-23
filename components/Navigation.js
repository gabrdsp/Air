import { useState, useRef, useEffect } from 'react';
import { Search, Bell, Wind, LogOut, Heart, Clock, Mail, Download } from 'lucide-react';

// ATENÇÃO: A palavra 'export' é obrigatória antes de 'const'
export const TopNavbar = ({ user, setView, onSearch, search, onLogout, notifications, onReadNotifications, isAdmin, onOpenNotifyModal }) => {
    const [showNotif, setShowNotif] = useState(false);
    const notifRef = useRef(null);
    const unreadCount = notifications.filter(n => !n.read).length;
    const level = user ? Math.floor(user.stats.booksReadYear / 3) + 1 : 1;

    useEffect(() => {
        function handleClickOutside(event) { if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotif(false); }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <div onClick={() => setView('home')} className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm"><Wind size={20} /></div>
            <span className="text-lg font-bold text-slate-900">Air</span>
          </div>
          <div className="hidden md:flex"><button onClick={() => setView('home')} className="px-3 py-2 text-sm font-medium text-slate-900 bg-gray-100 rounded-md">Library</button></div>
        </div>
        <div className="flex-1 max-w-md mx-4 hidden sm:block relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input value={search} onChange={(e) => onSearch(e.target.value)} className="block w-full pl-10 pr-3 py-2 bg-gray-100 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Search titles, authors..." />
        </div>
        <div className="flex items-center gap-3">
            {isAdmin && <button onClick={onOpenNotifyModal} className="p-2 text-purple-600 hover:bg-purple-50 rounded-full"><Mail size={20} /></button>}
            <div className="relative" ref={notifRef}>
                <button onClick={() => { setShowNotif(!showNotif); if(!showNotif) onReadNotifications(); }} className="p-2 text-slate-500 hover:text-blue-600 rounded-md relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>}
                </button>
                {showNotif && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                        <div className="p-3 border-b bg-gray-50 text-sm font-bold text-gray-700">Notifications</div>
                        <div className="max-h-64 overflow-y-auto">
                            {/* CORREÇÃO 1: Estrutura correta do ternário */}
                            {notifications.length === 0 ? (
                                <div className="p-4 text-center text-gray-400 text-sm">No messages</div>
                            ) : ( 
                                notifications.map(n => (
                                    <div 
                                        key={n.id} 
                                        // CORREÇÃO 2: Sintaxe correta do operador ternário dentro do template literal
                                        className={`p-3 border-b border-gray-50 ${!n.read ? 'bg-blue-50/50' : ''}`}
                                    >
                                        <p className="text-sm text-gray-800">{n.text}</p>
                                        <span className="text-[10px] text-gray-400">{n.date}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            {user && <div onClick={() => setView('profile')} className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-900 p-[2px] cursor-pointer relative hover:scale-105 transition"><img src={user.avatar} className="rounded-full bg-white h-full w-full object-cover" /><div className="absolute -bottom-1 -right-1 bg-blue-600 text-white text-[8px] px-1.5 rounded-full font-bold border border-white">Lvl {level}</div></div>}
            <button onClick={onLogout} className="p-1.5 text-slate-400 hover:text-red-500"><LogOut size={16} /></button>
        </div>
      </nav>
    );
};

// ATENÇÃO: A palavra 'export' é obrigatória aqui também
export const Sidebar = ({ user, setActiveFilter, setView, genresList, filter }) => (
    <aside className="w-64 hidden lg:block border-r border-gray-200 p-6 fixed top-16 bottom-0 overflow-y-auto bg-white z-40">
      <div className="space-y-8">
        {user && (
          <div className="p-4 rounded-xl bg-slate-900 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-600 rounded-full opacity-20 blur-2xl"></div>
            <h3 className="text-xs font-medium text-slate-300 uppercase tracking-wider mb-1">Weekly Goal</h3>
            <div className="flex items-end gap-2 mb-3"><span className="text-3xl font-semibold">{user.weeklyGoal.current}<span className="text-slate-500 text-lg">/{user.weeklyGoal.target}</span></span><span className="text-sm text-slate-400 mb-1">books</span></div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full"><div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min((user.weeklyGoal.current / user.weeklyGoal.target) * 100, 100)}%` }}></div></div>
          </div>
        )}
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Library</h4>
          <button onClick={() => setView('profile')} className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-600 hover:bg-gray-50 rounded-md"><span className="flex items-center gap-3"><Heart className="w-4 h-4"/> Favorites</span><span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{user?.favorites?.length || 0}</span></button>
          <button onClick={() => setView('profile')} className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-gray-50 rounded-md"><Clock className="w-4 h-4"/> History</button>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Genres</h4>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveFilter('All')} className={`px-2.5 py-1 rounded-md border text-xs font-medium ${filter === 'All' ? 'bg-blue-600 text-white' : 'bg-white'}`}>All</button>
            {genresList.map(g => <button key={g} onClick={() => setActiveFilter(g)} className={`px-2.5 py-1 rounded-md border text-xs font-medium ${filter === g ? 'bg-blue-600 text-white' : 'bg-white'}`}>{g}</button>)}
          </div>
        </div>
      </div>
    </aside>
);