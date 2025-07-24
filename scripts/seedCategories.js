const mongoose = require("mongoose")
const dotenv = require("dotenv")
const Category = require("../models/Category")

dotenv.config()

const categories = [
  // Home & Personal Services
  { name: "Barbers",  },
  { name: "House cleaning", },
  { name: "Laundry & dry cleaning",  },
  { name: "Plumbing & electrical repairs", },
  { name: "Air conditioning installation/servicing", },
  { name: "Pest control", description: "Pest elimination and prevention services" },
  { name: "Interior decoration", description: "Home and office interior design services" },
  { name: "Painting", description: "House and building painting services" },
  { name: "Carpentry & furniture making", description: "Wood working, furniture making, and carpentry services" },
  { name: "Home tutoring (for children)", description: "Private tutoring and educational support for children" },
  { name: "Personal fitness training", description: "Personal fitness coaching and training services" },
  { name: "Massage therapy & spa services", description: "Therapeutic massage and spa treatment services" },
  { name: "Beauty & makeup services (e.g. for weddings)", description: "Professional beauty and makeup services for events" },
  { name: "Hairdressing/barbing", description: "Hair styling, cutting, and grooming services" },

  // Skilled Trade & Technical Services
  { name: "Auto repair/mechanic", description: "Vehicle repair and maintenance services" },
  { name: "Auto diagnostics and computerization", description: "Vehicle diagnostic and computer system services" },
  { name: "Generator maintenance", description: "Generator repair, maintenance, and servicing" },
  { name: "Welding & fabrication", description: "Metal welding and fabrication services" },
  { name: "Tailoring & fashion design", description: "Clothing design, tailoring, and alteration services" },
  { name: "Shoe & bag repairs", description: "Footwear and bag repair services" },
  { name: "Phone & gadget repairs", description: "Mobile phone and electronic device repair services" },
  { name: "Satellite TV installation (DSTV, GoTV)", description: "Satellite TV installation and setup services" },

  // Digital & Tech Services
  { name: "Website design/development", description: "Web design and development services" },
  { name: "Graphic design & branding", description: "Graphic design and brand identity services" },
  { name: "Photography & videography", description: "Professional photography and videography services" },
  { name: "Social media management", description: "Social media marketing and management services" },
  { name: "Digital marketing", description: "Online marketing and advertising services" },
  { name: "SEO services", description: "Search engine optimization services" },
  { name: "App development", description: "Mobile and web application development" },
  { name: "Tech support & computer repairs", description: "Computer repair and technical support services" },
  { name: "Printing & photocopying", description: "Printing, photocopying, and document services" },
  { name: "Cybercafé and internet services", description: "Internet access and cyber café services" },
  { name: "CCTV & security system installation", description: "Security camera and system installation services" },

  // Corporate & Professional Services
  { name: "Legal services (lawyers)", description: "Legal consultation and representation services" },
  { name: "Accounting & tax consultancy", description: "Accounting, bookkeeping, and tax services" },
  { name: "Real estate agency", description: "Property buying, selling, and rental services" },
  { name: "Property management", description: "Property management and maintenance services" },
  { name: "Engineering consultancy", description: "Professional engineering consultation services" },
  { name: "Oil & gas services", description: "Oil and gas industry support services" },
  { name: "Procurement & logistics", description: "Procurement and supply chain management services" },
  { name: "HR & recruitment services", description: "Human resources and recruitment services" },
  { name: "Document typing & CV writing", description: "Document preparation and CV writing services" },
  { name: "Event planning & management", description: "Event planning and coordination services" },

  // Logistics & Transportation
  { name: "Bike delivery (dispatch riders)", description: "Motorcycle delivery and courier services" },
  { name: "Package courier service", description: "Package delivery and courier services" },
  { name: "Truck/haulage services", description: "Heavy-duty transportation and haulage services" },
  { name: "Car hire services", description: "Vehicle rental and hire services" },
  { name: "Boat transport (for riverside areas)", description: "Water transportation services" },
  { name: "Movers & packers", description: "Moving and packing services for relocation" },

  // Event & Entertainment Services
  { name: "Catering services", description: "Food catering for events and occasions" },
  { name: "Event décor", description: "Event decoration and styling services" },
  { name: "Rental services (canopies, chairs, coolers)", description: "Event equipment rental services" },
  { name: "MCs, DJs, and live band hire", description: "Entertainment services for events" },
  { name: "Party planning for kids & adults", description: "Party planning and coordination services" },
  { name: "Photography & drone videography", description: "Aerial photography and videography services" },
  { name: "Makeup artists for events", description: "Professional makeup services for events" },
  { name: "Fashion styling", description: "Personal styling and fashion consultation services" },

  // Retail & E-commerce
  { name: "Food delivery", description: "Restaurant and food delivery services" },
  { name: "Grocery shopping & delivery", description: "Grocery shopping and delivery services" },
  { name: "Online fashion vendors", description: "Fashion retail and online clothing sales" },
  { name: "Home appliance vendors", description: "Home appliance sales and distribution" },
  { name: "Mobile phones & accessories sales", description: "Mobile phone and accessory retail" },
  { name: "Electronics retail", description: "Electronic devices and gadgets retail" },
  { name: "Hair & beauty product sales", description: "Beauty and hair care product sales" },

  // Health & Wellness Services
  { name: "Mobile health testing", description: "Mobile health screening and testing services (blood pressure, sugar, etc.)" },
  { name: "Home nursing care", description: "Home healthcare and nursing services" },
  { name: "Physiotherapy", description: "Physical therapy and rehabilitation services" },
  { name: "Herbal medicine/traditional healing", description: "Traditional medicine and herbal healing services" },
  { name: "Counseling & therapy", description: "Mental health counseling and therapy services" },
  { name: "Pharmacy delivery", description: "Medication delivery and pharmacy services" },

  // Education & Training
  { name: "Private/home tutoring", description: "Private tutoring and educational support" },
  { name: "JAMB/WAEC/IELTS coaching", description: "Exam preparation and coaching services" },
  { name: "Vocational training (e.g. fashion, tech)", description: "Skills training and vocational education" },
  { name: "Online courses & seminars", description: "Online education and training programs" },
  { name: "Driving school", description: "Driving lessons and license preparation" },
  { name: "Music & instrument lessons", description: "Music education and instrument training" },

  // Pet & Agricultural Services
  { name: "Veterinary services", description: "Animal healthcare and veterinary services" },
  { name: "Pet grooming", description: "Pet grooming and care services" },
  { name: "Poultry farming consultancy", description: "Poultry farming advice and consultation" },
  { name: "Garden & landscaping", description: "Garden design and landscaping services" },
  { name: "Fish farming setup/support", description: "Aquaculture setup and support services" },
]

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

    // Clear existing categories
    await Category.deleteMany({})
    console.log("Cleared existing categories")

    // Insert new categories
    await Category.insertMany(categories)
    console.log("Categories seeded successfully")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding categories:", error)
    process.exit(1)
  }
};

seedCategories()
