---
title: "Ich habe eine Live-Karte meines gesamten Lebenssystems gebaut"
description: "18 Nebenprojekte neben einem Vollzeitjob zu managen bedeutet, dass Dinge untergehen — nicht wegen fehlender Tools, sondern wegen fehlender Übersicht. Also habe ich eine radiale D3.js-Mindmap gebaut, um alles auf einen Blick zu sehen."
date: 2026-03-25
language: de
image: /images/blog/mindmap-command-center.png
heroImage: true
category: Technologie
tags:
  - Produktivität
  - Building in Public
  - Open Source
related:
  - /blog/2026-03-24-ai-agent-team
  - /blog/2025-01-07-personal-life-management-system
---

Ich habe 18 Nebenprojekte. Einen Vollzeitjob. OKRs für Q2. Ein Team aus KI-Agenten. Ein CRM der Leute, mit denen ich baue.

Die Tools sind nicht das Problem. Notion trackt Aufgaben. GitHub trackt Code. Eine Tabelle trackt Projekte. Aber keines davon beantwortet die Frage, die ich wirklich beantwortet brauche: *Wie hängt das eine mit dem anderen zusammen?*

Diese Frage war der Auslöser. Ich habe eine Mindmap gebaut.

## Das Problem mit Aufgaben-Tools

Aufgaben-Tools sagen dir, *was du tun sollst*. Sie zeigen dir nicht, *warum es wichtig ist* — oder wie ein Projekt das andere nährt, wie ein Wert eine Entscheidung formt, wie eine wichtige Beziehung eine Tür zu einem bestimmten Ziel öffnet.

Ich öffnete Notion, sah 40 Karten und hatte kein Gefühl für die Form meiner Arbeit. Hängt WeDance mit meiner Mission zusammen? Theoretisch ja, aber wo in der Liste? Welche Projekte sind Satelliten und welche zentral? Ich konnte es nicht sehen.

Die Karte fehlte.

## Was ich gebaut habe

Einen radialen D3.js-Baum. Die Mission im Zentrum. Alles andere verzweigt sich: OKRs, Projekte, Werte, wichtige Personen, große Entscheidungen.

49 Knoten insgesamt. Das vollständige Bild.

Der Tech-Stack ist bewusst minimal — D3.js v7, TypeScript, Vite, etwa 20KB Quellcode. Kein Framework. Ich wollte etwas, das ich im Browser öffnen kann und das sofort funktioniert, nicht etwas, das drei npm-Installationen und eine Konfigurationsdatei braucht.

[Zur Live-Demo →](https://razbakov.com/mindmap)

Quellcode auf GitHub: [razbakov/mindmap-command-center](https://github.com/razbakov/mindmap-command-center)

## Der Bau war der Sinn

Was ich nicht erwartet hatte: Der Akt des Bauens hat mir mehr beigebracht als die Karte selbst.

Um den Baum zu strukturieren, musste ich schwierige Fragen beantworten. Ist "WeDance" ein OKR oder ein Projekt? (Projekt — aber es ist das Vehikel für OKR1.) Welche Werte treiben gerade wirklich meine Entscheidungen? (Verbindung, Autonomie, praktische Anwendung — drei, die jedes Mal auftauchen.) Welche Personen gehören auf die oberste Ebene des Systems? (Schlüsselbeziehungen, nicht einfach Kontakte.)

D3-Bäume erlauben keine zirkulären Abhängigkeiten. Wenn A mit B verbunden ist, muss man sich entscheiden, wer der Elternknoten ist. Diese Einschränkung ist nützlich. Sie zwingt dich, dich festzulegen.

Ich merkte immer wieder, dass Dinge am falschen Platz waren — nicht weil der Code falsch war, sondern weil mein mentales Modell unscharf war. Die Karte hat es geklärt.

## Wie es in mein System passt

Die Mindmap ist kein Aufgabenmanager. Sie trackt keine Fristen oder Status. Was sie tut: Sie beantwortet die Frage "Passt das hierher?" bevor ich mit der Arbeit beginne.

Wenn ich entscheide, ob ich etwas Neues annehme — ein Projekt, eine Partnerschaft, ein Feature — schaue ich auf die Karte. Verbindet es sich mit einem Knoten, der schon da ist? Oder schwebt es frei, unverbunden mit allem anderen? Unverbunden heißt meistens: nicht jetzt.

Es funktioniert auch als Erdungstool. Wenn ich zwischen fünf Dingen hin und her springe und den Faden verliere, setzt mich ein Blick auf die Karte zurück. Da ist das Zentrum. Da bin ich darin. Fünfzehn Sekunden und ich bin neu orientiert.

## Was in den 49 Knoten steckt

- **Mission** — zentraler Knoten
- **OKRs** — Ziele des aktuellen Quartals
- **Projekte** — alle 18, gruppiert nach Bereich (Tanz, KI, Ops, Side)
- **Werte** — die, die tatsächlich in Entscheidungen auftauchen, nicht die angestrebten
- **Schlüsselpersonen** — kein vollständiges CRM, nur die Beziehungen, die die Arbeit formen
- **Entscheidungen** — große ADRs, die das gesamte System betreffen

Die Ebene der Personen war am schwierigsten. Jemanden zur Karte hinzuzufügen heißt nicht einfach, einen Kontakt zu taggen — es heißt: "Diese Beziehung ist strukturell dafür, wie meine Arbeit läuft." Das hat ehrliches Nachdenken erzwungen darüber, wer operativ wirklich zählt — und wen ich einfach nur kenne.

## Was wäre, wenn es ein lebendes System wäre

Die aktuelle Version ist statisch — ich aktualisiere die Datendatei manuell, wenn sich etwas ändert. Aber der nächste logische Schritt ist, sie live zu machen: Aufgabenstatus aus Notion ziehen, Projektgesundheit aus GitHub, Fortschritte aus meinem OKR-Tracker.

Was wäre, wenn die Karte unterschiedlich leuchten würde je nachdem, welche Projekte aktiv sind? Wenn man nach Werten filtern könnte — zeig mir alles, was mit "Verbindung" als Treiber zusammenhängt? Wenn ein Klick auf einen Projektknoten den Notion-Workspace öffnen würde?

Das ist ein Wochenendprojekt. Vielleicht zwei.

## Probier es aus

Die Mindmap ist Open Source. Wenn du mehrere Projekte managst, könnte die Struktur nützlich sein — nicht unbedingt der Code, sondern der Akt, sich selbst zu zwingen, alles zu kartieren.

[razbakov.com/mindmap](https://razbakov.com/mindmap) — Live-Demo
[github.com/razbakov/mindmap-command-center](https://github.com/razbakov/mindmap-command-center) — Quellcode

Die 20 Minuten, die es braucht, dein System als Baum aufzuzeichnen, lohnen sich. Nicht weil die Karte die Antwort ist. Sondern weil das Zeichnen die richtige Frage erzwingt.
