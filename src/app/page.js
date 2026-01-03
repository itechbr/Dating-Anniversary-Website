"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const momentos = [
  { url: process.env.NEXT_PUBLIC_FOTO_1 || '', texto: 'Sua primeira frase aqui...' },
  { url: process.env.NEXT_PUBLIC_FOTO_2 || '', texto: 'Sua segunda frase aqui...' },
  { url: process.env.NEXT_PUBLIC_FOTO_3 || '', texto: 'Sua terceira frase aqui...' },
  { url: process.env.NEXT_PUBLIC_FOTO_4 || '', texto: 'Sua quarta frase aqui...' },
  { url: process.env.NEXT_PUBLIC_FOTO_5 || '', texto: 'Sua quinta frase aqui...' },
];

export default function Page() {
  const [iniciado, setIniciado] = useState(false);
  const [indice, setIndice] = useState(0);
  const [direcao, setDirecao] = useState(1);

  const mudarFoto = useCallback((novaDirecao) => {
    setDirecao(novaDirecao);
    setIndice((prev) => (novaDirecao === 1 ? (prev + 1) % momentos.length : (prev - 1 + momentos.length) % momentos.length));
  }, []);

  useEffect(() => {
    let timer;
    if (iniciado) timer = setInterval(() => mudarFoto(1), 20000);
    return () => clearInterval(timer);
  }, [iniciado, mudarFoto]);

  const variants = {
    enter: (direcao) => ({ x: direcao > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direcao) => ({ x: direcao > 0 ? -200 : 200, opacity: 0 })
  };

  return (
    <main className="relative min-h-screen w-full bg-black flex flex-col items-center justify-start overflow-hidden font-sans select-none">
      
      {/* ANIMAÇÃO DE ENTRADA: CORAÇÕES EM CASCATA */}
      <AnimatePresence>
        {!iniciado && (
          <div className="absolute inset-0 flex items-center justify-center z-100">
            {/* O Coração Principal que você clica */}
            <motion.button
              key="btn-inicio"
              onClick={() => setIniciado(true)}
              className="text-8xl cursor-pointer bg-transparent border-none z-110"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ❤️
            </motion.button>

            {/* Corações de efeito que "explodem" em sequência ao clicar */}
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={`expand-${i}`}
                initial={{ scale: 0, opacity: 0 }}
                exit={{ 
                  scale: [1, 10], 
                  opacity: [0.8, 0],
                  transition: { delay: i * 0.1, duration: 0.8, ease: "easeOut" } 
                }}
                className="absolute text-8xl pointer-events-none"
              >
                ❤️
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* FUNDO E CONTEÚDO */}
      {iniciado && (
        <>
          <div className="absolute inset-0 z-0 pointer-events-none blur-[1px]">
            {[...Array(80)].map((_, i) => <FallingHeart key={`heart-${i}`} />)}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }} // Espera a explosão acabar
            className="relative z-50 w-full max-w-md h-full flex flex-col items-center pt-10 px-4"
          >
            <div className="relative w-full flex items-center justify-center">
              <button onClick={() => mudarFoto(-1)} className="absolute -left-12 z-60 p-4 text-white/20 hover:text-white text-4xl hidden lg:block">❮</button>

              <div className="w-full max-w-75">
                <AnimatePresence initial={false} custom={direcao} mode="wait">
                  <motion.div
                    key={indice}
                    custom={direcao}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.3 } }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, { offset }) => {
                      if (offset.x < -40) mudarFoto(1);
                      else if (offset.x > 40) mudarFoto(-1);
                    }}
                    className="flex flex-col items-center w-full touch-none cursor-default"
                  >
                    <div className="w-full aspect-4/5 max-h-[45vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900 pointer-events-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={momentos[indice].url} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                    </div>
                    
                    <div className="mt-8 min-h-30 flex items-start justify-center">
                      <p className="text-xl md:text-2xl text-center text-white font-medium italic leading-relaxed px-2 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                        “{momentos[indice].texto}”
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <button onClick={() => mudarFoto(1)} className="absolute -right-12 z-60 p-4 text-white/20 hover:text-white text-4xl hidden lg:block">❯</button>
            </div>

            <div className="flex gap-3 mt-4">
              {momentos.map((_, i) => (
                <div key={i} onClick={() => { setDirecao(i > indice ? 1 : -1); setIndice(i); }} className={`h-1.5 rounded-full cursor-pointer transition-all duration-300 ${i === indice ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </main>
  );
}

function FallingHeart() {
  const [config, setConfig] = useState(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setConfig({
      x: `${Math.random() * 100}vw`,
      delay: Math.random() * 20,
      duration: Math.random() * 12 + 10,
      size: Math.random() * 18 + 8,
      opacity: Math.random() * 0.4 + 0.2
    });
  }, []);
  if (!config) return null;
  return (
    <motion.div
      initial={{ y: "110vh", x: config.x, opacity: 0 }}
      animate={{ y: "-10vh", opacity: [0, config.opacity, 0] }}
      transition={{ duration: config.duration, repeat: Infinity, delay: config.delay }}
      className="absolute text-white/60"
      style={{ fontSize: config.size }}
    >
      ❤️
    </motion.div>
  );
}