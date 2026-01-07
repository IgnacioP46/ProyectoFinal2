import { useState, useEffect } from 'react';

export const useClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        // Actualiza la hora cada segundo
        const timerID = setInterval(() => {
            setTime(new Date());
        }, 1000);

        // Limpieza: detiene el reloj si el componente se desmonta
        return () => clearInterval(timerID);
    }, []);

    // Formateamos la hora para que se vea bonita (HH:MM:SS)
    return time.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
};