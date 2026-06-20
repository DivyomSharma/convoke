# Product Bible

**Source of Truth Version:** 1.0.0

## 1. Product Vision
Convoke is a high-end, editorial-style aggregator for ambitious individuals (Builders, Founders, Researchers, and Creators). It is designed to replace chaotic Discord servers and fragmented job boards by combining communities (Spaces), events, opportunities, and professional portfolios into a single, cohesive timeline.

## 2. Core Pillars
1. **The Editorial Experience:** Convoke should feel like reading a high-end digital magazine. It is strictly monochrome. Information density is prioritized over playful branding.
2. **Speed & Keyboard First:** Interactions should be instantaneous. Power users navigate via `⌘K` command palettes rather than clicking through deep navigation trees.
3. **Identity over Resumes:** Profiles highlight verified work (Projects, Research), peer endorsements (Vouches), and contribution momentum (Heatmaps) rather than static chronological resumes.

## 3. Core Entities
- **User (People):** The core unit. Users have roles, universities, and detailed contribution profiles.
- **Organization:** A company, club, or institution that sponsors Spaces and Opportunities.
- **Space:** A distinct community governed by an Organization. It hosts events and discussion threads.
- **Event:** A time-bound gathering linked to a Space. Users can RSVP (Going, Interested).
- **Opportunity:** A role, grant, fellowship, or hackathon offered by an Organization.
- **Vouch:** A peer-to-peer endorsement representing trust capital.

## 4. Key User Flows
- **The Explore Feed (`/explore`):** The primary discovery mechanism. Users filter globally across Events, Roles, Projects, and Office Hours.
- **The Workspace (`/workspace`):** A private dashboard. Shows the user's upcoming timeline, active applications, and tailored recommendations.
- **The Profile (`/profile/[handle]`):** The user's public identity, highlighting a 24-week contribution heatmap and a timeline of curated work.

## 5. Non-Negotiable Constraints
- **No Gradients:** The UI must rely strictly on border hairlines and spacing for structure.
- **No Native Modals for Navigation:** Major context switches happen via full-page navigations or the `⌘K` palette. 
- **Offline First Considerations:** The application utilizes a Service Worker (PWA) to ensure fast initial loads and offline capabilities (even if currently rudimentary).
