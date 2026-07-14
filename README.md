# InkWell

A collaborative note-taking workspace built with Next.js, featuring rich text editing, file ingestion, and author-based collaboration.

**Live Demo**: *(deploy URL here)*

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI Components | shadcn/ui v4 (base-ui) |
| Styling | Tailwind CSS v4 (OKLCH color system) |
| Rich Text | TipTap (ProseMirror) |
| Database | PostgreSQL (Supabase) |
| ORM | Prisma 5 |
| Validation | Zod v4 |
| File Parsing | mammoth.js (.docx) |
| Testing | Vitest v2 |
| Deployment | Vercel |

---

## Architecture

```
┌─────────────────────────────────────────────┐
│                  Browser                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ Top Nav  │ │  Editor  │ │ Collab Dialog│ │
│  └──────────┘ └──────────┘ └──────────────┘ │
└────────────────────┬────────────────────────┘
                     │ fetch()
┌────────────────────┴────────────────────────┐
│              Next.js API Routes              │
│  /api/notes  /api/ingest  /api/authors       │
│  /api/notes/[id]/collaborators               │
└────────────────────┬────────────────────────┘
                     │ Prisma
┌────────────────────┴────────────────────────┐
│           PostgreSQL (Supabase)               │
│  Author ──< Note ──< Collaborator            │
└─────────────────────────────────────────────┘
```

---

## Project Structure

```
src/
├── app/                    # Next.js pages & API routes
│   ├── api/
│   │   ├── notes/          # CRUD + collaborator management
│   │   ├── ingest/         # File upload & parsing
│   │   └── authors/        # Author listing
│   ├── notes/[id]/         # Note editor page
│   ├── layout.tsx          # Root layout (Inter font, dark theme)
│   └── page.tsx            # Home / welcome screen
├── modules/                # Feature modules
│   ├── shell/              # Top nav, note drawer, author switcher, shortcuts
│   ├── editor/             # TipTap editor, bottom toolbar, word count
│   ├── collaboration/      # Collaborator management dialog
│   └── ingest/             # Upload & import dialogs
├── shared/                 # Cross-cutting concerns
│   ├── hooks/              # useCurrentAuthor context
│   ├── lib/                # prisma, validators, events, time-ago
│   ├── types/              # TypeScript interfaces
│   └── ui/                 # Reusable UI (confirm dialog)
├── components/ui/          # shadcn/ui primitives
└── lib/utils.ts            # cn() utility for shadcn
```

---

## Local Setup

### Prerequisites
- Node.js 20+
- PostgreSQL database (or Supabase)

### Steps

```bash
# 1. Clone and install
git clone <repo-url>
cd inkwell
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your database connection strings

# 3. Push schema to database
npx prisma db push

# 4. Seed demo authors
npx prisma db seed

# 5. Start development server
npm run dev
```

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (pooled) |
| `DIRECT_URL` | Direct PostgreSQL connection (for migrations) |

---

## Running Tests

```bash
npm test          # Run all 32 tests
npm run test:watch  # Watch mode
```

Test coverage:
- **16 validator tests** — createNoteSchema, updateNoteSchema, addCollaboratorSchema
- **5 event tests** — emit, subscribe, unsubscribe
- **6 permission tests** — author/collaborator access level logic
- **5 time-ago tests** — relative timestamp formatting

---

## Demo Authors

| Author | Email |
|---|---|
| Maya Chen | maya@inkwell.dev |
| Liam O'Brien | liam@inkwell.dev |
| Priya Sharma | priya@inkwell.dev |

---

## Key Features

- **Rich text editing** — Bold, italic, underline, H1-H3, bullet/numbered lists via bottom toolbar
- **File ingestion** — Upload .txt, .md, .docx files; import content into existing notes
- **Collaboration** — Add collaborators with reader/writer access levels
- **Author switching** — Switch between demo authors via dropdown
- **Word count** — Live word count badge in editor
- **Relative timestamps** — "2h ago" style time display
- **Keyboard shortcuts** — Press `?` to view all shortcuts
- **Dark-first theme** — Warm amber/teal OKLCH color palette
- **Auto-save** — Content saves 800ms after typing stops

---

## Design Decisions

| Decision | Rationale |
|---|---|
| Module-first structure | Feature modules with co-located components vs flat component folders |
| Bottom toolbar | Toolbar below editor for less visual noise while typing |
| Dark-first theme | OKLCH warm tones for comfortable extended use |
| Top nav + drawer | Notes accessible via slide-over instead of permanent sidebar |
| Author/Note/Collaborator | Domain-specific naming vs generic User/Document/Share |
| reader/writer access | Clearer semantics than view/edit for collaboration |
