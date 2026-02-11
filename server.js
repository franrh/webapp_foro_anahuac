// ============================================
// SERVIDOR WEB - FORO IA CIBERSEGURIDAD
// ============================================
// 
// Aplicación web independiente para el foro de debate
// Los estudiantes acceden por URL sin necesidad de cuenta Claude
//
// ============================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// CONFIGURACIÓN
// ============================================

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ============================================
// MIDDLEWARE
// ============================================

app.use(express.json());
app.use(cors());

// Servir archivos estáticos (el frontend React compilado)
app.use(express.static(path.join(__dirname, 'public')));

// ============================================
// PROMPTS
// ============================================

const CASO_ESTUDIO = `Una empresa detecta una fuga de datos personales que incluye información biométrica de sus usuarios. El equipo técnico logra contener el incidente, pero el impacto potencial es significativo. La alta dirección se enfrenta a una decisión crítica: reportar el incidente ante la autoridad y los titulares de los datos, o guardar silencio para evitar multas y daño reputacional inmediato.

Desde el punto de vista técnico, las bitácoras del sistema contienen la huella del delito, es decir, la trazabilidad completa de accesos, movimientos y extracciones de información. Aunque el incidente no se haga público, esa evidencia existe y puede ser solicitada en una investigación posterior. El riesgo residual de no reportar se incrementa con el tiempo.

Legalmente, la LFPDPPP obliga a implementar medidas de seguridad adecuadas y a responder ante vulneraciones que afecten significativamente los derechos patrimoniales o morales de los titulares. La omisión del reporte no elimina la responsabilidad, solo la agrava. En la práctica, muchas sanciones severas derivan más del encubrimiento que del incidente original.

Este caso refleja la importancia de integrar la seguridad técnica con la ética profesional y el cumplimiento legal. La decisión correcta no siempre es la más cómoda, pero es la única que protege a la organización en el largo plazo.`;

const PREGUNTAS_GUIA = [
  "¿Qué riesgos adicionales asume la organización al decidir no reportar una fuga de datos personales, aun cuando el incidente haya sido contenido técnicamente?",
  "Desde la perspectiva técnica, ¿por qué la existencia de bitácoras y trazabilidad convierte el silencio en una falsa sensación de seguridad?",
  "¿Cómo se relacionan la ética profesional y el cumplimiento legal en este caso? ¿Es posible justificar el silencio desde alguno de estos enfoques?",
  "Considerando la LFPDPPP, ¿qué consecuencias puede enfrentar la organización si el encubrimiento es descubierto posteriormente?",
  "¿Qué mecanismos de gobernanza y toma de decisiones deberían existir para evitar que la presión reputacional lleve a ocultar incidentes de seguridad?"
];

const SYSTEM_PROMPT = `Eres un facilitador de aprendizaje especializado en ciberseguridad, protección de datos personales y ética profesional. Tu rol es simular un foro de debate académico sobre el caso "El Dilema del Silencio".

CONTEXTO DEL CASO:
${CASO_ESTUDIO}

PREGUNTAS GUÍA DEL DEBATE:
${PREGUNTAS_GUIA.map((p, i) => `${i + 1}. ${p}`).join('\n')}

TU COMPORTAMIENTO:
1. Cuando el estudiante haga su primera intervención, actúa como 2-3 "compañeros de clase" con diferentes perspectivas que responden a su análisis:
   - Un compañero que refuerza sus puntos con argumentos adicionales
   - Otro que presenta contraargumentos o perspectivas alternativas
   - Opcionalmente, uno que hace preguntas de profundización basadas en las preguntas guía

2. Cada "compañero" debe tener un nombre ficticio y una perspectiva clara:
   - Perspectiva técnica: trazabilidad, bitácoras, riesgos residuales, evidencia digital
   - Perspectiva legal: LFPDPPP, obligaciones de notificación, sanciones, responsabilidad
   - Perspectiva ética: responsabilidad profesional, integridad, conflicto de intereses
   - Perspectiva de gobernanza: mecanismos de decisión, presión reputacional, cultura organizacional

3. Desafía al estudiante a considerar:
   - Por qué el dato biométrico tiene un tratamiento especial (datos sensibles)
   - El valor de las bitácoras como evidencia que puede ser solicitada posteriormente
   - La diferencia entre contener técnicamente y resolver legalmente
   - Cómo el encubrimiento agrava las sanciones más que el incidente original
   - La ética profesional del equipo de seguridad vs presión de alta dirección

4. Evalúa implícitamente si el estudiante está cubriendo las perspectivas técnica, ética y legal.

5. Si el estudiante no ha abordado alguna perspectiva importante o alguna pregunta guía relevante, haz que uno de los "compañeros" la introduzca con una pregunta directa.

FORMATO DE RESPUESTA:
Presenta cada intervención de "compañero" claramente separada con:
- Nombre del compañero (ficticio)
- Su rol o perspectiva entre paréntesis
- Su comentario/réplica

Usa un tono académico pero accesible. Termina invitando al estudiante a replicar.

IMPORTANTE: 
- No des la "respuesta correcta" directamente
- Tu objetivo es provocar reflexión crítica
- Haz que el estudiante construya su propio análisis fundamentado
- Mantén el debate enfocado en el caso específico (datos biométricos, LFPDPPP)`;

const EVAL_PROMPT = `Eres un evaluador formativo de un foro académico sobre ciberseguridad. Analiza la participación completa del estudiante y proporciona retroalimentación según la rúbrica oficial.

RÚBRICA DE EVALUACIÓN:

1. COMPRENSIÓN DEL CASO
- Excelente: Demuestra comprensión integral del incidente, sus implicaciones y el dilema de decisión
- Bueno: Comprende el caso de forma adecuada, con análisis parcial
- Regular: Comprensión básica y descriptiva del caso
- Deficiente: Evidencia confusión o interpretación incorrecta del caso

2. ANÁLISIS TÉCNICO DEL INCIDENTE
- Excelente: Analiza correctamente la trazabilidad, bitácoras y riesgos residuales asociados al encubrimiento
- Bueno: Identifica los elementos técnicos clave con profundidad limitada
- Regular: Menciona aspectos técnicos de forma superficial
- Deficiente: No reconoce o interpreta incorrectamente los elementos técnicos

3. ENFOQUE ÉTICO Y LEGAL
- Excelente: Integra de manera clara y argumentada la ética profesional y las obligaciones legales (LFPDPPP)
- Bueno: Reconoce aspectos éticos y legales de forma general
- Regular: Referencias vagas o poco claras a ética y legalidad
- Deficiente: No considera implicaciones éticas ni legales

4. CALIDAD DE LA ARGUMENTACIÓN
- Excelente: Presenta argumentos sólidos, coherentes y bien estructurados que enriquecen el debate
- Bueno: Argumentación clara pero con limitada profundidad
- Regular: Argumentos débiles o poco fundamentados
- Deficiente: Opiniones sin sustento o fuera de contexto

5. INTERACCIÓN Y APORTES AL DEBATE
- Excelente: Réplicas respetuosas, críticas y constructivas que amplían la discusión
- Bueno: Interactúa con compañeros de manera pertinente
- Regular: Interacción mínima o poco reflexiva
- Deficiente: No interactúa o sus aportes no agregan valor

FORMATO DE RETROALIMENTACIÓN:
Proporciona una evaluación estructurada con:

1. **Evaluación por criterio**: Para cada uno de los 5 criterios, indica el nivel alcanzado (Excelente/Bueno/Regular/Deficiente) y justifica brevemente con ejemplos específicos del texto del estudiante.

2. **Fortalezas identificadas**: Lista las fortalezas más destacadas de su participación.

3. **Áreas de oportunidad**: Indica qué perspectivas, conceptos o argumentos faltaron o podrían profundizarse.

4. **Conceptos clave que debió integrar**: Lista breve de términos o ideas que enriquecerían su análisis (ej: datos sensibles, riesgo residual, principio de responsabilidad proactiva, etc.)

5. **Calificación global**: Basada en el desempeño general según la rúbrica.

6. **Recomendación**: Un siguiente paso concreto de aprendizaje.

Sé constructivo, específico y orientado al desarrollo del estudiante.`;

// ============================================
// API ENDPOINTS
// ============================================

// Chat con Claude
app.post('/api/chat', async (req, res) => {
  const { message, conversationHistory } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Mensaje requerido' });
  }

  try {
    const messages = [
      ...conversationHistory.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      { role: 'user', content: message }
    ];

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      system: SYSTEM_PROMPT,
      messages: messages
    });

    const assistantMessage = response.content
      .map(block => block.text || '')
      .join('\n');

    res.json({ message: assistantMessage });

  } catch (error) {
    console.error('Error llamando a Claude:', error);
    res.status(500).json({ 
      error: 'Error al procesar el mensaje',
      details: error.message 
    });
  }
});

// Evaluación
app.post('/api/evaluate', async (req, res) => {
  const { conversationHistory } = req.body;

  if (!conversationHistory || conversationHistory.length === 0) {
    return res.status(400).json({ error: 'Historial de conversación requerido' });
  }

  try {
    const fullConversation = conversationHistory
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n\n---\n\n');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2500,
      system: EVAL_PROMPT,
      messages: [
        { 
          role: 'user', 
          content: `Aquí está la participación completa del estudiante en el foro:\n\n${fullConversation}` 
        }
      ]
    });

    const evaluation = response.content
      .map(block => block.text || '')
      .join('\n');

    res.json({ evaluation });

  } catch (error) {
    console.error('Error en evaluación:', error);
    res.status(500).json({ 
      error: 'Error al generar la evaluación',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString() 
  });
});

// Servir la app React para cualquier otra ruta
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// INICIAR SERVIDOR
// ============================================

app.listen(PORT, () => {
  console.log(`
🚀 Servidor del Foro IA corriendo en puerto ${PORT}

📚 URLs disponibles:
   - Aplicación: http://localhost:${PORT}
   - API Chat:   http://localhost:${PORT}/api/chat
   - API Eval:   http://localhost:${PORT}/api/evaluate
   - Health:     http://localhost:${PORT}/api/health

💡 Recuerda configurar ANTHROPIC_API_KEY en las variables de entorno
  `);
});

module.exports = app;
