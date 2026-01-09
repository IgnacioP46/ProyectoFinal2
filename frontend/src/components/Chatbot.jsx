import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Search, Truck, HelpCircle } from 'lucide-react';
import api from '../api/axios';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [searchMode, setSearchMode] = useState(false);

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
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen, isTyping]);

    const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // --- 1. LÓGICA DIRECTA PARA LOS BOTONES ---
    const handleQuickReply = (action) => {
        let userText = "";
        let botText = "";

        if (action === 'shipping') {
            userText = "🚚 Envíos";
            botText = "Los gastos de envío son de 4,95€ y las entregas llegan en 24-48H.";
            setSearchMode(false);
        } 
        else if (action === 'store') {
            userText = "📍 Tienda";
            botText = "Nuestra tienda está en C/ Desengaño 21, donde antes había un videoclub muy famoso.";
            setSearchMode(false);
        } 
        else if (action === 'search') {
            userText = "🔍 Buscar vinilo";
            botText = "¡Claro! 🎵 Dime el nombre del artista o del disco.";
            setSearchMode(true);
        }

        setMessages(prev => [...prev, { text: userText, sender: 'user', time: getCurrentTime(), type: 'text' }]);
        setIsTyping(true);

        setTimeout(() => {
            setMessages(prev => [...prev, { text: botText, sender: 'bot', time: getCurrentTime(), type: 'text' }]);
            setIsTyping(false);
        }, 800);
    };

    // --- 2. LÓGICA PARA ESCRIBIR MANUALMENTE ---
    const handleSend = async (manualText = null) => {
        const textToSend = manualText || input;
        if (!textToSend.trim()) return;

        setInput('');

        setMessages(prev => [...prev, { text: textToSend, sender: 'user', time: getCurrentTime(), type: 'text' }]);
        setIsTyping(true);

        if (searchMode) {
            try {
                const { data } = await api.get(`/vinyls?search=${textToSend}`);
                setTimeout(() => {
                    if (data.length > 0) {
                        setMessages(prev => [...prev, { 
                            text: `He encontrado ${data.length} coincidencias. Te recomiendo "${data[0].title}".`, 
                            sender: 'bot', time: getCurrentTime(), type: 'text' 
                        }]);
                    } else {
                        setMessages(prev => [...prev, { 
                            text: "No he encontrado nada con ese nombre. Intenta con otro artista.", 
                            sender: 'bot', time: getCurrentTime(), type: 'text' 
                        }]);
                    }
                    setIsTyping(false);
                }, 1000);
            } catch (error) { setIsTyping(false); }
        } else {
            setTimeout(() => {
                if (textToSend.toLowerCase().includes('envio')) {
                    setMessages(prev => [...prev, { text: "Los gastos de envío son de 4,95€ y las entregas llegan en 24-48H.", sender: 'bot', time: getCurrentTime(), type: 'text' }]);
                } else if (textToSend.toLowerCase().includes('tienda')) {
                    setMessages(prev => [...prev, { text: "Nuestra tienda está en C/ Desengaño 21, donde antes había un videoclub muy famoso.", sender: 'bot', time: getCurrentTime(), type: 'text' }]);
                } else {
                    setMessages(prev => [...prev, { text: "Elige una opción de abajo 👇 o pulsa 'Buscar' para encontrar discos.", sender: 'bot', time: getCurrentTime(), type: 'text' }]);
                }
                setIsTyping(false);
            }, 800);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSend();
    };

    const renderMessage = (msg, index) => {
        const isUser = msg.sender === 'user';
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
                <div 
                    // HE AÑADIDO LA CLASE "chat-window" AQUÍ
                    className="fixed shadow-2xl animate-fade-in-up chat-window" 
                    style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        bottom: '100px', 
                        // HE QUITADO 'width' DE AQUÍ PARA QUE LO CONTROLE EL CSS
                        height: '550px', 
                        maxHeight: '80vh', 
                        borderRadius: '24px', 
                        backgroundColor: '#0b141a', 
                        overflow: 'hidden', 
                        border: '1px solid #333', 
                        zIndex: 99999 
                    }}
                >
                    
                    {/* Header */}
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

                    {/* Cuerpo */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '16px', backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundColor: '#0b141a', backgroundBlendMode: 'soft-light', backgroundSize: '400px', opacity: 0.95 }}>
                        {messages.map(renderMessage)}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer */}
                    <div className="flex-shrink-0 bg-[#202c33]">
                        {!input && !searchMode && (
                            <div className="px-4 py-2 flex gap-2 overflow-x-auto border-t border-[#2a3942] no-scrollbar">
                                <button onClick={() => handleQuickReply('search')} className="flex items-center gap-1 bg-[#2a3942] border border-[#374248] px-3 py-1.5 rounded-full text-xs text-gray-300 hover:bg-[#364147] whitespace-nowrap transition">
                                    <Search size={12} /> Buscar
                                </button>
                                <button onClick={() => handleQuickReply('shipping')} className="flex items-center gap-1 bg-[#2a3942] border border-[#374248] px-3 py-1.5 rounded-full text-xs text-gray-300 hover:bg-[#364147] whitespace-nowrap transition">
                                    <Truck size={12} /> Envíos
                                </button>
                                <button onClick={() => handleQuickReply('store')} className="flex items-center gap-1 bg-[#2a3942] border border-[#374248] px-3 py-1.5 rounded-full text-xs text-gray-300 hover:bg-[#364147] whitespace-nowrap transition">
                                    <HelpCircle size={12} /> Tienda
                                </button>
                            </div>
                        )}
                        
                        <div className="p-2 px-3 flex items-center gap-2 border-t border-[#2a3942]">
                            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={handleKeyPress} placeholder={searchMode ? "Escribe artista..." : "Escribe un mensaje..."} className="flex-1 py-2.5 px-4 rounded-full bg-[#2a3942] border-none outline-none text-sm text-white placeholder-gray-400 focus:bg-[#323f47] transition" autoFocus />
                            <button onClick={() => handleSend()} disabled={!input.trim()} className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center ${input.trim() ? 'bg-[#00a884] text-white hover:scale-105' : 'bg-[#2a3942] text-gray-500 cursor-default'}`}><Send size={18} className={input.trim() ? 'ml-0.5' : ''} /></button>
                        </div>
                    </div>
                </div>
            )}

            {/* BOTÓN FLOTANTE */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-[40px] right-[40px] bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center gap-3 w-20 h-20 hover:scale-105 transition-transform z-[9990]"
                >
                    <MessageCircle size={36} fill="green" color="green" />
                    <span className="font-bold text-xl hidden md:block">Chat</span>
                </button>
            )}

            <style>{`
                .no-scrollbar::-webkit-scrollbar { display: none; } 
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                
                /* AQUÍ ESTÁ LA MAGIA RESPONSIVE */
                /* Por defecto (PC) */
                .chat-window {
                    width: 300px;
                    right: 20px;
                }

                /* Para Tablets y Móviles (menos de 768px) */
                @media (max-width: 768px) {
                    .chat-window {
                        width: 250px !important;
                        right: 15px !important;
                        bottom: 90px !important; /* Un poco más abajo en móvil */
                    }
                }
            `}</style>
        </div>
    );
};

export default Chatbot;