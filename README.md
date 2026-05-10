# SumX Dashboard

A clean, responsive dashboard with a fully editable data table. Built with Next.js, Tailwind CSS, ShadCN UI, and TanStack Table v8.

## Getting Started

1. **Clone the repo** (if needed):
   ```bash
   git clone <repository-url>
   cd sumx-fe
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the dev server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) and head to `/dashboard`.

## Tech Choices

- **Next.js (App Router)** — solid foundation for routing and rendering without much overhead.
- **Tailwind CSS** — keeps styling fast to write and easy to maintain.
- **ShadCN UI** — accessible components built on Radix primitives; easy to customize without fighting the library.
- **TanStack Table v8** — headless table library that gives full control over markup and styling while handling sorting, filtering, and pagination under the hood.
- **React Hook Form + Zod** — form state and validation for editable cells. Zod handles things like email format checks and required fields before a save goes through.
- **Lucide React** — lightweight, consistent icons.

## Tradeoffs

**Client-side data operations** — sorting, filtering, and pagination all run in the browser right now. It's fast and keeps things simple, but would need to move server-side if the dataset grows large.

**Custom editable table** — rather than dropping in a heavy grid library like AG Grid, we built an edit layer on top of TanStack Table. It took more work upfront (edit modes, focus handling, form wiring) but keeps the bundle lean and gives us full control over how things look and behave.

**Mock data** — everything runs off local state and a `mockData.js` file for now. Good for demos and local development, but a real backend would need proper handling for async saves, optimistic updates, and error states.

## What I'd Improve with More Time

1. **Real backend + server-side pagination** — move sorting, filtering, and pagination to the API so large datasets don't bog down the browser.
2. **Row virtualization** — use `@tanstack/react-virtual` to render only the visible rows, which would make the table much more performant at scale.
3. **Bulk actions** — checkboxes for multi-select, bulk delete, bulk status changes. Also undo/redo for edits would be a nice quality-of-life addition.
4. **Tests** — unit tests for utilities (Vitest), component tests (React Testing Library), and end-to-end flows (Playwright).
5. **Better accessibility** — keyboard navigation through editable cells needs more work, and screen reader support for edit mode and validation errors could be improved.
6. **Optimistic UI** — once wired to a real API, updates should feel instant rather than waiting on the network response.
