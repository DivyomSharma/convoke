# Goal Description

Implement the remaining UI polish and functional requirements requested by the user, focusing on theme consistency, dynamic forms, Maps API integration, and global terminology alignment.

## User Review Required

> [!WARNING]
> **Maps API Integration**: You requested that locations be fetched via a Maps API. To implement a genuine location autocomplete (e.g., Google Places Autocomplete or Mapbox Search), we need an API key. 
> *Should I implement a mock autocomplete for now, or would you like to provide a Google Maps/Mapbox API key?*

## Proposed Changes

### Terminology & Mock Data Cleanup
- **Global Find & Replace**: Change all user-facing instances of "Community" to "Space" and "Event" to "Meet" across `src/app/page.tsx`, `ProjectsList.tsx`, and `MeetsList.tsx`.
- **Remove Mock Data**: Scour the landing page (`page.tsx`) and any other hardcoded areas to remove placeholder data or ensure they dynamically pull from the database.

### Challenges Enhancements
#### [MODIFY] `src/app/challenges/ChallengesList.tsx`
- **Expanded Challenge Types**: Add popular Indian format types (e.g., Hackathon, Ideathon, Case Study, Quiz, Coding Challenge, Hiring Challenge, Treasure Hunt, Business Pitch).
- **Mode Field**: Add a new `mode` field with options: `Offline`, `Online`, `Hybrid`.
- **Location Field**: Convert the current text input to an autocomplete field (pending Maps API decision).

### Verification Plan
- Verify that "Community" and "Event" no longer appear in the UI (except where technically referring to webhook events or system variables).
- Ensure Challenge creation dropdowns successfully save the expanded types and mode options to the backend.
- Confirm all cards render uniformly across organizations, spaces, and challenges.
