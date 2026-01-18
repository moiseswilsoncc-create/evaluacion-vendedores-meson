"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ===============================
// Evaluación Vendedores Mesón
// Modelo: Atracción RRSS → Oferta → Calificación + ERP + Cross-sell + Seguimiento
// ===============================

const TIEMPO_TOTAL = 15 * 60; // 15 minutos
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyNyVJBjU58mNR5oHG77aqtAW-RQDFMJTLA7jL72AesAo2qWCyp6s0xX0NJirE0ZUwyIg/exec";

const questions = [
  // ===== PREGUNTAS 1-10: FUNDACIONALES (YA ESTABAN BUENAS) =====
  { 
    id: 1, 
    text: "Cliente escribe: 'precio papel higiénico por mayor'. ¿Qué haces?", 
    options: [
      { text: "Envío precio", score: 0 },
      { text: "Pregunto volumen, negocio y frecuencia", score: 10 },
      { text: "Ofrezco descuento directo", score: 2 }
    ]
  },
  { 
    id: 2, 
    text: "Fila llena, WhatsApp sonando. ¿A quién priorizas?", 
    options: [
      { text: "Orden de llegada", score: 2 },
      { text: "Mayor volumen potencial", score: 10 },
      { text: "Al más tranquilo", score: 0 }
    ]
  },
  { 
    id: 3, 
    text: "Atiendes 150 clientes diarios. ¿Cómo no pierdes oportunidades?", 
    options: [
      { text: "Vendo rápido", score: 2 },
      { text: "Identifico y registro clientes clave", score: 10 },
      { text: "Espero que vuelvan", score: 0 }
    ]
  },
  { 
    id: 4, 
    text: "Feriante compra solo 2 productos. ¿Qué haces?", 
    options: [
      { text: "Nada", score: 0 },
      { text: "Pregunto giro, rotación y días de feria", score: 10 },
      { text: "Ofrezco algo más barato", score: 2 }
    ]
  },
  { 
    id: 5, 
    text: "Cliente grande compra poco del mix", 
    options: [
      { text: "Nada", score: 0 },
      { text: "Detecto brechas de compra", score: 10 },
      { text: "Le mando lista", score: 2 }
    ]
  },
  { 
    id: 6, 
    text: "11:30 y llevas 30% de la meta diaria", 
    options: [
      { text: "Me estreso", score: 0 },
      { text: "Repriorizo clientes grandes", score: 10 },
      { text: "Espero la tarde", score: 2 }
    ]
  },
  { 
    id: 7, 
    text: "Vas 20% bajo el promedio del equipo", 
    options: [
      { text: "Me justifico", score: 0 },
      { text: "Analizo brecha y ajusto foco", score: 10 },
      { text: "Me desmotivo", score: 0 }
    ]
  },
  { 
    id: 8, 
    text: "Cliente dice: 'solo lo de siempre'", 
    options: [
      { text: "Ok", score: 1 },
      { text: "Propongo productos que rota", score: 10 },
      { text: "No insisto", score: 2 }
    ]
  },
  { 
    id: 9, 
    text: "Quedan 2 horas y estás lejos de la meta", 
    options: [
      { text: "Acelero sin foco", score: 1 },
      { text: "Voy por tickets altos", score: 10 },
      { text: "Me rindo", score: 0 }
    ]
  },
  { 
    id: 10, 
    text: "Un vendedor top…", 
    options: [
      { text: "Es rápido", score: 2 },
      { text: "Piensa como empresario", score: 10 },
      { text: "Es amable", score: 3 }
    ]
  },

  // ===== PREGUNTAS 11-30: ESPECÍFICAS DEL MODELO RRSS + ERP =====
  {
    id: 11,
    text: "Cliente vio papel higiénico en oferta en Instagram y vino solo por eso. ¿Qué haces?",
    options: [
      { text: "Le vendo el papel y listo", score: 0 },
      { text: "Pregunto qué negocio tiene, cuánto rota, y registro en ERP", score: 10 },
      { text: "Le ofrezco más papel con descuento", score: 3 }
    ]
  },
  {
    id: 12,
    text: "Cliente nuevo dice: 'solo quiero lo de la oferta'. ¿Cuál es tu prioridad?",
    options: [
      { text: "Vender rápido y atender al siguiente", score: 1 },
      { text: "Capturar datos: negocio, RUT, teléfono, días de compra", score: 10 },
      { text: "Convencerlo de comprar más", score: 4 }
    ]
  },
  {
    id: 13,
    text: "Llevas 20 clientes atendidos, pero olvidaste llenar el ERP en 15. ¿Qué haces?",
    options: [
      { text: "Lo lleno después si me acuerdo", score: 0 },
      { text: "No es tan importante, sigo vendiendo", score: 0 },
      { text: "Pauso, registro todo ahora mismo, ajusto mi ritmo", score: 10 }
    ]
  },
  {
    id: 14,
    text: "Cliente compra 3 cajas de producto en oferta. ¿Qué pregunta haces PRIMERO?",
    options: [
      { text: "¿Necesitas bolsa?", score: 0 },
      { text: "¿Qué tipo de negocio tienes y qué otros productos rotas?", score: 10 },
      { text: "¿Quieres llevar más con descuento?", score: 5 }
    ]
  },
  {
    id: 15,
    text: "Es la 3era vez que viene el mismo cliente, pero no lo reconoces. ¿Por qué?",
    options: [
      { text: "Atiendo muchos clientes, es normal", score: 0 },
      { text: "Porque no registré sus datos ni hice seguimiento", score: 10 },
      { text: "No es mi culpa, vienen muchos", score: 0 }
    ]
  },
  {
    id: 16,
    text: "Cliente de almacén compra 50 unidades de un producto. ¿Qué haces después de cobrar?",
    options: [
      { text: "Le doy el producto y chao", score: 0 },
      { text: "Le tomo WhatsApp y le digo: 'Te aviso las ofertas de la semana'", score: 10 },
      { text: "Le pregunto si necesita algo más hoy", score: 4 }
    ]
  },
  {
    id: 17,
    text: "La oferta de esta semana es detergente. Cliente viene solo por eso. ¿Qué productos ofreces?",
    options: [
      { text: "Nada, ya compró lo que quería", score: 0 },
      { text: "Más detergente", score: 2 },
      { text: "Cloro, desinfectante, jabón: productos que TAMBIÉN rota", score: 10 }
    ]
  },
  {
    id: 18,
    text: "Cliente dice: 'es mi primera vez aquí'. ¿Cuál es tu objetivo principal?",
    options: [
      { text: "Venderle bien hoy", score: 3 },
      { text: "Registrarlo en ERP y que vuelva TODAS las semanas", score: 10 },
      { text: "Ofrecerle la oferta del día", score: 1 }
    ]
  },
  {
    id: 19,
    text: "Feriante compra 10 unidades. Le preguntas qué negocio tiene y dice: 'feria los sábados'. ¿Qué haces?",
    options: [
      { text: "Ok, listo", score: 0 },
      { text: "Registro: feriante, compra semanal, contacto viernes", score: 10 },
      { text: "Le ofrezco más productos", score: 3 }
    ]
  },
  {
    id: 20,
    text: "Tu jefe revisa el ERP y ve que 40% de tus ventas NO tienen datos del cliente. ¿Qué pasó?",
    options: [
      { text: "No tuve tiempo, había mucha gente", score: 0 },
      { text: "Falla mía: prioricé velocidad sobre registro", score: 10 },
      { text: "El sistema es lento", score: 0 }
    ]
  },
  {
    id: 21,
    text: "Cliente viene por oferta de arroz. Compra 5 sacos. ¿Qué NO debes olvidar?",
    options: [
      { text: "Darle bolsa", score: 0 },
      { text: "Preguntar tipo de negocio, frecuencia, y registrar en ERP", score: 10 },
      { text: "Ofrecerle más arroz", score: 2 }
    ]
  },
  {
    id: 22,
    text: "Atiendes a un cliente que vino hace 2 semanas. ¿Cómo sabes si volvió?",
    options: [
      { text: "No sé, no lo registré", score: 0 },
      { text: "Busco su RUT en el ERP", score: 10 },
      { text: "Trato de recordar su cara", score: 1 }
    ]
  },
  {
    id: 23,
    text: "Cliente de restaurant compra aceite en oferta. ¿Qué preguntas clave haces?",
    options: [
      { text: "¿Cuántos litros usas por semana? ¿Qué más compras para la cocina?", score: 10 },
      { text: "¿Necesitas más aceite?", score: 2 },
      { text: "¿Está bueno el precio?", score: 0 }
    ]
  },
  {
    id: 24,
    text: "Vendiste $2M hoy pero solo registraste 30% de los clientes en ERP. ¿Está bien?",
    options: [
      { text: "Sí, la venta es lo importante", score: 0 },
      { text: "No, perdí 70% de oportunidades de seguimiento", score: 10 },
      { text: "Depende del día", score: 2 }
    ]
  },
  {
    id: 25,
    text: "Cliente compra solo el producto en oferta por 3 semanas seguidas. ¿Qué significa?",
    options: [
      { text: "Es un buen cliente, sigue viniendo", score: 2 },
      { text: "Fallé: no amplié su canasta ni detecté otras necesidades", score: 10 },
      { text: "Está bien, al menos compra algo", score: 0 }
    ]
  },
  {
    id: 26,
    text: "Tu meta es vender $3M al día. ¿Qué estrategia NO te ayuda?",
    options: [
      { text: "Atender rápido a todos por igual", score: 10 },
      { text: "Identificar clientes grandes y registrarlos", score: 0 },
      { text: "Hacer cross-sell en cada venta", score: 0 }
    ]
  },
  {
    id: 27,
    text: "Cliente: '¿Tienen servilletas?' Tú: 'Sí, ¿cuántas?' Cliente: '10 paquetes'. ¿Qué falta?",
    options: [
      { text: "Nada, es una buena venta", score: 0 },
      { text: "Preguntar: negocio, frecuencia, qué más necesita, registrar", score: 10 },
      { text: "Ofrecer más paquetes", score: 3 }
    ]
  },
  {
    id: 28,
    text: "Fin de mes: vendiste $50M pero tu jefe dice que 'perdiste oportunidades'. ¿Por qué?",
    options: [
      { text: "No sé, vendí mucho", score: 0 },
      { text: "No califiqué clientes ni hice seguimiento: fueron ventas puntuales", score: 10 },
      { text: "Es injusto, hice mi trabajo", score: 0 }
    ]
  },
  {
    id: 29,
    text: "Cliente nuevo compra $200k. ¿Qué información MÍNIMA necesitas capturar?",
    options: [
      { text: "RUT y monto", score: 2 },
      { text: "RUT, nombre, teléfono, tipo negocio, frecuencia de compra", score: 10 },
      { text: "Solo el RUT", score: 0 }
    ]
  },
  {
    id: 30,
    text: "Diferencia entre VENDEDOR y TOMADOR DE PEDIDOS en este mesón:",
    options: [
      { text: "El vendedor atiende rápido, el tomador es lento", score: 0 },
      { text: "El vendedor califica, registra y fideliza; el tomador solo cobra", score: 10 },
      { text: "El vendedor es más amable", score: 0 }
    ]
  }
];

export default function EvaluacionVendedor() {
  const [postulante, setPostulante] = useState({ 
    rut: "", 
    nombre: "", 
    email: "", 
    telefono: "" 
  });
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIEMPO_TOTAL);
  const [startTime, setStartTime] = useState<number>(0);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

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

  const enviarAGoogleSheets = async () => {
    setSending(true);
    try {
      const tiempoTardado = startTime ? Math.floor((Date.now() - startTime) / 1000) : TIEMPO_TOTAL - timeLeft;
      const minutos = Math.floor(tiempoTardado / 60);
      const segundos = tiempoTardado % 60;
      const tiempoFormateado = `${minutos}m ${segundos}s`;
      
      const estado = timeLeft <= 0 ? "Tiempo agotado" : "Completado";
      const porcentaje = Math.round((totalScore / maxScore) * 100);

      const datos = {
        rut: postulante.rut,
        nombre: postulante.nombre,
        email: postulante.email,
        telefono: postulante.telefono,
        puntaje: totalScore,
        maximo: maxScore,
        porcentaje: porcentaje,
        tiempo: tiempoFormateado,
        estado: estado
      };

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
      });

      setSent(true);
      
    } catch (error) {
      console.error('Error al enviar datos:', error);
      alert('Hubo un problema al enviar los datos. Por favor descarga el CSV como respaldo.');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (finished && !sent && !sending) {
      enviarAGoogleSheets();
    }
  }, [finished, sent, sending]);

  const descargarCSV = () => {
    const tiempoTardado = startTime ? Math.floor((Date.now() - startTime) / 1000) : TIEMPO_TOTAL - timeLeft;
    const minutos = Math.floor(tiempoTardado / 60);
    const segundos = tiempoTardado % 60;
    const tiempoFormateado = `${minutos}m ${segundos}s`;
    const estado = timeLeft <= 0 ? "Tiempo agotado" : "Completado";
    const porcentaje = Math.round((totalScore / maxScore) * 100);

    const row = {
      Rut: postulante.rut,
      Nombre: postulante.nombre,
      Email: postulante.email,
      Telefono: postulante.telefono,
      Puntaje: totalScore,
      Maximo: maxScore,
      Porcentaje: `${porcentaje}%`,
      Tiempo: tiempoFormateado,
      Estado: estado,
      Fecha: new Date().toLocaleString()
    };
    
    const csv = `${Object.keys(row).join(',')}\n${Object.values(row).join(',')}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `resultado_${postulante.rut}.csv`;
    link.click();
  };

  const formularioCompleto = postulante.rut && postulante.nombre && postulante.email && postulante.telefono;

  if (!started) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <Card className="rounded-2xl shadow">
          <CardContent className="space-y-4">
            <h1 className="text-xl font-bold">Evaluación Vendedores Mesón</h1>
            <p className="text-sm text-gray-600">
              Esta evaluación mide tu capacidad para trabajar bajo presión en un ambiente de ventas mayoristas.
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">RUT</label>
                <input 
                  className="w-full border p-2 rounded mt-1" 
                  placeholder="12.345.678-9" 
                  value={postulante.rut} 
                  onChange={e => setPostulante({ ...postulante, rut: e.target.value })} 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Nombre completo</label>
                <input 
                  className="w-full border p-2 rounded mt-1" 
                  placeholder="Juan Pérez González" 
                  value={postulante.nombre} 
                  onChange={e => setPostulante({ ...postulante, nombre: e.target.value })} 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input 
                  type="email"
                  className="w-full border p-2 rounded mt-1" 
                  placeholder="juan.perez@gmail.com" 
                  value={postulante.email} 
                  onChange={e => setPostulante({ ...postulante, email: e.target.value })} 
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Teléfono móvil</label>
                <input 
                  type="tel"
                  className="w-full border p-2 rounded mt-1" 
                  placeholder="+56 9 1234 5678" 
                  value={postulante.telefono} 
                  onChange={e => setPostulante({ ...postulante, telefono: e.target.value })} 
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm">
              <p className="font-semibold">⏱️ Tiempo límite: 15 minutos</p>
              <p className="text-gray-600 mt-1">30 preguntas • No puedes volver atrás</p>
            </div>
            
            <Button 
              className="w-full" 
              disabled={!formularioCompleto} 
              onClick={() => {
                setStarted(true);
                setStartTime(Date.now());
              }}
            >
              Comenzar Evaluación
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
              <p className="font-medium text-lg">{q.text}</p>
              <div className="space-y-3">
                {q.options.map((o, i) => (
                  <Button 
                    key={i} 
                    variant="outline" 
                    className="w-full text-left justify-start h-auto py-3 px-4" 
                    onClick={() => {
                      setAnswers({ ...answers, [q.id]: o.score });
                      if (current < questions.length - 1) setCurrent(current + 1);
                      else setFinished(true);
                    }}
                  >
                    {o.text}
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Evaluación Completada</h2>
                
                {sending && (
                  <p className="text-blue-600">📤 Enviando resultados...</p>
                )}
                
                {sent && (
                  <div className="bg-green-50 border border-green-200 rounded p-4">
                    <p className="text-green-700 font-semibold">✅ Resultados enviados correctamente</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Tus datos han sido registrados. Te contactaremos pronto.
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded-lg p-6 space-y-2">
                  <p className="text-lg">
                    <span className="font-semibold">Puntaje:</span> {totalScore} / {maxScore}
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {Math.round((totalScore / maxScore) * 100)}%
                  </p>
                </div>

                <Button 
                  onClick={descargarCSV}
                  variant="outline"
                  className="w-full"
                >
                  📥 Descargar respaldo (CSV)
                </Button>

                <p className="text-xs text-gray-500 mt-4">
                  Postulante: {postulante.nombre} ({postulante.rut})
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
