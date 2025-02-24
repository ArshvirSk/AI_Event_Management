import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Updated vendor database focusing on Mumbai and Maharashtra
const vendorDatabase = {
  venues: [
    // College Venues
    {
      name: "VJTI College Auditorium",
      category: "College Venue",
      address: "H R Mahajani Rd, Matunga, Mumbai, Maharashtra 400019",
      phone: "+91-22-2419-8101",
      rating: 4.4,
      specialization: "Technical events and seminars",
      location: { lat: 19.0222, lng: 72.8561 }
    },
    {
      name: "St. Xavier's College Hall",
      category: "College Venue",
      address: "5, Mahapalika Marg, Mumbai, Maharashtra 400001",
      phone: "+91-22-2262-0661",
      rating: 4.6,
      specialization: "Cultural events and performances",
      location: { lat: 18.9432, lng: 72.8324 }
    },
    // Professional Venues
    {
      name: "The Grand Hyatt Mumbai",
      category: "Premium Venue",
      address: "Off Western Express Highway, Santacruz East, Mumbai, Maharashtra 400055",
      phone: "+91-22-6676-1234",
      rating: 4.8,
      specialization: "Large conferences and cultural events",
      location: { lat: 19.0760, lng: 72.8777 }
    },
    {
      name: "Nehru Centre Auditorium",
      category: "Auditorium",
      address: "Dr. Annie Besant Road, Worli, Mumbai, Maharashtra 400018",
      phone: "+91-22-2496-4676",
      rating: 4.5,
      specialization: "Cultural performances and seminars",
      location: { lat: 19.0132, lng: 72.8176 }
    },
    {
      name: "Rang Sharda Auditorium",
      category: "Cultural Center",
      address: "KC Marg, Bandra Reclamation, Bandra West, Mumbai 400050",
      phone: "+91-22-2640-1919",
      rating: 4.3,
      specialization: "Theater and cultural performances",
      location: { lat: 19.0509, lng: 72.8320 }
    }
  ],
  caterers: [
    // Traditional Maharashtra Cuisine
    {
      name: "Maharashtra Kitchen",
      category: "Traditional Catering",
      address: "Dadar West, Mumbai, Maharashtra 400028",
      phone: "+91-98765-43210",
      rating: 4.7,
      specialization: "Authentic Maharashtrian cuisine",
      location: { lat: 19.0178, lng: 72.8478 }
    },
    {
      name: "Pune Caterers Mumbai",
      category: "Regional Cuisine",
      address: "Vile Parle East, Mumbai, Maharashtra 400057",
      phone: "+91-98765-43211",
      rating: 4.6,
      specialization: "Traditional Maharashtrian snacks and meals",
      location: { lat: 19.0969, lng: 72.8575 }
    },
    // Modern Catering
    {
      name: "Foodlink Services",
      category: "Premium Catering",
      address: "Lower Parel, Mumbai, Maharashtra 400013",
      phone: "+91-22-4343-4343",
      rating: 4.8,
      specialization: "Multi-cuisine corporate catering",
      location: { lat: 18.9977, lng: 72.8376 }
    },
    {
      name: "Blue Sea Catering",
      category: "Event Catering",
      address: "Worli, Mumbai, Maharashtra 400025",
      phone: "+91-22-2438-2222",
      rating: 4.6,
      specialization: "Large-scale event catering",
      location: { lat: 19.0176, lng: 72.8145 }
    }
  ],
  decorators: [
    // Modern Decorators
    {
      name: "Creative Corner Events",
      category: "Event Design",
      address: "Bandra West, Mumbai, Maharashtra 400050",
      phone: "+91-98765-43211",
      rating: 4.8,
      specialization: "Modern event designs and setups",
      location: { lat: 19.0596, lng: 72.8295 }
    },
    {
      name: "Mumbai Event Decorators",
      category: "Full Service Decoration",
      address: "Malad West, Mumbai, Maharashtra 400064",
      phone: "+91-98765-43212",
      rating: 4.4,
      specialization: "College event decorations",
      location: { lat: 19.1872, lng: 72.8484 }
    },
    // Traditional Decorators
    {
      name: "Maharashtra Events",
      category: "Traditional Decoration",
      address: "Thane West, Maharashtra 400601",
      phone: "+91-98765-43213",
      rating: 4.5,
      specialization: "Traditional Maharashtrian decoration",
      location: { lat: 19.2335, lng: 72.9780 }
    }
  ],
  equipment: [
    // Audio-Visual
    {
      name: "Sound & Light Pro",
      category: "AV Equipment",
      address: "Kandivali East, Mumbai, Maharashtra 400101",
      phone: "+91-98765-43214",
      rating: 4.7,
      specialization: "Professional sound and lighting systems",
      location: { lat: 19.2037, lng: 72.8597 }
    },
    {
      name: "Tech Events Mumbai",
      category: "Technical Equipment",
      address: "Powai, Mumbai, Maharashtra 400076",
      phone: "+91-98765-43215",
      rating: 4.5,
      specialization: "Complete technical event solutions",
      location: { lat: 19.1176, lng: 72.9060 }
    }
  ],
  photography: [
    {
      name: "PixelPro Mumbai",
      category: "Event Photography",
      address: "Andheri West, Mumbai, Maharashtra 400053",
      phone: "+91-98765-43216",
      rating: 4.8,
      specialization: "Event photography and videography",
      location: { lat: 19.1136, lng: 72.8697 }
    },
    {
      name: "Mumbai Memories",
      category: "Photography & Videography",
      address: "Borivali West, Mumbai, Maharashtra 400092",
      phone: "+91-98765-43217",
      rating: 4.6,
      specialization: "Complete event documentation",
      location: { lat: 19.2362, lng: 72.8486 }
    }
  ],
  transportation: [
    {
      name: "Mumbai Event Transport",
      category: "Transportation Services",
      address: "Kurla West, Mumbai, Maharashtra 400070",
      phone: "+91-98765-43218",
      rating: 4.4,
      specialization: "Event transportation and logistics",
      location: { lat: 19.0726, lng: 72.8845 }
    },
    {
      name: "City Connect Events",
      category: "Transport Solutions",
      address: "Chembur, Mumbai, Maharashtra 400071",
      phone: "+91-98765-43219",
      rating: 4.3,
      specialization: "Guest transportation services",
      location: { lat: 19.0522, lng: 72.9005 }
    }
  ]
};

export const getVendorRecommendations = async (eventDetails) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Based on the following event details, suggest which areas in Mumbai would be best suited and what type of vendors to prioritize:
    Event Type: ${eventDetails.eventType}
    Expected Attendees: ${eventDetails.expectedAttendees}
    Budget: ₹${eventDetails.totalBudget}
    Additional Requirements: ${eventDetails.additionalRequirements}

    Consider factors like:
    1. Accessibility via public transport
    2. Parking availability
    3. Venue capacity and facilities
    4. Local restrictions and permissions
    5. Weather conditions (if outdoor event)
    6. Peak traffic hours in Mumbai
    7. Proximity to colleges/target audience`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiRecommendation = response.text();

    // Combine all vendors into a single array
    const allVendors = [
      ...vendorDatabase.venues,
      ...vendorDatabase.caterers,
      ...vendorDatabase.decorators,
      ...vendorDatabase.equipment,
      ...vendorDatabase.photography,
      ...vendorDatabase.transportation
    ];

    return {
      vendors: allVendors,
      city: 'Mumbai',
      aiRecommendation
    };
  } catch (error) {
    console.error('Error getting vendor recommendations:', error);
    return {
      vendors: vendorDatabase.venues,
      city: 'Mumbai',
      aiRecommendation: 'Error generating AI recommendation'
    };
  }
};
