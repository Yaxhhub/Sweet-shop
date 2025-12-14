# Sweet Shop Management System

A full-stack application for managing a sweet shop with user authentication, inventory management, and purchase functionality.

## Tech Stack

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- JWT authentication
- bcrypt for password hashing

### Frontend
- React with TypeScript
- Axios for API calls
- Context API for state management
- Responsive CSS styling


### Authentication
- User registration and login
- JWT-based authentication
- Role-based access (USER, ADMIN)

### Sweet Management
- View all sweets
- Search by name/category/price
- Purchase sweets (reduces quantity)
- Admin: Add, update, delete sweets
- Admin: Restock inventory

### Business Rules
- Purchase fails if quantity is 0
- Quantity cannot be negative
- Restock amount must be positive
- Proper HTTP status codes

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Update `.env` file with your configuration:
```
PORT=8000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
NODE_ENV=development
```

**Note:** You need to:
- Set up your own MongoDB database (local or MongoDB Atlas)
- Generate a secure JWT secret key
- Update the connection string accordingly

5. Start the server:
```bash
npm run dev
```

6. Run tests:
```bash
npm test
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` and connect to the backend on `http://localhost:8000`.

## API Endpoints

### Authentication (Public)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Sweets (Protected)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets
- `POST /api/sweets` - Create sweet (Admin only)
- `PUT /api/sweets/:id` - Update sweet (Admin only)
- `DELETE /api/sweets/:id` - Delete sweet (Admin only)

### Inventory
- `POST /api/sweets/:id/purchase` - Purchase sweet
- `POST /api/sweets/:id/restock` - Restock sweet (Admin only)

## Usage

1. Register as a new user (select USER or ADMIN role)
2. Login with your credentials
3. Browse available sweets
4. Use search functionality to find specific sweets
5. Purchase sweets (quantity will decrease)
6. Admin users can:
   - Add new sweets
   - Delete existing sweets
   - Restock inventory


## Project Structure

```
sweet-shop/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Sweet.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── sweets.js
│   ├── middleware/
│   │   └── auth.js
│   ├── tests/
│   │   ├── auth.test.js
│   │   └── sweets.test.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── SweetsList.tsx
    │   │   └── AdminPanel.tsx
    │   ├── contexts/
    │   │   └── AuthContext.tsx
    │   ├── services/
    │   │   └── api.ts
    │   └── App.tsx
    └── package.json
```