# Query Pulse - Google Scraper

## Introduction

Query Pulse is tool designed to assist in keyword research by performing data scraping.


## Features

- **User Authentication**: Signup and Login.
- **CSV Upload**: Users can upload a CSV file containing search terms.
- **Keyword Search**: Search uploaded keywords and view metrics for each
- **Data Extraction**: Gathers result counts, AdWord counts, and link counts per keyword.
- **Graphile Worker**: Utilizes a PostgreSQL-backed job queue to process scraping tasks efficiently. So consumers for data scraping can be scaled independently and on-demand.

## Tech Stack

- **Frontend**: Angular 16
- **Backend**: Node.js 18 & Express
- **Database**: PostgreSQL
- **Job Queue**: Graphile Worker

## Local Development Setup

### Backend Setup

To set up the backend locally using Docker:

1. Ensure Docker and Docker Compose are installed on your system.
2. Create a `.env` file in the backend directory(/api) with the following keys:

   ```plaintext
   DATABASE_USER=youruser
   DATABASE_PASSWORD=yourpassword
   DATABASE_URL=postgresql://youruser:yourpassword@localhost:5432/yourdb
   JWT_SECRET=yoursecret

Replace the placeholders with your actual database credentials and desired JWT secret.

3. Run the following command to start the backend services:
```bash
docker-compose up --build
```

This will set up the Node.js API server, Graphile Queue worker and PostgreSQL database as Docker services.

### Frontend Setup
To run the frontend locally:

1. Ensure you have Node.js and the Angular CLI installed.

2. Navigate to the frontend directory.

3. Run npm install to install dependencies.

4. Start the development server using:
```bash
ng serve
```
The Angular application will be available at http://localhost:4200.

### Notes
 - The file format for upload is `.csv`. The file can have upto 100 rows with a  column with header as "Keyword" 