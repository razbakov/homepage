---
date: 2026-07-26
slug: livestream-to-content-pipeline
source: blog
source_url: https://razbakov.com/blog/2026-04-11-livestream-to-content-pipeline
channel: "Alösha — Daily (@razbakovdaily)"
format: "AI-avatar narration (HeyGen) + cloned voice (ElevenLabs)"
target_length: "~3:30"
status: draft
generated_at: 2026-07-26T06:30:51.936Z
llm: claude-oauth
---

# Daily — How I Turned a 90-Minute Livestream into 7 Pieces of Content in 20 Minutes

**Source:** https://razbakov.com/blog/2026-04-11-livestream-to-content-pipeline

## Hook (0:00–0:20)

Ninety minutes of livestream. Twenty minutes of AI. Seven pieces of content — and I didn't write a single word. That's not a flex. That's a pipeline. And today I want to show you exactly how it works, because the interesting part isn't the automation. It's what broke.

`[B-ROLL: Screen recording — YouTube Studio showing a livestream with default title, no description, no thumbnail]`
`[TEXT ON SCREEN: 90 min → 7 pieces of content → 20 min]`

## Point 1 — The Pipeline (0:20–1:10)

So here's the setup. I finish a livestream — ninety minutes about AI levels, philosophy, building websites with agents. The recording is just sitting on YouTube. Default title. No description. Nothing.

I take the transcript, paste it into Claude Code, and say: process this.

What comes back? A full blog post in five languages. Twenty-eight YouTube chapter markers with timestamps. An optimized title, description, tags. A custom thumbnail generated from HTML. A hero image from Gemini. All of it committed, uploaded, published.

I didn't outline anything. I didn't plan what content to make. The agent figured that out from the transcript. That's the part that still surprises me — you don't need a content plan. You need a recording and a clear instruction.

`[B-ROLL: Split screen — left side shows raw transcript text, right side shows the outputs appearing one by one: blog post, YouTube metadata, thumbnail, hero image]`
`[TEXT ON SCREEN: Transcript in → 7 content pieces out]`

## Point 2 — What Broke (1:10–2:10)

Now here's where it gets real. The pipeline wasn't clean. Three things broke.

First — the agent invented a URL. Just made up a domain name and linked to it. Across all seven files. A completely fake link that would've gone live if I hadn't caught it.

Second — every single timestamp was wrong. The transcript tool started recording six minutes before the stream went live. So all twenty-eight chapter markers were off by six minutes and thirty-six seconds. The agent actually asked me one question — "what's the first recognizable moment?" I said, "I say hello hello at 6:41." It found that in the transcript, calculated the offset, and recalculated everything. One answer fixed all twenty-eight timestamps.

Third — when I turned the workflow into a reusable skill, the agent hardcoded Telegram chat links directly into the skill file. Config belongs in the project, not in the skill. Skills need to stay generic.

All fixable. All caught in conversation. But this is the point people miss about AI workflows — you still review everything. Trust but verify. Every time.

`[B-ROLL: Close-up of a diff view showing the fake URL being removed across multiple files]`
`[TEXT ON SCREEN: Trust but verify — every time]`

## Point 3 — The Meta Moment (2:10–3:05)

Here's the thing I can't stop thinking about. The livestream was about ten levels of AI — from basic chatbots all the way up to autonomous agents running your business. And then I used Level 5 — orchestrating multiple agents across projects — to process the very recording where I explained it.

The content about AI agents was processed by AI agents. The blog post about finding your ikigai was written while I was living mine.

That's what I mean when I say the tools should disappear. Nobody cares that I have a content pipeline. What matters is the ideas get out into the world. The philosophy remains. The automation just gets out of the way.

And now? I have a single command — `/process-livestream`. Next time I finish a stream, I paste the transcript, run that command, and the whole thing happens again. That's the real unlock. Not doing it once — making it repeatable.

`[B-ROLL: Terminal showing the /process-livestream command executing, with agent tasks completing in sequence]`
`[TEXT ON SCREEN: The tools disappear. The ideas remain.]`

## CTA (3:05–3:30)

If you have a livestream or a talk sitting on YouTube with no description — you're twenty minutes away from fixing that. You don't need my setup. You need a transcript and a clear instruction. The full essay walks through every step, every mistake, every fix. It's on razbakov.com — link below. New one every day. I'll see you tomorrow.

`[END SCREEN: Subscribe + "Read the full essay → razbakov.com"]`

---

## Metadata (paste-ready)

**Title:** I Turned a 90-Min Livestream into 7 Pieces of Content | Daily #NNN

**Description (first 2 lines = the hook):**
> 90 minutes of livestream. 20 minutes of AI. 7 pieces of content — and I didn't write a word.
> Here's the exact pipeline, what broke, and why you still need to review everything agents produce.
>
> Full essay → https://razbakov.com/blog/2026-04-11-livestream-to-content-pipeline
> New essay narrated here every day.

**Tags:** content pipeline, ai agents, livestream repurposing, claude code, content creation, youtube automation, ai workflow, trust but verify, content at scale, repurpose content, ai content, creator tools, learn by doing, solopreneur, ai levels, daily vlog

**Thumbnail:** reuse the essay hero image (10 ascending steps with level icons); per Julia method, swap to a real photo of Alex once available.
