# FreeLex - Free UK Legal Research

FreeLex is a free UK legal research tool that searches 14 official legal sources with one query. Part of the CoSO (Community Support Organisation) suite of legal tools.

**Live URL:** https://freelex.pages.dev
**Repository:** https://github.com/sarahokafor-gif/freelex

## Tech Stack

- **Frontend:** React 18 with Vite
- **Routing:** React Router DOM v6
- **Icons:** Lucide React
- **Authentication:** Firebase Auth (shared with Court Bundle Builder)
- **Hosting:** Cloudflare Pages
- **Backend:** Cloudflare Pages Functions (serverless)
- **Styling:** CSS custom properties (no framework)

## Project Structure

```
freelex/
├── functions/
│   └── api/
│       └── search.js          # Backend search API (Cloudflare Function)
├── src/
│   ├── components/
│   │   ├── Header.jsx         # Navigation with auth state
│   │   ├── Header.css
│   │   ├── Footer.jsx
│   │   └── Footer.css
│   ├── contexts/
│   │   └── AuthContext.jsx    # Firebase auth provider
│   ├── pages/
│   │   ├── HomePage.jsx       # Landing page with search templates
│   │   ├── HomePage.css
│   │   ├── SearchResultsPage.jsx  # Grouped search results
│   │   ├── SearchResultsPage.css
│   │   ├── HelpPage.jsx       # User guide and tips
│   │   ├── HelpPage.css
│   │   ├── LoginPage.jsx      # Firebase login
│   │   ├── RegisterPage.jsx   # Firebase registration
│   │   └── AuthPages.css      # Shared auth styles
│   ├── styles/
│   │   ├── App.css
│   │   └── global.css         # CSS variables and base styles
│   ├── firebase.js            # Firebase configuration
│   ├── App.jsx                # Root component with AuthProvider
│   └── main.jsx               # Entry point
├── package.json
├── vite.config.js
└── wrangler.toml              # Cloudflare configuration
```

## Key Features

### 1. Smart Search with Query Expansion
The search API (`functions/api/search.js`) expands legal abbreviations automatically:
- `MCA` → `"Mental Capacity Act 2005"`
- `MHA 1983` → `"Mental Health Act 1983"`
- `s.3 MCA` → `Section 3 "Mental Capacity Act 2005"`
- `CPR` → `"Civil Procedure Rules"`

Full abbreviation list is in `LEGAL_ABBREVIATIONS` object (~50+ mappings).

### 2. Related Searches
Provides intelligent suggestions based on the query:
- `MCA` suggests: "deprivation of liberty", "best interests", "Court of Protection"
- `MHA` suggests: "section 2 assessment", "nearest relative", "mental health tribunal"

Defined in `RELATED_SEARCHES` object.

### 3. Result Categorization
Results are grouped into sections:
- **Start Here** - Primary legislation (Acts)
- **Key Cases** - Court judgments
- **Official Guidance** - Government guidance documents
- **Forms & Procedures** - Court rules and forms
- **Related Legislation** - Secondary legislation (SIs, regulations)
- **Policy & Decisions** - Government policy documents

Categorization logic is in `categorizeResult()` function.

### 4. Search Templates
Homepage includes pre-built searches for common legal topics:
- Mental Health Detention
- Child Protection
- Housing Disrepair
- Employment Dismissal
- Court of Protection
- Immigration Appeals

### 5. Export Features
- Download results as CSV
- Copy all links to clipboard

### 6. Firebase Authentication
Shared authentication with Court Bundle Builder using the same Firebase project:
- Email/password registration with email verification
- Password reset flow
- Persistent sessions
- One account works across all CoSO apps

## API Endpoint

### `GET /api/search`

**Parameters:**
- `q` (required) - Search query
- `source` (optional) - Filter to specific source, default `all`

**Response:**
```json
{
  "results": [
    {
      "id": 1,
      "title": "Mental Capacity Act 2005",
      "source": "legislation",
      "sourceLabel": "legislation.gov.uk",
      "url": "https://www.legislation.gov.uk/ukpga/2005/9",
      "snippet": "An Act to make new provision...",
      "date": "2005",
      "type": "Legislation",
      "category": "primary-legislation"
    }
  ],
  "relatedSearches": ["deprivation of liberty", "best interests"],
  "query": {
    "original": "mca 2005",
    "expanded": "\"Mental Capacity Act 2005\"",
    "actTitle": "Mental Capacity Act 2005",
    "section": null
  }
}
```

## Data Sources (14 Official Sources)

| Source | API Type | Description |
|--------|----------|-------------|
| legislation.gov.uk | Atom Feed | UK primary and secondary legislation |
| National Archives Case Law | Atom Feed | Court judgments (EWCA, EWHC, etc.) |
| Supreme Court | Atom Feed | UKSC judgments |
| Court Rules (UKSI) | Atom Feed | Statutory instruments, CPR, FPR |
| GOV.UK Guidance | JSON API | Official government guidance |
| UK Parliament Bills | JSON API | Current and recent bills |
| Judiciary.uk | Atom Feed | Practice directions, judicial guidance |
| Law Commission | RSS Feed | Reform proposals and reports |
| BAILII / Tribunals | Atom Feed | Historical cases, tribunal decisions |
| EUR-Lex / Retained EU Law | Atom Feed | EU retained legislation |
| HUDOC (ECHR) | JSON API | European Court of Human Rights |
| GOV.UK Policy | JSON API | Government policy documents |
| LG Ombudsman | HTML Scrape | Local Government Ombudsman decisions |
| Regulators (CQC, ICO, etc.) | JSON API | Regulatory guidance |

## Firebase Configuration

Firebase project: `court-bundle-builder` (shared across CoSO apps)

**Environment Variables Required:**

Firebase config is loaded from environment variables (not hardcoded for security):

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_FIREBASE_MEASUREMENT_ID` | Firebase measurement ID |

**Local Development:**
Copy `.env.example` to `.env.local` and fill in the values.

**Production (Cloudflare Pages):**
Set environment variables in Cloudflare Pages dashboard:
1. Go to Pages > freelex > Settings > Environment variables
2. Add all `VITE_FIREBASE_*` variables
3. Redeploy the site

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name=freelex
```

## Related CoSO Applications

FreeLex shares authentication with these applications:
1. **Court Bundle Builder** - Create court bundles from uploaded documents
2. **Unbundle Docs** - Extract and organize documents from bundles
3. **Drafting App** - Legal document drafting (planned)

All apps use the same Firebase project for unified user accounts.

## CSS Architecture

Uses CSS custom properties defined in `src/styles/global.css`:
- `--color-primary` - Green (#16a34a)
- `--color-primary-dark` - Dark green (#15803d)
- `--space-*` - Spacing scale (xs, sm, md, lg, xl, 2xl)
- `--radius-*` - Border radius scale
- `--shadow-*` - Box shadow scale
- `--font-display` - Inter (headings)
- `--font-body` - Inter (body text)

## Deployment

Deployed to Cloudflare Pages with automatic builds from GitHub.

**Production URL:** https://freelex.pages.dev

The `functions/` directory contains Cloudflare Pages Functions that run as serverless workers. The search API handles CORS and aggregates results from multiple external sources.

## Future Enhancements (Planned)

Per the plan in `.claude/plans/`:
- Saved searches (Cloudflare KV storage)
- Bookmarked results
- Cross-tool integration ("Add to Bundle" buttons)
- Contextual tooltips for first-time users
