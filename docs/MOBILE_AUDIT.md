# 📱 MOBILE LAYOUT AUDIT: BRUTAL ASSESSMENT

This is an absolute bloodbath. The current state of `src/` shows a clear "desktop-first, mobile-never" mentality. If a user opens this on an iPhone SE or Galaxy Fold, they will be met with broken navigation, horizontal scrollbar purgatory, and touch targets that require surgical precision to tap. 

Here is the merciless breakdown of the layout crimes committed using Tailwind classes:

## 🚨 1. Navigation is Non-Existent on Mobile (Critical Failure)
The entire application navigation has been completely severed on mobile screens. Users are effectively locked out of 90% of the platform.
*   **Missing Hamburger Menu:** There is no mobile drawer, bottom bar, or hamburger toggle.
*   `src/components/Shell.tsx` (Lines 64 & 82): 
    *   `className="hidden ... xl:flex"` on `nav` links completely hides the main `mainNav` on mobile. 
    *   The `Search` trigger (`Ctrl K` button) is set to `hidden md:flex`, making search literally impossible to access on touch devices.
    *   The `Workspace` icon has `hidden sm:inline-flex`. 

## 🚨 2. Horizontal Scrollbar Purgatory (Container Overflow)
You are forcing inner elements to be wider than the viewport, breaking the mobile DOM canvas and causing jittery side-scrolling.
*   **Builder Console Layout:** `src/app/builder/page.tsx` (Line 22) uses `<ul className="grid min-w-[1120px] grid-cols-3 gap-4">` inside a raw `overflow-x-auto`. While it has auto-scroll, forcing an 1120px minimum width on mobile screens forces a 3-page horizontal swipe with zero visual indicators. This is an awful UX pattern.
*   **Avatars Grid Overflow:** `src/app/spaces/[id]/page.tsx` (Line 131) uses `<div className="grid grid-cols-6 gap-2">`. The avatars inside are `w-10 h-10` (40px). 6 items + gaps + container padding pushes this grid to >320px minimum width. On an iPhone SE or narrow Android, this grid will blow past the screen edge and break the parent container because there is no `flex-wrap` or responsive `sm:grid-cols-6` logic.
*   **Tables Without Wrappers:** `src/app/events/[id]/OrganizerDashboard.tsx` (Line 133) uses `<table className="w-full ... text-[13px]">`. Standard tables *do not wrap natively*. On mobile, the column headers (User, RSVP, Joined, Actions) will crash into each other or push the viewport wide, causing hidden overflow.

## 🚨 3. Microscopic Touch Targets (Accessibility Violation)
You are expecting users to have styluses or tiny fingers. Apple HIG and Material Design demand 44x44px or 48x48px minimum touch targets. Your buttons are dangerously small.
*   **Organizer Action Buttons:** `src/app/events/[id]/OrganizerDashboard.tsx` (Lines 179, 187, 195). You have inline action buttons (Approve, Check In, Reject) with just `text-[11px]` and absolutely **ZERO** padding (`px`, `py`). This creates a ~15x15 pixel touch target on mobile screens. Users will accidentally reject attendees while trying to approve them.
*   **Header Navigation Icons:** `src/components/Shell.tsx` uses `h-8 w-8` (32x32px) for critical buttons like Notifications and Messages. This is severely undersized for mobile thumbs.
*   **Tiny Inline Links:** `src/app/challenges/[id]/RegisterClient.tsx` (Line 64) uses bare text links `text-[13px] text-g5` next to tight icons. 
*   **Undersized Buttons:** `src/app/builder/page.tsx` (Line 18) uses `px-4 py-2 text-[13px]` which equates to roughly ~32px in physical height.

## 🚨 4. Blind Desktop-First Breakpoints
Tailwind is mobile-first (`sm:`, `md:`, `lg:`), but the layout code ignores mobile flow.
*   **Admin Dashboard:** `src/app/admin/page.tsx` (Line 19) uses `grid-cols-2 md:grid-cols-4`. Forcing 2 columns on a 320px screen for metric cards will aggressively squish the text, likely causing overlaps if stats hit 5 digits.
*   **Misuse of screen heights:** The codebase relies on `min-h-screen` and `h-screen`. While seemingly harmless, on mobile Safari `h-[100vh]` does not account for the dynamic bottom/top UI toolbars, causing content to be hidden. `min-h-[100dvh]` or `min-h-dvh` must be adopted universally instead.

---

### VERDICT: 
The layout is broken for mobile users. If Convoke wants to be "For people building the future," you cannot alienate half the internet. Fix the responsive grid defaults, increase padding on interactive elements, and actually provide a mobile navigation toggle.
