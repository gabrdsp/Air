import { useState, useEffect } from 'react';
import { X, Camera, FileText } from 'lucide-react';
import { fileToBase64 } from '../lib/storage';

export const ImageUpload = ({ currentImage, onImageChange, label, className }) => {
    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (file) onImageChange(await fileToBase64(file));
    };
    return (
        <div className={`relative group cursor-pointer ${className}`}>
            <img
                src={currentImage || "https://placehold.co/300x400?text=Img"}
                className="w-full h-full object-cover rounded-lg border"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-lg">
                <Camera className="text-white" />
            </div>
            <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="absolute inset-0 opacity-0 cursor-pointer"
            />
        </div>
    );
};

export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="font-bold text-lg">{title}</h3>
                    <button onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

export const AdminBookModal = ({ isOpen, onClose, book, onSave }) => {
    // agora com pdfUrl no estado
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genres: '',
        desc: '',
        cover: '',
        pages: 0,
        pdfUrl: ''
    });

    useEffect(() => {
        if (book) {
            setFormData({
                ...book,
                genres: Array.isArray(book.genres) ? book.genres.join(', ') : (book.genres || ''),
                pdfUrl: book.pdfUrl || ''
            });
        } else {
            setFormData({
                title: '',
                author: '',
                genres: '',
                desc: '',
                cover: '',
                pages: 100,
                pdfUrl: ''
            });
        }
    }, [book, isOpen]);

    const handleChange = (e) =>
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    const handlePdfUpload = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        const base64 = await fileToBase64(file);
        setFormData((prev) => ({ ...prev, pdfUrl: base64 }));
    };

    const handleSave = () => {
        const genresArray = formData.genres
            .split(',')
            .map((g) => g.trim())
            .filter(Boolean);

        onSave({
            ...formData,
            genres: genresArray
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={book ? "Edit Book" : "Add Book"}>
            <div className="space-y-4">
                <div className="h-48 w-32 mx-auto">
                    <ImageUpload
                        currentImage={formData.cover}
                        onImageChange={(v) => setFormData({ ...formData, cover: v })}
                        className="h-full"
                    />
                </div>

                <input
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                />

                <input
                    name="author"
                    placeholder="Author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                />

                <input
                    name="genres"
                    placeholder="Genres (comma separated)"
                    value={formData.genres}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                />

                <textarea
                    name="desc"
                    placeholder="Description"
                    value={formData.desc}
                    onChange={handleChange}
                    className="w-full p-2 border rounded h-24 text-sm"
                />

                <input
                    name="pages"
                    type="number"
                    placeholder="Pages"
                    value={formData.pages}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-sm"
                />

                {/* Área harmonizada para anexar PDF */}
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-700">
                        Arquivo PDF do livro
                    </p>

                    <div className="border border-dashed border-slate-300 rounded-xl px-3 py-3 bg-slate-50 flex items-center justify-between gap-3">
                        <div className="text-xs text-slate-500">
                            {formData.pdfUrl ? (
                                <>
                                    <span className="block font-semibold text-emerald-600">
                                        PDF anexado
                                    </span>
                                    <span className="block text-[11px] text-slate-500">
                                        Ao salvar, este arquivo será usado no leitor pelos usuários.
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="block font-semibold text-slate-700">
                                        Nenhum arquivo selecionado
                                    </span>
                                    <span className="block text-[11px] text-slate-500">
                                        Selecione um PDF para que este livro seja lido dentro da plataforma.
                                    </span>
                                </>
                            )}
                        </div>

                        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-xs font-semibold text-blue-700 hover:bg-blue-100 cursor-pointer">
                            <FileText size={14} />
                            <span>{formData.pdfUrl ? 'Trocar PDF' : 'Anexar PDF'}</span>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handlePdfUpload}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-blue-900 text-white py-2 rounded font-bold text-sm hover:bg-blue-800 transition"
                >
                    Save
                </button>
            </div>
        </Modal>
    );
};

export const AdminTopPickModal = ({ isOpen, onClose, topPick, onSave }) => {
    const [data, setData] = useState({ ...topPick });
    useEffect(() => {
        if (topPick) setData({ ...topPick });
    }, [topPick, isOpen]);
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Banner">
            <div className="space-y-4">
                <div className="h-32 w-full">
                    <ImageUpload
                        currentImage={data.bannerCover}
                        onImageChange={(v) => setData({ ...data, bannerCover: v })}
                        className="h-full"
                    />
                </div>
                <input
                    value={data.bannerTitle}
                    onChange={(e) => setData({ ...data, bannerTitle: e.target.value })}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Title"
                />
                <textarea
                    value={data.bannerDesc}
                    onChange={(e) => setData({ ...data, bannerDesc: e.target.value })}
                    className="w-full p-2 border rounded text-sm"
                    placeholder="Description"
                />
                <button
                    onClick={() => {
                        onSave(data);
                        onClose();
                    }}
                    className="w-full bg-blue-900 text-white py-2 rounded font-bold text-sm hover:bg-blue-800 transition"
                >
                    Update
                </button>
            </div>
        </Modal>
    );
};

export const AdminNotificationModal = ({ isOpen, onClose, onSend }) => {
    const [text, setText] = useState('');
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Send Notification">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full p-2 border rounded h-32 mb-4 text-sm"
                placeholder="Message..."
            />
            <button
                onClick={() => {
                    onSend(text);
                    setText('');
                    onClose();
                }}
                className="w-full bg-blue-900 text-white py-2 rounded font-bold text-sm hover:bg-blue-800 transition"
            >
                Send
            </button>
        </Modal>
    );
};
