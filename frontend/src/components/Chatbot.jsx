import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Search, Truck, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [searchMode, setSearchMode] = useState(false);
    const [vinyls, setVinyls] = useState([]);

    const [messages, setMessages] = useState([
        {
            text: "¡Hola! 👋 Soy el asistente de Murmullo. ¿En qué te ayudo hoy?",
            sender: 'bot',
            time: 'AHORA',
            type: 'text'
        }
    ]);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchVinyls = async () => {
            try {
                const { data } = await api.get('/vinyls');
                setVinyls(data);
            } catch (error) { console.error(error); }
        };
        fetchVinyls();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen, isTyping]);

    const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const processResponse = (text) => {
        const lowerText = text.toLowerCase();
        if (searchMode) {
            setSearchMode(false);
            const results = vinyls.filter(v =>
                v.title.toLowerCase().includes(lowerText) ||
                v.artist_name.toLowerCase().includes(lowerText)
            );
            if (results.length > 0) {
                return [
                    { text: `¡He encontrado ${results.length} coincidencia(s)!`, sender: 'bot' },
                    ...results.slice(0, 3).map(v => ({ type: 'product', data: v, sender: 'bot', time: getCurrentTime() }))
                ];
            }
            return [{ text: "No he encontrado nada. 😓 Intenta con otro nombre.", sender: 'bot', time: getCurrentTime() }];
        }

        if (lowerText.includes('buscar') || lowerText.includes('tienes')) {
            setSearchMode(true);
            return [{ text: "¡Claro! 🎵 Dime el nombre del artista o del disco.", sender: 'bot', time: getCurrentTime() }];
        }

        if (lowerText.includes('envio')) {
            return [{ text: "🚚 Envíos GRATIS a partir de 60€. Menos de eso, 4,95€. 24/48h.", sender: 'bot', time: getCurrentTime() }];
        }
        return [{ text: "No te he entendido bien. Prueba con 'Buscar' o 'Envíos'.", sender: 'bot', time: getCurrentTime() }];
    };

    const handleSend = async (textOverride = null) => {
        const textToSend = textOverride || input;
        if (!textToSend.trim()) return;

        const time = getCurrentTime();
        setMessages(prev => [...prev, { text: textToSend, sender: 'user', time, type: 'text' }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const responses = processResponse(textToSend);
            setMessages(prev => [...prev, ...responses]);
            setIsTyping(false);
        }, 1000);
    };

    const handleKeyPress = (e) => { if (e.key === 'Enter') handleSend(); };

    // --- RENDERIZADO DE MENSAJES ---
    const renderMessage = (msg, index) => {
        const isUser = msg.sender === 'user';

        // >>> VINILOS EN FORMATO "BOCADILLO" DE CHAT <<<
        if (msg.type === 'product') {
            return (
                <div key={index} style={{ display: 'flex', width: '100%', justifyContent: 'flex-start', marginBottom: '10px' }}>
                    <div style={{
                        backgroundColor: '#202c33',
                        color: '#e9edef',
                        padding: '12px',
                        borderRadius: '0 16px 16px 16px', // Forma de burbuja de chat (pico izquierda)
                        maxWidth: '85%',
                        width: 'fit-content',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        borderLeft: '4px solid #00a884', // Acento verde dentro de la burbuja
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px'
                    }}>
                        {/* Contenido */}
                        <div className="flex flex-col">
                            <span className="text-[#00a884] text-[10px] font-bold uppercase tracking-wider">Resultado</span>
                            <h4 className="font-bold text-sm text-white leading-tight">{msg.data.title}</h4>
                            <p className="text-xs text-gray-400">{msg.data.artist_name}</p>
                        </div>

                        <div className="w-full h-[1px] bg-[#2a3942] my-1"></div>

                        <div className="flex items-center justify-between gap-4">
                            <span className="font-bold text-white">{Number(msg.data.price || msg.data.price_eur).toFixed(2)}€</span>
                            <Link
                                to={`/vinyls/${msg.data._id}`}
                                className="bg-[#00a884] hover:bg-[#008f6f] text-white text-[10px] font-bold px-3 py-1 rounded-full transition"
                                onClick={() => setIsOpen(false)}
                            >
                                Ver
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        // MENSAJES NORMALES
        return (
            <div key={index} style={{ display: 'flex', width: '100%', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
                <div style={{
                    backgroundColor: isUser ? '#005c4b' : '#202c33',
                    color: '#e9edef',
                    padding: '8px 12px',
                    borderRadius: isUser ? '16px 0 16px 16px' : '0 16px 16px 16px',
                    maxWidth: '85%',
                    width: 'fit-content',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                    wordWrap: 'break-word'
                }}>
                    <p style={{ margin: 0, fontSize: '14.5px', lineHeight: '1.4' }}>{msg.text}</p>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', display: 'block', textAlign: 'right', marginTop: '4px' }}>{msg.time || getCurrentTime()}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="font-sans" style={{ position: 'relative', zIndex: 9999 }}>

            {/* VENTANA DEL CHAT */}
            {isOpen && (
                <div className="fixed shadow-2xl animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', bottom: '100px', right: '20px', width: '340px', height: '550px', maxHeight: '80vh', maxWidth: 'calc(100vw - 40px)', borderRadius: '24px', backgroundColor: '#0b141a', overflow: 'hidden', border: '1px solid #333', zIndex: 99999 }}>
                    <div className="bg-[#202c33] p-3 px-4 border-b border-[#2a3942] shadow-md z-10" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center text-lg text-white">🎧</div>
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#202c33] rounded-full"></span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="font-bold text-base text-gray-100 leading-tight">Asistente Murmullo</span>
                                <span className="text-xs text-green-400 leading-tight mt-0.5">{isTyping ? 'Escribiendo...' : 'En línea'}</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 rounded-full p-1.5 transition"><X size={24} color="#aebac1" /></button>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundColor: '#0b141a', backgroundBlendMode: 'soft-light', backgroundSize: '400px', opacity: 0.95 }}>
                        {messages.map(renderMessage)}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="flex-shrink-0 bg-[#202c33]">
                        {!input && !searchMode && (
                            <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-[#2a3942] no-scrollbar">
                                <button onClick={() => handleSend("🔍 Buscar vinilo")} className="flex items-center gap-1 bg-[#2a3942] border border-[#374248] px-3 py-1.5 rounded-full text-xs text-gray-300 hover:bg-[#364147] whitespace-nowrap transition"><Search size={12} /> Buscar</button>
                                <button onClick={() => handleSend("🚚 Envíos")} className="flex items-center gap-1 bg-[#2a3942] border border-[#374248] px-3 py-1.5 rounded-full text-xs text-gray-300 hover:bg-[#364147] whitespace-nowrap transition"><Truck size={12} /> Envíos</button>
                                <button onClick={() => handleSend("📍 Tienda")} className="flex items-center gap-1 bg-[#2a3942] border border-[#374248] px-3 py-1.5 rounded-full text-xs text-gray-300 hover:bg-[#364147] whitespace-nowrap transition"><HelpCircle size={12} /> Tienda</button>
                            </div>
                        )}
                        <div className="p-2 px-3 flex items-center gap-2 border-t border-[#2a3942]">
                            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder={searchMode ? "Escribe artista..." : "Escribe un mensaje..."} className="flex-1 py-2.5 px-4 rounded-full bg-[#2a3942] border-none outline-none text-sm text-white placeholder-gray-400 focus:bg-[#323f47] transition" autoFocus />
                            <button onClick={() => handleSend()} disabled={!input.trim()} className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center ${input.trim() ? 'bg-[#00a884] text-white hover:scale-105' : 'bg-[#2a3942] text-gray-500 cursor-default'}`}><Send size={18} className={input.trim() ? 'ml-0.5' : ''} /></button>
                        </div>
                    </div>
                </div>
            )}

            {/* >>> BOTÓN FLOTANTE FINAL: VERDE, REDONDO (PÍLDORA) Y CON TEXTO "CHATBOT" <<< */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-[50px] right-[40px] bg-[#25D366] rounded-full shadow-lg flex items-center justify-center gap-2 px-5 py-3 hover:scale-105 transition-transform z-[9990]"
                >
                    <MessageCircle size={24} color="green" fill="green" />
                    <span className="text-green-500 font-bold text-base">Chatbot</span>
                </button>
            )}

            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        </div>
    );
};

export default Chatbot;