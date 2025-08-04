-- SQL Schema for the Blog, Vlogs, and Photography Gallery

-- Note: This schema is a starting point and can be adapted for your specific MySQL setup.

-- Blog Posts Table
CREATE TABLE posts (
    slug VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    content LONGTEXT NOT NULL,
    image VARCHAR(255),
    category ENUM('Tech', 'Current Affairs', 'Personal') NOT NULL,
    -- Storing tags as a JSON array or a comma-separated string is a simple approach.
    -- For more complex querying, a normalized structure with `tags` and `post_tags` tables is recommended.
    tags JSON,
    author VARCHAR(255),
    date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vlogs Table
CREATE TABLE vlogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(255),
    platform ENUM('YouTube', 'Instagram', 'TikTok') NOT NULL,
    url VARCHAR(255) NOT NULL,
    category ENUM('Travel', 'Tech Talks', 'Daily Life') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Photography Table
CREATE TABLE photography (
    id INT AUTO_INCREMENT PRIMARY KEY,
    src VARCHAR(255) NOT NULL,
    alt VARCHAR(255) NOT NULL,
    downloadUrl VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Admin Users Table (for login)
CREATE TABLE admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    full_name VARCHAR(255),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
