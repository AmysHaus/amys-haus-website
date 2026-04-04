# Amy's Haus — Website

Boutique hospitality experience consulting site for amys-haus.com.

## Stack
- **Hosting**: Vercel
- **CMS**: Sanity (services + journal posts)
- **Media**: Cloudinary
- **Forms**: Resend (contact form)
- **Email marketing**: Kit
- **Booking**: Calendly embed
- **Repo**: GitHub

## Fonts
Saigon font family (all weights) — files in `/public/fonts/`
Work Sans — loaded from Google Fonts

## Colours
| Token | Hex | Use |
|---|---|---|
| `--chocolate` | `#563433` | Primary brand |
| `--chocolate-deep` | `#3d2524` | Hover, footer |
| `--cream` | `#F5F0EA` | Light backgrounds |
| `--cream-mid` | `#E8DDD0` | Alternate light sections |
| `--gold` | `#C4956A` | Accent, hover states |
| `--white` | `#FFFFFF` | Text on dark, cards |
| `--ink` | `#1A1A1A` | Body text on light |

## Project Structure

```
amys-haus/
├── index.html              ← Homepage
├── pages/
│   ├── about.html
│   ├── work-with-me.html
│   ├── journal.html
│   └── contact.html
├── css/
│   ├── global.css          ← Design tokens, nav, footer, utilities
│   └── home.css            ← Homepage-specific styles
├── js/
│   └── main.js             ← Nav scroll, reveal animations, mobile menu
├── public/
│   ├── fonts/              ← Saigon .otf files
│   ├── images/             ← Static images (replace with Cloudinary URLs)
│   └── AmysHausLogo.svg
├── sanity/
│   └── schemas/
│       ├── service.js      ← Service tier schema
│       ├── journalPost.js  ← Journal post schema
│       └── index.js
└── vercel.json

```

## Sanity Setup

1. `npm create sanity@latest` in a new `/studio` folder
2. Point dataset to Amy's Sanity project
3. Import schemas from `/sanity/schemas/`
4. Add first 3 service documents in order: Haus Walk, Full Refresh, Partnership

## Image Swap Checklist

Images currently using Unsplash placeholder URLs — swap these for Cloudinary URLs once uploaded:

- `index.html` → hero background image
- `index.html` → solution section image
- `index.html` → haus-walk section image
- `index.html` → Amy photo (id="amy-photo") — awaiting Amy's actual photo

## Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables:
   - `SANITY_PROJECT_ID`
   - `SANITY_DATASET`
   - `RESEND_API_KEY`

## Calendly

Add Calendly embed to contact page once Amy's account is set up:
```html
<div class="calendly-inline-widget" data-url="https://calendly.com/amys-haus/discovery-call" style="min-width:320px;height:630px;"></div>
<script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
```
