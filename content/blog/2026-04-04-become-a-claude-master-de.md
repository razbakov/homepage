---
title: "Ich habe ein Trainingsprogramm in Claude Code gebaut"
description: "Wie ein einziger Slash-Befehl dich in Claude Code einarbeitet, die richtigen Skills installiert und dich durch ein strukturiertes Lernprogramm fuehrt — vom Anfaenger zum Power-User."
date: 2026-04-04
language: de
image: /images/blog/become-claude-master.png
category: Technology
tags:
  - AI Agents
  - Claude Code
  - Productivity
  - Building in Public
  - Developer Tools
related:
  - /blog/2026-03-25-my-ai-team-runs-my-day
  - /blog/2026-03-24-ai-executive-team
  - /blog/2026-03-20-ikigai-ai-chief-of-staff
telegram: https://t.me/razbakov/85
tweet: https://x.com/razbakov/status/2040772376988643580
cta:
  title: "Probier es selbst aus"
  description: "Installiere den Skill und starte deine Claude Code Lernreise in 5 Minuten."
  label: "Skill installieren"
  url: "https://github.com/razbakov/skills/tree/main/skills/become-claude-master"
---

Die meisten Leute nutzen Claude Code wie ChatGPT — Frage eintippen, Antwort bekommen, wiederholen. Sie entdecken nie, dass Claude Code ein Memory-System, Hooks, Skills, MCP-Integrationen und Multi-Agent-Workflows hat, die es in ein vollstaendiges Betriebssystem fuer ihre Arbeit verwandeln koennen.

Ich weiss das, weil ich vor sechs Monaten genau diese Person war. Ich bin zufaellig auf jedes Feature gestossen, habe Stunden mit Dingen verschwendet, die eine einzeilige Loesung hatten, und haette mir gewuenscht, dass mir jemand einfach den Weg gezeigt haette.

Also habe ich einen gebaut.

## Ein Befehl zum Starten

```
/become-claude-master
```

Das war's. Dieser einzelne Slash-Befehl startet ein dreiphasiges Onboarding, das sich an deinen aktuellen Stand anpasst.

## Phase 1: Dein Fundament (5 Minuten)

Der Skill prueft, ob du eine `~/.claude/CLAUDE.md` hast — die Datei, die Claude in jeder einzelnen Konversation liest. Wenn du keine hast, erstellt er eine mit fuenf Starterregeln:

- **`rule: <text>`** — Sag das und Claude fuegt die Regel sofort zu deiner Konfiguration hinzu
- **`learned?`** — Claude extrahiert Erkenntnisse aus dem, was gerade passiert ist, und speichert sie
- **`new skill`** — Claude verwandelt deinen aktuellen Workflow in einen wiederverwendbaren Skill
- **Pfadverwaltung** — Haelt Konfigurationen projektbezogen, nicht global
- **Browser-Automatisierung** — Verbindet sich bei Bedarf mit deiner authentifizierten Browser-Sitzung

Diese fuenf Regeln summieren sich. Nach einer Woche hast du eine CLAUDE.md, die wirklich versteht, wie du arbeitest.

## Phase 2: Die richtigen Tools fuer deine Arbeit (10 Minuten)

Der Skill interviewt dich. Kein generischer Fragebogen — er fragt, was du tatsaechlich tust: deinen Stack, deine Tools, ob du Content schreibst oder Projekte managst oder PRs reviewst.

Basierend auf deinen Antworten empfiehlt er Skills aus einer kuratierten Sammlung und installiert sie fuer dich. Ein Frontend-Entwickler bekommt `test-driven-development` und `pr-review-responder`. Ein Content Creator bekommt `social-post` und `viral-threads`. Ein Projektmanager bekommt `workflow` und `estimation`.

Du musst keinen Katalog durchblaettern. Der Skill matched Tools zu deiner Arbeit.

## Phase 3: Strukturiertes Lernen (fortlaufend)

Das ist der Teil, der mich am meisten begeistert. Claude Code hat ein 16-Themen-Curriculum eingebaut:

**Grundlagen** — Prompting-Muster, das CLAUDE.md-System, Slash-Befehle, Kontextmanagement.

**Coding-Workflows** — wann Edit vs Write vs Bash, testgetriebene Entwicklung, Debugging-Strategien.

**Fortgeschrittene Features** — Skills erstellen, Hooks und Automatisierung, MCP-Server-Integrationen, Multi-Agent-Workflows.

**Mastery** — das Memory-System, eigene Pipelines, Performance-Optimierung, Sicherheit.

Jede Sitzung dauert etwa 15 Minuten. Claude holt die neuesten Docs, praesentiert das Kernkonzept, gibt dir eine Mini-Challenge, zeichnet deinen Score auf und bietet an, die naechste Sitzung zu planen.

## Es beginnt mit einem Assessment

Als ich es bei mir selbst ausfuehrte, startete der Skill nicht bei Thema 1. Er fuehrte zuerst ein kurzes Assessment durch — vier Fragen darueber, wie ich Prompting, Hooks, Memory und Agents nutze.

Ergebnis: Ich betreibe 118 Skills und ein 6-Agent-Team, aber hatte nie einen einzigen Hook konfiguriert. Der Skill identifizierte diese Luecke und startete dort, statt Zeit mit Basics zu verschwenden, die ich bereits kannte.

Fuenfzehn Minuten spaeter hatte ich einen Notification-Hook global laufen — jetzt bekomme ich jedes Mal, wenn einer meiner Agents Input braucht, ein macOS-Popup mit Sound. Eine Zeile Konfiguration, die mir monatelang gefehlt hatte.

## Warum das wichtig ist

Claude Code ist das maechtigste Entwicklertool, das ich je benutzt habe. Aber seine Staerke ist versteckt. Es gibt keinen Onboarding-Wizard, kein progressives Aufdecken, keine "Das koenntest du auch"-Vorschlaege.

Der Unterschied zwischen einem Anfaenger und einem Power-User ist kein Talent — es ist zu wissen, was moeglich ist. Dieser Skill schliesst diese Luecke systematisch.

## Was kommt als Naechstes

Ich fuege weitere Themen hinzu, waehrend sich Claude Code weiterentwickelt — IDE-Integrationen, das Agent SDK, API-Muster. Das Curriculum waechst mit dem Tool.

Wenn du es ausprobierst, wuerde ich gerne hoeren, welche Luecken das Assessment bei dir findet. Der Skill ist Open Source und PRs sind willkommen.

```bash
claude install-skill https://github.com/razbakov/skills/tree/main/skills/become-claude-master
```

Dann einfach `/become-claude-master` eintippen und mitmachen.
