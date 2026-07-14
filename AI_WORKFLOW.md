# AI-Assisted Development Workflow

## Overview

InkWell was developed using AI-assisted pair programming with Claude (Anthropic). The AI served as an implementation partner — generating code, suggesting architecture decisions, and debugging issues — while all design choices and quality decisions were made by the developer.

---

## Development Phases

### Phase 1: Architecture & Planning
- Designed module-first project structure (`modules/` + `shared/`)
- Chose domain model: Author → Note → Collaborator
- Planned dark-first OKLCH theme with warm amber/teal palette
- Selected top-nav + drawer layout over traditional sidebar

### Phase 2: Foundation
- Next.js 16 setup with App Router and Turbopack
- Prisma 5 schema with Author/Note/Collaborator models
- shadcn/ui v4 component installation
- Inter font configuration, dark theme globals

### Phase 3: Core CRUD
- REST API routes for notes (`/api/notes`, `/api/notes/[id]`)
- Zod v4 validation schemas (createNoteSchema, updateNoteSchema)
- Note list with create/delete and confirmation dialog
- Author switcher with localStorage persistence

### Phase 4: Rich Text Editor
- TipTap integration with StarterKit + Underline extension
- Bottom-attached formatting toolbar (different from typical top toolbar)
- Auto-save with 800ms debounce
- Read-only mode for reader access level

### Phase 5: File Ingestion
- Upload API at `/api/ingest` supporting .txt, .md, .docx
- mammoth.js for server-side .docx parsing
- Import dialog for replacing existing note content
- 5MB file size limit with type validation

### Phase 6: Collaboration
- Collaborator management via `/api/notes/[id]/collaborators`
- CollabDialog with per-user loading states
- reader/writer access level enforcement
- Event emitter pattern for cross-component note list sync

### Phase 7: UX Polish
- Word count badge in editor
- Relative timestamps (`timeAgo` utility)
- Keyboard shortcuts dialog (press `?`)
- Top navigation with slide-over note drawer

### Phase 8: Testing & Verification
- 32 automated tests (Vitest v2)
- Validator, event emitter, permission, and time-ago tests
- Build verification with Turbopack

---

## AI-Assisted Decisions

| Decision | AI Contribution |
|---|---|
| Module structure | Suggested `modules/` + `shared/` pattern for feature isolation |
| OKLCH color system | Generated warm amber (hue 55-85) and teal (hue 165) palette values |
| TipTap JSON storage | Recommended JSON over HTML for content persistence |
| Event emitter | Proposed lightweight pub/sub over React context for sidebar sync |
| Zod v4 imports | Identified `zod/v4` import path requirement |
| Prisma v5 | Identified Node.js 20.11 compatibility constraint |

---

## What Worked Well

- **Rapid prototyping** — AI generated boilerplate code for API routes and components quickly
- **Schema design** — AI translated domain model requirements into Prisma schema efficiently
- **Bug identification** — AI caught potential issues like empty JSON content handling early
- **Test generation** — AI produced comprehensive test cases covering edge cases

## What Needed Human Intervention

- **Design taste** — Color palette tuning, layout decisions, UX flow
- **Architecture choices** — Module structure, API naming conventions
- **Integration testing** — Manual verification of full user flows
- **Deployment configuration** — Environment-specific settings
