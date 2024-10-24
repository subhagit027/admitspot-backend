# Contact Management System API

This repository contains a comprehensive RESTful API for a contact management system built with Next.js, including user authentication, advanced contact features, and file handling capabilities.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Backend Server](#running-the-backend-server)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Database Setup](#database-setup)
- [File Uploads](#file-uploads)
- [Additional Information](#additional-information)

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/) (version 14 or later)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)
- A SQL database (PostgreSQL or MySQL) set up locally or on a server

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/contact-management-system-api.git
   cd contact-management-system-api
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE=your_email_service
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
npm run dev
npm install
