"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const momentos = [
  { url: process.env.NEXT_PUBLIC_FOTO_1 || '', texto: 'Escreva aqui sua primeira mensagem especial...' },
  { url: process.env.NEXT_PUBLIC_FOTO_2 || '', texto: 'Escreva aqui sua segunda mensagem especial...' },
  { url: process.env.NEXT_PUBLIC_FOTO_3 || '', texto: 'Escreva aqui sua terceira mensagem especial...' },
  { url: process.env.NEXT_PUBLIC_FOTO_4 || '', texto: 'Escreva aqui sua quarta mensagem especial...' },
  { url: process.env.NEXT_PUBLIC_FOTO_5 || '', texto: 'Escreva aqui sua quinta mensagem especial...' },
];

const HeartSVG = ({ className, style }) => (
  <svg viewBox="0 0 32 32" className={className} style={style} fill="currentColor">
    <path d="M16 28.5L14.1 26.8C7.33 20.67 2.87 16.63 2.87 11.72C2.87 7.71 6.03 4.55 10.04 4.55C12.3 4.55 14.47 5.61 15.89 7.27C17.31 5.61 19.48 4.55 21.74 4.55C25.75 4.55 28.91 7.71 28.91 11.72C28.91 16.63 24.45 20.67 17.68 26.81L16 28.5Z" />
  </svg>
);

export default function Page() {
  const [iniciado, setIniciado] = useState(false);
  const [indice, setIndice] = useState(0);
  const [direcao, setDirecao] = useState(1);

  const mudarFoto = useCallback((novaDirecao) => {
    setDirecao(novaDirecao);
    setIndice((prev) => (novaDirecao === 1 ? (prev + 1) % momentos.length : (prev - 1 + momentos.length) % momentos.length));
  }, []);

  useEffect(() => {
    if (iniciado) {
      const timer = setInterval(() => mudarFoto(1), 20000);
      return () => clearInterval(timer);
    }
  }, [iniciado, mudarFoto]);

  return (
    <main className="relative min-h-screen w-full bg-black flex flex-col items-center justify-start overflow-hidden font-sans select-none">
      
      {/* TELA INICIAL: EXPLOSÃO FLUIDA */}
      <AnimatePresence>
        {!iniciado && (
          <div className="absolute inset-0 flex items-center justify-center z-[100] bg-black">
            <motion.button
              key="btn-inicio"
              onClick={() => setIniciado(true)}
              className="text-red-600 w-24 h-24 cursor-pointer bg-transparent border-none z-[110] outline-none"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <HeartSVG className="w-full h-full" />
            </motion.button>

            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={`exp-${i}`}
                exit={{ 
                  scale: 80, 
                  opacity: 0,
                  transition: { delay: i * 0.15, duration: 1.5, ease: "easeOut" } 
                }}
                className="absolute w-16 h-16 text-red-600 pointer-events-none"
                style={{ willChange: "transform, opacity" }}
              >
                <HeartSVG className="w-full h-full" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* CONTEÚDO PRINCIPAL */}
      {iniciado && (
        <>
          {/* FUNDO: CORAÇÕES MENORES E ATRÁS DE TUDO */}
          <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            {[...Array(30)].map((_, i) => (
              <FallingHeart key={`heart-${i}`} />
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative z-50 w-full max-w-md h-full flex flex-col items-center pt-12 px-4"
          >
            {/* ÁREA DE ARRASTE EXPANDIDA (FOTO + TEXTO) */}
            <div className="w-full max-w-[310px] relative">
              <AnimatePresence initial={false} custom={direcao} mode="wait">
                <motion.div
                  key={indice}
                  custom={direcao}
                  initial={{ x: direcao > 0 ? 150 : -150, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direcao > 0 ? -150 : 150, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, { offset }) => {
                    if (offset.x < -50) mudarFoto(1);
                    else if (offset.x > 50) mudarFoto(-1);
                  }}
                  className="flex flex-col items-center w-full touch-none cursor-grab active:cursor-grabbing"
                  style={{ willChange: "transform, opacity" }}
                >
                  {/* FOTO */}
                  <div className="w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900 pointer-events-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={momentos[indice].url} 
                      className="w-full h-full object-cover" 
                      alt="" 
                      loading="eager"
                    />
                  </div>
                  
                  {/* TEXTO: COM SOMBRA E PESO PARA NÃO SER SOBREPOSTO */}
                  <div className="mt-8 min-h-[120px] flex items-start justify-center text-center">
                    <p className="text-xl md:text-2xl text-white font-medium italic leading-relaxed px-4 drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                      “{momentos[indice].texto}”
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* INDICADORES */}
            <div className="flex gap-3 mt-4 mb-8">
              {momentos.map((_, i) => (
                <div 
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-500 ${i === indice ? 'w-8 bg-red-600' : 'w-2 bg-white/30'}`} 
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </main>
  );
}

function FallingHeart() {
  const [conf, setConf] = useState(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setConf({
      x: Math.random() * 100,
      delay: Math.random() * 20,
      duration: 15 + Math.random() * 10,
      size: 15 + Math.random() * 15
    });
  }, []);

  if (!conf) return null;

  return (
    <motion.div
      initial={{ y: "110vh", x: `${conf.x}vw`, opacity: 0 }}
      animate={{ y: "-10vh", opacity: [0, 0.5, 0] }}
      transition={{ duration: conf.duration, repeat: Infinity, delay: conf.delay, ease: "linear" }}
      className="absolute text-red-600/30"
      style={{ width: conf.size, height: conf.size, willChange: "transform" }}
    >
      <HeartSVG className="w-full h-full" />
    </motion.div>
  );
}