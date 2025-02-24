import { GoogleGenerativeAI } from '@google/generative-ai';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const generateSponsors = async (eventDetails) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate a list of 10 potential sponsors based in Mumbai and Maharashtra for a college event with the following details:
    Event Type: ${eventDetails.eventType}
    Expected Attendees: ${eventDetails.expectedAttendees}
    Budget: ₹${eventDetails.totalBudget}
    Additional Requirements: ${eventDetails.additionalRequirements}

    Focus on companies that:
    1. Have headquarters or major presence in Mumbai/Maharashtra
    2. Have history of supporting college events
    3. Are relevant to the event type and audience

    For each sponsor, provide:
    1. Company Name
    2. Industry/Sector
    3. Sponsorship Category (Platinum/Gold/Silver)
    4. Contact Person Name
    5. Contact Email
    6. Contact Phone
    7. Mumbai Office Address
    8. Typical Sponsorship Range
    9. Past Event Sponsorship History
    10. Preferred Event Types

    Format the response as structured data that can be parsed into rows.
    Use realistic Mumbai-based company details and contact information.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse the AI response into structured data
    const sponsors = parseSponsorsData(text);
    
    return sponsors;
  } catch (error) {
    console.error('Error generating sponsor recommendations:', error);
    return getSampleSponsors(); // Fallback to sample data
  }
};

const parseSponsorsData = (text) => {
  // This is a simple parser. In production, you'd want more robust parsing
  const lines = text.split('\n').filter(line => line.trim());
  const sponsors = [];
  let currentSponsor = {};

  for (const line of lines) {
    if (line.includes('Company Name:')) {
      if (Object.keys(currentSponsor).length > 0) {
        sponsors.push(currentSponsor);
      }
      currentSponsor = {};
      currentSponsor.companyName = line.split('Company Name:')[1].trim();
    } else if (line.includes('Industry:')) {
      currentSponsor.industry = line.split('Industry:')[1].trim();
    } else if (line.includes('Sponsorship Category:')) {
      currentSponsor.category = line.split('Sponsorship Category:')[1].trim();
    } else if (line.includes('Contact Person:')) {
      currentSponsor.contactPerson = line.split('Contact Person:')[1].trim();
    } else if (line.includes('Email:')) {
      currentSponsor.email = line.split('Email:')[1].trim();
    } else if (line.includes('Phone:')) {
      currentSponsor.phone = line.split('Phone:')[1].trim();
    } else if (line.includes('Address:')) {
      currentSponsor.address = line.split('Address:')[1].trim();
    } else if (line.includes('Sponsorship Range:')) {
      currentSponsor.sponsorshipRange = line.split('Sponsorship Range:')[1].trim();
    } else if (line.includes('Past Events:')) {
      currentSponsor.pastEvents = line.split('Past Events:')[1].trim();
    } else if (line.includes('Preferred Events:')) {
      currentSponsor.preferredEvents = line.split('Preferred Events:')[1].trim();
    }
  }
  
  if (Object.keys(currentSponsor).length > 0) {
    sponsors.push(currentSponsor);
  }

  return sponsors;
};

export const generateSponsorsExcel = (sponsors) => {
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(sponsors.map(sponsor => ({
    'Company Name': sponsor.companyName,
    'Industry/Sector': sponsor.industry,
    'Sponsorship Category': sponsor.category,
    'Contact Person': sponsor.contactPerson,
    'Email': sponsor.email,
    'Phone': sponsor.phone,
    'Address': sponsor.address,
    'Sponsorship Range': sponsor.sponsorshipRange,
    'Past Event History': sponsor.pastEvents,
    'Preferred Event Types': sponsor.preferredEvents
  })));

  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Potential Sponsors');

  // Generate Excel file
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  // Save file
  saveAs(data, 'potential_sponsors.xlsx');
};

// Fallback sample data with Mumbai-based companies
const getSampleSponsors = () => [
  // Corporate Giants
  {
    companyName: "Reliance Industries Ltd",
    industry: "Conglomerate",
    category: "Platinum",
    contactPerson: "Rajesh Mehta",
    email: "rajesh.mehta@ril.com",
    phone: "+91-22-3555-5000",
    address: "Maker Chambers IV, Nariman Point, Mumbai 400021",
    sponsorshipRange: "₹10,00,000 - ₹25,00,000",
    pastEvents: "Tech Symposiums, Cultural Festivals",
    preferredEvents: "Innovation Challenges, Cultural Events"
  },
  {
    companyName: "Tata Consultancy Services",
    industry: "Information Technology",
    category: "Platinum",
    contactPerson: "Priya Shah",
    email: "priya.shah@tcs.com",
    phone: "+91-22-6778-9999",
    address: "TCS House, Raveline Street, Fort, Mumbai 400001",
    sponsorshipRange: "₹5,00,000 - ₹15,00,000",
    pastEvents: "Coding Competitions, Tech Fests",
    preferredEvents: "Technical Workshops, Hackathons"
  },
  // Banking & Finance
  {
    companyName: "HDFC Bank",
    industry: "Banking",
    category: "Gold",
    contactPerson: "Amit Desai",
    email: "amit.desai@hdfcbank.com",
    phone: "+91-22-6161-6161",
    address: "HDFC Bank House, Senapati Bapat Marg, Lower Parel, Mumbai 400013",
    sponsorshipRange: "₹3,00,000 - ₹8,00,000",
    pastEvents: "Business Conclaves, Finance Seminars",
    preferredEvents: "Finance Workshops, Business Events"
  },
  {
    companyName: "ICICI Bank",
    industry: "Banking",
    category: "Gold",
    contactPerson: "Sneha Patel",
    email: "sneha.patel@icicibank.com",
    phone: "+91-22-2653-1414",
    address: "ICICI Bank Towers, Bandra-Kurla Complex, Mumbai 400051",
    sponsorshipRange: "₹3,00,000 - ₹7,00,000",
    pastEvents: "Financial Literacy Programs, Youth Festivals",
    preferredEvents: "Educational Events, Cultural Programs"
  },
  // Entertainment & Media
  {
    companyName: "Zee Entertainment",
    industry: "Media & Entertainment",
    category: "Gold",
    contactPerson: "Vikram Singh",
    email: "vikram.singh@zee.com",
    phone: "+91-22-7106-1234",
    address: "18th Floor, Marathon Futurex, Lower Parel, Mumbai 400013",
    sponsorshipRange: "₹2,00,000 - ₹5,00,000",
    pastEvents: "Media Festivals, Cultural Shows",
    preferredEvents: "Cultural Events, Entertainment Shows"
  },
  // Local Tech Companies
  {
    companyName: "Tech Mahindra",
    industry: "Information Technology",
    category: "Gold",
    contactPerson: "Rahul Kumar",
    email: "rahul.kumar@techmahindra.com",
    phone: "+91-22-6722-8888",
    address: "Spectrum Towers, Mindspace Complex, Malad West, Mumbai 400064",
    sponsorshipRange: "₹2,00,000 - ₹6,00,000",
    pastEvents: "Tech Conferences, Innovation Meets",
    preferredEvents: "Technology Events, Innovation Competitions"
  },
  // FMCG Companies
  {
    companyName: "Hindustan Unilever",
    industry: "FMCG",
    category: "Silver",
    contactPerson: "Anjali Sharma",
    email: "anjali.sharma@hul.com",
    phone: "+91-22-3983-3000",
    address: "Unilever House, B.D. Sawant Marg, Chakala, Andheri East, Mumbai 400099",
    sponsorshipRange: "₹1,00,000 - ₹3,00,000",
    pastEvents: "Marketing Events, Campus Initiatives",
    preferredEvents: "Marketing Competitions, Youth Events"
  },
  // Retail
  {
    companyName: "D'Mart",
    industry: "Retail",
    category: "Silver",
    contactPerson: "Rajesh Gupta",
    email: "rajesh.gupta@dmart.in",
    phone: "+91-22-3340-0000",
    address: "Anjaneya CHS Limited, Nahur Village, Mulund West, Mumbai 400080",
    sponsorshipRange: "₹50,000 - ₹2,00,000",
    pastEvents: "Local Community Events, College Fests",
    preferredEvents: "Community Events, Student Activities"
  },
  // Local Success Stories
  {
    companyName: "Mumbai Angels Network",
    industry: "Investment",
    category: "Silver",
    contactPerson: "Priti Rathi",
    email: "priti.rathi@mumbaiangels.com",
    phone: "+91-22-4972-0000",
    address: "B Wing, Trade Centre, Bandra Kurla Complex, Mumbai 400051",
    sponsorshipRange: "₹1,00,000 - ₹3,00,000",
    pastEvents: "Startup Events, Entrepreneurship Summits",
    preferredEvents: "Startup Competitions, Business Plan Contests"
  },
  // Education Sector
  {
    companyName: "NIIT Mumbai",
    industry: "Education",
    category: "Bronze",
    contactPerson: "Sanjay Mehta",
    email: "sanjay.mehta@niit.com",
    phone: "+91-22-2847-0000",
    address: "Techniplex Complex, Goregaon West, Mumbai 400062",
    sponsorshipRange: "₹25,000 - ₹1,00,000",
    pastEvents: "Technical Training Programs, Education Fairs",
    preferredEvents: "Technical Workshops, Career Fairs"
  }
];
