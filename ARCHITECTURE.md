# Architecture

## System Overview

InkWell is a monolithic Next.js 16 application using the App Router with server-side API routes and client-side React components. Data flows from PostgreSQL through Prisma ORM to REST API endpoints consumed by React components.

```
┌─────────────────────────────────────────────────────┐
│                    Client (React 19)                  │
│                                                       │
│  TopNav ─── NoteDrawer ─── NoteList                  │
│       └── AuthorSwitcher   └── UploadDialog           │
│                                                       │
│  NotePage ─── NoteEditor (TipTap)                    │
│       ├── CollabDialog                                │
│       ├── ImportDialog                                │
│       ├── WordCount                                   │
│       └── ShortcutsDialog                            │
└──────────────────┬──────────────────────────────────┘
                   │ REST API (fetch)
┌──────────────────┴──────────────────────────────────┐
│              Next.js API Routes (Server)              │
│                                                       │
│  GET/POST    /api/notes                               │
│  GET/PATCH/DELETE  /api/notes/[id]                    │
│  POST/DELETE /api/notes/[id]/collaborators            │
│  POST        /api/ingest                              │
│  GET         /api/authors                             │
└──────────────────┬──────────────────────────────────┘
                   │ Prisma ORM
┌──────────────────┴──────────────────────────────────┐
│              PostgreSQL (Supabase)                     │
│                                                       │
│  Author ──< Note ──< Collaborator                    │
│  (1:N)        (1:N)                                   │
└─────────────────────────────────────────────────────┘
```

---

## Database Schema

### Author
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| name | String | Display name |
| email | String | Unique |
| createdAt | DateTime | Auto |

### Note
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| heading | String | Default: "Untitled Note" |
| body | Json | TipTap JSON content, default: {} |
| authorId | String | FK → Author |
| createdAt | DateTime | Auto |
| updatedAt | DateTime | Auto-updated |

### Collaborator
| Field | Type | Notes |
|---|---|---|
| id | String (cuid) | Primary key |
| noteId | String | FK → Note (cascade delete) |
| authorId | String | FK → Author |
| accessLevel | String | "reader" or "writer", default: "writer" |
| createdAt | DateTime | Auto |
| | | @@unique([noteId, authorId]) |

---

## API Endpoints

| Method | Path | Body | Response |
|---|---|---|---|
| GET | `/api/notes?authorId=` | — | `{ owned: Note[], shared: Note[] }` |
| POST | `/api/notes` | `{ authorId, heading?, body? }` | Created Note |
| GET | `/api/notes/[id]` | — | Note with collaborators |
| PATCH | `/api/notes/[id]` | `{ heading?, body? }` | Updated Note |
| DELETE | `/api/notes/[id]` | — | `{ success: true }` |
| POST | `/api/notes/[id]/collaborators` | `{ authorId, accessLevel? }` | Created Collaborator |
| DELETE | `/api/notes/[id]/collaborators` | `{ authorId }` | `{ success: true }` |
| POST | `/api/ingest` | FormData: file, authorId | Created Note |
| GET | `/api/authors` | — | Author[] |

All POST/PATCH inputs are validated with Zod v4 schemas.

---

## Module Structure

### `modules/shell/`
- **TopNav** — App header with InkWell branding, upload button, author switcher
- **NoteDrawer** — Sheet/slide-over containing the note list
- **NoteList** — Lists owned and shared notes, create/delete actions
- **AuthorSwitcher** — Dropdown to switch active author (persisted in localStorage)
- **ShortcutsDialog** — Keyboard shortcuts reference, triggered by `?` key

### `modules/editor/`
- **NoteEditor** — TipTap wrapper with auto-save (800ms debounce), editable prop
- **BubbleToolbar** — Bottom-attached formatting toolbar with active state
- **WordCount** — Floating word count badge

### `modules/collaboration/`
- **CollabDialog** — Add/remove collaborators, change access levels (reader/writer)

### `modules/ingest/`
- **UploadDialog** — Upload .txt, .md, .docx to create new notes
- **ImportDialog** — Import file content into existing notes

---

## Key Architectural Decisions

| Decision | Rationale |
|---|---|
| Module-first folder structure | Co-locate related components by feature rather than by type |
| Top nav + drawer layout | Maximizes editor viewport; notes accessible on demand |
| Bottom toolbar | Reduces visual clutter above the writing area |
| Author/Note/Collaborator domain model | Semantically meaningful names for the note-taking domain |
| reader/writer access levels | Clearer than view/edit for collaboration context |
| Event emitter for cross-component sync | Lightweight alternative to global state management |
| TipTap JSON storage | Preserves rich text structure without HTML serialization overhead |
| Dark-first OKLCH theme | Modern color system with perceptual uniformity, warm amber/teal palette |
| Inter font | Clean, highly legible typeface optimized for screens |

---

## File Upload Processing

1. Client validates file type (.txt, .md, .docx) and size (< 5MB)
2. Server receives FormData at `/api/ingest`
3. File is parsed based on type:
   - **.txt** → Line-by-line paragraph conversion
   - **.md** → Heading, list, and paragraph detection
   - **.docx** → mammoth.js HTML conversion → TipTap JSON
4. Note is created with parsed content as TipTap JSON body

---

## Security Considerations

- All API inputs validated with Zod schemas
- Authors cannot be added as collaborators on their own notes
- Access level enforcement on client side (read-only mode for readers)
- File size limited to 5MB
- Only .txt, .md, .docx file types accepted
- No authentication (demo app with author switcher)

---

## What Would Be Added With More Time

- Real authentication (NextAuth, Clerk, etc.)
- WebSocket-based real-time collaboration
- Version history / undo
- Note organization (folders, tags)
- Full-text search across notes
- Export to PDF/Markdown
- Mobile-responsive layout
- E2E tests with Playwright
