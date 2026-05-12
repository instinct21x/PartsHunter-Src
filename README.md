# PartsHunter Backend Setup

## Prerequisites
- Node.js (v16 or higher)
- MongoDB running locally or a MongoDB Atlas connection string

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
The `.env` file is already created with default values. Update if needed:
```
MONGODB_URI=mongodb://localhost:27017/partshunter
JWT_SECRET=your_jwt_secret_key_change_this
PORT=5000
```

**For MongoDB Atlas**, replace `MONGODB_URI` with your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/partshunter?retryWrites=true&w=majority
```

### 3. Start MongoDB (if using local)
```bash
# On Windows with MongoDB installed:
mongod

# Or using Docker:
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4. Start the Backend Server
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### Register
- **POST** `/api/auth/register`
- Body: `{ name, email, password }`
- Response: `{ success, token, user }`

### Login
- **POST** `/api/auth/login`
- Body: `{ email, password }`
- Response: `{ success, token, user }`

### Get Current User
- **GET** `/api/auth/me`
- Headers: `Authorization: Bearer <token>`
- Response: `{ success, user }`

### Add Car
- **POST** `/api/auth/cars`
- Headers: `Authorization: Bearer <token>`
- Body: car object
- Response: `{ success, savedCars }`

### Delete Car
- **DELETE** `/api/auth/cars/:carId`
- Headers: `Authorization: Bearer <token>`
- Response: `{ success, savedCars }`

## Testing

Use Postman or cURL to test endpoints:

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (hashed with bcrypt),
  savedCars: [
    {
      id: String,
      make: String,
      model: String,
      year: String,
      engine: String,
      fuelType: String,
      numberPlate: String,
      source: String,
      dateAdded: String
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running on `localhost:27017`
- Check your connection string in `.env`
- For Atlas, verify firewall rules allow your IP

### CORS Error in App
- The backend already has CORS enabled
- Make sure the API URL in `AuthContext.js` matches your backend URL

### JWT Token Issues
- Change `JWT_SECRET` in `.env` to a more secure value
- Token expires after 7 days - users will need to login again

## Production Deployment

For deployment (e.g., Heroku, AWS):

1. Set environment variables on your hosting platform
2. Update `API_BASE_URL` in `context/AuthContext.js` to your production backend URL
3. Use a strong `JWT_SECRET`
4. Connect to MongoDB Atlas for a managed database
