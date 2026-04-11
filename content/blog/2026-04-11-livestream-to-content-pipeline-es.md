---
title: "Como convertí un livestream de 90 minutos en 7 piezas de contenido en 20 minutos"
description: "Un transcrito, una sesión de Claude Code y cero edición manual. Esta es la pipeline exacta que usé para procesar mi primer livestream en un artículo de blog, capítulos de YouTube, miniatura, imagen principal y resumen de Telegram."
date: 2026-04-11
image: /images/blog/livestream-to-content-pipeline/hero.png
heroImage: true
language: es
category: Technology
tags:
  - Artificial Intelligence
  - Productivity
  - Building in Public
  - Learn By Doing
  - Content Creation
related:
  - /blog/2026-04-11-ai-levels-from-qa-to-ikigai
  - /blog/2026-03-24-ai-agent-team
  - /blog/2026-04-09-julia-mccoy-method
cta:
  label: "Mira el livestream del que se creó este artículo"
  url: "https://www.youtube.com/watch?v=tqAS8_VQZGE"
---

Acabo de terminar mi primer livestream de Learn By Doing Academy. 90 minutos de conversación sobre niveles de IA, filosofía y construcción de sitios web con agentes. La grabación estaba en YouTube con un título por defecto y sin descripción.

Veinte minutos después tenía: un artículo de blog en 5 idiomas, capítulos de YouTube con 28 marcas de tiempo, una miniatura personalizada, una imagen principal generada y todo publicado. No escribí ni una sola palabra manualmente.

Esto es exactamente lo que pasó.

## El punto de partida

Tenía dos cosas:
1. Un enlace de YouTube a la grabación del livestream
2. Un transcrito de Jamie (una herramienta de transcripción con IA)

Eso era todo. Sin notas, sin esquema, sin plan de qué contenido crear.

## La pipeline

Pegué el transcrito en Claude Code y dije: procesa esto.

### Paso 1: Análisis de contenido

El agente leyó el transcrito completo y extrajo todo: transiciones de temas, conclusiones clave, participantes, proyectos mencionados, momentos citables. Identificó 28 marcadores de capítulos distintos en la conversación de 90 minutos.

### Paso 2: Artículo de blog en 5 idiomas

Luna, mi agente de contenido, tomó el análisis y escribió un artículo completo. No un resumen, no viñetas, sino un artículo de verdad con un gancho, secciones estructuradas y un llamado a la acción. Luego tradujo el artículo al alemán, español, ruso y ucraniano. Cinco archivos, commiteados al repositorio del blog.

### Paso 3: Metadatos de YouTube

El agente generó un título optimizado, una descripción completa con los 28 capítulos como marcas de tiempo, 27 etiquetas y cambió la categoría de Entertainment a Education. También creó ganchos de distribución social para X/Twitter, LinkedIn e Instagram.

Pero había un problema.

### El problema de las marcas de tiempo

La herramienta de transcripción comenzó a grabar antes de que el stream de YouTube estuviera en vivo. Cada marca de tiempo en el transcrito estaba desfasada por 6 minutos y 36 segundos. El agente me preguntó: "¿Cuál es el primer momento reconocible en el video y su marca de tiempo?"

Le dije: "Digo hola hola en 6:41."

Encontró ese momento en el transcrito en 00:05, calculó el desfase de +6:36 y recalculó las 28 marcas de tiempo de los capítulos. Una pregunta, una respuesta, todas las marcas de tiempo corregidas.

### Paso 4: Miniatura

El agente creó un archivo HTML de 1280x720 con un degradado púrpura oscuro, texto en negrita "10 LEVELS OF AI", una barra de progreso y una insignia de serie. Chrome lo capturó en modo headless a resolución 2x. Lo aprobé.

### Paso 5: Imagen principal

Aquí aprendí algo. Mi primer instinto fue reutilizar la miniatura como imagen principal del blog. El agente hizo exactamente eso. Luego recordé: las imágenes principales del blog deben generarse con Gemini, no copiarse de las miniaturas. Diferentes propósitos, diferentes estéticas.

La imagen principal generada con Gemini quedó mucho mejor: 10 escalones ascendentes con iconos para cada nivel, desde una burbuja de chat hasta un brillo cósmico. Atmosférica, no clickable. La herramienta correcta para el trabajo correcto.

### Paso 6: Subir y publicar

El agente subió los metadatos y la miniatura a YouTube vía la API, commiteó los artículos del blog y la imagen principal, y pusheó para activar el auto-deploy.

Listo.

## Lo que detecté

La pipeline no fue perfecta. Detecté tres cosas:

1. **Una URL falsa.** El agente inventó `web100.dev` como enlace para el proyecto Web100. Ese dominio no existe. Tuve que decirle que lo eliminara de los 7 archivos donde aparecía.

2. **Primer capítulo incorrecto.** El primer capítulo decía "0:00 Welcome & setup" pero la bienvenida real fue en 6:41. El tiempo muerto previo al stream necesitaba su propio marcador.

3. **Configuración hardcodeada en el skill.** Cuando convertí el flujo de trabajo en un skill reutilizable, el agente puso enlaces de chat de Telegram directamente en el archivo del skill. La configuración pertenece al proyecto, no a los skills. Los skills deben ser genéricos y reutilizables.

Los tres se detectaron en la conversación y se corrigieron en minutos. Pero me recuerdan: todavía hay que revisar lo que producen los agentes. Confiar pero verificar.

## El skill reutilizable

Después de que todo estuvo listo, pregunté: ¿debería esto convertirse en un skill?

Sí. Ahora tengo `/process-livestream` que captura todo el flujo de trabajo:

1. Calcular el desfase de marcas de tiempo entre transcrito y video
2. Analizar el transcrito para temas, capítulos y conclusiones
3. Generar metadatos de YouTube con capítulos
4. Crear miniatura (HTML a PNG)
5. Generar imagen principal vía Gemini
6. Escribir artículo de blog en todos los idiomas
7. Subir a YouTube vía API
8. Publicar blog
9. Redactar mensajes de Telegram para el chat comunitario y el canal personal

En el próximo livestream, pego el transcrito y digo `/process-livestream`. Todo el proceso se ejecuta de nuevo.

## El momento meta

Hablé sobre 10 niveles de IA en el livestream. Luego usé el Nivel 5 (director de división, orquestando múltiples agentes entre proyectos) para procesar exactamente la grabación donde lo expliqué.

El contenido sobre agentes de IA fue procesado por agentes de IA. El artículo sobre encontrar tu ikigai fue escrito mientras yo vivía el mío.

Ese es el punto. Las herramientas deberían desaparecer. La filosofía debería permanecer.

## Pruébalo tú mismo

Si tienes un livestream grabado o una presentación en YouTube sin descripción:

1. Consigue un transcrito (Jamie, Otter o los subtítulos automáticos de YouTube)
2. Abre Claude Code
3. Pega el transcrito con el enlace de YouTube
4. Dile qué quieres: artículo de blog, capítulos, miniatura

No necesitas mi setup exacto. No necesitas skills personalizados ni equipos de agentes. Solo un transcrito y una instrucción clara. Empieza en el Nivel 2 (operador) y ve subiendo.

El livestream de [Learn By Doing Academy](https://learn-by-doing-academy.com) es cada sábado a las 10am hora de Berlín. Trae una pregunta o un caso de uso y lo trabajaremos en vivo.
