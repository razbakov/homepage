---
date: 2026-09-14
slug: google-ads-php
source: blog
source_url: https://razbakov.com/blog/2020-07-30-google-ads-php
channel: "Alösha — Daily (@razbakovdaily)"
format: "AI-avatar narration (HeyGen) + cloned voice (ElevenLabs)"
target_length: "~3:30"
status: draft
generated_at: 2026-09-14T06:32:05.857Z
llm: claude-oauth
---

# Daily — Google Ads API with PHP

**Source:** https://razbakov.com/blog/2020-07-30-google-ads-php

## Hook (0:00–0:20)

Three days. That's how long it took me to make one API call to Google Ads. One. The official docs had a video that talked *about* the steps instead of walking you *through* them. So I wrote the guide I wish existed — five steps, zero confusion.

`[B-ROLL: Screen recording scrolling through Google's "Make Your First API Call" docs, then closing the tab in frustration]`
`[TEXT ON SCREEN: "3 days for 1 API call."]`

## Point 1 — The real problem with Google's docs (0:20–1:10)

Here's what nobody tells you upfront. You can't just sign up for the Google Ads API with your regular account. You need a Manager Account — a completely separate thing. And it has to be a *different* email than your existing Google Ads account. Already confusing, right? Then inside that Manager Account, you go to Tools & Settings, then Setup, then API Center — which, by the way, only shows up for Manager Accounts. So if you're staring at your dashboard wondering where the API option is… that's why. You haven't created the right kind of account yet. Step one is just getting to the starting line, and Google buries it.

`[B-ROLL: Screen recording navigating Google Ads Manager Account → Tools & Settings → API Center]`
`[TEXT ON SCREEN: "Manager Account ≠ regular Google Ads account"]`

## Point 2 — The test account trap (1:10–2:10)

Now it gets interesting. You need a *test* manager account too — a sandbox so you don't mess with real campaigns. But here's the catch: you need a *third* Google account for this. One that isn't linked to your production manager account. So we're three accounts deep and we haven't written a single line of code. Then you create OAuth credentials in the Google API Console — project, consent screen, client ID, client secret. Desktop Application type, not web. That trips people up. And *then* you run a PHP script to generate a refresh token. You paste your client ID and secret into a config file. Only after all of that — manager account, test account, OAuth credentials, refresh token — can you actually call the API. Four layers of configuration before "hello world."

`[B-ROLL: Split screen showing three different Google login screens side by side, then the OAuth consent screen setup flow]`
`[TEXT ON SCREEN: "4 layers of config before hello world"]`

## Point 3 — When it finally works (2:10–3:05)

Once you have that `adsapi_php.ini` file set up, the actual code part is almost anticlimactic. Composer install, drop in the config, download the GetCampaigns example, fix one require path, run it. No errors. That's it. And suddenly you can do conversion tracking, campaign management, all of it. The wall wasn't the code — it was the configuration maze. I wrote every step down, with screenshots, so you don't burn three days like I did. Oh, and one more thing — be very careful with datetime formats. That one bit me too.

`[B-ROLL: Terminal running `composer require googleads/googleads-php-lib`, then `php GetCampaigns.php` with clean output — no errors]`
`[TEXT ON SCREEN: "The wall isn't the code. It's the config."]`

## CTA (3:05–3:30)

The full five-step guide with screenshots and every link you need is on razbakov.com — link below. New one every day. I'll see you tomorrow.

`[END SCREEN: Subscribe + "Read the full essay → razbakov.com"]`

---

## Metadata (paste-ready)

**Title:** I Spent 3 Days on One API Call | Daily #NNN

**Description (first 2 lines = the hook):**
> Three days to make one Google Ads API call. The docs were useless.
> In 3 minutes: the 5-step setup guide I wish existed — manager accounts, OAuth, refresh tokens, all of it.
>
> Full essay → https://razbakov.com/blog/2020-07-30-google-ads-php
> New essay narrated here every day.

**Tags:** google ads api, php, googleads-php-lib, api tutorial, google ads manager account, oauth2 refresh token, developer token, google api console, adwords api, php composer, api configuration, google ads php, developer setup, api first call, coding tutorial, web development

**Thumbnail:** reuse the essay hero image if one exists; per Julia method, swap to a real photo of Alex once available.
