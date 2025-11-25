# Avelon - Modern IT-Konsult för AI-Eran

En modern, responsiv webbplats för Avelon - din teknologipartner för AI-eran. Hemsidan är byggd med React, Vite, Tailwind CSS och Framer Motion för att leverera en smidig och engagerande användarupplevelse.

## Funktioner

- **Modern Design**: Minimalistisk och clean design med fokus på användarvänlighet
- **Scroll-effekter**: Smooth parallax och fade-in animationer
- **Mobile-first**: Fullt responsiv design som ser bra ut på alla enheter
- **Calendly Integration**: Inbyggd bokningsfunktion för möten
- **SEO-optimerad**: Meta tags och Open Graph för bättre synlighet
- **Performance**: Optimerad för snabb laddning och smooth animationer

## Sektioner

1. **Hero**: Imponerande landningssida med gradient-effekter
2. **Tjänster**: Showcase av era 4 huvudtjänster (Airtable, AI-agenter, Custom Apps, Tech Consulting)
3. **Case Studies**: Portfolio med tidigare projekt och resultat
4. **Om Oss**: Information om företaget, värderingar och team
5. **Blogg**: Senaste artiklar och resurser
6. **Footer**: Kontaktinformation, sociala medier och newsletter

## Teknisk Stack

- **React 18**: Modern UI-bibliotek
- **Vite**: Blixtsnabb build tool och dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Kraftfulla animationer och scroll-effekter
- **React Calendly**: Enkel bokningsintegration

## Kom igång

### Förutsättningar

- Node.js 16+ och npm installerat

### Installation

1. Installera dependencies:
\`\`\`bash
npm install
\`\`\`

2. Starta utvecklingsservern:
\`\`\`bash
npm run dev
\`\`\`

3. Öppna webbläsaren på `http://localhost:5173`

### Bygga för produktion

\`\`\`bash
npm run build
\`\`\`

Produktionsfilerna skapas i `dist/` mappen.

### Preview production build

\`\`\`bash
npm run preview
\`\`\`

## Anpassning

### Uppdatera Calendly URL

1. Öppna `/src/context/CalendlyContext.jsx`
2. Ersätt `'https://calendly.com/your-username/30min'` med din egen Calendly-länk

### Ändra färger

Färgpaletten kan anpassas i `tailwind.config.js` under `theme.extend.colors`.

### Uppdatera innehåll

- **Hero-text**: `/src/components/sections/Hero.jsx`
- **Tjänster**: `/src/components/sections/Services.jsx` - uppdatera `services` arrayen
- **Case Studies**: `/src/components/sections/CaseStudies.jsx` - uppdatera `cases` arrayen
- **Blogg-artiklar**: `/src/components/sections/Blog.jsx` - uppdatera `posts` arrayen
- **Footer-info**: `/src/components/Footer.jsx`

### Byt ut placeholder-bilder

Case Studies och andra sektioner använder Unsplash-bilder. Ersätt dessa med era egna bilder genom att:

1. Lägg bilderna i `/public/images/` mappen
2. Uppdatera `image`-attributet i respektive komponent

## Deployment

### Netlify / Vercel

1. Koppla ditt Git-repo till Netlify eller Vercel
2. Build command: `npm run build`
3. Publish directory: `dist`

### Traditionell hosting

1. Kör `npm run build`
2. Ladda upp innehållet i `dist/` mappen till din webbserver

## Projektstruktur

\`\`\`
src/
├── components/
│   ├── ui/              # Återanvändbara UI-komponenter (Button, Container)
│   ├── sections/        # Sektionskomponenter (Hero, Services, etc)
│   ├── Navbar.jsx       # Navigation
│   ├── Footer.jsx       # Footer
│   └── CalendlyModal.jsx # Bokningsmodal
├── context/
│   └── CalendlyContext.jsx  # Global state för Calendly
├── hooks/
│   └── useCalendly.js   # Custom hook för bokningar
├── styles/
├── utils/
├── App.jsx             # Huvudkomponent
├── main.jsx           # Entry point
└── index.css          # Global styles med Tailwind
\`\`\`

## Nästa steg

- [ ] Ersätt Unsplash-bilder med era egna
- [ ] Uppdatera all copy-text med era egna texter
- [ ] Lägg till er Calendly-URL
- [ ] Lägg till riktiga case studies
- [ ] Koppla newsletter till er email-leverantör
- [ ] Lägg till Google Analytics eller annan analytics
- [ ] Sätt upp ett CMS (som Sanity eller Contentful) för bloggen
- [ ] Lägg till kontaktformulär-backend

## Support

För frågor eller support, kontakta utvecklaren eller öppna ett issue.

## Licens

© 2024 Avelon. Alla rättigheter förbehållna.
