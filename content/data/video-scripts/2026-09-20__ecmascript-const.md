---
date: 2026-09-20
slug: ecmascript-const
source: blog
source_url: https://razbakov.com/blog/2018-06-29-ecmascript-const
channel: "Alösha — Daily (@razbakovdaily)"
format: "AI-avatar narration (HeyGen) + cloned voice (ElevenLabs)"
target_length: "~3:30"
status: draft
generated_at: 2026-09-20T06:30:51.125Z
llm: claude-oauth
---

# Daily — ECMAScript const objects are references

**Source:** https://razbakov.com/blog/2018-06-29-ecmascript-const

## Hook (0:00–0:20)

`const` doesn't mean constant. I know — the name is literally "const." But in JavaScript, it's lying to you. It's not protecting the value. It's protecting the *label*. And that one misunderstanding has probably caused more bugs than any typo ever could.

`[B-ROLL: Screen recording — declaring a const object, then mutating a property inside it. No error.]`
`[TEXT ON SCREEN: const ≠ constant]`

## Point 1 — The Name Is a Lie (0:20–1:10)

Here's what `const` actually does. It creates a read-only *reference*. Not a read-only *value*. Think of it like a name tag glued to a box. You can't peel the tag off and stick it on a different box — that's the "no rebinding" part. But you can open the box and swap out everything inside it.

So when you write `const user = { name: "Alex" }`, you can't reassign `user` to something else. But `user.name = "Bob"`? Totally fine. JavaScript won't even blink. The variable identifier is locked. The contents? Wide open.

This is what Mathias Bynens nailed years ago: `const` makes a contract that no *rebinding* will happen. That's the whole contract. Nothing more.

`[B-ROLL: Whiteboard animation — a name tag glued to a box, hand reaches in and swaps items inside]`
`[TEXT ON SCREEN: "const = no rebinding, not no mutation"]`

## Point 2 — Why This Matters More Than You Think (1:10–2:10)

Now you might say — okay, fine, technically interesting. But does it matter day to day? Yes. Because when you believe `const` means immutable, you stop thinking about mutation. You see `const` at the top of a function and you relax. You assume nothing downstream is going to change that object. And then something does. And you spend two hours debugging something that was never actually protected.

This is a language design problem, honestly. The keyword *sounds* like a guarantee it doesn't deliver. Marius Schulz put it well — it's "one-time assignment." Not "one-time value." That's a subtle but critical distinction.

If you actually want immutability, you need `Object.freeze`. Or you reach for a library like Immer. Or you adopt patterns where you never mutate — you always create new objects. But `const` alone? It's a seatbelt that only works on the driver's seat while the passengers do whatever they want.

`[B-ROLL: Split screen — left side shows "const" with a green checkmark, right side shows object properties changing freely]`
`[TEXT ON SCREEN: "Want real immutability? Object.freeze()"]`

## Point 3 — The Deeper Lesson (2:10–3:05)

Here's the thought I keep coming back to. This isn't just a JavaScript quirk. It's a reminder that naming things is genuinely hard — and names shape how we think. When a language gives you a keyword called `const`, your brain fills in the rest. Constant. Fixed. Immutable. Done. But the machine doesn't care about your assumptions. It only cares about the spec.

I think this applies beyond code, too. We do this with labels all the time — in work, in relationships, in how we describe ourselves. We hear a word and assume the full contract. But the contract is always narrower than the name suggests. Read the fine print. In JavaScript and in life.

`[B-ROLL: Close-up of hands typing, then pulling back to a wider shot — Alex at desk, reflective]`
`[TEXT ON SCREEN: "Names shape assumptions. Read the spec."]`

## CTA (3:05–3:30)

So — `const` is a reference lock, not a value lock. Know what your tools actually promise, not what their names imply. The full essay is on razbakov.com — link below. New one every day. I'll see you tomorrow.

`[END SCREEN: Subscribe + "Read the full essay → razbakov.com"]`

---

## Metadata (paste-ready)

**Title:** const doesn't mean constant | Daily #NNN

**Description (first 2 lines = the hook):**
> `const` in JavaScript is lying to you — it protects the label, not the value.
> 3 minutes on why this one misunderstanding causes so many bugs.
>
> Full essay → https://razbakov.com/blog/2018-06-29-ecmascript-const
> New essay narrated here every day.

**Tags:** javascript, ecmascript, const, immutability, object freeze, javascript basics, web development, coding tips, es6, es2015, javascript gotchas, programming, developer mindset, const vs let, mutation, reference types

**Thumbnail:** reuse the essay hero image if one exists; per Julia method, swap to a real photo of Alex once available.
