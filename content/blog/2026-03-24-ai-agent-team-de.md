---
title: "Ich habe ein Führungsteam aus 6 KI-Agenten aufgebaut, um meine 15 Nebenprojekte zu managen"
description: "Wie ich Claude Code nutze, um ein autonomes KI-Agententeam zu betreiben, das Code-Reviews, Content, Strategie, Coaching und Community über 15 Projekte hinweg übernimmt — neben meinem Vollzeitjob."
date: 2026-03-24
language: de
image: /images/blog/ai-agent-team.png
heroImage: true
tweet: https://x.com/razbakov/status/1904281908619587855
category: Technologie
tags:
  - Künstliche Intelligenz
  - Produktivität
  - Building in Public
related:
  - /blog/2026-03-21-dancing-with-ai
  - /blog/2025-01-10-ai-first
cta:
  label: "Schau dir die vollständige Präsentation an"
  url: "https://www.youtube.com/watch?v=6Jwb8pSOZ4M"
---

Ich habe 15 aktive Nebenprojekte und einen Vollzeitjob als Entwickler.

Die Rechnung geht nicht auf — es sei denn, man delegiert.

Also habe ich ein Führungsteam aus 6 KI-Agenten aufgebaut. Jeder hat seinen eigenen Bereich, seine eigene Persönlichkeit und seine eigenen Fähigkeiten. Ich nenne es mein **Executive Cabinet**.

## Das Team

| Agent | Rolle | Bereich |
|-------|-------|---------|
| **Maya** | Chief of Staff | Tägliche Reviews, Inbox-Triage, Aufgabenverteilung |
| **Viktor** | CTO | Code-Reviews, PRs, Architekturentscheidungen |
| **Luna** | Content & Wachstum | Blogbeiträge, Social Media, SEO |
| **Marco** | Strategie & Business | Von Ideen zu Plänen, Hypothesenvalidierung |
| **Sage** | Persönlicher Coach | Work-Life-Balance, Reflexion, Zieltracking |
| **Kai** | Community & Partnerschaften | CRM, Networking, Follow-ups |

## Meine Rolle als Commander

Ich konzentriere mich nur auf vier Dinge:

- **Strategische Entscheidungen** — was gebaut wird, was gestrichen wird
- **Das Gesicht sein** — Präsentationen, Networking, Beziehungen
- **Beziehungen aufbauen** — Partnerschaften, Kooperationen
- **Ideen validieren** — Hypothesen mit echten Nutzern testen

Alles andere wird delegiert. Coding, Inbox-Verarbeitung, Blogbeiträge, Zieltracking, Wettbewerbsanalyse — alles Agenten.

## Wie es in der Praxis funktioniert

Ich sende eine Nachricht (meistens über Telegram). Maya ordnet sie dem richtigen Bereich zu und leitet sie an den passenden Agenten weiter.

Ein typischer Tag:

- **Morgens**: Maya + Sage führen das tägliche Review durch und setzen Prioritäten
- **Mittags**: Viktor reviewt PRs, Luna erstellt Content-Entwürfe
- **Abends**: Maya generiert einen Bericht, Marco prüft die Wochenziele

Jeder Agent läuft in seiner eigenen tmux-Session mit einem isolierten git worktree. Sie liefern Pull Requests, nicht nur lokale Commits. Alles ist überprüfbar.

## Der Tech Stack

Nichts Proprietäres. Keine eigene Plattform.

- **Claude Code** (Opus) — das Gehirn
- **Markdown-Dateien** — Skill-Definitionen, Prompts, Kontext
- **Git worktrees** — Isolation pro Agenten-Aufgabe
- **Tmux** — parallele Agenten-Sessions
- **Notion** — Kanban-Board zur Nachverfolgung
- **Telegram** — Eingabeschnittstelle

## Governance: Sociocracy 3.0

Das Team folgt S3-Mustern:

- **Klare Bereiche** — jeder Agent ist für einen bestimmten Bereich verantwortlich
- **Konsent-basierte Entscheidungen** — niemand überstimmt den Bereich eines anderen
- **Treiberbasiertes Arbeiten** — jede Aufgabe beginnt mit dem "Warum" (Spannung, Treiber, Anforderung, Reaktion)
- **Verantwortlichkeit** — Agenten müssen PRs liefern, nicht nur Statusupdates

## Was ich gelernt habe

1. **Agenten brauchen Struktur, nicht Freiheit.** Vage Prompts liefern vage Ergebnisse. Jeder Agent hat eine detaillierte Skill-Datei mit schrittweisen Prozessen.

2. **Fire-and-Forget schlägt Mikromanagement.** Ich verteile Aufgaben und prüfe die Ergebnisse später über einen `/scrum`-Befehl, der alle Agenten-Logs liest.

3. **Das Inbox-Pattern ist alles.** Ein Befehl (`/inbox: <Aufgabe>`) erstellt einen Worktree, schreibt einen Prompt, startet in tmux und protokolliert alles für Wiederholungen.

4. **Persönlichkeit zählt.** Agenten Namen und Bereiche zu geben ist nicht nur witzig — es schafft klare Zuordnung und Verantwortlichkeit.

## Probier es selbst aus

Das gesamte System läuft auf Claude Code mit Markdown-Skill-Dateien. Keine besondere Infrastruktur nötig. Starte mit einem Agenten (einem Chief of Staff für tägliche Reviews) und erweitere von dort aus.

Ich habe ein 7-Minuten-Video aufgenommen, das den kompletten Aufbau zeigt, präsentiert aus meinem Apple Vision Pro Workspace. Schau es dir oben an oder [auf YouTube](https://www.youtube.com/watch?v=6Jwb8pSOZ4M).

---

Wie managst du mehrere Projekte mit KI? Ich würde gerne hören, wie andere das machen. [Finde mich auf X](https://x.com/razbakov) oder hinterlasse einen Kommentar beim [YouTube-Video](https://www.youtube.com/watch?v=6Jwb8pSOZ4M).
