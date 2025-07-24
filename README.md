# QuickWork.ng - Service Marketplace

A modern two-sided marketplace platform connecting skilled service providers with customers across Nigeria.

## Features

### For Customers
- Search and filter service providers by category, location, and ratings
- View detailed provider profiles with portfolios
- Direct contact via WhatsApp, phone, or email
- Browse verified professionals across multiple service categories

### For Service Providers
- Create comprehensive professional profiles
- Showcase work through portfolio galleries
- Manage contact information and service areas
- Track profile views and customer interactions

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

## Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd marketplace-backend
   \`\`\`

2. **Install frontend dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Install backend dependencies**
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

4. **Set up environment variables**
   
   Frontend (`.env.local`):
   \`\`\`env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   \`\`\`
   
   Backend (`.env`):
   \`\`\`env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/marketplace
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   \`\`\`

5. **Start MongoDB**
   \`\`\`bash
   mongod
   \`\`\`

6. **Seed the database**
   \`\`\`bash
   cd backend
   npm run seed
   \`\`\`

7. **Start the backend server**
   \`\`\`bash
   cd backend
   npm run dev
   \`\`\`

8. **Start the frontend development server**
   \`\`\`bash
   npm run dev
   \`\`\`

9. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── search/            # Provider search
│   ├── providers/         # Provider profiles
│   └── provider/          # Provider dashboard
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── context/              # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # API clients and utilities
├── backend/              # Express.js backend
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middleware/       # Express middleware
│   └── scripts/          # Database scripts
└── public/               # Static assets
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Providers
- `GET /api/providers` - Get all providers
- `GET /api/providers/search` - Search providers
- `GET /api/providers/:id` - Get provider by ID
- `POST /api/providers/profile` - Create provider profile
- `PUT /api/providers/:id/profile` - Update provider profile
- `POST /api/providers/:id/portfolio` - Add portfolio item

### Categories
- `GET /api/categories` - Get all service categories

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (Provider/Customer)
- Persistent login sessions
- Protected routes

### Search & Discovery
- Advanced search with filters
- Category-based browsing
- Location-based filtering
- Pagination support

### Provider Profiles
- Comprehensive profile creation
- Portfolio management
- Contact information
- Rating and review system

### Communication
- WhatsApp integration
- Direct phone calling
- Email contact
- Pre-filled contact messages

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@quickwork.ng or join our Slack channel.
"# QuickWorkNG" 
