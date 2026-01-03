"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// CONFIGURAÇÃO: O array busca os links do seu .env.local
// Se o link não existir, ele usa um placeholder profissional.
const momentos = [
  { url: process.env.NEXT_PUBLIC_FOTO_1 || 'https://via.placeholder.com/500x700?text=Foto+1', texto: 'Sua frase para a foto 1 aqui...' },
  { url: process.env.NEXT_PUBLIC_FOTO_2 || 'https://via.placeholder.com/500x700?text=Foto+2', texto: 'Sua frase para a foto 2 aqui...' },
  { url: process.env.NEXT_PUBLIC_FOTO_3 || 'https://via.placeholder.com/500x700?text=Foto+3', texto: 'Sua frase para a foto 3 aqui...' },
  { url: process.env.NEXT_PUBLIC_FOTO_4 || 'https://via.placeholder.com/500x700?text=Foto+4', texto: 'Sua frase para a foto 4 aqui...' },
  { url: process.env.NEXT_PUBLIC_FOTO_5 || 'https://via.placeholder.com/500x700?text=Foto+5', texto: 'Sua frase para a foto 5 aqui...' },
];

export default function Page() {
  const [iniciado, setIniciado] = useState(false);
  const [indice, setIndice] = useState(0);

  // Funções de navegação memorizadas para o ESLint
  const proximo = useCallback(() => {
    setIndice((prev) => (prev + 1) % momentos.length);
  }, []);

  const anterior = useCallback(() => {
    setIndice((prev) => (prev - 1 + momentos.length) % momentos.length);
  }, []);

  // Timer de 20 segundos
  useEffect(() => {
    let timer;
    if (iniciado) {
      timer = setInterval(proximo, 20000);
    }
    return () => clearInterval(timer);
  }, [iniciado, proximo]);

  return (
    <main className="relative min-h-screen w-full bg-black flex items-center justify-center overflow-hidden font-sans select-none">
      
      {/* TELA INICIAL: CORAÇÃO DE ENTRADA */}
      {!iniciado && (
        <motion.button
          onClick={() => setIniciado(true)}
          className="text-8xl z-50 cursor-pointer bg-transparent border-none p-0"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Abrir"
        >
          ❤️
        </motion.button>
      )}

      {/* ANIMAÇÃO DE EXPANSÃO DE FUNDO */}
      <AnimatePresence>
        {iniciado && (
          <motion.div
            initial={{ scale: 0, borderRadius: "100%" }}
            animate={{ scale: 5, borderRadius: "0%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 bg-neutral-950 z-10"
          />
        )}
      </AnimatePresence>

      {/* CONTEÚDO PRINCIPAL (GALERIA) */}
      {iniciado && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-20 w-full max-w-md h-screen flex flex-col items-center justify-center p-4"
        >
          {/* BACKGROUND: 40 CORAÇÕES BRANCOS COM OPACIDADE VARIAVEL */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(40)].map((_, i) => (
              <FallingHeart key={`heart-${i}`} />
            ))}
          </div>

          {/* CONTÊINER DA FOTO COM CONTROLES */}
          <div className="relative w-full max-w-sm flex items-center justify-center">
            
            {/* Seta Esquerda (Oculta no mobile, aparece no desktop fora da imagem) */}
            <button 
              onClick={anterior}
              className="absolute -left-20 z-30 p-4 text-white/20 hover:text-white transition-colors text-4xl hidden lg:block cursor-pointer"
            >
              ❮
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={indice}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, { offset }) => {
                  if (offset.x > 70) anterior();
                  else if (offset.x < -70) proximo();
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center w-full touch-none cursor-default"
              >
                {/* Imagem com proporção 4:5 e altura máxima controlada */}
                <div className="w-full aspect-4/5 max-h-[60vh] rounded-3xl overflow-hidden shadow-2xl border border-white/10 pointer-events-none bg-neutral-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={momentos[indice].url} 
                    className="w-full h-full object-cover" 
                    alt={`Momento ${indice + 1}`} 
                    onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/500x700?text=Erro+no+Link'; }}
                  />
                </div>
                
                <p className="mt-8 text-base md:text-lg text-center text-gray-200 italic leading-relaxed px-6 min-h-20">
                  &ldquo;{momentos[indice].texto}&rdquo;
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Seta Direita */}
            <button 
              onClick={proximo}
              className="absolute -right-20 z-30 p-4 text-white/20 hover:text-white transition-colors text-4xl hidden lg:block cursor-pointer"
            >
              ❯
            </button>
          </div>

          {/* INDICADORES (DOTS) */}
          <div className="flex gap-2 mt-4">
            {momentos.map((_, i) => (
              <div 
                key={`dot-${i}`} 
                onClick={() => setIndice(i)}
                className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${i === indice ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} 
              />
            ))}
          </div>
        </motion.div>
      )}
    </main>
  );
}

// COMPONENTE DOS CORAÇÕES CAINDO
function FallingHeart() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setConfig({
      x: `${Math.random() * 100}vw`,
      delay: Math.random() * 20,
      duration: Math.random() * 15 + 10,
      size: Math.random() * 15 + 8,
      opacity: Math.random() * 0.3 + 0.1
    });
  }, []);

  if (!config) return null;

  return (
    <motion.div
      initial={{ y: "110vh", x: config.x, opacity: 0 }}
      animate={{ y: "-10vh", opacity: [0, config.opacity, 0] }}
      transition={{ 
        duration: config.duration, 
        repeat: Infinity, 
        delay: config.delay 
      }}
      className="absolute text-white"
      style={{ fontSize: config.size }}
    >
      ❤️
    </motion.div>
  );
}