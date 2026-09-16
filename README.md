# Expense Tracker Frontend

This is the frontend application for the Expense Tracker, built with React and Vite.

## Tech Stack
- React 19
- Vite
- React Router v7
- Tailwind CSS v4
- Chart.js & React-Chartjs-2
- Axios
- TanStack React Query v5 (Data Fetching & Caching)
- React Hook Form & Zod (Form Validation)

## Project Structure
The project has been refactored for scalability with a clear separation of concerns:

- `src/components/` - Reusable UI components.
  - `layout/` - `Navbar`, `Layout`, and `ProtectedRoute` components.
  - `dashboard/` - Dashboard specific components like `StatCard`.
  - `transactions/` - Transaction specific components like `TransactionForm`.
- `src/pages/` - Main page views (`Login`, `Signup`, `Dashboard`, `Transactions`).
- `src/context/` - Global state context (e.g., `AuthContext`).
- `src/lib/` - Utilities and configuration (e.g., Axios setup in `api.js`, shared `constants.js`).

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```
