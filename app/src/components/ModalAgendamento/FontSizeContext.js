import React, { createContext, useContext, useState } from 'react';

// Criação do contexto para o tamanho da fonte
const FontSizeContext = createContext();

export const FontSizeProvider = ({ children }) => {
    const [fontScale, setFontScale] = useState(1);

    const increaseFontSize = () => {
        setFontScale(prev => Math.min(prev + 0.1, 3)); // Limita a escala a no máximo 3
    };

    const decreaseFontSize = () => {
        setFontScale(prev => Math.max(prev - 0.1, 0.5)); // Limita a escala a no mínimo 0.5
    };

    return (
        <FontSizeContext.Provider value={{ fontScale, increaseFontSize, decreaseFontSize }}>
            {children}
        </FontSizeContext.Provider>
    );
};

// Hook para usar o contexto do tamanho da fonte
export const useFontSize = () => useContext(FontSizeContext);
