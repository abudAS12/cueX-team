# Cueks Team - Full-Stack Next.js Project

A comprehensive full-stack web application for "Cueks Team" organization built with Next.js 15, TypeScript, Tailwind CSS, and MySQL. This project includes both public-facing pages and an admin dashboard for content management.

## 🚀 Features

### Public Features
- **Responsive Design**: Mobile-first design with tablet and desktop support
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Home Section**: Welcome message with team introduction
- **About Section**: Organization information and mission
- **Members Section**: Team member cards with social media links
- **Gallery**: Photo and video gallery with lightbox view
- **News**: Latest news and activities with detail pages
- **Contact Form**: Functional contact form that saves to database

### Admin Features
- **Secure Authentication**: Password-protected admin area
- **Dashboard**: Overview with statistics
- **Member Management**: CRUD operations for team members
- **Gallery Management**: Add/edit photos and videos
- **News Management**: Create and manage news articles
- **Contact Management**: View and manage contact submissions
- **Content Editor**: Edit static content across pages

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with shadcn/ui components
- **Database**: MySQL/MariaDB (XAMPP compatible)
- **Database Client**: mysql2
- **Authentication**: bcryptjs for password hashing
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
2. **XAMPP** (for MySQL/MariaDB database)
3. **Git** (for cloning the repository)

## 🗄 Database Setup (XAMPP)

### 1. Start XAMPP Services
- Open XAMPP Control Panel
- Start **Apache** and **MySQL** services
- Make sure both services are running (green indicator)

### 2. Create Database
- Open your web browser and go to `http://localhost/phpmyadmin`
- Click on **"New"** in the left sidebar
- Enter database name: `cueks_db`
- Select **"utf8mb4_unicode_ci"** collation
- Click **"Create"**

### 3. Import Database Schema
- In phpMyAdmin, select the `cueks_db` database
- Click on the **"Import"** tab
- Choose the `db_init.sql` file from the project root
- Click **"Go"** to import the database structure and sample data

### 4. Verify Database
After import, you should see these tables:
- `users` (admin authentication)
- `members` (team members)
- `gallery` (photos and videos)
- `news` (articles and updates)
- `contacts` (contact form submissions)
- `static_content` (editable text content)

## 🚀 Project Setup

### 1. Clone or Download the Project
```bash
# If you have the project files, navigate to the project directory
cd /path/to/cueks-team-project
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the project root with the following configuration:

```env
# Database Configuration for XAMPP MySQL
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=cueks_db

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-change-in-production

# Admin Credentials (default)
ADMIN_EMAIL=admin@cueksteam.com
ADMIN_PASSWORD=admin123
```

**Important**: The database configuration is set for XAMPP's default MySQL setup:
- Host: `127.0.0.1` (localhost)
- Port: `3306` (MySQL default)
- User: `root` (XAMPP default)
- Password: empty (XAMPP default)
- Database: `cueks_db`

### 4. Test Database Connection
You can test the database connection by running:

```bash
npm run dev
```

Then visit `http://localhost:3000/api/health` in your browser. You should see a success message if the database is connected properly.

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🌐 Accessing the Application

### Public Website
- URL: `http://localhost:3000`
- Features: Home, About, Members, Gallery, News, Contact sections

### Admin Dashboard
- URL: `http://localhost:3000/admin/login`
- Default Credentials:
  - Email: `admin@cueksteam.com`
  - Password: `admin123`

**Important**: Change the default admin password in production!

## 📁 Project Structure

```
cueks-team-project/
├── src/
│   ├── app/
│   │   ├── admin/                 # Admin pages
│   │   │   ├── login/            # Admin login page
│   │   │   └── dashboard/        # Admin dashboard
│   │   ├── api/                  # API routes
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   ├── members/          # Members CRUD
│   │   │   ├── gallery/          # Gallery CRUD
│   │   │   ├── news/             # News CRUD
│   │   │   └── contact/          # Contact form
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── navbar.tsx            # Navigation bar
│   │   └── footer.tsx            # Footer
│   └── lib/
│       ├── mysql.ts              # Database connection
│       └── utils.ts              # Utility functions
├── public/                       # Static assets
├── db_init.sql                   # Database initialization script
├── .env.local                    # Environment variables
├── package.json                  # Dependencies and scripts
├── tailwind.config.ts            # Tailwind configuration
└── README.md                     # This file
```

## 🎨 Customization

### Color Scheme
The project uses a purple-to-pink gradient theme:
- Primary Purple: `#7C3AED`
- Primary Pink: `#EC4899`

To customize colors, edit:
- `tailwind.config.ts` - Update color values
- `src/app/globals.css` - Update CSS variables

### Database Configuration
If your XAMPP setup uses different credentials:
1. Update `.env.local` with your database settings
2. Ensure MySQL service is running in XAMPP
3. Verify database name matches `cueks_db`

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint

# Database operations (if using Prisma)
npm run db:push
npm run db:generate
npm run db:migrate
```

## 🐛 Troubleshooting

### Database Connection Issues
1. **Ensure XAMPP MySQL is running**: Check XAMPP Control Panel
2. **Verify credentials**: Check `.env.local` matches your XAMPP setup
3. **Database exists**: Confirm `cueks_db` is created in phpMyAdmin
4. **Port conflict**: Make sure port 3306 is not blocked

### Development Server Issues
1. **Port 3000 in use**: Kill existing Node.js processes or change port
2. **Dependencies missing**: Run `npm install` again
3. **Permission issues**: Run terminal as administrator (Windows)

### Build Issues
1. **TypeScript errors**: Check for type mismatches
2. **Import errors**: Verify all imports are correct
3. **Missing dependencies**: Run `npm install`

## 🔒 Security Notes

### Production Deployment
1. **Change default credentials**: Update admin email and password
2. **Environment variables**: Use strong, unique secrets
3. **Database security**: Use strong MySQL passwords
4. **HTTPS**: Enable SSL in production
5. **Rate limiting**: Implement API rate limiting

### Database Security
- Use parameterized queries (already implemented)
- Validate all user inputs
- Hash passwords with bcrypt
- Limit database user permissions

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify XAMPP services are running
3. Confirm database setup is complete
4. Check browser console for errors

For additional support, refer to the:
- Next.js documentation: https://nextjs.org/docs
- Tailwind CSS documentation: https://tailwindcss.com/docs
- XAMPP documentation: https://www.apachefriends.org/docs/

---

**Built with ❤️ by the Cueks Team**