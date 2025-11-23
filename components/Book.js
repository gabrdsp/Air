import { Star, ChevronLeft, BookOpen, Heart, Edit3, Trash2 } from 'lucide-react';

export const BookGridItem = ({ book, onClick }) => (
  <div onClick={() => onClick(book)} className="group cursor-pointer animate-in fade-in zoom-in duration-300">
    <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-sm border border-black/5 group-hover:shadow-md bg-gray-200">
      <img src={book.cover} className="w-full h-full object-cover" alt={book.title} />
    </div>
    <div className="flex justify-between items-start">
      <div className="w-[80%]">
        <h3 className="text-sm font-bold text-slate-900 leading-tight truncate">{book.title}</h3>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{book.author}</p>
      </div>
      <div className="flex items-center text-xs font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {book.rating}
      </div>
    </div>
  </div>
);

export const BookDetail = ({ book, onRead, onBack, user, onToggleFavorite, isAdmin, onDelete, onEdit }) => {
  const isFav = user.favorites.includes(book.id);
  return (
    <div className="max-w-5xl mx-auto animate-fade-in pt-4">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-slate-500 hover:text-blue-700 text-sm font-medium"
      >
        <ChevronLeft size={16} className="mr-1" /> Back
      </button>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-[280px] shrink-0 relative group">
          <img src={book.cover} className="w-full rounded-xl shadow-2xl shadow-blue-900/10" />
          {isAdmin && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition bg-black/50 p-1 rounded-lg backdrop-blur-sm">
              <button onClick={() => onEdit(book)} className="p-1.5 bg-blue-600 text-white rounded">
                <Edit3 size={14} />
              </button>
              <button onClick={() => onDelete(book.id)} className="p-1.5 bg-red-600 text-white rounded">
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            {book.genres?.map((g) => (
              <span
                key={g}
                className="px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded text-xs font-bold uppercase"
              >
                {g}
              </span>
            ))}
            <div className="flex items-center text-amber-500 gap-1">
              <Star size={14} fill="currentColor" />
              <span className="text-sm font-bold text-slate-900">{book.rating}</span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">{book.title}</h1>
          <p className="text-lg text-slate-500 mb-6">by {book.author}</p>
          <p className="text-slate-600 leading-relaxed mb-8">{book.desc}</p>
          <div className="flex gap-4">
            <button
              onClick={() => onRead(book)}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center"
            >
              <BookOpen size={18} className="mr-2" /> Read Now
            </button>
            <button
              onClick={() => onToggleFavorite(book.id)}
              className={`p-3 border rounded-xl transition ${
                isFav ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 text-gray-400'
              }`}
            >
              <Heart size={20} fill={isFav ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Reader = ({ book, onBack, onFinish }) => {
  if (!book) return null;

  const hasPdf = !!book.pdfUrl;

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col items-center pb-20 z-[200] relative fixed inset-0 overflow-y-auto">
      {/* Top bar */}
      <div className="fixed top-0 left-0 w-full bg-zinc-950/80 backdrop-blur-md text-white p-4 flex items-center z-50 border-b border-white/5 justify-between px-6">
        <div className="flex items-center">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full">
            <ChevronLeft size={20} />
          </button>
          <div className="ml-4">
            <h2 className="text-sm font-bold line-clamp-1">{book.title}</h2>
            {book.author && (
              <p className="text-[11px] text-zinc-400">by {book.author}</p>
            )}
          </div>
        </div>
        <button
          onClick={onFinish}
          className="bg-blue-600 text-xs font-bold px-4 py-2 rounded-full hover:bg-blue-500 transition"
        >
          Finish Book
        </button>
      </div>

      {/* Conteúdo */}
      <div className="mt-20 w-full max-w-4xl px-4 space-y-6 pb-10">
        {hasPdf ? (
          <div className="w-full h-[calc(100vh-140px)] bg-black rounded-xl overflow-hidden shadow-2xl border border-zinc-800">
            <iframe
              src={book.pdfUrl}
              title={book.title}
              className="w-full h-full"
            />
          </div>
        ) : (
          // Fallback se ainda não tiver PDF anexado – mantém tua ideia das páginas
          <div className="mt-4 w-full max-w-2xl px-0 space-y-6">
            {[1, 2, 3].map((page) => (
              <div
                key={page}
                className="bg-white w-full aspect-[2/3] relative flex flex-col items-center justify-center text-gray-300 shadow-2xl"
              >
                <div className="text-6xl font-bold opacity-10">{page}</div>
                <p className="mt-4 text-sm uppercase tracking-widest opacity-50">
                  Page Content
                </p>
              </div>
            ))}
            <p className="text-center text-xs text-zinc-400 mt-4">
              Nenhum PDF foi anexado para este livro. Edite o livro no painel do administrador para anexar um arquivo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
