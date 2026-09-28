# Clearing: a calm app for quitting weed

Clearing tracks your time since your last use and shows **withdrawal symptoms fading away** as progress rings. Every timeline is based on published research, and every claim links to its source.

It's built to be checked once in a while. It has no account, no notifications, no streak-shaming and no paywall. All data stays on your device.

## What's in it

| Tab | What you see |
| --- | --- |
| **Overview** | Days since your last use inside a deco sunburst whose ticks light up with overall recovery, the current withdrawal phase, the next symptoms due to go, and a ledger of joints, weed, THC and money not spent. |
| **Milestones** | The core of the app: 20 negative effects, each with a plain one-line cause on the card. 12 are **caused by quitting** (withdrawal: short temper, can't sleep, cravings…) and 8 are **caused by regular use** (foggy memory, needing weed to feel normal, low drive, smoker's cough…). Each ring fills over that effect's typical course from the studies; when it's over, the card gets stamped GONE. |
| **Timeline** | 20 dated body-and-brain events in plain language (carbon monoxide cleared, half the stored THC gone, THC receptors back to normal…). |

Returning after a while shows what changed since your last visit, and rings animate from where you last saw them. A slip resets the clock and keeps your longest streak.

## Design

Earthy mid-century modern with art deco linework: paper and ink, one brass accent for progress, and vermilion only for the GONE stamp and the "today" marker. Type is Antonio (condensed display) and Jost (geometric, Futura-like), self-hosted under the SIL Open Font License so the app works offline. Light and dark follow the phone's setting.

## The science

Symptom timings come from the literature on cannabis withdrawal. Onset is usually 1–3 days after the last use and the peak is around days 2–6. Most symptoms are gone within about 2 weeks. Sleep problems and vivid dreams last longest, often 4–7 weeks. The main sources are Budney et al. 2003/2004, Connor et al. 2022 and Gates et al. 2016. Brain receptor recovery follows the PET studies by D'Souza 2016 and Hirvonen 2012.

All 43 sources are listed in `js/data.js` and in the app. Tap any source to look it up (PubMed for journal articles). The rings show the *typical* course and don't measure you personally. This is not medical advice.

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
css/styles.css        styles (paper/ink light theme, espresso dark theme)
js/data.js            sources, symptoms, milestones: edit content here
js/logic.js           pure calculations (tested)
js/art.js             line symbols and the sunburst dial
fonts/                Antonio + Jost (OFL)
js/app.js             UI, routing, sheets, storage
sw.js                 offline cache
test/logic.test.js    unit tests
```
