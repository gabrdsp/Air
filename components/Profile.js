import { useState } from 'react';
import { Edit3, Flame, Heart, BookOpen } from 'lucide-react';
import { ImageUpload, Modal } from './Modals';
import { BookGridItem } from './Book';

export const ProfileView = ({ user, updateUser, onBookClick, books }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({...user});
    const favoriteBooks = books.filter(b => user.favorites.includes(b.id));
    const historyBooks = user.history.slice(0, 4).map(id => books.find(b => b.id === id)).filter(Boolean);
    const level = Math.floor(user.stats.booksReadYear / 3) + 1;

    return (
        <div className="animate-fade-in max-w-5xl mx-auto space-y-8">
            <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Profile">
                <div className="space-y-4">
                     <div className="flex justify-center h-24"><ImageUpload currentImage={editForm.avatar} onImageChange={(val) => setEditForm({...editForm, avatar: val})} className="w-24 h-24 rounded-full" /></div>
                     <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border rounded" placeholder="Name" />
                     <textarea value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} className="w-full p-2 border rounded h-24" placeholder="Bio" />
                     <button onClick={() => { updateUser(editForm); setIsEditing(false); }} className="w-full bg-blue-600 text-white py-2 rounded font-bold">Save</button>
                </div>
            </Modal>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden">
                 <div className="relative">
                    <img src={user.avatar} className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
                    <button onClick={() => { setEditForm({...user}); setIsEditing(true); }} className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md"><Edit3 size={16} /></button>
                 </div>
                 <div className="flex-1 text-center md:text-left z-10">
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2 justify-center md:justify-start">{user.name} <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Lvl {level}</span></h1>
                    <p className="text-slate-500 max-w-lg mt-2">{user.bio}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                        <div className="bg-slate-50 p-4 rounded-xl text-center"><div className="text-2xl font-bold text-slate-900">{user.stats.booksReadYear}</div><div className="text-[10px] font-bold text-slate-400">Books</div></div>
                        <div className="bg-slate-50 p-4 rounded-xl text-center"><div className="text-2xl font-bold text-slate-900">{user.stats.pagesRead}</div><div className="text-[10px] font-bold text-slate-400">Pages</div></div>
                        <div className="bg-slate-50 p-4 rounded-xl text-center"><div className="text-2xl font-bold text-slate-900 flex items-center justify-center gap-1"><Flame size={18} className="text-orange-500"/> {user.stats.currentStreak}</div><div className="text-[10px] font-bold text-slate-400">Streak</div></div>
                        <div className="bg-slate-50 p-4 rounded-xl text-center"><div className="text-2xl font-bold text-slate-900">{Math.floor(user.stats.totalTime / 60)}h</div><div className="text-[10px] font-bold text-slate-400">Time</div></div>
                    </div>
                 </div>
            </div>

            <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Heart size={18} className="text-red-500 fill-red-500"/> Favorites</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-5">{favoriteBooks.map(b => <BookGridItem key={b.id} book={b} onClick={onBookClick} />)}</div>
            </div>
            
            <div>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><BookOpen size={18} className="text-blue-500"/> History</h2>
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">{historyBooks.map(b => <div key={b.id} onClick={() => onBookClick(b)} className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b"><img src={b.cover} className="w-12 h-16 rounded mr-4"/><h4 className="font-bold text-sm">{b.title}</h4></div>)}</div>
            </div>
        </div>
    );
};