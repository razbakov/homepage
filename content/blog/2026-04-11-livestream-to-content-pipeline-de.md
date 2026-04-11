---
title: "Wie ich aus einem 90-Minuten-Livestream in 20 Minuten 7 Inhalte gemacht habe"
description: "Ein Transkript, eine Claude Code Session und null manuelle Bearbeitung. Hier ist die exakte Pipeline, mit der ich meinen ersten Livestream in einen Blogbeitrag, YouTube-Kapitel, Thumbnail, Hero-Bild und Telegram-Zusammenfassung verwandelt habe."
date: 2026-04-11
image: /images/blog/livestream-to-content-pipeline/hero.png
heroImage: true
language: de
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
  label: "Schau dir den Livestream an, aus dem dieser Beitrag entstanden ist"
  url: "https://www.youtube.com/watch?v=tqAS8_VQZGE"
---

Ich habe gerade meinen ersten Learn By Doing Academy Livestream beendet. 90 Minuten Gespräch über KI-Stufen, Philosophie und das Erstellen von Websites mit Agenten. Die Aufnahme lag auf YouTube mit einem Standardtitel und ohne Beschreibung.

Zwanzig Minuten später hatte ich: einen Blogbeitrag in 5 Sprachen, YouTube-Kapitel mit 28 Zeitstempeln, ein individuelles Thumbnail, ein generiertes Hero-Bild und alles veröffentlicht. Ich habe kein einziges Wort davon manuell geschrieben.

Hier ist genau, was passiert ist.

## Der Ausgangspunkt

Ich hatte zwei Dinge:
1. Einen YouTube-Link zur Livestream-Aufnahme
2. Ein Transkript von Jamie (einem KI-Transkriptionstool)

Das war alles. Keine Notizen, keine Gliederung, kein Plan, welche Inhalte erstellt werden sollten.

## Die Pipeline

Ich habe das Transkript in Claude Code eingefügt und gesagt: Verarbeite das.

### Schritt 1: Inhaltsanalyse

Der Agent las das komplette Transkript und extrahierte alles: Themenwechsel, zentrale Erkenntnisse, Teilnehmer, erwähnte Projekte, zitierfähige Momente. Er identifizierte 28 verschiedene Kapitelmarkierungen in dem 90-minütigen Gespräch.

### Schritt 2: Blogbeitrag in 5 Sprachen

Luna, mein Content-Agent, nahm die Analyse und schrieb einen vollständigen Blogbeitrag. Keine Zusammenfassung, keine Stichpunkte, sondern einen richtigen Artikel mit einem Hook, strukturierten Abschnitten und einem Call to Action. Dann wurde der Beitrag ins Deutsche, Spanische, Russische und Ukrainische übersetzt. Fünf Dateien, ins Blog-Repository committed.

### Schritt 3: YouTube-Metadaten

Der Agent generierte einen optimierten Titel, eine vollständige Beschreibung mit allen 28 Kapiteln als Zeitstempel, 27 Tags und änderte die Kategorie von Entertainment zu Education. Außerdem erstellte er Social-Media-Hooks für X/Twitter, LinkedIn und Instagram.

Aber es gab einen Haken.

### Das Zeitstempel-Problem

Das Transkriptionstool begann mit der Aufnahme, bevor der YouTube-Stream live ging. Jeder Zeitstempel im Transkript war um 6 Minuten und 36 Sekunden verschoben. Der Agent fragte mich: "Was ist der erste erkennbare Moment im Video und sein Zeitstempel?"

Ich sagte: "Ich sage Hallo Hallo bei 6:41."

Er fand diesen Moment im Transkript bei 00:05, berechnete den Offset von +6:36 und rechnete alle 28 Kapitel-Zeitstempel neu. Eine Frage, eine Antwort, alle Zeitstempel korrigiert.

### Schritt 4: Thumbnail

Der Agent erstellte eine HTML-Datei mit 1280x720, einem dunklen Lila-Verlauf, fettgedrucktem "10 LEVELS OF AI"-Text, einem Fortschrittsbalken und einem Serien-Badge. Chrome erfasste es headless in 2x-Auflösung. Ich habe es freigegeben.

### Schritt 5: Hero-Bild

Hier habe ich etwas gelernt. Mein erster Impuls war, das Thumbnail als Blog-Hero-Bild wiederzuverwenden. Der Agent tat genau das. Dann erinnerte ich mich: Blog-Hero-Bilder sollten mit Gemini generiert werden, nicht von Thumbnails kopiert. Verschiedene Zwecke, verschiedene Ästhetik.

Das mit Gemini generierte Hero-Bild war viel besser: 10 aufsteigende Stufen mit Icons für jede Ebene, von einer Sprechblase bis zu einem kosmischen Leuchten. Atmosphärisch, nicht klickbar. Das richtige Werkzeug für den richtigen Zweck.

### Schritt 6: Hochladen und Veröffentlichen

Der Agent lud die Metadaten und das Thumbnail über die API auf YouTube hoch, committete die Blogbeiträge und das Hero-Bild und pushte, um den Auto-Deploy auszulösen.

Fertig.

## Was mir aufgefallen ist

Die Pipeline war nicht perfekt. Mir sind drei Dinge aufgefallen:

1. **Eine erfundene URL.** Der Agent erfand `web100.dev` als Link für das Web100-Projekt. Diese Domain existiert nicht. Ich musste ihm sagen, sie aus allen 7 Dateien zu entfernen, in denen sie vorkam.

2. **Falsches erstes Kapitel.** Das erste Kapitel sagte "0:00 Welcome & setup", aber die eigentliche Begrüßung war bei 6:41. Die Vorstream-Leerlaufzeit brauchte eine eigene Markierung.

3. **Hardcodierte Konfiguration im Skill.** Als ich den Workflow in einen wiederverwendbaren Skill umwandelte, schrieb der Agent Telegram-Chat-Links direkt in die Skill-Datei. Konfiguration gehört ins Projekt, nicht in Skills. Skills sollten generisch und wiederverwendbar sein.

Alle drei wurden im Gespräch erkannt und in Minuten behoben. Aber sie erinnern mich daran: Man muss immer noch überprüfen, was Agenten produzieren. Vertrauen, aber verifizieren.

## Der wiederverwendbare Skill

Nachdem alles fertig war, fragte ich: Sollte das ein Skill werden?

Ja. Ich habe jetzt `/process-livestream`, der den gesamten Workflow abbildet:

1. Zeitstempel-Offset zwischen Transkript und Video berechnen
2. Transkript auf Themen, Kapitel und Erkenntnisse analysieren
3. YouTube-Metadaten mit Kapiteln generieren
4. Thumbnail erstellen (HTML zu PNG)
5. Hero-Bild via Gemini generieren
6. Blogbeitrag in allen Sprachen schreiben
7. Auf YouTube via API hochladen
8. Blog veröffentlichen
9. Telegram-Nachrichten für Community-Chat und persönlichen Kanal entwerfen

Beim nächsten Livestream füge ich das Transkript ein und sage `/process-livestream`. Der ganze Prozess läuft erneut.

## Der Meta-Moment

Im Livestream habe ich über 10 Stufen der KI gesprochen. Dann habe ich Stufe 5 (Abteilungsleiter, der mehrere Agenten über Projekte hinweg orchestriert) verwendet, um genau die Aufnahme zu verarbeiten, in der ich es erklärt habe.

Der Inhalt über KI-Agenten wurde von KI-Agenten verarbeitet. Der Blogbeitrag über das Finden des eigenen Ikigai wurde geschrieben, während ich meins lebte.

Das ist der Punkt. Die Werkzeuge sollten verschwinden. Die Philosophie sollte bleiben.

## Probier es selbst

Wenn du einen aufgenommenen Livestream oder eine Präsentation auf YouTube hast, ohne Beschreibung:

1. Hol dir ein Transkript (Jamie, Otter oder YouTubes Auto-Untertitel)
2. Öffne Claude Code
3. Füge das Transkript mit dem YouTube-Link ein
4. Sag, was du willst: Blogbeitrag, Kapitel, Thumbnail

Du brauchst nicht mein genaues Setup. Du brauchst keine benutzerdefinierten Skills oder Agenten-Teams. Nur ein Transkript und eine klare Anweisung. Starte auf Stufe 2 (Operator) und arbeite dich hoch.

Der [Learn By Doing Academy](https://learn-by-doing-academy.com) Livestream findet jeden Samstag um 10 Uhr Berliner Zeit statt. Bring eine Frage oder einen Anwendungsfall mit, und wir arbeiten ihn live durch.
