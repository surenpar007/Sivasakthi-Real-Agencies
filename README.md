# Sivasakthi Real Agencies — website

Live files for the Sivasakthi Real Agencies website (Villupuram). Static HTML, CSS and JavaScript: no build step, no database.

A fast, static website. No server, database or monthly software needed. Any web host can serve it.

## What's inside

| File | What it is |
|---|---|
| `index.html` | Home: sunset-to-drone land hero, Deepavali offers, featured land, plot of the week, layout gallery, document checklist, contact |
| `properties.html` | All land for sale with filters (`properties.html?type=plot`, `farm`, `commercial`, `home`), plot loan EMI calculator, FAQ |
| `sell.html` | For owners selling land: process + form that opens WhatsApp with their details |
| `contact.html` | Phones, WhatsApp, office address with Google Maps link, FAQ |
| `404.html` | Page-not-found screen |
| `assets/js/data.js` | **All listings, phone numbers and the plot map. Edit this file to update the site.** |
| `assets/css/main.css` | All styles |
| `assets/js/core.js` | Menu, smooth scroll, listings, filters, forms, EMI |
| `assets/js/hero.js` | Home hero: sunset road → drone rise → corner plot survey → top-down plan; "Built before you buy" callouts |
| `assets/js/scenes.js` | Plot of the week, sideways layout gallery, dream-home reveal, night closing with light trails and fireflies |
| `assets/js/offers.js` | Deepavali offer section (cards built from `projects` in data.js), poster viewer, festive lights |
| `assets/js/plan.js` | Clickable top-down layout plan on the Land page (uses `plan` in data.js) |
| `assets/img/` | Images (WebP), logo, favicons, social share image |

## Before going live (10 minutes)

1. **Your domain.** Search all files for `YOUR-DOMAIN.in` and replace it with your real domain (for example `sivasakthirealagencies.in`). It appears in the `<head>` of each page, `sitemap.xml` and `robots.txt`.
2. **Real listings.** Open `assets/js/data.js` and replace the sample properties with your real ones. Then set `showSampleNote: false`.
3. **Real photos.** The current photos are AI-generated previews. Put your own photos in `assets/img/` (WebP or JPG, about 1600 px wide for big images, 960 px for cards) and use the file name (without extension) in `data.js`. If you use `.jpg`, also change `.webp` to `.jpg` in `core.js` where cards are built, or convert your photos to WebP at squoosh.app.
4. **Layout plan.** In `data.js` → `plan`, set the layout name, place, rate per sq.ft, and each plot's size and `status` (`a` available, `b` booked, `s` sold). The plot of the week (KC-09) text is in `index.html`.
5. **RERA number** (optional): add it to the footer in each page if you want it shown.

## Offers

The Deepavali offer cards come from `projects` in `data.js` (name, location, old and offer rate per sq.ft, total area, poster image). The same two projects are also at the top of `properties` so they appear in the listings. When the offer ends, change the rates or remove them, and remove the floating "Deepavali offer" pill by deleting the `offer-pill` link in each page (or ask your developer).

## How to put it online

Pick one:

- **Netlify (free, easiest):** go to app.netlify.com → *Add new site* → *Deploy manually* → drag this whole folder in. Then *Domain settings* → add your domain and follow the DNS steps.
- **Hostinger with GitHub (recommended, auto-updates):** hPanel → *Websites* → *Manage* → *Advanced* → *Git*. Repository: `https://github.com/surenpar007/Sivasakthi-Real-Agencies.git`, branch `main`, install path: leave empty (deploys to `public_html`). Click *Create*, then *Deploy*. Turn on *Auto Deployment* and add the webhook URL it shows to GitHub → repo *Settings* → *Webhooks* so every push goes live automatically. `public_html` must be empty before the first deploy (delete Hostinger's default `default.php`).
- **Hostinger without Git:** *File Manager* → `public_html` → upload everything in this folder (keep the `assets` folder structure, include `.htaccess`).
- **GitHub Pages / Cloudflare Pages / Vercel:** push the folder to a repository and connect it. No build step is needed.

After it is live:
- Add the site to **Google Search Console** and submit `sitemap.xml`.
- Create or update your **Google Business Profile** with the same name, phone and address, and add the website link. This matters most for local search ("plots in Villupuram").

## How enquiries reach you

There is no email server. Every enquiry button (property cards, plot map "Hold this plot", the sell form) opens **WhatsApp to 95851 78509** with the message already typed, so customers only press send. To change the number, edit `whatsapp` in `data.js` and the `wa.me/919585178509` links in the HTML files.

## Technical notes

- Libraries load from public CDNs with fixed versions: GSAP 3.12.2, Lenis 1.0.42, three.js r128, Google Fonts.
- The site works without them too: if a CDN is blocked, content, links and forms still work; only the motion is skipped.
- It respects "reduce motion" settings, has a skip link, keyboard-usable menu and plot map, and alt text on images.
- Structured data (`RealEstateAgent` and `FAQPage`) is included so Google can show your business details.
