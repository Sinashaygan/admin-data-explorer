# Admin Data Explorer

A production-oriented admin dashboard for exploring, filtering, and managing large sets of e-commerce orders.

The project is designed around a feature-based architecture with a clear separation between UI, domain logic, data access, URL state, and client-side server-state management.

---

## Tech Stack

<p align="left">
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-16.3.0-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://mui.com/">
    <img src="https://img.shields.io/badge/MUI-9.3.1-007FFF?style=for-the-badge&logo=mui&logoColor=white" alt="Material UI" />
  </a>
  <a href="https://tanstack.com/query">
    <img src="https://img.shields.io/badge/TanStack_Query-5.101.4-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="TanStack Query" />
  </a>
  <a href="https://supabase.com/">
    <img src="https://img.shields.io/badge/Supabase-2.112.3-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </a>
  <a href="https://recharts.org/">
    <img src="https://img.shields.io/badge/Recharts-3.10.1-22B5BF?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Recharts" />
  </a>
  <a href="https://zod.dev/">
    <img src="https://img.shields.io/badge/Zod-4.4.3-3E67B1?style=for-the-badge&logo=zod&logoColor=white" alt="Zod" />
  </a>
  <a href="https://react-hook-form.com/">
    <img src="https://img.shields.io/badge/React_Hook_Form-7.85.0-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white" alt="React Hook Form" />
  </a>
</p>

### Core Technologies

- **Next.js 16** — Application framework and routing
- **React 19** — UI development
- **TypeScript** — Static typing and domain contracts
- **MUI** — UI components and theming
- **MUI X Data Grid** — High-performance data table
- **TanStack Query** — Server-state management and caching
- **Supabase** — Database and data access layer
- **Zod** — Runtime validation and schema parsing
- **Recharts** — Dashboard data visualization
- **React Hook Form** — Form state management
- **Notistack** — User notifications

---

## Features

### Orders Data Explorer

- Server-side pagination
- Server-side sorting
- Search by order information
- Status filtering
- Date range filtering
- URL-driven table state
- Debounced search filters
- Order status management
- Optimistic status updates
- Automatic rollback after mutation failure
- Loading, error, and empty states
- MUI X Data Grid integration

### Bulk Operations

- Row selection using checkboxes
- Selection state management
- Export selected orders as CSV
- Bulk status update
- Clear selected rows
- Selection limited to orders loaded on the current server-side page

### Dashboard Summary

- Total orders
- Total revenue
- Pending and processing order count
- Status distribution chart
- Revenue grouped by order status
- Responsive chart layout
- Summary based on the currently loaded and filtered dataset

### Data and UX

- URL as the source of truth for filter, sorting, and pagination state
- Client-side debounce for search inputs
- Server-side data fetching
- TanStack Query cache management
- Server-side prefetching
- Hydration using `HydrationBoundary`
- Optimistic UI updates
- Rollback on failed mutations
- Responsive admin interface
- Clear empty and loading states

---

## Architecture

The project follows a feature-based architecture.

The main goal is to keep UI components independent from infrastructure details such as Supabase queries and database implementation.
```text
src/
├── app/
│   ├── api/
│   │   └── orders/
│   │       └── [orderId]/
│   │           └── status/
│   │               └── route.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── features/
│   └── orders/
│       ├── api/
│       │   ├── orders.client.ts
│       │   └── orders.repository.ts
│       │
│       ├── components/
│       │   ├── GridError.tsx
│       │   ├── GridOverlays.tsx
│       │   ├── GridToolbar.tsx
│       │   ├── OrdersBulkActions.tsx
│       │   ├── OrdersFilters.tsx
│       │   ├── OrdersGrid.tsx
│       │   ├── OrdersStatusMenu.tsx
│       │   └── OrdersSummary.tsx
│       │
│       ├── hooks/
│       │   ├── useDebouncedValue.ts
│       │   ├── useOrderFilters.ts
│       │   ├── useOrders.ts
│       │   └── useUpdateOrderStatus.ts
│       │
│       ├── model/
│       │   ├── order-summary.mapper.ts
│       │   ├── order-url.mapper.ts
│       │   ├── order.constants.ts
│       │   ├── order.defaults.ts
│       │   ├── order.query-mapper.ts
│       │   └── order.types.ts
│       │
│       └── schemas/
│
├── lib/
│
├── providers/
│   └── ReactQueryProvider.tsx
│
├── shared/
│   └── csv-helper.ts
│
└── theme/

### Directory Responsibilities

| Directory | Responsibility |
|---|---|
| `app` | Next.js routes, layouts, API route handlers, and application entry points |
| `features/orders` | All order-related business functionality |
| `features/orders/api` | Client API functions and repository implementation |
| `features/orders/components` | Order-specific UI components |
| `features/orders/hooks` | Client-side hooks for queries, filters, and mutations |
| `features/orders/model` | Domain types, constants, defaults, mappers, and data transformations |
| `features/orders/schemas` | Runtime validation schemas |
| `providers` | Application-level providers such as TanStack Query |
| `shared` | Reusable utilities that are not specific to the Orders feature |
| `theme` | MUI theme and design-system customization |

---

## Data Flow

The order data flow follows this general path:

text
URL Search Params
│
▼
Order URL Mapper
│
▼
Validated Order Filters
│
▼
TanStack Query
│
▼
Orders Repository
│
▼
Supabase
│
▼
Orders Data Grid

For mutations:

text
User Action
│
▼
Status Mutation
│
├── Optimistic Cache Update
│
├── Server Request
│
├── Rollback on Error
│
└── Query Invalidation / Refetch

---

## State Management Strategy

The project separates state based on its responsibility.

### URL State

The URL is used as the source of truth for table-related state:

- Search query
- Status filter
- Date range
- Pagination
- Sorting

This makes the current table state:

- Shareable
- Refresh-safe
- Browser-navigation friendly
- Compatible with server-side fetching

`router.replace` is used for filter updates to prevent unnecessary browser history entries.

### Server State

Server data is managed with TanStack Query.

Responsibilities include:

- Fetching orders
- Caching query results
- Query key management
- Loading and error states
- Mutation lifecycle
- Cache invalidation
- Optimistic updates
- Rollback after failed mutations

### Local UI State

Local component state is used for short-lived interactive state such as:

- Selected rows
- Open menus
- Temporary UI states
- Client-only chart interactions

---

## Orders Page Workflow

The main Orders page follows this workflow:

1. Read table filters from URL search parameters.
2. Map URL values into the order filter model.
3. Validate filter values with Zod.
4. Apply domain rules such as date range validation.
5. Convert filters into the database query model.
6. Fetch orders through TanStack Query.
7. Use server-side prefetching where configured.
8. Hydrate the client using `HydrationBoundary`.
9. Render orders inside MUI X Data Grid.
10. Allow filtering, sorting, pagination, and row selection.
11. Export selected orders as CSV.
12. Update order status with optimistic UI.
13. Roll back the cache when a mutation fails.
14. Invalidate or refetch the relevant orders query.
15. Recalculate the summary based on the current dataset.

---

## Dashboard Summary

`OrdersSummary` provides a compact overview of the currently available order data.

The summary includes:

- Total number of loaded orders
- Total revenue
- Pending and processing order count
- Order distribution by status
- Revenue grouped by status

The summary is calculated from the currently loaded and filtered dataset.

Because pagination is server-side, the displayed figures represent the currently loaded page rather than the complete database unless a separate aggregation query is introduced.

The data transformation is kept separate from the chart presentation through the order summary mapper.

text
Order[]
   │
   ▼
order-summary.mapper.ts
   │
   ▼
OrderSummary
   │
   ├── Summary cards
   ├── Status distribution chart
   └── Revenue chart

---

## CSV Export

CSV generation is implemented independently from the Data Grid and DOM.

The export utility is responsible for:

- Converting typed rows to CSV content
- Generating column headers
- Escaping commas
- Escaping quotation marks
- Escaping line breaks
- Handling `null` and `undefined`
- Formatting dates, amounts, and statuses
- Creating a downloadable UTF-8 CSV file

Only the selected orders that are available in the currently loaded dataset are exported.

The export utility is located in:

text
src/shared/csv-helper.ts

This separation makes the CSV functionality reusable and independent from the table rendering library.

---

## Validation

Zod is used for runtime validation at the boundary of the application.

Validation is applied to user-controlled values such as:

- Search parameters
- Status filters
- Pagination parameters
- Sorting parameters
- Date filters

Date range validation ensures that the start date is earlier than the end date.

This prevents invalid URL values from reaching the repository and database layers.

---

## Error and Loading Handling

The application provides dedicated UI states for:

- Initial loading
- Background fetching
- Empty results
- Query errors
- Mutation errors
- Optimistic update rollback
- Bulk operation failures

The Data Grid uses custom overlays for loading and empty states.

Mutation errors do not silently fail. The cache is rolled back and the user receives an appropriate notification.

---

## Getting Started

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- A configured Supabase project

### Installation

Clone the repository and install dependencies:

bash
git clone <repository-url>
cd admin-data-explorer
npm install

### Environment Variables

Create the local environment file:

bash
cp .env.example .env.local

If the project does not contain an `.env.example` file, create `.env.local` manually and configure the variables required by the Supabase client.

Never commit real credentials or secret values to the repository.

Example structure:

env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

Use the exact variable names expected by the project implementation.

### Run the Development Server

bash
npm run dev

Open:

text
http://localhost:3000

---

## Available Scripts

bash
npm run dev
npm run lint
npm run build
npx tsc --noEmit

| Command | Description |
|---|---|
| `npm run dev` | Starts the local development server |
| `npm run lint` | Runs ESLint checks |
| `npm run build` | Creates a production build |
| `npx tsc --noEmit` | Runs TypeScript type checking without emitting files |

Use only the scripts available in `package.json`.

---

## Dependency Overview

json
{
  "next": "16.3.0",
  "react": "19.2.8",
  "react-dom": "19.2.8",
  "typescript": "strict",
  "@mui/material": "^9.3.1",
  "@mui/x-data-grid": "^9.11.0",
  "@tanstack/react-query": "^5.101.4",
  "@supabase/supabase-js": "^2.112.3",
  "recharts": "^3.10.1",
  "zod": "^4.4.3",
  "react-hook-form": "^7.85.0",
  "notistack": "^3.0.2"
}

### UI and Styling

- `@mui/material`
- `@mui/icons-material`
- `@mui/material-nextjs`
- `@emotion/react`
- `@emotion/styled`

### Data Management

- `@tanstack/react-query`
- `@supabase/supabase-js`
- `zod`

### Visualization and Forms

- `recharts`
- `react-hook-form`

### Notifications

- `notistack`

---

## Known Limitations

- Row selection is limited to orders loaded on the current server-side page.
- Dashboard statistics are calculated from the current loaded dataset.
- The dashboard does not use a separate server-side aggregation endpoint.
- Export does not automatically include orders from other pages that are not currently loaded.
- Bulk delete is intentionally not included in the current scope.
- The application requires valid Supabase configuration to access order data.
- Automated test coverage depends on the test setup available in the repository.

---

## Engineering Decisions

### Feature-Based Architecture

Order-related functionality is grouped inside `features/orders`. This keeps the domain cohesive and makes future features easier to add without creating a large global component directory.

### Repository Separation

The repository layer hides Supabase-specific implementation details from the UI and domain code.

### URL-Driven Table State

Filters, sorting, and pagination are stored in the URL to make the page state persistent and shareable.

### Optimistic Updates

Status changes update the UI immediately and roll back automatically if the server operation fails.

### Pure Data Mappers

Summary and URL transformations are kept in pure mapper functions to improve maintainability and reduce coupling between domain logic and React components.

### Lightweight CSV Export

CSV export is implemented without relying on Data Grid internals, DOM scraping, or a heavy external export package.

---

## Verification

Run the following commands before opening a pull request:

bash
npm run lint
npx tsc --noEmit
npm run build

Expected result:

text
- ESLint passes without errors
- TypeScript completes without type errors
- Production build completes successfully

---

## Git Workflow

Recommended branch names:

bash
feat/orders-bulk-actions
feat/orders-dashboard-summary
docs/orders-readme

Recommended commits:

bash
feat(orders): add row selection and bulk actions
feat(orders): add type-safe csv export
feat(orders): add dashboard summary charts
docs(orders): document admin data explorer

---

## License

This project is currently intended for internal, educational, or portfolio use.

Add the appropriate license here if the project is later published under an open-source license.


### دو نکته مهم

1. در بخش `Tech Stack` بهتر است نسخه‌ی دقیق `TypeScript` را از `package.json` بررسی کنی؛ چون در dependencyهایی که فرستادی، نسخه‌ی TypeScript نمایش داده نشده است. بنابراین عبارت `TypeScript — Strict` به تنظیمات `tsconfig.json` اشاره دارد، نه نسخه‌ی پکیج.

2. اگر فایل `.env.example` در پروژه وجود ندارد، در README بهتر است جمله‌ی مربوط به `cp .env.example .env.local` حذف شود و فقط روش ساخت `.env.local` نوشته شود؛ چون README نباید به فایل غیرواقعی ارجاع بدهد.