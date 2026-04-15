# Backend Course Project

A Node.js backend application for managing a movie watchlist, built with Express, TypeScript, and Prisma ORM.

## Description

This project is a RESTful API that allows users to register, authenticate, create movies, and manage their personal watchlist. Users can add movies to their watchlist with different statuses (planned, watching, completed, dropped), rate them, and add notes.

## Features

- User authentication and authorization (JWT)
- Movie creation and management
- Personal watchlist with status tracking
- Rating and note-taking for watchlist items
- Secure API with validation using Zod
- PostgreSQL database with Prisma ORM
- Hosted database support with Neon

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (via Prisma ORM)
- **Database Hosting**: Neon
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Password Hashing**: bcryptjs
- **Development**: tsx (for watch mode), TypeScript compiler

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd backend-course
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables (see Environment Variables section).

4. Set up the database (see Database Setup section).

5. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3333
DATABASE_URL=your_neon_database_url_here
JWT_SECRET=your_jwt_secret_here
```

- `PORT`: The port on which the server will run (default: 3333)
- `DATABASE_URL`: Connection string for your PostgreSQL database (Neon recommended)
- `JWT_SECRET`: Secret key for JWT token signing

## Database Setup

1. Ensure you have a PostgreSQL database set up (Neon provides free hosted databases).

2. Update your `DATABASE_URL` in the `.env` file.

3. Generate Prisma client and run migrations:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

4. (Optional) Seed the database with sample movies:
   ```bash
   npm run seed:movies
   ```

## Running the Application

### Development

```bash
npm run dev
```

This starts the server with hot reloading using tsx.

### Production

```bash
npm run build
npm start
```

Builds the TypeScript code and runs the compiled JavaScript.

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user

### Movies

- `GET /movies` - Get movies (placeholder endpoint)

### Watchlist (Protected routes - require authentication)

- `POST /watchlist` - Add a movie to watchlist
- `PUT /watchlist/:id` - Update a watchlist item
- `DELETE /watchlist/:id` - Remove a movie from watchlist

## Database Schema

### User

- `id`: String (UUID, primary key)
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `createdAt`: DateTime

### Movie

- `id`: String (UUID, primary key)
- `title`: String
- `overview`: String (optional)
- `releaseYear`: Int
- `genres`: String[] (array)
- `runtime`: Int (optional)
- `posterUrl`: String (optional)
- `createdBy`: String (foreign key to User)
- `createdAt`: DateTime

### WatchlistItem

- `id`: String (UUID, primary key)
- `userId`: String (foreign key to User)
- `movieId`: String (foreign key to Movie)
- `status`: WatchlistStatus (enum: PLANNED, WATCHING, COMPLETED, DROPPED)
- `rating`: Int (optional, 1-10 presumably)
- `notes`: String (optional)
- `createdAt`: DateTime
- `updatedAt`: DateTime

## Project Structure

```
backend-course/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Database seeding script
│   └── migrations/            # Database migrations
├── src/
│   ├── controllers/           # Route handlers
│   │   ├── auth.controller.ts
│   │   └── watchlist.controller.ts
│   ├── middlewares/           # Express middlewares
│   │   ├── auth.middleware.ts
│   │   └── validateRequest.ts
│   ├── routes/                # API routes
│   │   ├── auth.routes.ts
│   │   ├── movie.routes.ts
│   │   └── watchlist.routes.ts
│   ├── utils/                 # Utility functions
│   │   ├── express.d.ts
│   │   └── generateToken.ts
│   ├── validators/            # Zod validation schemas
│   │   └── watchlist.validators.ts
│   ├── db.ts                  # Prisma client setup
│   └── server.ts              # Express server setup
├── package.json
├── tsconfig.json
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (if any)
5. Submit a pull request

## License

ISC
