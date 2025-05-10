# Next.js Dashboard
A modern, responsive dashboard application built with Next.js 15, React, and TypeScript. This project implements a full-featured admin dashboard with authentication, data visualization, and database integration.
## 🚀 Live Demo
Check out the live application: [Next.js Dashboard](https://dashboard-ruslan-shuranovs-projects.vercel.app/)
**Demo Credentials:**
- Email: user@nextmail.com
- Password: 123456

## ✨ Features
- **Authentication & Authorization**: Secure login system using NextAuth.js
- **Modern UI**: Built with Tailwind CSS and Heroicons
- **Database Integration**: Prisma ORM with PostgreSQL
- **Type Safety**: Fully typed with TypeScript
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Data Visualization**: Dashboard with interactive charts and metrics

## 🛠️ Technology Stack
- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS, PostCSS
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: NextAuth.js
- **Form Validation**: Zod
- **Package Management**: pnpm

## 🚦 Getting Started
1. Clone the repository
2. Install dependencies:
``` bash
   pnpm install
```
1. Set up environment variables (see ): `.env.example`
``` 
   DATABASE_URL=your_postgresql_connection_string
   AUTH_SECRET=your_auth_secret
   AUTH_URL=http://localhost:3000/api/auth
```
1. Generate Prisma client and run migrations:
``` bash
   pnpm prisma generate
   pnpm prisma migrate dev
```
1. Run the development server:
``` bash
   pnpm dev
```
## 📦 Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Generate Prisma client and build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm prisma generate` - Generate Prisma client
- `pnpm prisma migrate dev` - Create and apply migrations during development
- `pnpm prisma db push` - Push schema changes directly to the database

## 💾 Database Setup
This project uses Prisma ORM with PostgreSQL. The database schema is defined in the file. `prisma/schema.prisma`
- The Prisma client is automatically generated during the build process
- Database migrations can be created and applied using the Prisma CLI
- For local development, you'll need a PostgreSQL database instance
- The project uses Prisma Accelerate for optimized database performance

## 🌟 Key Dependencies
- Next.js 15.2.4
- React (latest)
- Prisma 6.7.0
- Tailwind CSS 3.4.17
- TypeScript 5.7.3
- NextAuth 5.0.0-beta.25

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
