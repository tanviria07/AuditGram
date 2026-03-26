# AuditGram Architecture

*   **Client-Side Only:** The entire application runs in the browser. There is no backend server, ensuring complete data privacy.
*   **React & Vite:** Built with React 19 and bundled using Vite for fast development and optimized production builds.
*   **Tailwind CSS:** Styling is handled entirely with Tailwind CSS v4, providing a responsive and modern UI.
*   **Framer Motion:** Used for smooth, layout-aware animations and transitions between states.
*   **JSZip:** Used to parse and extract the uploaded Instagram ZIP file directly in the browser memory.
*   **Data Parsing (`src/lib/instagramZip.ts`):** Recursively traverses the extracted JSON files to find and collect all usernames.
*   **Comparison Logic (`src/lib/compare.ts`):** Computes the differences between the followers and following sets to identify non-followers, fans, and mutuals.
*   **Component Structure:** Divided into UI components (`src/components/ui`) and feature-specific components (`src/features/upload`, `src/features/results`, `src/features/walkthrough`).
*   **State Management:** Uses standard React hooks (`useState`, `useCallback`) to manage the application state.
*   **Error Handling:** Custom error classes (e.g., `HtmlZipError`) are used to provide specific, actionable feedback to the user if they upload the wrong file format.
