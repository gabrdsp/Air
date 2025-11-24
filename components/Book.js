import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, BookOpen, Heart, Edit3, Trash2 } from 'lucide-react';

export const BookGridItem = ({ book, onClick }) => (
  <div
    onClick={() => onClick(book)}
    className="group cursor-pointer animate-in fade-in zoom-in duration-300"
  >
    <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-3 shadow-sm border border-black/5 group-hover:shadow-md bg-gray-200">
      <img
        src={book.cover}
        className="w-full h-full object-cover"
        alt={book.title}
      />
    </div>
    <div className="flex justify-between items-start">
      <div className="w-[80%]">
        <h3 className="text-sm font-bold text-slate-900 leading-tight truncate">
          {book.title}
        </h3>
        <p className="text-xs text-slate-500 mt-0.5 truncate">
          {book.author}
        </p>
      </div>
      <div className="flex items-center text-xs font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{' '}
        {book.rating ?? 0}
      </div>
    </div>
  </div>
);

export const BookDetail = ({
  book,
  onRead,
  onBack,
  user,
  onToggleFavorite,
  isAdmin,
  onDelete,
  onEdit,
  onRate,
}) => {
  const isFav = user?.favorites?.includes(book.id);
  const [hoverRating, setHoverRating] = useState(null);

  const currentRating = typeof book.rating === 'number' ? book.rating : 0;

  const handleRateClick = (value) => {
    if (onRate) {
      onRate(book.id, value);
    }
  };

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
          <img
            src={book.cover}
            className="w-full rounded-xl shadow-2xl shadow-blue-900/10"
            alt={book.title}
          />
          {isAdmin && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition bg-black/50 p-1 rounded-lg backdrop-blur-sm">
              <button
                onClick={() => onEdit(book)}
                className="p-1.5 bg-blue-600 text-white rounded"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => onDelete(book.id)}
                className="p-1.5 bg-red-600 text-white rounded"
              >
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
              <span className="text-sm font-bold text-slate-900">
                {currentRating > 0 ? `${currentRating.toFixed(1)}` : '0.0'}
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">
            {book.title}
          </h1>
          <p className="text-lg text-slate-500 mb-6">by {book.author}</p>
          <p className="text-slate-600 leading-relaxed mb-8">{book.desc}</p>
          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={() => onRead(book)}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold shadow-lg flex items-center"
            >
              <BookOpen size={18} className="mr-2" /> Read Now
            </button>
            <button
              onClick={() => onToggleFavorite(book.id)}
              className={`p-3 border rounded-xl transition ${
                isFav
                  ? 'border-red-200 bg-red-50 text-red-500'
                  : 'border-gray-200 text-gray-400'
              }`}
            >
              <Heart
                size={20}
                fill={isFav ? 'currentColor' : 'none'}
              />
            </button>
          </div>

          {/* Avaliação por estrelas */}
          <div className="mt-6">
            <p className="text-xs font-semibold text-slate-500 mb-1">
              Avalie este livro
            </p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => {
                const active =
                  hoverRating != null
                    ? value <= hoverRating
                    : value <= currentRating;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRateClick(value)}
                    onMouseEnter={() => setHoverRating(value)}
                    onMouseLeave={() => setHoverRating(null)}
                    className="p-1"
                  >
                    <Star
                      size={20}
                      className={
                        active
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-300'
                      }
                    />
                  </button>
                );
              })}
              <span className="text-xs text-slate-500 ml-2">
                {currentRating > 0
                  ? `${currentRating.toFixed(1)} / 5`
                  : 'Ainda não avaliado'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Converte dataURL -> blob URL para o PDF (mais compatível com navegadores)
const buildPdfSrc = (rawUrl) => {
  if (!rawUrl) return '';
  if (!rawUrl.startsWith('data:application/pdf')) {
    // já é uma URL "normal" ou blob
    return rawUrl;
  }

  try {
    const base64 = rawUrl.split(',')[1];
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Erro ao converter dataURL de PDF para blob URL:', err);
    return rawUrl;
  }
};

export const Reader = ({ book, onBack, onFinish }) => {
  const [pdfSrc, setPdfSrc] = useState('');

  useEffect(() => {
    if (!book || !book.pdfUrl) {
      setPdfSrc('');
      return;
    }
    const url = buildPdfSrc(book.pdfUrl);
    setPdfSrc(url);

    return () => {
      if (url && url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    };
  }, [book]);

  if (!book) return null;

  const hasPdf = !!pdfSrc;

  return (
    <div className="fixed inset-0 z-[200] bg-zinc-950 text-white flex flex-col">
      {/* Barra superior */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/5 bg-zinc-950/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/10 transition"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <BookOpen size={16} className="text-blue-400" />
              <h2 className="text-sm font-semibold line-clamp-1">
                {book.title}
              </h2>
            </div>
            {book.author && (
              <p className="text-[11px] text-zinc-400 mt-0.5">
                por {book.author}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onFinish}
          className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-xs font-semibold tracking-wide"
        >
          Concluir leitura
        </button>
      </header>

      {/* Área principal */}
      <main className="flex-1 flex justify-center items-stretch px-3 sm:px-4 pb-6 pt-4 overflow-hidden">
        <div className="w-full max-w-6xl flex flex-col gap-3">
          {/* Container do PDF */}
          <div className="flex-1 bg-zinc-900/90 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden">
            {hasPdf ? (
              <iframe
                src={pdfSrc}
                title={book.title}
                className="w-full h-full min-h-[65vh] md:min-h-[75vh]"
                style={{ border: 'none' }}
              />
            ) : (
              <div className="w-full h-full min-h-[65vh] md:min-h-[75vh] flex flex-col items-center justify-center gap-4">
                <div className="w-full max-w-md mx-auto space-y-3">
                  <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                    <p className="text-sm text-zinc-200 font-medium">
                      Nenhum PDF anexado a este livro.
                    </p>
                    <p className="text-xs text-zinc-400 mt-1.5">
                      Para que a leitura funcione, edite este livro no painel
                      do administrador e anexe um arquivo PDF. O conteúdo de
                      leitura será exatamente o PDF enviado.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rodapé de dica (sem contagem de páginas) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-zinc-400 px-1">
            <span className="uppercase tracking-[0.18em] text-zinc-500">
              Modo de leitura • PDF completo
            </span>
            <span className="opacity-80">
              Use os controles do visualizador de PDF (zoom, rolagem, páginas)
              do seu navegador para navegar pela HQ/livro.
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};
