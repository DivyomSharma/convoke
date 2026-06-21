# Convoke UX Audit Report

**Role:** UX Critic
**Focus:** State management, loading states, empty states, error boundaries, and form feedback.

The Convoke UI strives for a premium, editorial feel, but beneath the surface, there are multiple critical UX dead-ends, confusing loading patterns, and unpolished form interactions that will leave users frustrated or waiting without feedback.

## 1. Form Feedback & Error Handling Flaws

*   **Blind Form Errors (Missing Auto-Scroll):** In `ProjectsList.tsx`, `SpacesList.tsx`, and `EventsList.tsx`, the creation modals are heavily scrollable. Error messages are conditionally rendered at the *absolute top* of the form. If a server action fails when the user is scrolled to the bottom (clicking Submit), the button spinner disappears but the modal remains open. The user receives **no visible feedback** and must manually scroll up to discover why the submission failed.
*   **Unvalidated Base64 Uploads / Payload Crashes:** `ImageUploadField.tsx` converts file uploads to base64 strings and passes them to Server Actions. There is **zero file size validation**. A 5MB+ image will silently exceed Next.js's default 1MB Server Action body limit, resulting in a cryptic `413 Payload Too Large` error, which the catch block will likely render as a confusing "Failed to fetch" message.
*   **Synchronous UI Freezes on Image Upload:** `ImageUploadField.tsx` relies on `FileReader.readAsDataURL` on the main thread without any `isUploading` state. For large images, this will completely freeze the UI for several hundred milliseconds, offering no visual progress to the user.
*   **Native Window Alerts:** Both `OrganizerDashboard.tsx` and `RsvpClient.tsx` rely on native `window.alert()` for error handling and authentication prompts (e.g., `alert("Authentication required to register.")`). This completely breaks the carefully crafted, "premium" brand aesthetic and halts the main thread.
*   **Global Loading State in Lists (UI Thrashing):** In `OrganizerDashboard.tsx`, the `isPending` state from `useTransition` applies globally to the *entire table* of attendees. Clicking "Approve" on a single user instantly replaces the action buttons for **all users** with spinners, preventing organizers from rapidly processing multiple waitlist approvals.

## 2. Authentication Flow Dead-Ends

*   **Arbitrary Loading Timeouts:** In `AuthPage` (`app/auth/page.tsx`), the OAuth handler triggers an arbitrary timeout: `window.setTimeout(() => setLoadingStrategy(null), 1400)`. If the Clerk API or network takes longer than 1.4 seconds to redirect the user, the loading spinner simply vanishes, leaving the user staring at a dead, unresponsive UI.
*   **Unlocked Magic Link State:** Upon submitting an email link in `AuthPage`, the UI displays a small text message ("Check your email to continue.") but **fails to disable the form**. The user can continue typing and spamming the "Continue" button because there is no persistent locked state to indicate the flow has moved to their inbox.

## 3. Navigation & Onboarding States

*   **Silent "Save for later" Navigation:** In `OnboardingClient.tsx`, clicking "Save for later" executes a client-side `router.push("/workspace")` without any loading indicator. On slower networks, the user is left waiting with no visual confirmation that their click registered.
*   **Unprotected Navigation:** The "Save for later" button is **not disabled** when `saving` is true. A user could double-click, triggering both a form submission and a route change simultaneously, potentially interrupting the save process.
*   **Missing Core Onboarding Feature:** Despite the `InitialUser` type expecting an `avatarUrl` and the live preview mocking a complete profile, there is **no UI for avatar upload** in the onboarding flow, leaving users permanently anonymous until they find the settings page.

## 4. Inconsistent Empty States (Dead-Ends)

Empty states in a dashboard should serve as primary onboarding funnels. Instead, Convoke’s `workspace/page.tsx` treats them as literal dead-ends:
*   **"My Spaces & Collectives"**: Renders static text ("You haven't joined any workspace spaces yet.") without a link to the Spaces directory.
*   **"Ongoing Collaborations"**: Renders static text ("No active applications in progress.") without a link to Opportunities.
*   **"Upcoming Gatherings"**: Renders static text ("Your campus is quiet today.") without a link to the Campus timeline.
Only the Tickets section contains a functioning Call to Action. The rest of the dashboard leaves new users completely stranded.
