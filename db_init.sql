-- Database initialization for Cueks Team
-- Run this SQL in phpMyAdmin to create the database and tables

CREATE DATABASE IF NOT EXISTS cueks_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cueks_db;

-- Users table for admin authentication
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','editor') DEFAULT 'admin',
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Members table for team members
CREATE TABLE members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100),
  bio TEXT,
  photo VARCHAR(255), -- simpan path relatif / URL
  socials JSON,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Gallery table for photos and videos
CREATE TABLE gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('image','video') DEFAULT 'image',
  file_path VARCHAR(255) NOT NULL,
  caption TEXT,
  metadata JSON,
  tags VARCHAR(255),
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- News table for articles and updates
CREATE TABLE news (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  summary TEXT,
  content LONGTEXT,
  featured_image VARCHAR(255),
  event_date DATE,
  is_published TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Contacts table for contact form submissions
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  email VARCHAR(255),
  subject VARCHAR(255),
  message TEXT,
  is_read TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Static content table for editable text content
CREATE TABLE static_content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page_key VARCHAR(100) NOT NULL UNIQUE,
  content_key VARCHAR(100) NOT NULL,
  content_value LONGTEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password, role, name) VALUES 
('admin@cueksteam.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Administrator');

-- Insert sample static content
INSERT INTO static_content (page_key, content_key, content_value) VALUES
('home', 'welcome_text', 'Welcome to Cueks Team'),
('home', 'description', 'We are a dynamic team of 4 passionate individuals dedicated to creating amazing experiences and innovative solutions.'),
('about', 'title', 'About Cueks Team'),
('about', 'content', 'Cueks Team was founded with a vision to bring creativity and innovation together. Our team consists of talented individuals who share a common passion for excellence and a drive to make a difference in everything we do.');

-- Insert sample members
INSERT INTO members (name, role, bio, photo, socials) VALUES 
('Alex Johnson', 'Team Lead', 'Passionate leader with 5+ years of experience in project management and team coordination.', '/images/members/alex.jpg', '{"twitter": "https://twitter.com/alexj", "linkedin": "https://linkedin.com/in/alexj", "github": "https://github.com/alexj"}'),
('Sarah Chen', 'Developer', 'Full-stack developer specializing in modern web technologies and user experience design.', '/images/members/sarah.jpg', '{"twitter": "https://twitter.com/sarahc", "linkedin": "https://linkedin.com/in/sarahc", "github": "https://github.com/sarahc"}'),
('Mike Rodriguez', 'Designer', 'Creative designer with an eye for detail and a passion for beautiful, functional design.', '/images/members/mike.jpg', '{"twitter": "https://twitter.com/miker", "linkedin": "https://linkedin.com/in/miker", "dribbble": "https://dribbble.com/miker"}'),
('Emma Wilson', 'Marketing', 'Marketing strategist focused on brand growth and digital presence optimization.', '/images/members/emma.jpg', '{"twitter": "https://twitter.com/emmaw", "linkedin": "https://linkedin.com/in/emmaw", "instagram": "https://instagram.com/emmaw"}');

-- Insert sample gallery items
INSERT INTO gallery (type, file_path, caption, tags) VALUES
('image', '/images/gallery/team1.jpg', 'Team building session at our annual retreat', 'team,retreat,building'),
('image', '/images/gallery/workshop1.jpg', 'Design workshop with industry experts', 'workshop,design,learning'),
('image', '/images/gallery/celebration1.jpg', 'Celebrating our latest project success', 'celebration,success,team'),
('video', '/videos/gallery/intro.mp4', 'Introduction to Cueks Team', 'intro,team,video');

-- Insert sample news
INSERT INTO news (title, slug, summary, content, featured_image, event_date) VALUES
('Cueks Team Wins Innovation Award', 'cueks-team-wins-innovation-award', 'Our team has been recognized for outstanding innovation in the tech industry.', 'We are thrilled to announce that Cueks Team has received the prestigious Innovation Award for our groundbreaking work in developing sustainable technology solutions. This recognition is a testament to our team''s dedication and creative approach to problem-solving.', '/images/news/award.jpg', '2024-01-15'),
('New Project Launch: Community Platform', 'new-project-launch-community-platform', 'Excited to announce the launch of our new community engagement platform.', 'After months of hard work and collaboration, we are proud to launch our new community platform designed to connect people and foster meaningful interactions. This project represents our commitment to creating positive impact through technology.', '/images/news/platform.jpg', '2024-02-01'),
('Team Expansion: Welcome New Members', 'team-expansion-welcome-new-members', 'Growing our team with talented new members to drive innovation forward.', 'As we continue to grow, we are excited to welcome new members to our team. Their diverse skills and fresh perspectives will help us tackle new challenges and create even better solutions for our community.', '/images/news/expansion.jpg', '2024-02-15');