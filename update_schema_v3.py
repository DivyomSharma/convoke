import re

with open('prisma/schema.prisma', 'r', encoding='utf-8') as f:
    content = f.read()

# Add User relations
user_fields = '''    skills      String[] @default([])
    languages   String[] @default([])
    
    experiences Experience[]
    educations  Education[]
    achievements Achievement[]
    vouchesReceived Vouch[] @relation("VouchesReceived")
    vouchesGiven Vouch[] @relation("VouchesGiven")
    buildLogs   BuildLog[]'''

user_block_match = re.search(r'(model User\s*{.*?)(})', content, re.DOTALL)
if user_block_match:
    new_user_block = user_block_match.group(1) + user_fields + "\n  " + user_block_match.group(2)
    content = content.replace(user_block_match.group(0), new_user_block)

# Add Project relations
project_fields = '    buildLogs BuildLog[]'
project_block_match = re.search(r'(model Project\s*{.*?)(})', content, re.DOTALL)
if project_block_match:
    new_project_block = project_block_match.group(1) + project_fields + "\n  " + project_block_match.group(2)
    content = content.replace(project_block_match.group(0), new_project_block)

new_models = '''
model Experience {
  id          String   @id @default(uuid())
  company     String
  role        String
  type        String   // Full Time, Internship, etc.
  startDate   DateTime
  endDate     DateTime?
  description String?  @db.Text
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Education {
  id           String   @id @default(uuid())
  school       String
  degree       String?
  field        String?
  startDate    DateTime?
  endDate      DateTime?
  grade        String?
  achievements String?  @db.Text
  userId       String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Achievement {
  id          String   @id @default(uuid())
  title       String
  type        String   // Hackathon, Scholarship, Competition
  date        DateTime?
  description String?  @db.Text
  url         String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model Vouch {
  id          String   @id @default(uuid())
  authorId    String
  receiverId  String
  content     String   @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  author      User     @relation("VouchesGiven", fields: [authorId], references: [id], onDelete: Cascade)
  receiver    User     @relation("VouchesReceived", fields: [receiverId], references: [id], onDelete: Cascade)
}

model BuildLog {
  id          String   @id @default(uuid())
  content     String   @db.Text
  projectId   String?
  userId      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  project     Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
'''

content += new_models

with open('prisma/schema.prisma', 'w', encoding='utf-8') as f:
    f.write(content)