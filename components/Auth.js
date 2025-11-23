import { useState } from 'react';
import { Wind, AlertCircle } from 'lucide-react';

export const LoginView = ({ onLogin, onRegister }) => {
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ username: '', password: '', name: '' });
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (mode === 'login') onLogin(form.username, form.password, setError);
        else onRegister(form, setError);
    }

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md animate-fade-in">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg mx-auto mb-4"><Wind size={24} /></div>
                    <h1 className="text-2xl font-bold text-slate-900">{mode === 'login' ? 'Welcome Back' : 'Join Air'}</h1>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2"><AlertCircle size={16}/> {error}</div>}
                    {mode === 'register' && <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-xl" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />}
                    <input type="text" placeholder="Username" className="w-full p-3 border rounded-xl" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
                    <input type="password" placeholder="Password" className="w-full p-3 border rounded-xl" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                    <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition">{mode === 'login' ? 'Sign In' : 'Create Account'}</button>
                </form>
                <p className="text-center text-sm text-blue-600 cursor-pointer mt-6 hover:underline" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}>{mode === 'login' ? "Create an account" : "Back to Login"}</p>
                {mode === 'login' && <div className="text-center text-xs text-gray-400 mt-4">Admin: admingab / 12345admin</div>}
            </div>
        </div>
    )
};