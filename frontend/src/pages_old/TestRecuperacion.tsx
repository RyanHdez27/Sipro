"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import {
  Brain,
  ChevronRight,
  ChevronLeft,
  Home,
  Target,
  Sparkles,
  CheckCircle2,
  XCircle,
  Lightbulb,
  BarChart3,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// ─── Preguntas adaptativas (2 por área débil: Ciencias Naturales + Matemáticas + 2 extra) ─
const preguntasAdaptativas = [
  {
    id: 1,
    numero: 1,
    competencia: "Matemáticas",
    dificultad: "Baja",
    pregunta: "Si 4x - 8 = 20, ¿cuál es el valor de x?",
    opciones: [
      { id: "A", texto: "3" },
      { id: "B", texto: "5" },
      { id: "C", texto: "7" },
      { id: "D", texto: "9" }
    ],
    respuestaCorrecta: "C",
    explicacion: "Para resolver: 4x - 8 = 20, sumamos 8 a ambos lados: 4x = 28, luego dividimos entre 4: x = 7. Siempre despeja la incógnita paso a paso."
  },
  {
    id: 2,
    numero: 2,
    competencia: "Lectura Crítica",
    dificultad: "Media",
    pregunta: "Un texto argumentativo se caracteriza principalmente por:",
    opciones: [
      { id: "A", texto: "Presentar datos estadísticos exclusivamente" },
      { id: "B", texto: "Defender una postura con razones y evidencias" },
      { id: "C", texto: "Narrar hechos en orden cronológico" },
      { id: "D", texto: "Describir características de objetos o personas" }
    ],
    respuestaCorrecta: "B",
    explicacion: "Un texto argumentativo busca convencer al lector de una postura específica mediante el uso de razones lógicas, evidencias y ejemplos que sustenten la tesis del autor."
  },
  {
    id: 3,
    numero: 3,
    competencia: "Ciencias Naturales",
    dificultad: "Media",
    pregunta: "La respiración celular ocurre principalmente en:",
    opciones: [
      { id: "A", texto: "El núcleo celular" },
      { id: "B", texto: "Los ribosomas" },
      { id: "C", texto: "Las mitocondrias" },
      { id: "D", texto: "Los cloroplastos" }
    ],
    respuestaCorrecta: "C",
    explicacion: "Las mitocondrias son los orgánulos donde ocurre la respiración celular, proceso que convierte la glucosa en energía (ATP) utilizando oxígeno. Por eso se les llama 'centrales energéticas de la célula'."
  },
  {
    id: 4,
    numero: 4,
    competencia: "Inglés",
    dificultad: "Baja",
    pregunta: "I _____ to the gym every Monday.",
    opciones: [
      { id: "A", texto: "go" },
      { id: "B", texto: "goes" },
      { id: "C", texto: "going" },
      { id: "D", texto: "went" }
    ],
    respuestaCorrecta: "A",
    explicacion: "Con 'I' usamos el verbo en forma base sin -s. 'Every Monday' indica hábito, por lo que usamos presente simple. La respuesta correcta es 'I go'."
  },
  {
    id: 5,
    numero: 5,
    competencia: "Razonamiento Cuantitativo",
    dificultad: "Media",
    pregunta: "Un libro cuesta $45.000 y tiene un descuento del 15%. ¿Cuánto pagarás por el libro?",
    opciones: [
      { id: "A", texto: "$38.250" },
      { id: "B", texto: "$40.500" },
      { id: "C", texto: "$42.750" },
      { id: "D", texto: "$43.500" }
    ],
    respuestaCorrecta: "A",
    explicacion: "El 15% de $45.000 es $6.750 (45.000 × 0.15). Restamos: $45.000 - $6.750 = $38.250. Otra forma: multiplicar por 0.85 (45.000 × 0.85 = 38.250)."
  },
  {
    id: 6,
    numero: 6,
    competencia: "Ciencias Sociales",
    dificultad: "Media",
    pregunta: "El mercantilismo fue una política económica que se caracterizó por:",
    opciones: [
      { id: "A", texto: "Promover el libre comercio sin restricciones" },
      { id: "B", texto: "Acumular metales preciosos mediante exportaciones" },
      { id: "C", texto: "Eliminar los impuestos al comercio" },
      { id: "D", texto: "Privatizar todas las empresas estatales" }
    ],
    respuestaCorrecta: "B",
    explicacion: "El mercantilismo buscaba acumular riqueza (oro y plata) favoreciendo las exportaciones sobre las importaciones, estableciendo monopolios comerciales y colonias que proveyeran materias primas."
  },
  {
    id: 7,
    numero: 7,
    competencia: "Matemáticas",
    dificultad: "Media",
    pregunta: "¿Cuál es el área de un triángulo con base 10 cm y altura 6 cm?",
    opciones: [
      { id: "A", texto: "30 cm²" },
      { id: "B", texto: "60 cm²" },
      { id: "C", texto: "16 cm²" },
      { id: "D", texto: "20 cm²" }
    ],
    respuestaCorrecta: "A",
    explicacion: "El área de un triángulo se calcula con la fórmula: A = (base × altura) / 2. Entonces: A = (10 × 6) / 2 = 60 / 2 = 30 cm²."
  },
  {
    id: 8,
    numero: 8,
    competencia: "Lectura Crítica",
    dificultad: "Alta",
    pregunta: "El uso de la primera persona en un ensayo tiene como efecto:",
    opciones: [
      { id: "A", texto: "Darle objetividad y credibilidad científica" },
      { id: "B", texto: "Crear cercanía y personalizar la argumentación" },
      { id: "C", texto: "Eliminar la subjetividad del autor" },
      { id: "D", texto: "Convertirlo en un texto narrativo" }
    ],
    respuestaCorrecta: "B",
    explicacion: "El uso de la primera persona ('yo', 'nosotros') en un ensayo permite que el autor se involucre directamente, expresando su perspectiva personal y creando una conexión más íntima con el lector."
  },
  {
    id: 9,
    numero: 9,
    competencia: "Ciencias Naturales",
    dificultad: "Baja",
    pregunta: "¿Qué gas es esencial para la fotosíntesis?",
    opciones: [
      { id: "A", texto: "Oxígeno" },
      { id: "B", texto: "Nitrógeno" },
      { id: "C", texto: "Dióxido de carbono" },
      { id: "D", texto: "Hidrógeno" }
    ],
    respuestaCorrecta: "C",
    explicacion: "Las plantas absorben dióxido de carbono (CO₂) del aire durante la fotosíntesis y lo convierten, junto con agua y luz solar, en glucosa y oxígeno."
  },
  {
    id: 10,
    numero: 10,
    competencia: "Inglés",
    dificultad: "Media",
    pregunta: "She _____ be at the office now. She called me from there.",
    opciones: [
      { id: "A", texto: "can't" },
      { id: "B", texto: "must" },
      { id: "C", texto: "might" },
      { id: "D", texto: "shouldn't" }
    ],
    respuestaCorrecta: "B",
    explicacion: "'Must' expresa deducción lógica o certeza. Como ella llamó desde la oficina, estamos seguros de que está allí. 'Can't' es imposibilidad, 'might' es posibilidad, y 'shouldn't' es consejo."
  },
  {
    id: 11,
    numero: 11,
    competencia: "Razonamiento Cuantitativo",
    dificultad: "Alta",
    pregunta: "Si 5 trabajadores construyen 3 casas en 12 días, ¿cuántos días tardarán 3 trabajadores en construir 5 casas?",
    opciones: [
      { id: "A", texto: "20 días" },
      { id: "B", texto: "30 días" },
      { id: "C", texto: "33.33 días" },
      { id: "D", texto: "36 días" }
    ],
    respuestaCorrecta: "C",
    explicacion: "Primero calculamos trabajo total: 5 trabajadores × 12 días = 60 trabajador-días para 3 casas. Por casa: 20 trabajador-días. Para 5 casas con 3 trabajadores: (5 × 20) / 3 = 100 / 3 = 33.33 días."
  },
  {
    id: 12,
    numero: 12,
    competencia: "Ciencias Sociales",
    dificultad: "Baja",
    pregunta: "¿Cuál es la función principal del poder legislativo?",
    opciones: [
      { id: "A", texto: "Juzgar delitos y aplicar sanciones" },
      { id: "B", texto: "Crear y aprobar leyes" },
      { id: "C", texto: "Ejecutar políticas públicas" },
      { id: "D", texto: "Controlar las fuerzas armadas" }
    ],
    respuestaCorrecta: "B",
    explicacion: "El poder legislativo (Congreso) tiene como función principal crear, debatir y aprobar las leyes que rigen un país. En Colombia, está compuesto por el Senado y la Cámara de Representantes."
  },
  {
    id: 13,
    numero: 13,
    competencia: "Matemáticas",
    dificultad: "Alta",
    pregunta: "Si sen(θ) = 3/5 y θ está en el primer cuadrante, ¿cuál es el valor de cos(θ)?",
    opciones: [
      { id: "A", texto: "4/5" },
      { id: "B", texto: "3/4" },
      { id: "C", texto: "5/3" },
      { id: "D", texto: "2/5" }
    ],
    respuestaCorrecta: "A",
    explicacion: "Usando la identidad pitagórica: sen²(θ) + cos²(θ) = 1. Si sen(θ) = 3/5, entonces (3/5)² + cos²(θ) = 1, así 9/25 + cos²(θ) = 1, cos²(θ) = 16/25, cos(θ) = 4/5 (positivo en el primer cuadrante)."
  },
  {
    id: 14,
    numero: 14,
    competencia: "Lectura Crítica",
    dificultad: "Baja",
    pregunta: "La función principal de un título en un texto es:",
    opciones: [
      { id: "A", texto: "Resumir la conclusión del autor" },
      { id: "B", texto: "Atraer la atención e indicar el tema" },
      { id: "C", texto: "Presentar las fuentes consultadas" },
      { id: "D", texto: "Demostrar el conocimiento del autor" }
    ],
    respuestaCorrecta: "B",
    explicacion: "El título cumple dos funciones esenciales: captar la atención del lector y dar una idea general del tema que se tratará en el texto, sin necesariamente revelar conclusiones."
  },
  {
    id: 15,
    numero: 15,
    competencia: "Ciencias Naturales",
    dificultad: "Alta",
    pregunta: "El efecto invernadero es causado principalmente por:",
    opciones: [
      { id: "A", texto: "La destrucción de la capa de ozono" },
      { id: "B", texto: "Gases que atrapan el calor en la atmósfera" },
      { id: "C", texto: "La radiación solar directa" },
      { id: "D", texto: "El aumento del nivel del mar" }
    ],
    respuestaCorrecta: "B",
    explicacion: "Los gases de efecto invernadero (CO₂, metano, vapor de agua) permiten que la radiación solar entre pero atrapan el calor que la Tierra emite, causando el calentamiento global. Es diferente al daño en la capa de ozono."
  },
  {
    id: 16,
    numero: 16,
    competencia: "Inglés",
    dificultad: "Alta",
    pregunta: "I wish I _____ speak French fluently.",
    opciones: [
      { id: "A", texto: "can" },
      { id: "B", texto: "could" },
      { id: "C", texto: "will" },
      { id: "D", texto: "would" }
    ],
    respuestaCorrecta: "B",
    explicacion: "'I wish' + pasado simple expresa un deseo sobre el presente. 'Could' es el pasado de 'can'. Expresa que deseas tener esa habilidad ahora pero no la tienes."
  },
  {
    id: 17,
    numero: 17,
    competencia: "Razonamiento Cuantitativo",
    dificultad: "Baja",
    pregunta: "¿Cuál es el promedio de los números 8, 12, 15 y 21?",
    opciones: [
      { id: "A", texto: "12" },
      { id: "B", texto: "14" },
      { id: "C", texto: "15" },
      { id: "D", texto: "16" }
    ],
    respuestaCorrecta: "B",
    explicacion: "El promedio se calcula sumando todos los valores y dividiendo entre la cantidad: (8 + 12 + 15 + 21) / 4 = 56 / 4 = 14."
  },
  {
    id: 18,
    numero: 18,
    competencia: "Ciencias Sociales",
    dificultad: "Alta",
    pregunta: "La inflación se define como:",
    opciones: [
      { id: "A", texto: "El aumento generalizado y sostenido de los precios" },
      { id: "B", texto: "La disminución del desempleo" },
      { id: "C", texto: "El crecimiento de la producción nacional" },
      { id: "D", texto: "La devaluación de la moneda extranjera" }
    ],
    respuestaCorrecta: "A",
    explicacion: "La inflación es el aumento continuo y generalizado de los precios de bienes y servicios, lo que reduce el poder adquisitivo del dinero. Se mide con el IPC (Índice de Precios al Consumidor)."
  },
  {
    id: 19,
    numero: 19,
    competencia: "Matemáticas",
    dificultad: "Media",
    pregunta: "La pendiente de una recta que pasa por los puntos (2, 3) y (6, 11) es:",
    opciones: [
      { id: "A", texto: "1" },
      { id: "B", texto: "2" },
      { id: "C", texto: "3" },
      { id: "D", texto: "4" }
    ],
    respuestaCorrecta: "B",
    explicacion: "La pendiente m = (y₂ - y₁) / (x₂ - x₁) = (11 - 3) / (6 - 2) = 8 / 4 = 2. La pendiente indica cuánto sube la recta por cada unidad que avanza horizontalmente."
  },
  {
    id: 20,
    numero: 20,
    competencia: "Lectura Crítica",
    dificultad: "Media",
    pregunta: "Un texto expositivo tiene como propósito fundamental:",
    opciones: [
      { id: "A", texto: "Convencer al lector de adoptar una postura" },
      { id: "B", texto: "Informar y explicar un tema de manera objetiva" },
      { id: "C", texto: "Entretener mediante historias ficticias" },
      { id: "D", texto: "Expresar emociones personales del autor" }
    ],
    respuestaCorrecta: "B",
    explicacion: "Los textos expositivos buscan transmitir información de forma clara y objetiva, explicando conceptos, procesos o fenómenos sin intentar persuadir o entretener principalmente."
  },
  {
    id: 21,
    numero: 21,
    competencia: "Ciencias Naturales",
    dificultad: "Media",
    pregunta: "La diferencia entre átomo y molécula es que:",
    opciones: [
      { id: "A", texto: "El átomo es divisible y la molécula no" },
      { id: "B", texto: "El átomo es la unidad mínima de un elemento, la molécula une dos o más átomos" },
      { id: "C", texto: "La molécula solo existe en estado gaseoso" },
      { id: "D", texto: "El átomo solo se encuentra en metales" }
    ],
    respuestaCorrecta: "B",
    explicacion: "Un átomo es la partícula más pequeña de un elemento que conserva sus propiedades. Una molécula es la unión de dos o más átomos (iguales o diferentes) mediante enlaces químicos. Ejemplo: H₂O es una molécula formada por átomos de H y O."
  },
  {
    id: 22,
    numero: 22,
    competencia: "Inglés",
    dificultad: "Baja",
    pregunta: "My brother is _____ than me.",
    opciones: [
      { id: "A", texto: "tall" },
      { id: "B", texto: "taller" },
      { id: "C", texto: "tallest" },
      { id: "D", texto: "more tall" }
    ],
    respuestaCorrecta: "B",
    explicacion: "'Than' indica comparación. Con adjetivos cortos (una sílaba) agregamos -er: tall → taller. La estructura es: subject + verb + adjective-er + than."
  },
  {
    id: 23,
    numero: 23,
    competencia: "Razonamiento Cuantitativo",
    dificultad: "Media",
    pregunta: "Un tanque de agua tiene 500 litros y pierde 15 litros por hora. ¿En cuántas horas estará completamente vacío?",
    opciones: [
      { id: "A", texto: "30 horas" },
      { id: "B", texto: "33.33 horas" },
      { id: "C", texto: "35 horas" },
      { id: "D", texto: "40 horas" }
    ],
    respuestaCorrecta: "B",
    explicacion: "Dividimos el total entre la pérdida por hora: 500 ÷ 15 = 33.33 horas (aproximadamente 33 horas y 20 minutos)."
  },
  {
    id: 24,
    numero: 24,
    competencia: "Ciencias Sociales",
    dificultad: "Media",
    pregunta: "La división de poderes propuesta por Montesquieu incluye:",
    opciones: [
      { id: "A", texto: "Poder militar, eclesiástico y civil" },
      { id: "B", texto: "Poder ejecutivo, legislativo y judicial" },
      { id: "C", texto: "Poder central, regional y local" },
      { id: "D", texto: "Poder económico, político y social" }
    ],
    respuestaCorrecta: "B",
    explicacion: "Montesquieu propuso dividir el poder del Estado en tres ramas independientes: ejecutivo (gobierno), legislativo (hace leyes) y judicial (imparte justicia), para evitar abusos de poder y garantizar controles mutuos."
  },
  {
    id: 25,
    numero: 25,
    competencia: "Matemáticas",
    dificultad: "Baja",
    pregunta: "¿Cuál es el perímetro de un cuadrado con lado de 7 cm?",
    opciones: [
      { id: "A", texto: "14 cm" },
      { id: "B", texto: "21 cm" },
      { id: "C", texto: "28 cm" },
      { id: "D", texto: "49 cm" }
    ],
    respuestaCorrecta: "C",
    explicacion: "El perímetro de un cuadrado es la suma de sus 4 lados: P = 4 × lado = 4 × 7 = 28 cm. El perímetro es la distancia alrededor de la figura."
  },
  {
    id: 26,
    numero: 26,
    competencia: "Lectura Crítica",
    dificultad: "Alta",
    pregunta: "La ironía como recurso literario consiste en:",
    opciones: [
      { id: "A", texto: "Repetir palabras para dar énfasis" },
      { id: "B", texto: "Expresar lo contrario de lo que se piensa" },
      { id: "C", texto: "Comparar dos elementos usando 'como'" },
      { id: "D", texto: "Exagerar las características de algo" }
    ],
    respuestaCorrecta: "B",
    explicacion: "La ironía expresa lo opuesto a lo que realmente se quiere comunicar, usualmente con intención crítica o humorística. Ejemplo: 'Qué día tan hermoso' dicho durante una tormenta."
  },
  {
    id: 27,
    numero: 27,
    competencia: "Ciencias Naturales",
    dificultad: "Baja",
    pregunta: "Los seres vivos que producen su propio alimento se llaman:",
    opciones: [
      { id: "A", texto: "Heterótrofos" },
      { id: "B", texto: "Descomponedores" },
      { id: "C", texto: "Autótrofos" },
      { id: "D", texto: "Consumidores" }
    ],
    respuestaCorrecta: "C",
    explicacion: "Los autótrofos (como las plantas) producen su propio alimento mediante fotosíntesis. Los heterótrofos deben consumir otros organismos para obtener energía."
  },
  {
    id: 28,
    numero: 28,
    competencia: "Inglés",
    dificultad: "Media",
    pregunta: "They have lived in Madrid _____ 2015.",
    opciones: [
      { id: "A", texto: "for" },
      { id: "B", texto: "since" },
      { id: "C", texto: "from" },
      { id: "D", texto: "during" }
    ],
    respuestaCorrecta: "B",
    explicacion: "'Since' se usa con un punto específico en el tiempo (2015). 'For' se usa con períodos de duración (for 5 years). Present perfect + since/for indica acciones que comenzaron en el pasado y continúan."
  },
  {
    id: 29,
    numero: 29,
    competencia: "Razonamiento Cuantitativo",
    dificultad: "Alta",
    pregunta: "En una clase, 3/5 son mujeres. Si hay 18 hombres, ¿cuántos estudiantes hay en total?",
    opciones: [
      { id: "A", texto: "30" },
      { id: "B", texto: "35" },
      { id: "C", texto: "40" },
      { id: "D", texto: "45" }
    ],
    respuestaCorrecta: "D",
    explicacion: "Si 3/5 son mujeres, entonces 2/5 son hombres. Si 2/5 del total = 18, entonces 1/5 = 9, y 5/5 (el total) = 9 × 5 = 45 estudiantes."
  },
  {
    id: 30,
    numero: 30,
    competencia: "Ciencias Sociales",
    dificultad: "Baja",
    pregunta: "¿Qué derecho protege la libertad de expresión en Colombia?",
    opciones: [
      { id: "A", texto: "Derecho a la educación" },
      { id: "B", texto: "Derecho fundamental de libre expresión" },
      { id: "C", texto: "Derecho al trabajo" },
      { id: "D", texto: "Derecho a la salud" }
    ],
    respuestaCorrecta: "B",
    explicacion: "La libertad de expresión es un derecho fundamental consagrado en la Constitución de 1991, que permite a todas las personas expresar y difundir sus pensamientos y opiniones libremente."
  },
  {
    id: 31,
    numero: 31,
    competencia: "Matemáticas",
    dificultad: "Media",
    pregunta: "Si el radio de un círculo es 5 cm, ¿cuál es su área? (π ≈ 3.14)",
    opciones: [
      { id: "A", texto: "31.4 cm²" },
      { id: "B", texto: "62.8 cm²" },
      { id: "C", texto: "78.5 cm²" },
      { id: "D", texto: "157 cm²" }
    ],
    respuestaCorrecta: "C",
    explicacion: "El área del círculo se calcula con A = πr². Entonces: A = 3.14 × 5² = 3.14 × 25 = 78.5 cm²."
  },
  {
    id: 32,
    numero: 32,
    competencia: "Lectura Crítica",
    dificultad: "Baja",
    pregunta: "Las comillas se usan principalmente para:",
    opciones: [
      { id: "A", texto: "Separar oraciones largas" },
      { id: "B", texto: "Indicar citas textuales o resaltar palabras" },
      { id: "C", texto: "Reemplazar los puntos" },
      { id: "D", texto: "Enumerar elementos en una lista" }
    ],
    respuestaCorrecta: "B",
    explicacion: "Las comillas (\"\") se utilizan para citar textualmente las palabras de otra persona, resaltar términos específicos, o indicar títulos de obras cortas, entre otros usos."
  },
  {
    id: 33,
    numero: 33,
    competencia: "Ciencias Naturales",
    dificultad: "Media",
    pregunta: "Las placas tectónicas se mueven debido a:",
    opciones: [
      { id: "A", texto: "La rotación de la Tierra" },
      { id: "B", texto: "Las corrientes de convección en el manto" },
      { id: "C", texto: "La gravedad lunar" },
      { id: "D", texto: "Los vientos en la atmósfera" }
    ],
    respuestaCorrecta: "B",
    explicacion: "Las corrientes de convección en el manto terrestre (capa debajo de la corteza) generan movimiento del material caliente que empuja las placas tectónicas, causando sismos, volcanes y formación de montañas."
  },
  {
    id: 34,
    numero: 34,
    competencia: "Inglés",
    dificultad: "Alta",
    pregunta: "Neither John _____ Mary came to the party.",
    opciones: [
      { id: "A", texto: "or" },
      { id: "B", texto: "nor" },
      { id: "C", texto: "and" },
      { id: "D", texto: "but" }
    ],
    respuestaCorrecta: "B",
    explicacion: "'Neither... nor' es una correlación que significa 'ni... ni'. Se usa para negar dos elementos. 'Neither John nor Mary' = ni John ni Mary vinieron."
  },
  {
    id: 35,
    numero: 35,
    competencia: "Razonamiento Cuantitativo",
    dificultad: "Baja",
    pregunta: "¿Qué fracción representa 0.75?",
    opciones: [
      { id: "A", texto: "1/2" },
      { id: "B", texto: "2/3" },
      { id: "C", texto: "3/4" },
      { id: "D", texto: "4/5" }
    ],
    respuestaCorrecta: "C",
    explicacion: "0.75 = 75/100 = 3/4 (simplificando dividiendo entre 25). También puedes verificar: 3 ÷ 4 = 0.75."
  },
  {
    id: 36,
    numero: 36,
    competencia: "Ciencias Sociales",
    dificultad: "Alta",
    pregunta: "El PIB (Producto Interno Bruto) mide:",
    opciones: [
      { id: "A", texto: "La felicidad de la población" },
      { id: "B", texto: "El valor total de bienes y servicios producidos en un país" },
      { id: "C", texto: "La cantidad de empleados públicos" },
      { id: "D", texto: "El nivel de educación promedio" }
    ],
    respuestaCorrecta: "B",
    explicacion: "El PIB es el valor monetario total de todos los bienes y servicios finales producidos en un país durante un período (generalmente un año). Es el principal indicador de actividad económica."
  },
  {
    id: 37,
    numero: 37,
    competencia: "Matemáticas",
    dificultad: "Alta",
    pregunta: "La derivada de f(x) = x³ es:",
    opciones: [
      { id: "A", texto: "x²" },
      { id: "B", texto: "2x²" },
      { id: "C", texto: "3x²" },
      { id: "D", texto: "x³/3" }
    ],
    respuestaCorrecta: "C",
    explicacion: "Usando la regla de potencias: d/dx(xⁿ) = n·xⁿ⁻¹. Para x³, tenemos: 3·x³⁻¹ = 3x². La derivada representa la tasa de cambio instantánea."
  },
  {
    id: 38,
    numero: 38,
    competencia: "Lectura Crítica",
    dificultad: "Media",
    pregunta: "La coherencia en un texto se refiere a:",
    opciones: [
      { id: "A", texto: "El uso correcto de signos de puntuación" },
      { id: "B", texto: "La relación lógica entre las ideas presentadas" },
      { id: "C", texto: "La extensión adecuada de los párrafos" },
      { id: "D", texto: "El uso de vocabulario técnico" }
    ],
    respuestaCorrecta: "B",
    explicacion: "La coherencia es la propiedad que hace que un texto tenga sentido global, donde todas las ideas se relacionan lógicamente entre sí y contribuyen al mensaje principal."
  },
  {
    id: 39,
    numero: 39,
    competencia: "Ciencias Naturales",
    dificultad: "Alta",
    pregunta: "La meiosis es importante porque:",
    opciones: [
      { id: "A", texto: "Produce células con el doble de cromosomas" },
      { id: "B", texto: "Genera variabilidad genética y células sexuales" },
      { id: "C", texto: "Solo ocurre en células vegetales" },
      { id: "D", texto: "Duplica exactamente las células madre" }
    ],
    respuestaCorrecta: "B",
    explicacion: "La meiosis produce células sexuales (gametos) con la mitad de cromosomas y genera variabilidad genética mediante recombinación, lo que es esencial para la reproducción sexual y evolución."
  },
  {
    id: 40,
    numero: 40,
    competencia: "Inglés",
    dificultad: "Baja",
    pregunta: "What _____ you do yesterday?",
    opciones: [
      { id: "A", texto: "do" },
      { id: "B", texto: "does" },
      { id: "C", texto: "did" },
      { id: "D", texto: "done" }
    ],
    respuestaCorrecta: "C",
    explicacion: "'Yesterday' indica pasado, por lo que usamos el auxiliar 'did' para formar preguntas en pasado simple. La estructura es: Did + subject + verb (base form)?"
  },
  {
    id: 41,
    numero: 41,
    competencia: "Razonamiento Cuantitativo",
    dificultad: "Media",
    pregunta: "Un rectángulo tiene un área de 48 cm² y un ancho de 6 cm. ¿Cuál es su largo?",
    opciones: [
      { id: "A", texto: "6 cm" },
      { id: "B", texto: "7 cm" },
      { id: "C", texto: "8 cm" },
      { id: "D", texto: "9 cm" }
    ],
    respuestaCorrecta: "C",
    explicacion: "Área = largo × ancho. Si 48 = largo × 6, entonces largo = 48 ÷ 6 = 8 cm."
  },
  {
    id: 42,
    numero: 42,
    competencia: "Ciencias Sociales",
    dificultad: "Media",
    pregunta: "La Declaración de los Derechos Humanos fue proclamada por:",
    opciones: [
      { id: "A", texto: "La Organización Mundial de la Salud" },
      { id: "B", texto: "Las Naciones Unidas" },
      { id: "C", texto: "El Banco Mundial" },
      { id: "D", texto: "La Unión Europea" }
    ],
    respuestaCorrecta: "B",
    explicacion: "La Declaración Universal de los Derechos Humanos fue adoptada por la Asamblea General de las Naciones Unidas el 10 de diciembre de 1948, estableciendo derechos fundamentales para todas las personas."
  },
  {
    id: 43,
    numero: 43,
    competencia: "Matemáticas",
    dificultad: "Baja",
    pregunta: "¿Cuánto es 25% de 200?",
    opciones: [
      { id: "A", texto: "25" },
      { id: "B", texto: "40" },
      { id: "C", texto: "50" },
      { id: "D", texto: "75" }
    ],
    respuestaCorrecta: "C",
    explicacion: "25% = 25/100 = 0.25. Multiplicamos: 200 × 0.25 = 50. También puedes calcular: 25% es la cuarta parte, entonces 200 ÷ 4 = 50."
  },
  {
    id: 44,
    numero: 44,
    competencia: "Lectura Crítica",
    dificultad: "Alta",
    pregunta: "Un texto con lenguaje denotativo se caracteriza por:",
    opciones: [
      { id: "A", texto: "Usar significados literales y objetivos" },
      { id: "B", texto: "Emplear abundantes metáforas" },
      { id: "C", texto: "Expresar emociones subjetivas" },
      { id: "D", texto: "Utilizar múltiples interpretaciones" }
    ],
    respuestaCorrecta: "A",
    explicacion: "El lenguaje denotativo usa palabras en su significado literal, preciso y objetivo, común en textos científicos y técnicos. El lenguaje connotativo usa significados figurados y subjetivos."
  },
  {
    id: 45,
    numero: 45,
    competencia: "Ciencias Naturales",
    dificultad: "Baja",
    pregunta: "¿Qué planeta es conocido como el 'planeta rojo'?",
    opciones: [
      { id: "A", texto: "Venus" },
      { id: "B", texto: "Júpiter" },
      { id: "C", texto: "Marte" },
      { id: "D", texto: "Saturno" }
    ],
    respuestaCorrecta: "C",
    explicacion: "Marte es llamado el 'planeta rojo' debido al óxido de hierro (herrumbre) presente en su superficie, que le da su característico color rojizo."
  },
  {
    id: 46,
    numero: 46,
    competencia: "Inglés",
    dificultad: "Media",
    pregunta: "The car _____ by my father last year.",
    opciones: [
      { id: "A", texto: "is bought" },
      { id: "B", texto: "was bought" },
      { id: "C", texto: "buys" },
      { id: "D", texto: "bought" }
    ],
    respuestaCorrecta: "B",
    explicacion: "Usamos voz pasiva en pasado: was/were + past participle. 'Last year' indica pasado. La estructura correcta es 'was bought' (fue comprado)."
  },
  {
    id: 47,
    numero: 47,
    competencia: "Razonamiento Cuantitativo",
    dificultad: "Alta",
    pregunta: "Si x + y = 10 y x - y = 4, ¿cuál es el valor de x?",
    opciones: [
      { id: "A", texto: "5" },
      { id: "B", texto: "6" },
      { id: "C", texto: "7" },
      { id: "D", texto: "8" }
    ],
    respuestaCorrecta: "C",
    explicacion: "Sumamos ambas ecuaciones: (x + y) + (x - y) = 10 + 4, entonces 2x = 14, por lo tanto x = 7. Para verificar: si x = 7, entonces y = 3 (7 + 3 = 10, 7 - 3 = 4)."
  },
  {
    id: 48,
    numero: 48,
    competencia: "Ciencias Sociales",
    dificultad: "Baja",
    pregunta: "El voto en Colombia es:",
    opciones: [
      { id: "A", texto: "Obligatorio para todos" },
      { id: "B", texto: "Un derecho y un deber" },
      { id: "C", texto: "Solo para mayores de 25 años" },
      { id: "D", texto: "Exclusivo para ciudadanos con título universitario" }
    ],
    respuestaCorrecta: "B",
    explicacion: "El voto en Colombia es un derecho (puedes ejercerlo) y un deber (hay responsabilidad cívica de participar) para ciudadanos mayores de 18 años, pero no es obligatorio."
  },
  {
    id: 49,
    numero: 49,
    competencia: "Matemáticas",
    dificultad: "Media",
    pregunta: "La suma de los ángulos internos de un pentágono es:",
    opciones: [
      { id: "A", texto: "360°" },
      { id: "B", texto: "450°" },
      { id: "C", texto: "540°" },
      { id: "D", texto: "720°" }
    ],
    respuestaCorrecta: "C",
    explicacion: "La fórmula es (n - 2) × 180°, donde n es el número de lados. Para un pentágono (5 lados): (5 - 2) × 180° = 3 × 180° = 540°."
  },
  {
    id: 50,
    numero: 50,
    competencia: "Lectura Crítica",
    dificultad: "Media",
    pregunta: "El propósito de un prólogo en un libro es:",
    opciones: [
      { id: "A", texto: "Resumir toda la historia" },
      { id: "B", texto: "Presentar el contexto y orientar al lector" },
      { id: "C", texto: "Agradecer a los colaboradores" },
      { id: "D", texto: "Mostrar las conclusiones del autor" }
    ],
    respuestaCorrecta: "B",
    explicacion: "El prólogo introduce la obra, proporciona contexto sobre su creación, explica su importancia y orienta al lector sobre qué esperar, preparándolo para la lectura sin revelar la trama completa."
  }
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getColorForScore = (puntaje: number) => {
  if (puntaje >= 75) return "#10b981";
  if (puntaje >= 50) return "#3b82f6";
  return "#f59e0b";
};

const getDificultadColor = (dificultad: string) => {
  switch (dificultad) {
    case "Alta": return "bg-red-100 text-red-700 border-red-300";
    case "Media": return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "Baja": return "bg-green-100 text-green-700 border-green-300";
    default: return "bg-gray-100 text-gray-700 border-gray-300";
  }
};

// ─── Pantalla de resultados al finalizar ──────────────────────────────────────
function PantallaResultados({
  respuestas,
  onVolver,
}: {
  respuestas: Record<number, string>;
  onVolver: () => void;
}) {
  const router = useRouter();
  const [expandida, setExpandida] = useState<number | null>(null);

  // Calcular resultados por área
  const areaMap: Record<string, { correctas: number; total: number }> = {};
  preguntasAdaptativas.forEach((p) => {
    if (!areaMap[p.competencia]) areaMap[p.competencia] = { correctas: 0, total: 0 };
    areaMap[p.competencia].total += 1;
    if (respuestas[p.id] === p.respuestaCorrecta) {
      areaMap[p.competencia].correctas += 1;
    }
  });

  const resultadoAreas = Object.entries(areaMap).map(([nombre, v]) => ({
    nombre,
    puntaje: Math.round((v.correctas / v.total) * 100),
    correctas: v.correctas,
    total: v.total,
  }));

  const totalCorrectas = preguntasAdaptativas.filter(
    (p) => respuestas[p.id] === p.respuestaCorrecta
  ).length;
  const porcentaje = Math.round((totalCorrectas / preguntasAdaptativas.length) * 100);
  const aprobado = porcentaje >= 75;

  // Guardar en localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem(
      "sipro_recovery_result",
      JSON.stringify({ resultadoAreas, totalCorrectas, porcentaje, fecha: new Date().toLocaleDateString("es-CO") })
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-600 to-green-700 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">Test de Recuperación — Resultados</h1>
              <p className="text-sm text-gray-600">Análisis detallado de tu desempeño</p>
            </div>
          </div>
          <Button onClick={() => router.push("/dashboard")} variant="outline" className="border-gray-300">
            <Home className="w-4 h-4 mr-2" /> Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        {/* Card de puntaje general */}
        <Card
          className={`shadow-xl border-0 text-white overflow-hidden relative ${aprobado
              ? "bg-gradient-to-br from-green-600 to-green-700"
              : "bg-gradient-to-br from-orange-500 to-orange-600"
            }`}
        >
          <div className="absolute top-0 right-0 opacity-10">
            {aprobado ? <CheckCircle2 className="w-48 h-48" /> : <AlertTriangle className="w-48 h-48" />}
          </div>
          <CardContent className="pt-8 pb-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-3 mx-auto">
                  {aprobado
                    ? <CheckCircle2 className="w-12 h-12 text-white" />
                    : <AlertTriangle className="w-12 h-12 text-white" />}
                </div>
                <h2 className="text-2xl font-bold mb-1">
                  {aprobado ? "¡Excelente trabajo!" : "¡Sigue practicando!"}
                </h2>
                <p className={`text-sm ${aprobado ? "text-green-100" : "text-orange-100"}`}>
                  Has completado el test adaptativo
                </p>
              </div>
              <div>
                <p className={`text-sm mb-2 ${aprobado ? "text-green-100" : "text-orange-100"}`}>Respuestas Correctas</p>
                <p className="text-5xl font-bold">{totalCorrectas}/{preguntasAdaptativas.length}</p>
              </div>
              <div>
                <p className={`text-sm mb-2 ${aprobado ? "text-green-100" : "text-orange-100"}`}>Rendimiento</p>
                <p className="text-5xl font-bold">{porcentaje}%</p>
                <p className={`text-sm mt-2 font-semibold ${aprobado ? "text-green-200" : "text-orange-200"}`}>
                  {aprobado ? "APROBADO" : "A MEJORAR"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfica por área */}
          <Card className="shadow-md border-gray-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                Resultado por Área
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={resultadoAreas}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="nombre" tick={{ fill: "#6b7280", fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v: number) => [`${v}%`, "Puntaje"]} />
                    <Bar dataKey="puntaje" radius={[6, 6, 0, 0]}>
                      {resultadoAreas.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getColorForScore(entry.puntaje)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {resultadoAreas.map((area, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{area.nombre}</span>
                    <span className="text-sm font-semibold" style={{ color: getColorForScore(area.puntaje) }}>
                      {area.correctas}/{area.total} ({area.puntaje}%)
                    </span>
                  </div>
                  <Progress value={area.puntaje} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recomendaciones dinámicas */}
          <Card className="shadow-md border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Recomendaciones Personalizadas
              </CardTitle>
              <CardDescription>Basadas en tu desempeño</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {resultadoAreas.map((area, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-lg ${area.puntaje >= 75 ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"
                    }`}
                >
                  {area.puntaje >= 75
                    ? <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    : <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />}
                  <div>
                    <p className={`font-medium text-sm ${area.puntaje >= 75 ? "text-green-900" : "text-orange-900"}`}>
                      {area.nombre}
                    </p>
                    <p className={`text-xs ${area.puntaje >= 75 ? "text-green-700" : "text-orange-700"}`}>
                      {area.puntaje >= 75
                        ? "¡Buen desempeño! Sigue practicando para consolidar."
                        : "Necesita refuerzo. Habla con el Tutor IA para más ejercicios."}
                    </p>
                  </div>
                </div>
              ))}
              <Button
                onClick={() => router.push("/dashboard/tutor-ia")}
                className="w-full mt-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                <Brain className="w-4 h-4 mr-2" />
                Consultar Tutor IA
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Revisión pregunta por pregunta */}
        <Card className="shadow-md border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Revisión Detallada — Pregunta por Pregunta
            </CardTitle>
            <CardDescription>
              Haz clic en cada pregunta para ver la explicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {preguntasAdaptativas.map((p) => {
              const esCorrecta = respuestas[p.id] === p.respuestaCorrecta;
              const isOpen = expandida === p.id;
              return (
                <div
                  key={p.id}
                  className={`border rounded-lg overflow-hidden transition-all ${esCorrecta ? "border-green-200" : "border-red-200"
                    }`}
                >
                  <button
                    onClick={() => setExpandida(isOpen ? null : p.id)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between ${esCorrecta ? "bg-green-50 hover:bg-green-100" : "bg-red-50 hover:bg-red-100"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {esCorrecta
                        ? <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        : <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                      <div className="text-left">
                        <p className={`text-sm font-semibold ${esCorrecta ? "text-green-900" : "text-red-900"}`}>
                          Pregunta {p.numero} — {p.competencia}
                        </p>
                        <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{p.pregunta}</p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${isOpen ? "rotate-90" : ""
                        }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="p-4 space-y-3 bg-white border-t border-gray-100">
                      <p className="text-sm text-gray-800">{p.pregunta}</p>

                      <div className="grid grid-cols-2 gap-3">
                        <div className={`p-3 rounded-lg ${esCorrecta ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                          <p className="text-xs font-medium text-gray-500 mb-1">Tu respuesta</p>
                          <p className={`text-sm font-semibold ${esCorrecta ? "text-green-700" : "text-red-700"}`}>
                            Opción {respuestas[p.id] ?? "Sin responder"}
                          </p>
                        </div>
                        <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                          <p className="text-xs font-medium text-gray-500 mb-1">Respuesta correcta</p>
                          <p className="text-sm font-semibold text-green-700">
                            Opción {p.respuestaCorrecta}
                          </p>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex items-start gap-2 mb-2">
                          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm font-semibold text-blue-900">Explicación del Tutor IA:</p>
                        </div>
                        <p className="text-sm text-blue-900 leading-relaxed">{p.explicacion}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Acciones finales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Volver al Dashboard
          </Button>
          <Button
            onClick={() => router.push("/dashboard/prueba-simulada")}
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            size="lg"
          >
            <Brain className="w-5 h-5 mr-2" />
            Nueva Prueba Simulada
          </Button>
        </div>
      </main>
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export function TestRecuperacion() {
  const router = useRouter();
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [respuestas, setRespuestas] = useState<Record<number, string>>({});
  const [mostrarExplicacion, setMostrarExplicacion] = useState(false);
  const [testCompletado, setTestCompletado] = useState(false);

  const pregunta = preguntasAdaptativas[preguntaActual];
  const progreso = ((preguntaActual + 1) / preguntasAdaptativas.length) * 100;
  const respuestaSeleccionada = respuestas[pregunta.id];

  const handleSeleccionarRespuesta = (opcionId: string) => {
    setRespuestas({ ...respuestas, [pregunta.id]: opcionId });
    setMostrarExplicacion(false);
  };

  const handleVerExplicacion = () => setMostrarExplicacion(true);

  const handleSiguiente = () => {
    if (preguntaActual < preguntasAdaptativas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
      setMostrarExplicacion(false);
    } else {
      setTestCompletado(true);
    }
  };

  const handleAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
      setMostrarExplicacion(false);
    }
  };

  // ─── Pantalla de resultados ─────────────────────────────────────────────────
  if (testCompletado) {
    return <PantallaResultados respuestas={respuestas} onVolver={() => setTestCompletado(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-2 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-gray-900">
                  Test de Recuperación Adaptativo
                </h1>
                <p className="text-sm text-gray-600">
                  Personalizado según tus áreas de mejora
                </p>
              </div>
            </div>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              className="border-gray-300"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Pregunta {preguntaActual + 1} de {preguntasAdaptativas.length}
            </span>
            <span className="text-sm font-medium text-green-600">
              {Math.round(progreso)}% completado
            </span>
          </div>
          <Progress value={progreso} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Pregunta Principal */}
          <div className="lg:col-span-3">
            <Card className="shadow-lg border-gray-200">
              <CardContent className="pt-6">
                {/* Header con Competencia y Dificultad */}
                <div className="flex items-center justify-between mb-4">
                  <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    {pregunta.competencia}
                  </div>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getDificultadColor(
                      pregunta.dificultad
                    )}`}
                  >
                    Dificultad: {pregunta.dificultad}
                  </div>
                </div>

                {/* Banner Test Adaptativo */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 mb-6">
                  <div className="flex items-start gap-3">
                    <Brain className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 mb-1">
                        Test Adaptativo con IA
                      </p>
                      <p className="text-sm text-green-700">
                        Esta pregunta fue diseñada para reforzar tus áreas de
                        mejora identificadas en evaluaciones anteriores.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Número de Pregunta */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-gradient-to-br from-green-600 to-green-700 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold">
                    {pregunta.numero}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Pregunta {pregunta.numero}
                  </h2>
                </div>

                {/* Texto de la Pregunta */}
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                  <p className="text-lg text-gray-900 leading-relaxed">
                    {pregunta.pregunta}
                  </p>
                </div>

                {/* Opciones */}
                <div className="space-y-3">
                  {pregunta.opciones.map((opcion) => {
                    const isSelected = respuestaSeleccionada === opcion.id;
                    const isCorrect = opcion.id === pregunta.respuestaCorrecta;
                    const showResult = mostrarExplicacion;

                    let cls =
                      "w-full text-left p-5 rounded-lg border-2 transition-all ";
                    if (showResult) {
                      if (isCorrect)
                        cls += "border-green-600 bg-green-50";
                      else if (isSelected && !isCorrect)
                        cls += "border-red-600 bg-red-50";
                      else cls += "border-gray-200";
                    } else {
                      cls += isSelected
                        ? "border-green-600 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-green-300 hover:bg-gray-50";
                    }

                    return (
                      <button
                        key={opcion.id}
                        onClick={() =>
                          !mostrarExplicacion &&
                          handleSeleccionarRespuesta(opcion.id)
                        }
                        disabled={mostrarExplicacion}
                        className={cls}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${showResult
                                ? isCorrect
                                  ? "bg-green-600 text-white"
                                  : isSelected && !isCorrect
                                    ? "bg-red-600 text-white"
                                    : "bg-gray-200 text-gray-700"
                                : isSelected
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-200 text-gray-700"
                              }`}
                          >
                            {opcion.id}
                          </div>
                          <div className="flex-1 flex items-center justify-between">
                            <span className="text-gray-900 pt-1">
                              {opcion.texto}
                            </span>
                            {showResult && isCorrect && (
                              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                            )}
                            {showResult && isSelected && !isCorrect && (
                              <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explicación expandible */}
                {mostrarExplicacion && (
                  <div className="mt-6 bg-blue-50 p-5 rounded-lg border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 mb-2">
                          Explicación del Tutor IA:
                        </p>
                        <p className="text-sm text-blue-900 leading-relaxed">
                          {pregunta.explicacion}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navegación */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                  <Button
                    onClick={handleAnterior}
                    disabled={preguntaActual === 0}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>

                  <div className="flex gap-3">
                    {!mostrarExplicacion && respuestaSeleccionada && (
                      <Button
                        onClick={handleVerExplicacion}
                        variant="outline"
                        className="border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        <Lightbulb className="w-4 h-4 mr-2" />
                        Ver Explicación
                      </Button>
                    )}
                    <Button
                      onClick={handleSiguiente}
                      disabled={!respuestaSeleccionada}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                    >
                      {preguntaActual === preguntasAdaptativas.length - 1
                        ? "Finalizar Test"
                        : "Siguiente"}
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progreso */}
            <Card className="shadow-lg border-green-200 bg-gradient-to-br from-green-50 to-white">
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <Target className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <h3 className="font-bold text-green-900">Test Personalizado</h3>
                </div>
                <div className="space-y-2 text-sm text-green-800">
                  <p>✓ Enfocado en tus debilidades</p>
                  <p>✓ Dificultad adaptativa</p>
                  <p>✓ Retroalimentación instantánea</p>
                </div>
              </CardContent>
            </Card>

            {/* Mapa de Preguntas */}
            <Card className="shadow-lg border-gray-200">
              <CardContent className="pt-6">
                <h3 className="font-bold text-gray-900 mb-4">Navegación</h3>
                <div className="grid grid-cols-4 gap-2">
                  {preguntasAdaptativas.map((p, index) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setPreguntaActual(index);
                        setMostrarExplicacion(false);
                      }}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all ${index === preguntaActual
                          ? "bg-green-600 text-white shadow-md scale-110"
                          : respuestas[p.id]
                            ? "bg-blue-100 text-blue-700 border border-blue-300"
                            : "bg-gray-100 text-gray-700 border border-gray-300"
                        }`}
                    >
                      {p.numero}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="shadow-lg border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Consejo IA
                    </h4>
                    <p className="text-sm text-blue-800">
                      Lee la explicación después de cada respuesta para
                      fortalecer tu aprendizaje.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
