# Task CRM

A modern, full-featured Customer Relationship Management (CRM) system built with NestJS, TypeScript, and Prisma. This application provides a robust API for managing companies, contacts, deals, and users with role-based access control.

## 🚀 Features

- **Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (USER, ADMIN)
  - Secure password hashing with bcrypt
  - Protected API endpoints

- **Core CRM Functionality**
  - **Companies Management**: Create, read, update, and delete company records
  - **Contacts Management**: Manage contact information with relationships to companies
  - **Deals Management**: Track deals with stages (OPEN, IN_PROGRESS, CLOSED) and amounts
  - **User Management**: User registration and profile management

- **Additional Features**
  - Pagination support for list endpoints
  - Data validation with class-validator
  - Automatic timestamps (createdAt, updatedAt)
  - Many-to-many relationships between entities
  - Audit trail (tracks who created each record)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)
- **Git**

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd task-crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/task_crm?schema=public"
   JWT_SECRET="your-secret-key-here"
   JWT_EXPIRES_IN="7d"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev
   ```

5. **Build the application**
   ```bash
   npm run build
   ```

## 🏃 Running the Application

### Development Mode
```bash
npm run start:dev
```
The application will start on `http://localhost:3000` with hot-reload enabled.

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

## 📚 API Documentation

### Authentication Endpoints

#### Register a new user
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Protected Endpoints

All endpoints below require authentication. Include the JWT token in the Authorization header:
```http
Authorization: Bearer <your-jwt-token>
```

### Companies Endpoints

- `GET /companies` - Get all companies (with pagination)
- `GET /companies/:id` - Get a specific company
- `POST /companies` - Create a new company (USER, ADMIN)
- `PATCH /companies/:id` - Update a company (USER, ADMIN)
- `DELETE /companies/:id` - Delete a company (ADMIN only)

**Create Company Example:**
```http
POST /companies
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Acme Corporation",
  "domain": "acme.com",
  "industry": "Technology",
  "address": "123 Main St, City, State"
}
```

### Contacts Endpoints

- `GET /contacts` - Get all contacts (with pagination)
- `GET /contacts/:id` - Get a specific contact
- `POST /contacts` - Create a new contact
- `PATCH /contacts/:id` - Update a contact
- `DELETE /contacts/:id` - Delete a contact (ADMIN only)

**Create Contact Example:**
```http
POST /contacts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "address": "456 Oak Ave"
}
```

### Deals Endpoints

- `GET /deals` - Get all deals (with pagination)
- `GET /deals/:id` - Get a specific deal
- `POST /deals` - Create a new deal
- `PATCH /deals/:id` - Update a deal
- `DELETE /deals/:id` - Delete a deal (ADMIN only)

**Create Deal Example:**
```http
POST /deals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Q1 Enterprise Deal",
  "stage": "OPEN",
  "amount": 50000.00,
  "companyId": 1
}
```

### Users Endpoints

- `GET /users` - Get all users
- `GET /users/:id` - Get a specific user
- `PATCH /users/:id` - Update a user
- `DELETE /users/:id` - Delete a user (ADMIN only)

## 🗄️ Database Schema

### Models

- **User**: Authentication and user management
  - Roles: `USER`, `ADMIN`
  - Tracks created companies, contacts, and deals

- **Company**: Business entity information
  - Fields: name, domain, industry, address
  - Related to contacts (many-to-many) and deals

- **Contact**: Individual contact information
  - Fields: name, email, phone, address
  - Can be associated with multiple companies
  - Can be associated with multiple deals

- **Deal**: Sales opportunity tracking
  - Stages: `OPEN`, `IN_PROGRESS`, `CLOSED`
  - Fields: title, stage, amount, companyId
  - Related to contacts (many-to-many)

### Relationships

- User → Companies (one-to-many)
- User → Contacts (one-to-many)
- User → Deals (one-to-many)
- Company ↔ Contacts (many-to-many via `ContactCompany`)
- Deal ↔ Contacts (many-to-many via `DealContact`)
- Company → Deals (one-to-many)

## 🔒 Security

- **Password Hashing**: Passwords are hashed using bcrypt before storage
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for USER and ADMIN roles
- **Input Validation**: All inputs are validated using class-validator
- **SQL Injection Protection**: Prisma ORM provides parameterized queries

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Watch mode
npm run test:watch
```

## 📦 Project Structure

```
task-crm/
├── prisma/
│   ├── migrations/          # Database migrations
│   └── schema.prisma        # Prisma schema definition
├── src/
│   ├── auth/                # Authentication module
│   │   ├── dto/             # Data transfer objects
│   │   ├── jwt.strategy.ts  # JWT strategy
│   │   ├── jwt-auth.guard.ts
│   │   ├── roles.guard.ts   # Role-based guard
│   │   └── roles.enum.ts    # Role definitions
│   ├── companies/           # Companies module
│   ├── contacts/            # Contacts module
│   ├── deals/               # Deals module
│   ├── users/               # Users module
│   ├── prisma/              # Prisma service
│   ├── common/              # Shared utilities
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
├── test/                    # E2E tests
└── dist/                    # Compiled output
```

## 🛠️ Development

### Code Formatting
```bash
npm run format
```

### Linting
```bash
npm run lint
```

### Database Management

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: This will delete all data)
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

## 🚢 Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**
   - Ensure `DATABASE_URL` points to your production database
   - Use a strong `JWT_SECRET` in production

3. **Run database migrations**
   ```bash
   npx prisma migrate deploy
   ```

4. **Start the application**
   ```bash
   npm run start:prod
   ```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `JWT_SECRET` | Secret key for JWT token signing | Yes |
| `JWT_EXPIRES_IN` | JWT token expiration time (e.g., "7d") | No (default: "7d") |


## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Database management with [Prisma](https://www.prisma.io/)
- Authentication with [Passport.js](http://www.passportjs.org/)

---

For more information about NestJS, visit the [official documentation](https://docs.nestjs.com/).
