# Clearing: a calm app for quitting weed

Clearing tracks your time since your last use and shows **withdrawal symptoms fading away** as progress rings. Every timeline is based on published research, and every claim links to its source.

It's built to be checked once in a while. It has no account, no notifications, no streak-shaming and no paywall. All data stays on your device.

## What's in it

| Tab | What you see |
| --- | --- |
| **Overview** | A Central Coast bluff that follows the real time of day (morning fog, blue midday, dusk, stars) and heals with your streak: bare sand slides grow back over with ice plant, silver sage replaces dried brush, ice plant blooms after a week and turkey vultures arrive after two. It also shows a live counter, overall withdrawal recovery, and four stat tiles: joints not smoked, weed avoided, THC avoided and money saved. |
| **Milestones** | A health timeline of 22 research-backed milestones, such as carbon monoxide cleared, receptors recovering, stored THC halved and a fresh sperm cycle. Reached milestones turn green, and upcoming ones fill a ring. Tap the book to see all sources. |
| **Recovery** | This is the core of the app. 13 withdrawal symptoms each have a ring showing progress through their typical course. Tap one to see its intensity curve with a "you are here" dot, what's happening, and what helps. |

**Small touches that make it rewarding to come back:**

- **Since your last visit.** When you return after a while you get a summary like "Withdrawal recovery 56% → 69%, Shakiness is behind you, 2 new milestones".
- **Rings animate** from where you last saw them to where they are now, so you actually see the progress.
- **Slips are handled kindly.** You can restart the clock without judgement, and your best streak is kept.

## The science

Symptom timings come from the literature on cannabis withdrawal. Onset is usually 1–3 days after the last use and the peak is around days 2–6. Most symptoms are gone within about 2 weeks. Sleep problems and vivid dreams last longest, often 4–7 weeks. The main sources are Budney et al. 2003/2004, Connor et al. 2022 and Gates et al. 2016. Brain receptor recovery follows the PET studies by D'Souza 2016 and Hirvonen 2012.

All 40 sources are listed in `js/data.js` and in the app. Tap any source to look it up (PubMed for journal articles). The rings show the *typical* course and don't measure you personally. This is not medical advice.

## Run it

It's plain HTML/CSS/JS with no build step and no dependencies.

```sh
npm start      # serves on http://localhost:8080
npm test       # unit tests for the timeline/progress logic
```

## Put it on your iPhone

1. Host the folder anywhere with HTTPS. The included workflow deploys to **GitHub Pages** on every push to `main` (enable it under *Settings → Pages → Source: GitHub Actions*).
2. Open the URL in Safari, then tap **Share → Add to Home Screen**.
3. It now opens full-screen like a native app and works offline.

## Files

```
index.html            app shell
css/styles.css        styles (sand-and-fog light theme, night-ocean dark theme)
js/data.js            sources, symptoms, milestones: edit content here
js/logic.js           pure calculations (tested)
js/art.js             SVG landscape, icons, tile illustrations
js/app.js             UI, routing, sheets, storage
sw.js                 offline cache
test/logic.test.js    unit tests
```
