import re

with open('prisma/schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

org_fields = '''    approvalStatus          String   @default("DRAFT")
    sponsorIndustries       String?
    sponsorBudgetRange      String?
    sponsorAudience         String?
    sponsorPastSponsorships String?
    sponsorContactEmail     String?
    
    challenges              Challenge[]
    sponsorshipRequests     SponsorshipRequest[] @relation("SponsorInbox")
    initiatedCollaborations Collaboration[] @relation("InitiatedCollaborations")
    targetCollaborations    Collaboration[] @relation("TargetCollaborations")'''

# Find model Organization block and insert new fields before the last closing brace
org_block_match = re.search(r'(model Organization\s*{.*?)(})', content, re.DOTALL)
if org_block_match:
    new_org_block = org_block_match.group(1) + org_fields + "\n  " + org_block_match.group(2)
    content = content.replace(org_block_match.group(0), new_org_block)

# Add relation to User
user_fields = '    sponsorshipRequests SponsorshipRequest[]'
user_block_match = re.search(r'(model User\s*{.*?)(})', content, re.DOTALL)
if user_block_match:
    new_user_block = user_block_match.group(1) + user_fields + "\n  " + user_block_match.group(2)
    content = content.replace(user_block_match.group(0), new_user_block)

# Add relation to Meet
meet_fields = '    sponsorshipRequests SponsorshipRequest[]'
meet_block_match = re.search(r'(model Meet\s*{.*?)(})', content, re.DOTALL)
if meet_block_match:
    new_meet_block = meet_block_match.group(1) + meet_fields + "\n  " + meet_block_match.group(2)
    content = content.replace(meet_block_match.group(0), new_meet_block)


new_models = '''
model Challenge {
  id            String   @id @default(uuid())
  name          String
  slug          String   @unique
  description   String?  @db.Text
  startDate     DateTime?
  endDate       DateTime?
  type          String?  // Hackathon, Quiz, Gaming, etc.
  organizationId String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  organization  Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  sponsorshipRequests SponsorshipRequest[]
}

model SponsorshipRequest {
  id             String   @id @default(uuid())
  requesterId    String
  sponsorId      String
  meetId         String?
  challengeId    String?
  audienceSize   String?
  college        String?
  budget         String?
  deliverables   String?  @db.Text
  benefits       String?  @db.Text
  assetsUrl      String?
  socialLinks    String?
  deckUrl        String?
  status         String   @default("NEW") // NEW, VIEWED, INTERESTED, MEETING, WON, LOST
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  requester      User         @relation(fields: [requesterId], references: [id], onDelete: Cascade)
  sponsor        Organization @relation("SponsorInbox", fields: [sponsorId], references: [id], onDelete: Cascade)
  meet           Meet?        @relation(fields: [meetId], references: [id], onDelete: SetNull)
  challenge      Challenge?   @relation(fields: [challengeId], references: [id], onDelete: SetNull)
}

model Collaboration {
  id             String   @id @default(uuid())
  initiatorOrgId String
  targetOrgId    String
  status         String   @default("PROPOSED") // PROPOSED, CONFIRMED, COMPLETED
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  initiatorOrg   Organization @relation("InitiatedCollaborations", fields: [initiatorOrgId], references: [id], onDelete: Cascade)
  targetOrg      Organization @relation("TargetCollaborations", fields: [targetOrgId], references: [id], onDelete: Cascade)
}
'''

content += new_models

with open('prisma/schema.prisma', 'w', encoding='utf-8') as f:
    f.write(content)