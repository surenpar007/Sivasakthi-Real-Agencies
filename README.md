# Sivasakthi Real Agencies — website

A fast, static website. No server, database or monthly software needed. Any web host can serve it.

## What's inside

| File | What it is |
|---|---|
| `index.html` | Home: monsoon-to-golden-hour land hero, featured land, 3D plot map, document checklist, contact |
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

1. **Domain — done.** The site is live at https://sivasakthirealagencies.in. Canonical links, social-share URLs, `sitemap.xml` and `robots.txt` use it; `www.` redirects to the bare domain and HTTPS is forced. Next: add the site to Google Search Console and submit `sitemap.xml`.
2. **Real listings.** Open `assets/js/data.js` and replace the sample properties with your real ones. Then set `showSampleNote: false`.
3. **Real photos.** The current photos are AI-generated previews. Put your own photos in `assets/img/` (WebP or JPG, about 1600 px wide for big images, 960 px for cards) and use the file name (without extension) in `data.js`. If you use `.jpg`, also change `.webp` to `.jpg` in `core.js` where cards are built, or convert your photos to WebP at squoosh.app.
4. **Layout plan.** In `data.js` → `plan`, set the layout name, place, rate per sq.ft, and each plot's size and `status` (`a` available, `b` booked, `s` sold). The plot of the week (KC-09) text is in `index.html`.
5. **RERA number** (optional): add it to the footer in each page if you want it shown.

## Offers

The Deepavali offer cards come from `projects` in `data.js` (name, location, old and offer rate per sq.ft, total area, poster image). The same two projects are also at the top of `properties` so they appear in the listings. When the offer ends, change the rates or remove them, and remove the floating "Deepavali offer" pill by deleting the `offer-pill` link in each page (or ask your developer).

## How to put it online

Pick one:

- **Netlify (free, easiest):** go to app.netlify.com → *Add new site* → *Deploy manually* → drag this whole folder in. Then *Domain settings* → add your domain and follow the DNS steps.
- **Hostinger / GoDaddy / any cPanel host:** open *File Manager* → `public_html` → upload everything in this folder (keep the `assets` folder structure).
- **GitHub Pages / Cloudflare Pages / Vercel:** push the folder to a repository and connect it. No build step is needed.

After it is live:
- Add the site to **Google Search Console** and submit `sitemap.xml`.
- Create or update your **Google Business Profile** with the same name, phone and address, and add the website link. This matters most for local search ("plots in Villupuram").

## How enquiries reach you

There is no email server. Every enquiry button (property cards, plot map "Hold this plot", the sell form) opens **WhatsApp to 95851 78509** with the message already typed, so customers only press send. To change the number, edit `whatsapp` in `data.js` and the `wa.me/919585178509` links in the HTML files.

## Technical notes

- No third-party requests at all. Motion is plain JavaScript and CSS; fonts are self-hosted in `assets/fonts/` (subset, preloaded).
- Every CSS, JS and image link carries `?v=<version>`, so browsers and the Hostinger CDN always get the newest files after a deploy.
- PageSpeed Insights on the live site (1 Nov 2026), mobile: Home 95–96, Land 96, Sell 94, Contact 98; desktop Home 98. Accessibility, Best Practices and SEO 100 on every page.
- Animations only run while their section is on screen, and stop when the phone is idle.
- Images are WebP with a 960 px version for phones; images below the first screen load after the page is ready.
- It respects "reduce motion" settings, has a skip link, keyboard-usable menu and plot map, and alt text on images.
- Structured data (`RealEstateAgent`, and `FAQPage` on the contact page) is included so Google can show your business details.
- `.htaccess` turns on compression, browser caching, security headers and the 404 page on Hostinger.
