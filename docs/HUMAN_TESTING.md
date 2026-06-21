# CONVOKE P1 HUMAN TESTING PROTOCOL

**Objective:** Validate that the RC1 environment is 100% functional for strangers before launching.

> [!WARNING]
> Do NOT use your admin account for this. Use a fresh browser (e.g. Chrome Incognito or Safari) with no cached data to accurately simulate a new user's perspective.

## 👥 Setup
1. Create **Account A** (Organizer) using Google or GitHub.
2. Create **Account B** (Normal User) using a secondary email or Discord.

## 🧪 Test Matrix

### Phase 1: Organization & Event Creation (Account A)
- [ ] Log into Account A.
- [ ] Navigate to **Workspace**.
- [ ] Click **Create Organization**.
  - *Verify*: Empty form throws validation errors and scrolls to red fields.
  - *Verify*: Image uploads work via UploadThing and generate a short URL.
- [ ] Click **Create Space** under that organization.
- [ ] Click **Create Meet/Event** inside the new space.
  - *Verify*: Banner upload succeeds.
  - *Verify*: Dates are properly formatted and required.

### Phase 2: Registration & Interaction (Account B)
- [ ] Log into Account B on a separate browser profile.
- [ ] Navigate to the **Events** feed.
- [ ] Locate the Event created by Account A.
  - *Verify*: The banner image loaded correctly and isn't a massive base64 string.
- [ ] Click **Register**.
  - *Verify*: A success toast appears.
- [ ] Refresh the page.
  - *Verify*: State persists as "Registered".
- [ ] Click **Cancel Registration**.
  - *Verify*: State returns to unregistered.

### Phase 3: Application & Profile (Account B)
- [ ] Go to **Opportunities** and click **Apply** on any opportunity.
- [ ] Upload a dummy PDF resume via UploadThing if prompted.
- [ ] Go to your **Passport / Profile**.
- [ ] Edit your bio and save.
- [ ] **Logout**.
- [ ] **Login** again.
  - *Verify*: The bio edits persisted.

## 📋 Bug Tracking
If any of these tests fail, log the exact URL and reproduction steps below. Do NOT go live until this matrix is 100% green.

- Bug 1: 
- Bug 2: 
- Bug 3: 