# ESOP Management System

A full-stack application for managing Employee Stock Ownership Plans (ESOPs) with secure authentication, MFA support, and data visualization.

## Features

- Secure authentication with OAuth providers (Google, GitHub) and email/password
- Multi-factor authentication (MFA) for enhanced security
- Excel/CSV file upload for ESOP data
- Interactive data visualization dashboards
- Performance-optimized UI with error handling
- GraphQL API for flexible data access

## Tech Stack

### Frontend
- Next.js (React framework)
- TypeScript
- Tailwind CSS for styling
- Recharts for data visualization
- GSAP for animations
- React Spring for UI effects

### Backend
- Node.js with Express
- MongoDB for data storage
- Passport.js for authentication
- JWT for API authorization
- GraphQL for flexible data querying

## Recent Improvements

- Implemented proper authentication with email/password and OAuth providers
- Added MFA verification using the speakeasy library
- Moved session management to the backend for better security
- Refactored complex UI components for better maintainability
- Added error boundaries throughout the React application
- Optimized animations for better performance
- Improved environment configuration for different deployment environments
- Enhanced database connection with retry mechanisms
- Secured API endpoints with proper authentication checks

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your MongoDB URI and other settings

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd Frontend/esop
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file by copying `.env.example`:
   ```bash
   cp .env.example .env.local
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

Refer to the `testing-with-testsprite.md` file for comprehensive testing instructions using TestSprite.

## Deployment

### Backend Deployment

1. Set all required environment variables for production
2. Build the application:
   ```bash
   npm run build
   ```
3. Start the production server:
   ```bash
   npm start
   ```

### Frontend Deployment

1. Set the API_URL environment variable to point to your production backend
2. Build the application:
   ```bash
   npm run build
   ```
3. Deploy the `.next` folder to your hosting provider

## Security Considerations

- Always use HTTPS in production
- Store sensitive data in environment variables
- Keep dependencies updated to patch security vulnerabilities
- Use secure HTTP headers as configured in the backend
- Implement rate limiting for authentication endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

This project is licensed under the MIT License
