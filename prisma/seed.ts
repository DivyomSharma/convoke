import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')
  
  // Create sample users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'attendee@example.com',
        username: 'attendee',
        name: 'Alex Johnson',
        headline: 'Tech Enthusiast & Event Attendee',
        role: 'ATTENDEE',
        bio: 'Passionate about technology, innovation, and networking. I love attending events to learn new things and meet like-minded people.',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      }
    }),
    prisma.user.create({
      data: {
        email: 'organizer@example.com',
        username: 'organizer',
        name: 'Sarah Chen',
        headline: 'Event Organizer & Community Builder',
        role: 'ORGANIZER',
        bio: 'Experienced event organizer with a passion for creating meaningful experiences that connect people and foster collaboration.',
        imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b5d3?w=400&h=400&fit=crop&crop=face',
      }
    }),
    prisma.user.create({
      data: {
        email: 'volunteer@example.com',
        username: 'volunteer',
        name: 'Marcus Rodriguez',
        headline: 'Community Volunteer & Student Leader',
        role: 'VOLUNTEER',
        bio: 'Dedicated volunteer committed to making a difference in the community through service and leadership.',
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      }
    }),
    prisma.user.create({
      data: {
        email: 'sponsor@example.com',
        username: 'sponsor',
        name: 'Priya Sharma',
        headline: 'Corporate Sponsorship Manager',
        role: 'SPONSOR',
        bio: 'Strategic partnership professional focused on creating mutually beneficial relationships between brands and events.',
        imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face',
      }
    }),
    prisma.user.create({
      data: {
        email: 'admin@example.com',
        username: 'admin',
        name: 'David Kim',
        headline: 'Platform Administrator',
        role: 'ADMIN',
        bio: 'Platform administrator responsible for maintaining and improving the Convoke ecosystem.',
        imageUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face',
      }
    })
  ])

  // Create profiles for users
  await Promise.all(
    users.map(user => 
      prisma.profile.create({
        data: {
          userId: user.id,
          headline: user.headline,
          avatarUrl: user.imageUrl,
          location: 'San Francisco, CA',
          website: 'https://example.com',
          linkedinUrl: `https://linkedin.com/in/${user.username}`,
          twitterUrl: `https://twitter.com/${user.username}`,
          skills: ['Leadership', 'Communication', 'Networking'],
          badges: ['Early Adopter', 'Community Contributor'],
          eventsAttended: Math.floor(Math.random() * 10),
          eventsOrganized: Math.floor(Math.random() * 5),
          volunteerHours: Math.floor(Math.random() * 50),
          communitiesJoined: Math.floor(Math.random() * 3)
        }
      })
    )
  )

  // Create sample organizations
  const organizations = await Promise.all([
    prisma.organization.create({
      data: {
        name: 'Tech Innovators Collective',
        slug: 'tech-innovators',
        type: 'Technology Community',
        description: 'A community of technology enthusiasts, innovators, and thought leaders dedicated to advancing technology and fostering innovation.',
        website: 'https://techinnovators.example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=400&fit=crop&crop=face',
        bannerUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&h=400&fit=crop',
      }
    }),
    prisma.organization.create({
      data: {
        name: 'Green Future Initiative',
        slug: 'green-future',
        type: 'Environmental Organization',
        description: 'Dedicated to promoting sustainability and environmental awareness through education, advocacy, and community action.',
        website: 'https://greenfuture.example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1448315640896-05b2c30e5d62?w=400&h=400&fit=crop&crop=face',
        bannerUrl: 'https://images.unsplash.com/photo-1448315640896-05b2c30e5d62?w=1200&h=400&fit=crop',
      }
    }),
    prisma.organization.create({
      data: {
        name: 'Creative Arts Alliance',
        slug: 'creative-arts',
        type: 'Arts & Culture Organization',
        description: 'A vibrant community of artists, creators, and cultural enthusiasts celebrating creativity in all its forms.',
        website: 'https://creativearts.example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1518563548045-01d2ec5e6af2?w=400&h=400&fit=crop&crop=face',
        bannerUrl: 'https://images.unsplash.com/photo-1518563548045-01d2ec5e6af2?w=1200&h=400&fit=crop',
      }
    })
  ])

  // Create memberships
  await Promise.all([
    prisma.membership.create({
      data: {
        userId: users[0].id, // attendee
        organizationId: organizations[0].id,
        role: 'Member'
      }
    }),
    prisma.membership.create({
      data: {
        userId: users[1].id, // organizer
        organizationId: organizations[0].id,
        role: 'Organizer'
      }
    }),
    prisma.membership.create({
      data: {
        userId: users[2].id, // volunteer
        organizationId: organizations[1].id,
        role: 'Volunteer Coordinator'
      }
    }),
    prisma.membership.create({
      data: {
        userId: users[3].id, // sponsor
        organizationId: organizations[2].id,
        role: 'Sponsor Relations'
      }
    })
  ])

  // Create sample events
  const now = new Date()
  const events = await Promise.all([
    prisma.event.create({
      data: {
        organizationId: organizations[0].id,
        organizerId: users[1].id,
        title: 'Future of AI Conference 2026',
        slug: 'future-of-ai-2026',
        category: 'Technology',
        city: 'San Francisco',
        mode: 'HYBRID',
        startsAt: new Date(now.getFullYear(), now.getMonth() + 2, 15),
        endsAt: new Date(now.getFullYear(), now.getMonth() + 2, 17),
        isPaid: true,
        inviteOnly: false,
        approvalBased: false,
        heroImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=600&fit=crop',
      }
    }),
    prisma.event.create({
      data: {
        organizationId: organizations[1].id,
        organizerId: users[2].id,
        title: 'Sustainability Summit',
        slug: 'sustainability-summit-2026',
        category: 'Environment',
        city: 'Portland',
        mode: 'OFFLINE',
        startsAt: new Date(now.getFullYear(), now.getMonth() + 3, 10),
        endsAt: new Date(now.getFullYear(), now.getMonth() + 3, 12),
        isPaid: false,
        inviteOnly: false,
        approvalBased: true,
        heroImageUrl: 'https://images.unsplash.com/photo-1448315640896-05b2c30e5d62?w=1200&h=600&fit=crop',
      }
    }),
    prisma.event.create({
      data: {
        organizationId: organizations[2].id,
        organizerId: users[0].id,
        title: 'Digital Arts Festival',
        slug: 'digital-arts-festival-2026',
        category: 'Arts & Culture',
        city: 'New York',
        mode: 'ONLINE',
        startsAt: new Date(now.getFullYear(), now.getMonth() + 1, 5),
        endsAt: new Date(now.getFullYear(), now.getMonth() + 1, 7),
        isPaid: true,
        inviteOnly: false,
        approvalBased: false,
        heroImageUrl: 'https://images.unsplash.com/photo-1518563548045-01d2ec5e6af2?w=1200&h=600&fit=crop',
      }
    })
  ])

  // Create ticket types
  await Promise.all([
    prisma.ticketType.create({
      data: {
        eventId: events[0].id,
        name: 'General Admission',
        category: 'GENERAL',
        priceInr: 5000,
        capacity: 200,
        sold: 75
      }
    }),
    prisma.ticketType.create({
      data: {
        eventId: events[0].id,
        name: 'VIP Pass',
        category: 'VIP',
        priceInr: 15000,
        capacity: 50,
        sold: 20
      }
    }),
    prisma.ticketType.create({
      data: {
        eventId: events[1].id,
        name: 'Free Registration',
        category: 'GENERAL',
        priceInr: 0,
        capacity: 500,
        sold: 300
      }
    })
  ])

  // Create event schedules
  await Promise.all([
    prisma.eventSchedule.create({
      data: {
        eventId: events[0].id,
        title: 'Opening Keynote: The Future of AI',
        description: 'Visionary talk on where AI is headed and what it means for humanity.',
        startsAt: new Date(now.getFullYear(), now.getMonth() + 2, 15, 9, 0),
        endsAt: new Date(now.getFullYear(), now.getMonth() + 2, 15, 10, 0)
      }
    }),
    prisma.eventSchedule.create({
      data: {
        eventId: events[0].id,
        title: 'Networking Break',
        description: 'Coffee and networking session.',
        startsAt: new Date(now.getFullYear(), now.getMonth() + 2, 15, 10, 0),
        endsAt: new Date(now.getFullYear(), now.getMonth() + 2, 15, 10, 30),
        isBreak: true
      }
    }),
    prisma.eventSchedule.create({
      data: {
        eventId: events[0].id,
        title: 'Panel Discussion: AI Ethics',
        description: 'Experts discuss the ethical implications of AI development.',
        startsAt: new Date(now.getFullYear(), now.getMonth() + 2, 15, 11, 0),
        endsAt: new Date(now.getFullYear(), now.getMonth() + 2, 15, 12, 0)
      }
    })
  ])

  // Create event speakers
  await Promise.all([
    prisma.eventSpeaker.create({
      data: {
        eventId: events[0].id,
        userId: users[0].id,
        name: 'Dr. Elena Rodriguez',
        title: 'AI Research Director',
        organization: 'Tech Innovators Collective',
        bio: 'Leading researcher in artificial intelligence with over 15 years of experience in the field.',
        talkTitle: 'The Future of AI: Opportunities and Challenges',
        talkDescription: 'Exploring the potential of AI to transform industries while addressing ethical considerations.',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b5d3?w=400&h=400&fit=crop&crop=face'
      }
    }),
    prisma.eventSpeaker.create({
      data: {
        eventId: events[0].id,
        name: 'James Wilson',
        title: 'Senior AI Engineer',
        organization: 'NVIDIA',
        bio: 'AI engineer specializing in machine learning and deep learning applications.',
        talkTitle: 'Practical Applications of AI in Industry',
        talkDescription: 'Real-world examples of how AI is being used to solve business problems.',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'
      }
    })
  ])

  // Create event sponsors
  await Promise.all([
    prisma.eventSponsor.create({
      data: {
        eventId: events[0].id,
        organizationId: organizations[0].id,
        companyName: 'Tech Innovators Collective',
        tier: 'Platinum',
        benefits: ['Booth space', 'Speaking opportunity', 'Logo on all materials'],
        logoUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200&h=200&fit=crop'
      }
    }),
    prisma.eventSponsor.create({
      data: {
        eventId: events[0].id,
        companyName: 'NVIDIA',
        tier: 'Gold',
        benefits: ['Booth space', 'Logo on website and social media'],
        logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop'
      }
    }),
    prisma.eventSponsor.create({
      data: {
        eventId: events[0].id,
        companyName: 'Microsoft',
        tier: 'Silver',
        benefits: ['Logo on event materials'],
        logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=200&fit=crop'
      }
    })
  ])

  // Create volunteer applications
  await Promise.all([
    prisma.volunteerApplication.create({
      data: {
        userId: users[2].id,
        eventId: events[0].id,
        role: 'Registration Assistant',
        status: 'APPROVED',
        hours: 8
      }
    }),
    prisma.volunteerApplication.create({
      data: {
        userId: users[0].id,
        eventId: events[1].id,
        role: 'Event Setup Crew',
        status: 'PENDING',
        hours: 0
      }
    })
  ])

  // Create sponsor leads
  await Promise.all([
    prisma.sponsorLead.create({
      data: {
        organizationId: organizations[0].id,
        eventId: events[0].id,
        companyName: 'Google',
        contactEmail: 'partnerships@google.com',
        stage: 'CONTACTED',
        valueInr: 50000,
        notes: 'Interested in sponsoring the AI track of the conference.'
      }
    }),
    prisma.sponsorLead.create({
      data: {
        organizationId: organizations[1].id,
        companyName: 'Patagonia',
        contactEmail: 'environmental@patagonia.com',
        stage: 'PROSPECTING',
        valueInr: 30000,
        notes: 'Outdoor apparel company interested in environmental events.'
      }
    })
  ])

  // Create opportunities
  const opportunities = await Promise.all([
    prisma.opportunity.create({
      data: {
        organizationId: organizations[0].id,
        title: 'Software Engineering Internship',
        type: 'INTERNSHIP',
        location: 'San Francisco, CA',
        isRemote: false,
        description: 'Join our engineering team to work on cutting-edge technology projects.',
        requirements: ['Currently pursuing CS degree', 'Knowledge of JavaScript/Python', 'Strong problem-solving skills'],
        skills: ['JavaScript', 'Python', 'React', 'Node.js'],
        stipend: '30000 INR/month',
        duration: '3 months',
        startsAt: new Date(now.getFullYear(), now.getMonth() + 1, 1),
        endsAt: new Date(now.getFullYear(), now.getMonth() + 4, 31),
        applicationDeadline: new Date(now.getFullYear(), now.getMonth() + 0, 15),
        positionsAvailable: 3,
        featured: true
      }
    }),
    prisma.opportunity.create({
      data: {
        organizationId: organizations[1].id,
        title: 'Environmental Research Volunteer',
        type: 'VOLUNTEER',
        location: 'Remote',
        isRemote: true,
        description: 'Help us conduct research on sustainable practices and environmental impact.',
        requirements: ['Passion for environmental issues', 'Research experience preferred', 'Ability to work independently'],
        skills: ['Research', 'Data Analysis', 'Environmental Science'],
        stipend: 'Unpaid',
        duration: '6 months',
        startsAt: new Date(now.getFullYear(), now.getMonth() + 0, 15),
        endsAt: new Date(now.getFullYear(), now.getMonth() + 6, 15),
        applicationDeadline: new Date(now.getFullYear(), now.getMonth() + 0, 30),
        positionsAvailable: 5,
        featured: true
      }
    }),
    prisma.opportunity.create({
      data: {
        organizationId: organizations[2].id,
        title: 'Digital Marketing Ambassador',
        type: 'AMBASSADOR',
        location: 'New York, NY',
        isRemote: false,
        description: 'Represent our organization at events and on social media to promote digital arts initiatives.',
        requirements: ['Strong social media presence', 'Excellent communication skills', 'Passion for the arts'],
        skills: ['Social Media Marketing', 'Content Creation', 'Public Speaking'],
        stipend: '15000 INR/month + benefits',
        duration: '12 months',
        startsAt: new Date(now.getFullYear(), now.getMonth() + 0, 1),
        endsAt: new Date(now.getFullYear(), now.getMonth() + 12, 31),
        applicationDeadline: new Date(now.getFullYear(), now.getMonth() + 1, 15),
        positionsAvailable: 2,
        featured: false
      }
    })
  ])

  // Create opportunity applications
  await Promise.all([
    prisma.opportunityApplication.create({
      data: {
        userId: users[0].id,
        opportunityId: opportunities[0].id,
        status: 'APPLIED',
        coverLetter: 'I am excited to apply for this internship opportunity...',
        resumeUrl: 'https://example.com/resumes/alex-johnson.pdf',
        portfolioUrl: 'https://example.com/portfolios/alex-johnson'
      }
    }),
    prisma.opportunityApplication.create({
      data: {
        userId: users[2].id,
        opportunityId: opportunities[1].id,
        status: 'SHORTLISTED',
        coverLetter: 'As an environmental science student, I am passionate about...',
        resumeUrl: 'https://example.com/resumes/marcus-rodriguez.pdf'
      }
    })
  ])

  // Create announcements
  await Promise.all([
    prisma.announcement.create({
      data: {
        organizationId: organizations[0].id,
        title: 'Welcome to Our New Website!',
        content: 'We are excited to announce the launch of our new website with improved features and user experience.',
        published: true,
        publishedAt: new Date(now.getFullYear(), now.getMonth() - 1, 15)
      }
    }),
    prisma.announcement.create({
      data: {
        organizationId: organizations[1].id,
        title: 'Upcoming Beach Cleanup Event',
        content: 'Join us this Saturday for a beach cleanup event to help protect our marine ecosystems.',
        published: true,
        publishedAt: new Date(now.getFullYear(), now.getMonth() - 0, 10)
      }
    })
  ])

  // Create galleries
  const galleries = await Promise.all([
    prisma.gallery.create({
      data: {
        organizationId: organizations[0].id,
        eventId: events[0].id,
        title: 'Future of AI Conference 2026 - Day 1',
        description: 'Photos from the first day of our AI conference.'
      }
    }),
    prisma.gallery.create({
      data: {
        organizationId: organizations[1].id,
        title: 'Green Future Initiative - Volunteer Activities',
        description: 'Photos from our recent volunteer activities and community events.'
      }
    })
  ])

  // Create gallery items
  await Promise.all([
    prisma.galleryItem.create({
      data: {
        galleryId: galleries[0].id,
        url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
        caption: 'Keynote speaker presenting on the future of AI',
        order: 0
      }
    }),
    prisma.galleryItem.create({
      data: {
        galleryId: galleries[0].id,
        url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=600&fit=crop',
        caption: 'Attendees networking during the coffee break',
        order: 1
      }
    }),
    prisma.galleryItem.create({
      data: {
        galleryId: galleries[1].id,
        url: 'https://images.unsplash.com/photo-1448315640896-05b2c30e5d62?w=800&h=600&fit=crop',
        caption: 'Volunteers planting trees in the community park',
        order: 0
      }
    })
  ])

  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        userId: users[0].id,
        type: 'EVENT_REMINDER',
        title: 'Future of AI Conference Reminder',
        message: 'The Future of AI Conference starts in 3 days!',
        data: { eventId: events[0].id },
        status: 'UNREAD'
      }
    }),
    prisma.notification.create({
      data: {
        userId: users[1].id,
        type: 'APPLICATION_UPDATE',
        title: 'Internship Application Update',
        message: 'Your application for the Software Engineering Internship has been reviewed.',
        data: { opportunityId: opportunities[0].id },
        status: 'UNREAD'
      }
    })
  ])

  // Create bookmarks
  await Promise.all([
    prisma.bookmark.create({
      data: {
        userId: users[0].id,
        eventId: events[1].id
      }
    }),
    prisma.bookmark.create({
      data: {
        userId: users[0].id,
        opportunityId: opportunities[1].id
      }
    })
  ])

  // Create certificates
  await Promise.all([
    prisma.certificate.create({
      data: {
        userId: users[2].id,
        eventId: events[0].id,
        type: 'VOLUNTEER',
        title: 'Volunteer Certificate of Appreciation',
        description: 'Awarded for outstanding service as a Registration Assistant at the Future of AI Conference 2026.',
        certificateUrl: 'https://example.com/certificates/volunteer-marcus-rodriguez.pdf'
      }
    }),
    prisma.certificate.create({
      data: {
        userId: users[0].id,
        eventId: events[0].id,
        type: 'PARTICIPATION',
        title: 'Participation Certificate',
        description: 'Awarded for participation in the Future of AI Conference 2026.',
        certificateUrl: 'https://example.com/certificates/participant-alex-johnson.pdf'
      }
    })
  ])

  // Create follows
  await Promise.all([
    prisma.follow.create({
      data: {
        followerId: users[0].id,
        followingId: users[1].id
      }
    }),
    prisma.follow.create({
      data: {
        followerId: users[2].id,
        followingId: users[0].id
      }
    })
  ])

  // Create comments
  await Promise.all([
    prisma.comment.create({
      data: {
        userId: users[0].id,
        eventId: events[0].id,
        content: 'This conference was amazing! Learned so much about AI.',
      }
    }),
    prisma.comment.create({
      data: {
        userId: users[1].id,
        eventId: events[0].id,
        content: 'Thanks for attending! We hope to see you at our next event.',
      }
    })
  ])

  // Create reactions
  await Promise.all([
    prisma.reaction.create({
      data: {
        userId: users[1].id,
        commentId: (await prisma.comment.findFirst({ where: { userId: users[0].id, eventId: events[0].id }}))!.id,
        type: 'like'
      }
    }),
    prisma.reaction.create({
      data: {
        userId: users[2].id,
        commentId: (await prisma.comment.findFirst({ where: { userId: users[0].id, eventId: events[0].id }}))!.id,
        type: 'celebrate'
      }
    })
  ])

  console.log('Database seeding completed successfully!')
}

main()
  .catch(e => {
    console.error('Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })