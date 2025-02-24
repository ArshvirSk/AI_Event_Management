// AI-based budget calculation logic
import { generateTasksAndBudgetRecommendations } from './geminiService';
import { getVendorRecommendations } from './vendorService';
import { generateSponsors } from './sponsorService';

export const calculateBudget = async (formData) => {
  const { totalBudget, expectedAttendees, eventDuration, eventType } = formData;
  
  // Get vendor and sponsor recommendations
  const [
    { vendors, city, aiRecommendation },
    sponsors,
    { budgetRecommendations: { aiRecommendations }, tasks }
  ] = await Promise.all([
    getVendorRecommendations(formData),
    generateSponsors(formData),
    generateTasksAndBudgetRecommendations(
      {
        title: formData.eventName,
        description: formData.additionalRequirements,
        startDate: formData.eventDate,
        endDate: formData.eventDate // For single day events
      },
      [], // Empty team members for now, can be added later
      formData
    )
  ]);

  // Basic cost ratios based on event type (adjusted for Indian context)
  const costRatios = {
    'Venue Rental': 0.25,
    'Catering & Refreshments': 0.30,
    'Decoration & Ambiance': 0.15,
    'Technical Equipment': 0.12,
    'Marketing & Promotion': 0.08,
    'Miscellaneous & Emergency': 0.10
  };

  // Calculate budget breakdown in rupees
  const breakdown = {};
  Object.entries(costRatios).forEach(([category, ratio]) => {
    breakdown[category] = Math.round(totalBudget * ratio);
  });

  // Calculate potential sponsorship amount
  const potentialSponsorship = sponsors.reduce((total, sponsor) => {
    const range = sponsor.sponsorshipRange.match(/₹([\d,]+)/g);
    if (range && range.length > 0) {
      const amount = parseInt(range[0].replace(/[₹,]/g, ''));
      return total + amount;
    }
    return total;
  }, 0);

  // Generate basic recommendations
  const baseRecommendations = [
    `Venue Space Required: ${calculateVenueSize(expectedAttendees)} sqft`,
    `For ${eventDuration} hours, plan for ${Math.ceil(eventDuration / 4)} meal/snack services`,
    `Emergency Fund: ₹${Math.round(totalBudget * 0.10)}`,
    getEventSpecificRecommendation(eventType),
    `Recommended City: ${city} - ${aiRecommendation}`,
    `Potential Sponsorship Amount: ₹${potentialSponsorship.toLocaleString('en-IN')} from ${sponsors.length} potential sponsors`
  ];

  return {
    totalBudget: parseInt(totalBudget),
    breakdown,
    recommendations: [...baseRecommendations, ...aiRecommendations],
    currency: '₹',
    vendors,
    recommendedCity: city,
    sponsors,
    potentialSponsorship,
    tasks: tasks.tasks // Include AI-generated tasks in the response
  };
};

const calculateVenueSize = (attendees) => {
  return attendees * 12;
};

const getEventSpecificRecommendation = (eventType) => {
  const recommendations = {
    'conference': 'Consider booking a professional conference venue with built-in AV equipment',
    'cultural': 'Look for venues with proper stage and green room facilities',
    'technical': 'Ensure backup power supply and high-speed internet connectivity',
    'sports': 'Include first-aid facilities and necessary safety equipment',
    'workshop': 'Account for workshop materials and handouts in the budget'
  };

  return recommendations[eventType.toLowerCase()] || 
    'Consider professional photography/videography services for event documentation';
};
