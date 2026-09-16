---
date: 2026-09-16
slug: vue-google-firebase-analytics
source: blog
source_url: https://razbakov.com/blog/2020-01-12-vue-google-firebase-analytics
channel: "Alösha — Daily (@razbakovdaily)"
format: "AI-avatar narration (HeyGen) + cloned voice (ElevenLabs)"
target_length: "~3:30"
status: draft
generated_at: 2026-09-16T06:31:19.336Z
llm: claude-oauth
---

# Daily — Vue + Google Firebase Analytics

**Source:** https://razbakov.com/blog/2020-01-12-vue-google-firebase-analytics

## Hook (0:00–0:20)

I wasted hours debugging analytics — because I brought old assumptions into a new tool. If you're adding Google Analytics to a Vue app in 2020, Firebase Analytics already does most of the work. The trick is knowing when to stop adding things.

`[B-ROLL: Screen recording — multiple browser tabs open with vue-gtm, vue-gtag docs, console errors flashing]`
`[TEXT ON SCREEN: "Stop adding things."]`

## Point 1 — The wrong path (0:20–1:10)

So here's what happened. I'm building a budgeting app with Quasar — Vue-based, runs as SPA, PWA, eventually native. I needed analytics. And my brain immediately went to what I already knew: Google Tag Manager, gtag, the whole stack I'd used before.

First I tried vue-gtm. That means configuring things twice — once in your code, once in Tag Manager. Then I switched to vue-gtag, which sends events directly. Better in theory. But my debugger kept showing gtag initializing twice. I spent way too long assuming it was some cache issue from my previous GTM setup.

It wasn't. Firebase was already injecting gtag on its own. I was literally duplicating what was already there. The answer was to remove code, not add more.

`[B-ROLL: Side-by-side of cluttered code vs. a single clean firebase.analytics() call]`
`[TEXT ON SCREEN: "The answer was to remove code."]`

## Point 2 — The simple path (1:10–2:10)

Firebase Analytics — or Google Analytics App + Web, as they're calling it — is basically GA version two. It thinks in users and events instead of sessions and hits. It has real-time debugging built in. And when you set it up in a Vue app, you get event tracking with one line: `firebase.analytics().logEvent()`. That's it.

You don't need a separate gtag snippet. You don't need Tag Manager. You initialize Firebase, call `firebase.analytics()`, and you're live. I put an alias on the Vue prototype — `this.$analytics` — so every component can log events without importing anything.

The part that actually requires thought is page view tracking. In a single-page app, the document title doesn't change on navigation by default. I used vue-meta for that. But there's a timing catch — vue-meta updates the title after the router hook fires. So if you track on `router.afterEach`, you record the previous page name. You have to hook into vue-meta's `changed` callback instead.

`[B-ROLL: Firebase DebugView showing real-time events flowing in — page_view, screen_view]`
`[TEXT ON SCREEN: "One line. You're live."]`

## Point 3 — The real lesson (2:10–3:05)

What I keep coming back to is this: I lost time not because the problem was hard, but because I assumed the new tool worked like the old one. I carried GTM patterns into a Firebase world. And Firebase had already solved the thing I was trying to bolt on manually.

This happens constantly in engineering. You reach for what's familiar before you read what's already in front of you. The Firebase docs literally say: here's the recommended setup, just use our SDK. But I skipped past that because I thought I knew better.

Before you create a custom event, check the automatic events list. Before you build your own tracking layer, check what the SDK already provides. The boring path — reading the docs, trusting the defaults — is usually the fastest one.

`[B-ROLL: Close-up of hands closing laptop tabs one by one until only Firebase docs remain]`
`[TEXT ON SCREEN: "Read what's already in front of you."]`

## CTA (3:05–3:30)

Sometimes the best engineering decision is to stop engineering. Trust the tool. Remove the extra layer. The full essay walks through every line of setup — Firebase config, event tracking, page views, debugging extensions — all of it. It's on razbakov.com — link below. New one every day. I'll see you tomorrow.

`[END SCREEN: Subscribe + "Read the full essay → razbakov.com"]`

---

## Metadata (paste-ready)

**Title:** I Debugged Analytics for Hours (The Fix Was Deleting Code) | Daily #NNN

**Description (first 2 lines = the hook):**
> I wasted hours debugging analytics because I brought old assumptions into a new tool.
> 3 minutes on why Firebase Analytics already does the work — and when to stop adding things.
>
> Full essay → https://razbakov.com/blog/2020-01-12-vue-google-firebase-analytics
> New essay narrated here every day.

**Tags:** vue analytics, firebase analytics, google analytics app web, vue firebase, gtag vs gtm, vue-gtag, vue-gtm, spa analytics, page view tracking, vue-meta, firebase debugview, quasar framework, pwa analytics, javascript analytics, web development, developer workflow

**Thumbnail:** reuse the essay hero image if one exists; per Julia method, swap to a real photo of Alex once available.
