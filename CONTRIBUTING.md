# Contributing to PennyMon

## Development Workflow

1. Create or switch to a feature branch.
2. Install dependencies with `npm install`.
3. Run the app with `npm run dev`.
4. Keep changes focused on one feature or fix.
5. Run `npm run build` before pushing.

## Environment Safety

- Do not commit `.env.local`.
- Do not paste API keys into frontend code.
- Store Gemini keys as Supabase secrets.
- Keep generated folders such as `dist`, `node_modules`, and Supabase temp files out of Git.

## Code Style

- Follow the existing React component style.
- Keep UI changes mobile-first.
- Prefer existing helpers and state patterns in `src/App.jsx`.
- Add comments only when logic is not obvious.

## Pull Request Checklist

- App builds successfully.
- No API keys or private tokens are included.
- New assets are placed in the correct `src/assets/pennymon` folder.
- README is updated if setup or behavior changes.
