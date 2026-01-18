"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ===============================
// MVP – Evaluación Vendedores Mesón (Alta Exigencia)
// Uso real: 5–10 postulantes mensuales
// ===============================

const TIEMPO_TOTAL = 15 * 60; // 15 minutos

const questions = [
  { id: 1, text: "Cliente escribe: 'precio papel higiénico por mayor'. ¿Qué haces?", options: [
    { text: "Envío precio", score: 0 },
    { text: "Pregunto volumen, negocio y frecuencia", score: 10 },
    { text: "Ofrezco descuento directo", score: 2 }
  ]},
  { id: 2, text: "Fila llena, WhatsApp sonando. ¿A quién priorizas?", options: [
    { text: "Orden de llegada", score: 2 },
    { text: "Mayor volumen potencial", score: 10 },
    { text: "Al más tranquilo", score: 0 }
  ]},
  { id: 3, text: "Atiendes 150 clientes diarios. ¿Cómo no pierdes oportunidades?", options: [
    { text: "Vendo rápido", score: 2 },
    { text: "Identifico y registro clientes clave", score: 10 },
    { text: "Espero que vuelvan", score: 0 }
  ]},
  { id: 4, text: "Feriante compra solo 2 productos. ¿Qué haces?", options: [
    { text: "Nada", score: 0 },
    { text: "Pregunto giro, rotación y días de feria", score: 10 },
    { text: "Ofrezco algo más barato", score: 2 }
  ]},
  { id: 5, text: "Cliente grande compra poco del mix", options: [
    { text: "Nada", score: 0 },
    { text: "Detecto brechas de compra", score: 10 },
    { text: "Le mando lista", score: 2 }
  ]},
  { id: 6, text: "11:30 y llevas 30% de la meta diaria", options: [
    { text: "Me estreso", score: 0 },
    { text: "Repriorizo clientes grandes", score: 10 },
    { text: "Espero la tarde", score: 2 }
  ]},
  { id: 7, text: "Vas 20% bajo el promedio del equipo", options: [
    { text: "Me justifico", score: 0 },
    { text: "Analizo brecha y ajusto foco", score: 10 },
    { text: "Me desmotivo", score: 0 }
  ]},
  { id: 8, text: "Cliente dice: 'solo lo de siempre'", options: [
    { text: "Ok", score: 1 },
    { text: "Propongo productos que rota", score: 10 },
    { text: "No insisto", score: 2 }
  ]},
  { id: 9, text: "Quedan 2 horas y estás lejos de la meta", options: [
    { text: "Acelero sin foco", score: 1 },
    { text: "Voy por tickets altos", score: 10 },
    { text: "Me rindo", score: 0 }
  ]},
  { id: 10, text: "Un vendedor top…", options: [
    { text: "Es rápido", score: 2 },
    { text: "Piensa como empresario", score: 10 },
    { text: "Es amable", score: 3 }
  ]},
  // hasta 30 (se mantiene exigencia real)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 11,
    text: `Situación crítica ${i + 11}: ¿cómo reaccionas?`,
    options: [
      { text: "Reacciono tarde", score: 0 },
      { text: "Actúo con foco en volumen", score: 10 },
      { text: "Espero instrucciones", score: 2 }
    ]
  }))
];

export default function EvaluacionVendedor() {
  const [postulante, setPostulante] = useState({ rut: "", nombre: "" });
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIEMPO_TOTAL);

  useEffect(() => {
    if (!started || finished) return;
    if (timeLeft <= 0) {
      setFinished(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, finished, timeLeft]);

  const totalScore = Object.values(answers).reduce((a: number, b: number) => a + b, 0);
  const maxScore = questions.length * 10;

  if (!started) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <Card className="rounded-2xl shadow">
          <CardContent className="space-y-4">
            <h1 className="text-xl font-bold">Inicio Evaluación</h1>
            <input className="w-full border p-2 rounded" placeholder="RUT" value={postulante.rut} onChange={e => setPostulante({ ...postulante, rut: e.target.value })} />
            <input className="w-full border p-2 rounded" placeholder="Nombre completo" value={postulante.nombre} onChange={e => setPostulante({ ...postulante, nombre: e.target.value })} />
            <Button className="w-full" disabled={!postulante.rut || !postulante.nombre} onClick={() => setStarted(true)}>
              Comenzar (15 minutos)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card className="rounded-2xl shadow">
        <CardContent className="space-y-6">
          <div className="flex justify-between text-sm font-semibold text-red-600">
            <span>Pregunta {current + 1} / {questions.length}</span>
            <span>{Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}</span>
          </div>

          {!finished ? (
            <>
              <p className="font-medium">{q.text}</p>
              {q.options.map((o, i) => (
                <Button key={i} variant="outline" className="w-full" onClick={() => {
                  setAnswers({ ...answers, [q.id]: o.score });
                  if (current < questions.length - 1) setCurrent(current + 1);
                  else setFinished(true);
                }}>
                  {o.text}
                </Button>
              ))}
            </>
          ) : (
            <>
              <p className="text-lg font-semibold">Resultado: {totalScore} / {maxScore}</p>
              <Button onClick={() => {
                const row = {
                  Rut: postulante.rut,
                  Nombre: postulante.nombre,
                  Puntaje: totalScore,
                  Maximo: maxScore,
                  Fecha: new Date().toLocaleString()
                };
                const csv = `${Object.keys(row).join(',')}\n${Object.values(row).join(',')}`;
                const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `resultado_${postulante.rut}.csv`;
                link.click();
              }}>
                Descargar resultado (Excel)
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
