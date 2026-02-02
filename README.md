# FreeLex 🏛️

**Free UK Legal Research** — Search legislation, case law, court rules, and guidance from official UK government sources. No subscription required.

## What is FreeLex?

FreeLex is a free, open alternative to expensive legal research databases like LexisNexis and Westlaw. It searches **only official UK government and judicial sources**:

- **legislation.gov.uk** — Acts of Parliament, Statutory Instruments
- **National Archives Case Law** — Court judgments
- **BAILII** — British and Irish Legal Information Institute
- **Supreme Court** — UK Supreme Court decisions
- **Court Rules** — CPR, FPR, COPR, and Practice Directions

## Getting Started

```bash
# Clone the repo
git clone https://github.com/sarahokafor-gif/freelex.git
cd freelex

# Install dependencies
npm install

# Start development server
npm run dev
```

## Deploy to Cloudflare Pages

1. Push to GitHub
2. Go to Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** tab
3. Connect to Git → Select this repo
4. Build settings:
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
5. Deploy!

## Tech Stack

- React 18 + Vite
- React Router
- Lucide React icons
- Cloudflare Pages (hosting)
- Cloudflare Workers (backend API — coming soon)

## Part of the CoSO App Family

FreeLex is a [Chambers of Sarah Okafor](https://www.courtbundlebuilder.co.uk) project, alongside:

- **Court Bundle Builder** — Professional court document organisation
- **Unbundle Docs** — PDF editing, redaction, and splitting

## License

Copyright © 2026 Sarah Okafor. All rights reserved.
