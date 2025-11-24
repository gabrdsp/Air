// components/Book.js
import {
  Star,
  ChevronLeft,
  BookOpen,
  Heart,
  Edit3,
  Trash2,
} from "lucide-react";

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
        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{" "}
        {book.rating}
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
}) => {
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
                {book.rating}
              </span>
            </div>
          </div>

          <h1 className="text-4xl font-black text-slate-900 mb-2">
            {book.title}
          </h1>
          <p className="text-lg text-slate-500 mb-6">by {book.author}</p>

          <p className="text-slate-600 leading-relaxed mb-8">
            {book.desc}
          </p>

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
                isFav
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-gray-200 text-gray-400"
              }`}
            >
              <Heart size={20} fill={isFav ? "currentColor" : "none"} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Reader = ({ book, onBack, onFinish }) => {
  if (!book) return null;

  const hasImagePages =
    Array.isArray(book.pageImages) && book.pageImages.length > 0;

  const hasPdf =
    !hasImagePages &&
    typeof book.pdfUrl === "string" &&
    book.pdfUrl.length > 0;

  const mainAuthor = Array.isArray(book.authors)
    ? book.authors.join(", ")
    : book.author;

  // se for PDF, escondemos a toolbar com fragmento na URL
  const pdfSrc = hasPdf
    ? `${book.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`
    : null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-slate-900/80 backdrop-blur-sm">
      {/* HEADER – segue o padrão visual do app */}
      <header className="bg-white shadow-sm border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-slate-400">
              Air Library • Reader
            </span>
            <h2 className="text-sm sm:text-base font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
              {book.title}
            </h2>
            {mainAuthor && (
              <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md">
                {mainAuthor}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={onFinish}
          className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white tracking-wide"
        >
          Concluir leitura
        </button>
      </header>

      {/* CONTEÚDO */}
      <main className="flex-1 overflow-y-auto bg-[#F3F4F6]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          {/* Título central e info da coleção */}
          <div className="text-center mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
              {book.title}
            </h1>
            {book.collection && (
              <p className="text-xs sm:text-sm text-slate-500">
                All volumes are in{" "}
                <span className="text-blue-600 font-semibold">
                  {book.collection}
                </span>
              </p>
            )}
          </div>

          {/* ÁREA DE LEITURA – container do tamanho das imagens */}
          {hasImagePages ? (
            <div className="flex justify-center">
              {/* esse wrapper se ajusta exatamente ao tamanho das imagens */}
              <div className="inline-block">
                {book.pageImages.map((src, index) => {
                  const safeSrc = encodeURI(src);
                  return (
                    <img
                      key={index}
                      src={safeSrc}
                      alt={`${book.title} – página ${index + 1}`}
                      className="block max-w-full h-auto"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  );
                })}
              </div>
            </div>
          ) : hasPdf ? (
            // FALLBACK: ainda suporta PDF se algum livro antigo usar
            <div className="flex justify-center">
              <div className="inline-block">
                <object
                  data={pdfSrc}
                  type="application/pdf"
                  className="w-full h-[80vh]"
                >
                  <iframe
                    src={pdfSrc}
                    title={book.title}
                    className="w-full h-[80vh]"
                    style={{ border: "none" }}
                  />
                  <div className="w-full h-[80vh] flex items-center justify-center p-6">
                    <p className="text-xs text-slate-400 text-center max-w-sm">
                      Não foi possível exibir o PDF embutido.
                    </p>
                  </div>
                </object>
              </div>
            </div>
          ) : (
            // Se não houver nem imagens nem PDF
            <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-3 px-4">
              <p className="text-sm font-medium text-slate-700">
                Nenhum conteúdo de leitura configurado para este livro.
              </p>
              <p className="text-xs text-slate-500 max-w-sm text-center">
                Adicione páginas de leitura (imagens jpg) ou um PDF para este
                título.
              </p>
            </div>
          )}

          {/* Rodapé da página de leitura */}
          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500 uppercase tracking-[0.21em]">
            <span>Modo de leitura</span>
            {book.collection && <span>{book.collection}</span>}
          </div>
        </div>
      </main>
    </div>
  );
};
