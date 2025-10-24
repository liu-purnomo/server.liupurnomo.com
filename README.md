<div align="center">

# Liu Purnomo Blog API

<img src="./public/logo.webp" alt="Liu Purnomo" width="200"/>

**A modern, scalable personal blog backend with advanced content management and SEO optimization**

[![Version](https://img.shields.io/badge/version-0.6.0-blue.svg)](https://github.com/liu-purnomo/server.liupurnomo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-Latest-2D3748)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-316192)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

[Features](#features) • [Getting Started](#getting-started) • [Documentation](#documentation) • [License](#license)

</div>

---

## Overview

Liu Purnomo's personal blog - a production-ready backend built with TypeScript, Prisma, and PostgreSQL. Features comprehensive content management, interactive commenting system, media handling, and advanced SEO capabilities.

### Tech Stack

- **Runtime:** Node.js 18+
- **Language:** TypeScript 5.9
- **Database:** PostgreSQL 14+
- **ORM:** Prisma
- **Documentation:** Scalar API Reference

---

## Features

### Content Management
- Multi-type content support (Blog posts, Tutorials)
- Rich text editor with JSON storage
- Content scheduling and draft management
- Hierarchical category system
- Flexible tagging mechanism
- Post series organization
- Reading time calculation
- Difficulty level classification

### Authentication & User System
- **Modern email-first authentication flow**
  - Check email existence before login/register
  - 4-digit verification codes via email (15-minute expiry)
  - Secure JWT token-based authentication
- **OAuth 2.0 Integration**
  - Google OAuth - One-click sign-in with Google
  - GitHub OAuth - Sign-in with GitHub account
  - Auto-registration with verified email
  - Auto-verification for existing users
  - Temporary password generation
- **Complete auth endpoints**
  - User registration with email verification
  - Login with password
  - Google & GitHub OAuth login/register
  - Forgot password and reset with token
  - Change password for authenticated users
  - Refresh token support
- Role-based access control (Admin, Author, User)
- Profile management with avatar support
- Activity logging for security audit

### Interactive Comments
- Nested comment threads
- Guest commenting support
- Rich text formatting
- User mentions with notifications
- Multiple reaction types (Like, Helpful, Love, Insightful)
- Comment moderation workflow
- Spam detection
- Featured and pinned comments
- Link tracking

### Media Management
- Multi-format file upload
- Image optimization
- Automatic metadata extraction
- Alt text and caption support
- Dimension tracking

### SEO Optimization
- Meta tags management
- Open Graph support
- Schema.org markup
- Canonical URLs
- Full-text search capability
- Smart URL redirects (301, 302, 307)

### Analytics & Bookmarks
- Post view tracking
- Visitor analytics
- Referrer tracking
- User engagement metrics
- Comment statistics
- **User bookmarks** with notes, tags, and read status

---

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js >= 18
- PostgreSQL >= 14
- npm, yarn, or pnpm

### Installation

1. Clone the repository
```bash
git clone https://github.com/liu-purnomo/server.liupurnomo.com.git
cd server.liupurnomo.com
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
PORT=3000
NODE_ENV="development"
JWT_SECRET="your-secret-key"
```

4. Set up the database
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed initial data
npx prisma db seed
```

5. Start the development server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

---

## Database Schema

The application uses a comprehensive database schema designed for scalability and performance:

### Core Entities
- **Users** - Authentication and user management
- **Posts** - Blog content with rich metadata
- **Categories** - Hierarchical content organization
- **Tags** - Flexible content tagging
- **Comments** - Interactive discussion system
- **Media** - Asset management
- **Post Series** - Related content grouping
- **Redirects** - SEO-friendly URL management

### Key Features
- Soft delete support for data retention
- Full-text search indexes
- Optimized database indexes for performance
- Referential integrity with cascading operations
- Flexible JSON storage for rich content

For detailed schema information, see the [Prisma schema file](./prisma/schema.prisma).

---

## Documentation

### API Documentation
Interactive API documentation is available via Scalar at:
```
http://localhost:3000/docs
```

### Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Run production server

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with sample data
npm run db:studio        # Open Prisma Studio
npm run db:reset         # Reset database

# Code Quality
npm run lint             # Run linter
npm run format           # Format code
npm run type-check       # TypeScript type checking

# Testing
npm test                 # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

---

## Project Structure

```
server.liupurnomo.com/
├── prisma/              # Database schema and migrations
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/                 # Application source code
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── routes/          # API routes
│   ├── middlewares/     # Express middlewares
│   ├── utils/           # Utility functions
│   └── types/           # TypeScript type definitions
├── tests/               # Test files
├── public/              # Static assets
└── docs/                # Additional documentation
```

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Guidelines
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## Support

For questions, issues, or support:

- **Email:** [liu@drone.co.id](mailto:liu@drone.co.id)
- **Documentation:** [https://server.liupurnomo.com/docs](https://server.liupurnomo.com/docs)
- **Issues:** [GitHub Issues](https://github.com/liu-purnomo/server.liupurnomo.com/issues)

---

<div align="center">

**Built with modern technologies and best practices**

© 2025 Liu Purnomo. All rights reserved.

[Website](https://liupurnomo.com) • [GitHub](https://github.com/liu-purnomo) • [LinkedIn](https://linkedin.com/in/liu-purnomo)

</div>
