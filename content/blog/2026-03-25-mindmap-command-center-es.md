---
title: "Construí un mapa en vivo de todo mi sistema de vida"
description: "Gestionar 18 proyectos paralelos mientras trabajas a tiempo completo significa que las cosas se pierden — no por falta de herramientas, sino por falta de visibilidad. Así que construí un mindmap radial con D3.js para verlo todo de un vistazo."
date: 2026-03-25
language: es
image: /images/blog/mindmap-command-center.png
heroImage: true
category: Tecnología
tags:
  - Productividad
  - Building in Public
  - Open Source
related:
  - /blog/2026-03-24-ai-agent-team
  - /blog/2025-01-07-personal-life-management-system
---

Tengo 18 proyectos paralelos. Un trabajo a tiempo completo. OKRs para Q2. Un equipo de agentes de IA. Un CRM de personas con las que construyo cosas.

Las herramientas no son el problema. Notion rastrea tareas. GitHub rastrea código. Una hoja de cálculo rastrea proyectos. Pero ninguna de ellas responde la pregunta que realmente necesito responder: *¿cómo se conecta esto con aquello?*

Esa pregunta fue el detonante. Construí un mindmap.

## El problema con las herramientas de tareas

Las herramientas de tareas te dicen *qué hacer*. No te muestran *por qué importa* — ni cómo un proyecto alimenta a otro, cómo un valor da forma a una decisión, cómo una relación clave abre la puerta a un objetivo específico.

Abría Notion, veía 40 tarjetas y no tenía ninguna noción de la forma de mi trabajo. ¿WeDance está conectado con mi misión? Teóricamente sí, pero ¿dónde en la lista? ¿Qué proyectos son satélites y cuáles son centrales? No podía verlo.

Faltaba el mapa.

## Lo que construí

Un árbol radial con D3.js. La misión en el centro. Todo lo demás se ramifica: OKRs, proyectos, valores, personas clave, decisiones importantes.

49 nodos en total. La imagen completa.

La tecnología es deliberadamente mínima — D3.js v7, TypeScript, Vite, unos 20KB de código fuente. Sin framework. Quería algo que pudiera abrir en un navegador y que funcionara inmediatamente, no algo que necesite tres instalaciones de npm y un archivo de configuración.

[Prueba la demo en vivo →](https://razbakov.com/mindmap)

Código fuente en GitHub: [razbakov/mindmap-command-center](https://github.com/razbakov/mindmap-command-center)

## Construirlo era el objetivo

Algo que no esperaba: el acto de construir el mapa me enseñó más que el mapa en sí.

Para estructurar el árbol, tuve que responder preguntas difíciles. ¿"WeDance" es un OKR o un proyecto? (Proyecto — pero es el vehículo para OKR1.) ¿Qué valores realmente guían mis decisiones ahora mismo? (Conexión, autonomía, aplicación práctica — tres que aparecen siempre.) ¿Qué personas pertenecen al nivel superior del sistema? (Relaciones clave, no solo contactos.)

Los árboles de D3 no permiten dependencias circulares. Si A se conecta con B, tienes que decidir cuál es el padre. Esa restricción es útil. Te obliga a comprometerte.

Me di cuenta una y otra vez de que las cosas estaban en el lugar equivocado — no porque el código estuviera mal, sino porque mi modelo mental era difuso. El mapa lo aclaró.

## Cómo encaja en mi sistema

El mindmap no es un gestor de tareas. No rastrea fechas límite ni estados. Lo que hace es responder la pregunta "¿esto encaja?" antes de empezar a trabajar.

Cuando estoy decidiendo si tomar algo nuevo — un proyecto, una colaboración, una funcionalidad — miro el mapa. ¿Se conecta con un nodo que ya está ahí? ¿O flota desconectado de todo lo demás? Desconectado generalmente significa: ahora no.

También funciona como herramienta de anclaje. Cuando estoy saltando entre cinco cosas y pierdo el hilo, abrir el mapa me resetea. Ahí está el centro. Ahí es donde estoy yo. Quince segundos y estoy reorientado.

## Qué hay en los 49 nodos

- **Misión** — nodo central
- **OKRs** — objetivos del trimestre actual
- **Proyectos** — los 18, agrupados por dominio (danza, IA, ops, side)
- **Valores** — los que realmente aparecen en las decisiones, no los aspiracionales
- **Personas clave** — no un CRM completo, solo las relaciones que dan forma al trabajo
- **Decisiones** — ADRs importantes que afectan a todo el sistema

La capa de personas fue la más difícil. Añadir a alguien al mapa no es simplemente etiquetar un contacto — es decir "esta relación es estructural para cómo funciona mi trabajo." Eso me obligó a pensar con honestidad sobre quién realmente importa operativamente versus a quién simplemente conozco.

## Y si fuera un sistema vivo

La versión actual es estática — actualizo el archivo de datos manualmente cuando algo cambia. Pero el siguiente paso obvio es hacerlo en vivo: traer el estado de tareas desde Notion, la salud de proyectos desde GitHub, el progreso desde mi tracker de OKRs.

¿Y si el mapa brillara de forma diferente según qué proyectos estén activos? ¿Y si pudieras filtrar por valor — muéstrame todo lo conectado con "conexión" como motor? ¿Y si al hacer clic en un nodo de proyecto se abriera el workspace de Notion?

Eso es un proyecto de fin de semana. Quizá dos.

## Pruébalo

El mindmap es open source. Si gestionas múltiples proyectos, la estructura podría ser útil — no necesariamente el código, sino el acto de obligarte a mapearlo todo.

[razbakov.com/mindmap](https://razbakov.com/mindmap) — demo en vivo
[github.com/razbakov/mindmap-command-center](https://github.com/razbakov/mindmap-command-center) — código fuente

Los 20 minutos que toma dibujar tu sistema como un árbol valen la pena. No porque el mapa sea la respuesta. Sino porque dibujarlo te obliga a hacer la pregunta correcta.
