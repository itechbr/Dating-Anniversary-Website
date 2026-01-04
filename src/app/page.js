"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// 1. ADICIONE AS DATAS E TEXTOS REAIS AQUI
const momentos = [
  { url: process.env.NEXT_PUBLIC_FOTO_1 || '', texto: 'Obrigadooo Didaaa, por ser minha parceira elegante de todos os momentos', data: '18 JAN 2025' },
  { url: process.env.NEXT_PUBLIC_FOTO_2 || '', texto: 'Por ser meu par nos jantares', data: '04 MAR 2025' },
  { url: process.env.NEXT_PUBLIC_FOTO_3 || '', texto: 'Por servirmos juntos Àquele que nos salvou e podermos compartilhar de Sua palavra', data: '26 JUL 2025' },
  { url: process.env.NEXT_PUBLIC_FOTO_4 || '', texto: 'Por me apoiar e estar comigo desde quando tudo ainda era um planejamento, pelas nossas vitórias', data: '01 AGO 2025' },
  { url: process.env.NEXT_PUBLIC_FOTO_5 || '', texto: 'Por ser você! ❤️ Gostxoo mutchooo de tchiii gaiaataaa, glória a Deus por tudo!!', data: '11 NOV 2026' },
];

const HeartSVG = ({ className, style }) => (
  <svg viewBox="0 0 32 32" className={className} style={style} fill="currentColor">
    <path d="M16 28.5L14.1 26.8C7.33 20.67 2.87 16.63 2.87 11.72C2.87 7.71 6.03 4.55 10.04 4.55C12.3 4.55 14.47 5.61 15.89 7.27C17.31 5.61 19.48 4.55 21.74 4.55C25.75 4.55 28.91 7.71 28.91 11.72C28.91 16.63 24.45 20.67 17.68 26.81L16 28.5Z" />
  </svg>
);

export default function Page() {
  const [iniciado, setIniciado] = useState(false);
  const [mostrarFrase, setMostrarFrase] = useState(false);
  const [exibirFotos, setExibirFotos] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [indice, setIndice] = useState(0);
  const [direcao, setDirecao] = useState(1);
  const audioRef = useRef(null);
  const timeoutFraseRef = useRef(null);

  const mudarFoto = useCallback((novaDirecao) => {
    setDirecao(novaDirecao);
    setIndice((prev) => (novaDirecao === 1 ? (prev + 1) % momentos.length : (prev - 1 + momentos.length) % momentos.length));
  }, []);

  const pularFrase = () => {
    if (mostrarFrase) {
      clearTimeout(timeoutFraseRef.current);
      setMostrarFrase(false);
      setTimeout(() => setExibirFotos(true), 2500);
    }
  };

  const iniciarTudo = () => {
    setIniciado(true);
    setMostrarFrase(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Erro áudio:", e));
    }
    timeoutFraseRef.current = setTimeout(() => {
      setMostrarFrase(false);
      setTimeout(() => setExibirFotos(true), 2500); 
    }, 12000); 
  };

  useEffect(() => {
    if (iniciado && exibirFotos && !pausado) {
      const timer = setInterval(() => mudarFoto(1), 7000);
      return () => clearInterval(timer);
    }
  }, [iniciado, exibirFotos, pausado, mudarFoto]);

  return (
    <main 
      onClick={pularFrase}
      className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center overflow-hidden font-sans select-none cursor-default"
    >
      <audio ref={audioRef} src="/musica.mp3" loop />

      {/* TELA INICIAL */}
      <AnimatePresence>
        {!iniciado && (
          <div className="absolute inset-0 flex items-center justify-center z-100 bg-black">
            <motion.button
              key="btn-inicio"
              onClick={(e) => { e.stopPropagation(); iniciarTudo(); }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className="text-red-600 w-24 h-24 cursor-default bg-transparent border-none z-110 outline-none"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <HeartSVG className="w-full h-full" />
            </motion.button>
            {[0, 1, 2, 3].map((i) => (
              <motion.div 
                key={i} 
                exit={{ scale: 80, opacity: 0, transition: { delay: i * 0.1, duration: 1.5, ease: "easeOut" } }} 
                className="absolute w-16 h-16 text-red-600 pointer-events-none"
              >
                <HeartSVG className="w-full h-full" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* FUNDO CORAÇÕES */}
      {iniciado && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          {[...Array(55)].map((_, i) => <FallingHeart key={i} />)}
        </div>
      )}

      {/* CENA 1: FRASE INICIAL */}
      <AnimatePresence>
        {iniciado && mostrarFrase && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 2.5 }}
            className="absolute z-50 text-center px-6 pointer-events-none"
          >
            <motion.h1 className="text-4xl md:text-6xl text-white font-bold italic drop-shadow-[0_0_25px_rgba(255,0,0,0.6)]">
              {"Feliz 1 ano de namoro! ❤️".split("").map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.0 + (index * 0.1), duration: 0.1 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 6 }} className="text-white/40 mt-4 text-sm animate-pulse">
              (toque para pular)
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CENA 2: ÁLBUM (MODELO 1: POLAROID CHIC) */}
      {iniciado && exibirFotos && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2.5 }} className="relative z-50 w-full max-w-md h-full flex flex-col items-center pt-8 px-4">
          <div 
            className="w-full max-w-77.5 relative"
            onPointerDown={() => setPausado(true)}
            onPointerUp={() => setPausado(false)}
            onMouseLeave={() => setPausado(false)}
          >
            <AnimatePresence initial={false} custom={direcao} mode="wait">
              <motion.div
                key={indice}
                custom={direcao}
                initial={{ x: direcao > 0 ? 150 : -150, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direcao > 0 ? -150 : 150, opacity: 0 }}
                transition={{ duration: 0.5 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(e, { offset }) => {
                  if (offset.x < -50) mudarFoto(1);
                  else if (offset.x > 50) mudarFoto(-1);
                }}
                className="flex flex-col items-center w-full touch-none cursor-default"
              >
                <motion.span className="mb-6 text-white/70 font-light tracking-[0.4em] text-sm uppercase italic drop-shadow-sm">
                  — {momentos[indice].data} —
                </motion.span>

                <div className="w-full aspect-4/5 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-neutral-900 pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={momentos[indice].url} className="w-full h-full object-cover" alt="" />
                </div>
                
                <div className="mt-8 min-h-30 flex items-start justify-center text-center">
                  <p className="text-xl md:text-2xl text-white font-medium italic px-4 drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                    “{momentos[indice].texto}”
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex gap-3 mt-4 mb-8">
            {momentos.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i === indice ? 'w-8 bg-red-600' : 'w-2 bg-white/30'}`} />
            ))}
          </div>
        </motion.div>
      )}
    </main>
  );
}

function FallingHeart() {
  const [conf, setConf] = useState(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setConf({ x: Math.random() * 100, delay: Math.random() * 15, duration: 8 + Math.random() * 7, size: 10 + Math.random() * 15 });
  }, []);
  if (!conf) return null;
  return (
    <motion.div initial={{ y: "110vh", x: `${conf.x}vw`, opacity: 0 }} animate={{ y: "-10vh", opacity: [0, 0.6, 0] }} transition={{ duration: conf.duration, repeat: Infinity, delay: conf.delay, ease: "linear" }} className="absolute text-red-600/40" style={{ width: conf.size, height: conf.size }}><HeartSVG className="w-full h-full" /></motion.div>
  );
}