# Restaurant Reservation Management System

Full-stack MERN assignment using React, Express, MongoDB, and JWT authentication.

## Features

- Customer registration and login
- JWT-protected API routes
- Customer reservation creation, listing, and cancellation
- Admin reservation listing, date filtering, updating, and cancellation
- Seeded restaurant tables with fixed capacities
- Availability checks that prevent table double booking

## Tech Stack

- Frontend: React
- Backend: Node.js, Express
- Database: MongoDB, Mongoose
- Auth: JWT, bcrypt password hashing

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

3. Set values in `.env`:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/restaurant_reservations
JWT_SECRET=replace_with_a_long_random_secret
CLIENT_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:5000
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

Leave `PORT` unset for local `npm run dev`. The backend defaults to `5000`, and React defaults to `3000`. If both apps read the same `PORT` value, they can try to start on the same port.

4. Seed tables and the default admin:

```bash
npm run seed
```

5. Run frontend and backend together:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`. Backend runs on `http://localhost:5000`.

## API Summary

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/reservations`
- `GET /api/reservations/mine`
- `PATCH /api/reservations/:id/cancel`
- `GET /api/reservations?date=YYYY-MM-DD` admin only
- `PATCH /api/reservations/:id` admin only
- `GET /api/tables` admin only
- `POST /api/tables` admin only
- `PATCH /api/tables/:id` admin only

## Assumptions

- The app manages one restaurant.
- Tables are fixed and seeded into MongoDB.
- Reservation slots are fixed hourly labels from `9:00 AM` to `11:00 PM`.
- A reservation occupies one table for one selected slot.
- Cancelled reservations do not block future bookings.

## Availability Logic

When a customer requests a reservation, the backend finds active tables with capacity greater than or equal to the guest count. It checks each suitable table for a booked reservation with the same date and time slot. The first table without a conflict is assigned.

MongoDB also has a unique partial index on `table + reservationDate + timeSlot` for booked reservations. This protects against double booking even if two requests arrive close together.

## Role-Based Access

- Customers can only create reservations, view their own reservations, and cancel their own reservations.
- Admins can view all reservations, filter by date, update any reservation, cancel any reservation, and manage tables.
- Protected routes require a valid JWT. Admin routes also require `role: "admin"`.

## Known Limitations

- Time slots are simple labels, not full start/end ranges.
- Admin table management exists in the API, while the current UI only displays table capacity.
- No payment, notifications, or real-time updates.
- No automated integration test suite yet.

## Improvements With More Time

- Add automated API tests.
- Add admin UI for creating and editing tables.
- Add richer slot configuration per restaurant.
- Add deployment-specific environment templates.
