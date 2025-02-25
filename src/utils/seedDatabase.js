import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { ensureAdminUser } from './auth';

const seedDatabase = async () => {
  try {
    // First authenticate as admin
    const userCredential = await ensureAdminUser();
    const user = userCredential.user;
    
    // Dummy Events
    const events = [
      {
        name: "AI Conference 2025",
        date: Timestamp.fromDate(new Date("2025-03-15")),
        location: "Tech Hub, Silicon Valley",
        participantCount: 150,
        status: "upcoming",
        budget: 25000
      },
      {
        name: "Machine Learning Workshop",
        date: Timestamp.fromDate(new Date("2025-04-01")),
        location: "Innovation Center",
        participantCount: 75,
        status: "upcoming",
        budget: 15000
      },
      {
        name: "Data Science Symposium",
        date: Timestamp.fromDate(new Date("2025-03-01")),
        location: "Virtual Event",
        participantCount: 200,
        status: "completed",
        budget: 10000
      }
    ];

    // Dummy Participants
    const participants = [
      {
        name: "John Doe",
        email: "john@example.com",
        registrationDate: Timestamp.fromDate(new Date("2025-02-01")),
        eventId: "AI Conference 2025",
        status: "registered"
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        registrationDate: Timestamp.fromDate(new Date("2025-02-05")),
        eventId: "Machine Learning Workshop",
        status: "registered"
      },
      {
        name: "Bob Wilson",
        email: "bob@example.com",
        registrationDate: Timestamp.fromDate(new Date("2025-02-10")),
        eventId: "Data Science Symposium",
        status: "attended"
      }
    ];

    // Dummy Tasks
    const tasks = [
      {
        title: "Set up registration portal",
        description: "Create and deploy event registration system",
        committee: "technical",
        assignedTo: "Alex Tech",
        deadline: Timestamp.fromDate(new Date("2025-02-28")),
        completed: false,
        priority: "high"
      },
      {
        title: "Design event brochure",
        description: "Create marketing materials for the event",
        committee: "marketing",
        assignedTo: "Sarah Creative",
        deadline: Timestamp.fromDate(new Date("2025-03-01")),
        completed: true,
        priority: "medium"
      },
      {
        title: "Arrange venue logistics",
        description: "Coordinate with venue for setup and equipment",
        committee: "logistics",
        assignedTo: "Mike Operations",
        deadline: Timestamp.fromDate(new Date("2025-03-10")),
        completed: false,
        priority: "high"
      }
    ];

    // Dummy Budget Entries
    const budgetEntries = [
      {
        description: "Venue booking",
        amount: 10000,
        type: "expense",
        category: "venue",
        date: Timestamp.fromDate(new Date("2025-01-15")),
        eventId: "AI Conference 2025"
      },
      {
        description: "Sponsorship - TechCorp",
        amount: 15000,
        type: "income",
        category: "sponsorship",
        date: Timestamp.fromDate(new Date("2025-01-20")),
        eventId: "AI Conference 2025"
      },
      {
        description: "Marketing materials",
        amount: 5000,
        type: "expense",
        category: "marketing",
        date: Timestamp.fromDate(new Date("2025-01-25")),
        eventId: "Machine Learning Workshop"
      }
    ];

    // Add data to collections
    for (const event of events) {
      await addDoc(collection(db, 'events'), {
        ...event,
        createdAt: Timestamp.now(),
        createdBy: user.uid
      });
      console.log('Added event:', event.name);
    }

    for (const participant of participants) {
      await addDoc(collection(db, 'participants'), {
        ...participant,
        createdAt: Timestamp.now(),
        createdBy: user.uid
      });
      console.log('Added participant:', participant.name);
    }

    for (const task of tasks) {
      await addDoc(collection(db, 'tasks'), {
        ...task,
        createdAt: Timestamp.now(),
        createdBy: user.uid
      });
      console.log('Added task:', task.title);
    }

    for (const budget of budgetEntries) {
      await addDoc(collection(db, 'budget'), {
        ...budget,
        createdAt: Timestamp.now(),
        createdBy: user.uid
      });
      console.log('Added budget entry:', budget.description);
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export default seedDatabase;
