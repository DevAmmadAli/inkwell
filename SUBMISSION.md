# Submission — Ajaia LLC AI-Native Full Stack Developer Assignment

## Candidate
*(Name here)*

## Live Demo
*(Deploy URL here)*

## Repository
*(GitHub URL here)*

---

## Deliverables

| # | Requirement | Status | Location |
|---|---|---|---|
| 1 | Document creation | ✅ | `src/modules/shell/note-list.tsx` — "New Note" button |
| 2 | Document editing | ✅ | `src/app/notes/[id]/page.tsx` — inline heading + TipTap body |
| 3 | Document renaming | ✅ | `src/app/notes/[id]/page.tsx` — heading input with auto-save |
| 4 | Document deletion | ✅ | `src/modules/shell/note-list.tsx` — trash icon + confirmation dialog |
| 5 | Rich text — bold, italic, underline | ✅ | `src/modules/editor/bubble-toolbar.tsx` |
| 6 | Rich text — headings (H1, H2, H3) | ✅ | `src/modules/editor/bubble-toolbar.tsx` |
| 7 | Rich text — bullet & numbered lists | ✅ | `src/modules/editor/bubble-toolbar.tsx` |
| 8 | File upload (.txt, .md) | ✅ | `src/app/api/ingest/route.ts` — client-side + server parsing |
| 9 | File upload (.docx) | ✅ | `src/app/api/ingest/route.ts` — mammoth.js server-side parsing |
| 10 | Import into existing document | ✅ | `src/modules/ingest/import-dialog.tsx` |
| 11 | Sharing / collaboration system | ✅ | `src/modules/collaboration/collab-dialog.tsx` |
| 12 | User switcher (simulated auth) | ✅ | `src/modules/shell/author-switcher.tsx` — 3 seeded authors |
| 13 | View/edit permission enforcement | ✅ | `src/app/notes/[id]/page.tsx` — read-only mode, toolbar hidden |
| 14 | Permission management (change level) | ✅ | `src/modules/collaboration/collab-dialog.tsx` — reader/writer dropdown |
| 15 | Persistence (survives refresh) | ✅ | PostgreSQL via Prisma — `prisma/schema.prisma` |
| 16 | Zod validation | ✅ | `src/shared/lib/validators.ts` — all API inputs validated |
| 17 | Automated tests | ✅ | `tests/` — 32 tests (Vitest) |
| 18 | Deployment | ✅ | Vercel + Supabase |

---

## Files Included

### Documentation
| File | Purpose |
|---|---|
| `README.md` | Project overview, setup instructions, tech stack |
| `ARCHITECTURE.md` | System design, schema, API reference, decisions |
| `AI_WORKFLOW.md` | How AI was used during development |
| `WALKTHROUGH.md` | Step-by-step demo script for reviewers |
| `SUBMISSION.md` | This file — deliverables checklist |

### Database
| File | Purpose |
|---|---|
| `prisma/schema.prisma` | Author, Note, Collaborator models |
| `prisma/seed.ts` | Seeds 3 demo authors (Maya, Liam, Priya) |

### API Routes
| File | Purpose |
|---|---|
| `src/app/api/notes/route.ts` | GET (list) + POST (create) notes |
| `src/app/api/notes/[id]/route.ts` | GET, PATCH, DELETE single note |
| `src/app/api/notes/[id]/collaborators/route.ts` | POST (add) + DELETE (remove) collaborators |
| `src/app/api/ingest/route.ts` | POST file upload (.txt, .md, .docx) |
| `src/app/api/authors/route.ts` | GET all authors |

### Pages
| File | Purpose |
|---|---|
| `src/app/layout.tsx` | Root layout — Inter font, dark theme, author context |
| `src/app/page.tsx` | Home screen with welcome message |
| `src/app/notes/[id]/page.tsx` | Note editor page |

### Modules
| File | Purpose |
|---|---|
| `src/modules/shell/top-nav.tsx` | Top navigation bar |
| `src/modules/shell/note-drawer.tsx` | Slide-over note list drawer |
| `src/modules/shell/note-list.tsx` | Note listing with create/delete |
| `src/modules/shell/author-switcher.tsx` | Author dropdown switcher |
| `src/modules/shell/shortcuts-dialog.tsx` | Keyboard shortcuts reference |
| `src/modules/editor/editor.tsx` | TipTap editor with auto-save |
| `src/modules/editor/bubble-toolbar.tsx` | Bottom formatting toolbar |
| `src/modules/editor/word-count.tsx` | Live word count badge |
| `src/modules/collaboration/collab-dialog.tsx` | Collaborator management dialog |
| `src/modules/ingest/upload-dialog.tsx` | File upload dialog |
| `src/modules/ingest/import-dialog.tsx` | Import content into existing note |

### Shared
| File | Purpose |
|---|---|
| `src/shared/hooks/use-current-author.tsx` | Author context + localStorage persistence |
| `src/shared/lib/prisma.ts` | Prisma singleton |
| `src/shared/lib/validators.ts` | Zod schemas (createNote, updateNote, addCollaborator) |
| `src/shared/lib/events.ts` | Event emitter for cross-component sync |
| `src/shared/lib/time-ago.ts` | Relative timestamp utility |
| `src/shared/types/index.ts` | TypeScript interfaces (AuthorInfo, NoteInfo, CollaboratorInfo) |
| `src/shared/ui/confirm-dialog.tsx` | Reusable confirmation dialog |

### Tests
| File | Tests | Purpose |
|---|---|---|
| `tests/validators.test.ts` | 16 | All 3 Zod schemas |
| `tests/events.test.ts` | 5 | Event emitter (emit, subscribe, unsubscribe) |
| `tests/permissions.test.ts` | 6 | Access level logic (author, reader, writer) |
| `tests/time-ago.test.ts` | 5 | Relative timestamp formatting |
| **Total** | **32** | |

---

## Tech Stack Summary

- **Next.js 16** — App Router, Turbopack, React 19
- **TypeScript 5** — Strict mode
- **Tailwind CSS v4** — OKLCH dark-first theme (amber/teal)
- **shadcn/ui v4** — base-ui primitives
- **TipTap** — ProseMirror-based rich text (JSON storage)
- **Prisma 5** — PostgreSQL ORM
- **Zod v4** — Runtime validation
- **mammoth.js** — .docx server-side parsing
- **Vitest v2** — 32 automated tests
- **Vercel + Supabase** — Deployment
