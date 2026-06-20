# Changelog

All notable changes to Convoke will be documented in this file.

## [Unreleased]
### Added
- Created `docs/` directory representing the complete architectural single source of truth.
- Migrated fully to Supabase Authentication (OAuth and Magic Links).
- Added `privacy` and `terms` static pages.
- Implemented `@base-ui/react` for headless components.
- Introduced strict Monochrome Editorial System via Tailwind CSS v4 variables.

### Removed
- Entirely removed Clerk authentication (`<ClerkProvider>`, `@clerk/nextjs`).
- Removed arbitrary UI colors; forced grayscale constraint globally.

### Fixed
- Re-wired the custom `/login` page UI to natively trigger Supabase auth functions, resolving the broken placeholder HTML buttons.
