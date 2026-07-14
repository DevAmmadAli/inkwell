# InkWell Demo Walkthrough

Step-by-step guide for reviewers to verify all features.

---

## 1. Initial Load

1. Open the app — you see the InkWell welcome screen with dark theme
2. Click the **InkWell** logo in the top nav — the note drawer slides open
3. The drawer shows "No notes yet" with a PenTool icon

---

## 2. Author Switching

1. In the top nav, see the current author (Maya Chen)
2. Click the author dropdown — see Maya, Liam, Priya
3. Switch to **Liam O'Brien** — the author changes
4. Refresh the page — Liam is still selected (localStorage persistence)
5. Switch back to **Maya Chen**

---

## 3. Note Creation & Editing

1. Click **InkWell** logo to open the drawer
2. Click **New Note** — a new "Untitled Note" is created
3. You're redirected to the note editor
4. Change the heading from "Untitled Note" to "My First Note"
5. Wait ~1 second — see "Saved" indicator appear
6. Click into the editor body — start typing
7. Notice the **word count** badge in the bottom-right corner updating
8. Notice the **relative timestamp** showing "just now" next to the save indicator

---

## 4. Rich Text Formatting

1. Type some text in the editor
2. The **bottom toolbar** shows formatting options (Bold, Italic, Underline, H1-H3, Lists)
3. Select text → click **Bold** — text becomes bold
4. Click **H1** — creates a heading
5. Click **Bullet List** — creates a bulleted list
6. Click **Numbered List** — creates a numbered list
7. All formatting buttons show active state when the cursor is in formatted text

---

## 5. Keyboard Shortcuts

1. Click outside the editor (e.g., on the header area)
2. Press **?** — the keyboard shortcuts dialog opens
3. See all available shortcuts (Ctrl+B, Ctrl+I, etc.)
4. Close the dialog

---

## 6. File Upload

1. Click **Upload File** in the top nav
2. Select a `.txt` file — it appears in the upload dialog
3. Click **Upload & Create Note** — a new note is created with the file content
4. Try with a `.md` file — headings and lists are preserved
5. Try with a `.docx` file — content is extracted via server-side parsing

---

## 7. Import into Existing Note

1. Open an existing note
2. Click the **Import** button in the header
3. Select a file — click **Import Content**
4. The note content is replaced with the imported file content
5. The editor remounts with the new content

---

## 8. Collaboration

1. As **Maya Chen**, open a note you own
2. Click **Collaborate** button
3. See Maya listed as "Author"
4. Click the **+** button next to Liam — he's added as a collaborator with "Can write"
5. Use the dropdown to change Liam's access to **Can read**
6. Switch to **Liam O'Brien** via the author switcher
7. Open the shared note — see "Read only" badge
8. The toolbar is hidden, heading is not editable
9. Switch back to **Maya**, remove Liam's access via the **X** button

---

## 9. Note Deletion

1. Click **InkWell** logo to open the drawer
2. Hover over a note — the trash icon appears
3. Click the trash icon — a confirmation dialog appears
4. Click **Delete** — the note is removed

---

## Feature Checklist

- [x] Note creation
- [x] Note editing (heading + rich text body)
- [x] Note renaming (inline, auto-save)
- [x] Note deletion (with confirmation)
- [x] Rich text: bold, italic, underline
- [x] Rich text: H1, H2, H3
- [x] Rich text: bullet list, numbered list
- [x] File upload (.txt, .md, .docx)
- [x] Import into existing note
- [x] Collaboration (add/remove collaborators)
- [x] Access level management (reader/writer)
- [x] Access enforcement (read-only mode)
- [x] Author switcher with persistence
- [x] Word count
- [x] Relative timestamps
- [x] Keyboard shortcuts dialog
- [x] Zod validation on all API inputs
- [x] 32 automated tests
- [x] Dark-first theme
