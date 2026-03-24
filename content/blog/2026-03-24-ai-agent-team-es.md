---
title: "Construí un equipo directivo de 6 agentes de IA para gestionar mis 15 proyectos paralelos"
description: "Cómo uso Claude Code para dirigir un equipo autónomo de agentes de IA que se encarga de revisiones de código, contenido, estrategia, coaching y comunidad en 15 proyectos mientras trabajo a tiempo completo."
date: 2026-03-24
image: /images/blog/ai-agent-team.png
heroImage: true
tweet: https://x.com/razbakov/status/1904281908619587855
category: Tecnología
tags:
  - Inteligencia Artificial
  - Productividad
  - Building in Public
related:
  - /blog/2026-03-21-dancing-with-ai
  - /blog/2025-01-10-ai-first
cta:
  label: "Mira la presentación completa"
  url: "https://www.youtube.com/watch?v=6Jwb8pSOZ4M"
---

Tengo 15 proyectos paralelos activos y un trabajo de ingeniería a tiempo completo.

Las cuentas no salen — a menos que delegues.

Así que construí un equipo directivo de 6 agentes de IA. Cada uno tiene su propio dominio, personalidad y conjunto de habilidades. Lo llamo mi **Executive Cabinet**.

## El equipo

| Agente | Rol | Dominio |
|--------|-----|---------|
| **Maya** | Chief of Staff | Revisiones diarias, triaje de inbox, enrutamiento de tareas |
| **Viktor** | CTO | Revisión de código, PRs, decisiones de arquitectura |
| **Luna** | Contenido y Crecimiento | Posts de blog, redes sociales, SEO |
| **Marco** | Estrategia y Negocios | De ideas a planes, validación de hipótesis |
| **Sage** | Coach Personal | Equilibrio de vida, reflexión, seguimiento de objetivos |
| **Kai** | Comunidad y Alianzas | CRM, networking, seguimientos |

## Mi rol como Commander

Me enfoco solo en cuatro cosas:

- **Decisiones estratégicas** — qué construir, qué eliminar
- **Ser la cara visible** — presentaciones, networking, relaciones
- **Construir relaciones** — alianzas, colaboraciones
- **Validar ideas** — probar hipótesis con usuarios reales

Todo lo demás se delega. Código, procesamiento de inbox, posts de blog, seguimiento de objetivos, investigación de competencia — todo agentes.

## Cómo funciona en la práctica

Envío un mensaje (generalmente por Telegram). Maya lo clasifica por dominio y lo enruta al agente correcto.

Un día típico:

- **Mañana**: Maya + Sage hacen la revisión diaria y establecen prioridades
- **Mediodía**: Viktor revisa PRs, Luna redacta contenido
- **Noche**: Maya genera un informe, Marco revisa los objetivos semanales

Cada agente corre en su propia sesión de tmux con un git worktree aislado. Entregan pull requests, no solo commits locales. Todo es revisable.

## El stack tecnológico

Nada propietario. Ninguna plataforma personalizada.

- **Claude Code** (Opus) — el cerebro
- **Archivos Markdown** — definiciones de habilidades, prompts, contexto
- **Git worktrees** — aislamiento por tarea de agente
- **Tmux** — sesiones de agentes en paralelo
- **Notion** — tablero Kanban para seguimiento
- **Telegram** — interfaz de entrada

## Gobernanza: Sociocracy 3.0

El equipo sigue patrones de S3:

- **Dominios claros** — cada agente es responsable de un área específica
- **Decisiones basadas en consentimiento** — nadie anula el dominio de otro
- **Trabajo basado en drivers** — cada tarea empieza con el "por qué" (tensión, driver, requisito, respuesta)
- **Responsabilidad** — los agentes deben entregar PRs, no solo actualizaciones de estado

## Lo que aprendí

1. **Los agentes necesitan estructura, no libertad.** Prompts vagos producen resultados vagos. Cada agente tiene un archivo de habilidades detallado con procesos paso a paso.

2. **Disparar y olvidar supera al micromanagement.** Despacho tareas y reviso resultados después con un comando `/scrum` que lee todos los logs de agentes.

3. **El patrón de inbox lo es todo.** Un comando (`/inbox: <tarea>`) crea un worktree, escribe un prompt, lo lanza en tmux y registra todo para reintentos.

4. **La personalidad importa.** Darles nombres y dominios a los agentes no es solo divertido — crea enrutamiento claro y responsabilidad.

## Pruébalo tú mismo

Todo el sistema funciona con Claude Code y archivos de habilidades en Markdown. No se necesita infraestructura especial. Empieza con un agente (un Chief of Staff para revisiones diarias) y expande desde ahí.

Grabé un video de 7 minutos recorriendo toda la configuración, presentado desde mi espacio de trabajo en Apple Vision Pro. Míralo arriba o [en YouTube](https://www.youtube.com/watch?v=6Jwb8pSOZ4M).

---

¿Cuál es tu enfoque para gestionar múltiples proyectos con IA? Me encantaría saber cómo lo hacen otros. [Encuéntrame en X](https://x.com/razbakov) o deja un comentario en [el video de YouTube](https://www.youtube.com/watch?v=6Jwb8pSOZ4M).
