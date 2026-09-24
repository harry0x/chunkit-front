# ChunkIt - Frontend

This is the frontend application for **ChunkIt**, a fast and open web application that splits large videos into 1-minute chunks. It has been streamlined to provide a seamless drag-and-drop experience without requiring any user logins, signups, or memberships.

## Features

- **No Authentication Required:** Users can upload videos instantly without creating an account.
- **Drag-and-Drop Interface:** Easily upload videos up to 1GB using a modern, animated interface.
- **Real-time Progress:** Visual feedback during the upload and backend FFmpeg processing stages.
- **Direct ZIP Download:** Once the video is chunked, a single ZIP file containing all parts is immediately available for download.
- **Responsive & Animated:** Built with React, Vite, Tailwind CSS, and Framer Motion for a polished experience.

## Tech Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS + Vanilla CSS (`index.css`)
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **HTTP Client:** Axios

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository and navigate into this directory.
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser to the URL provided (typically `http://localhost:5173`).

## Connecting to Backend

By default, the application expects the API to be running on `http://localhost:5000/api`. Ensure the `chunkit-backend` is up and running simultaneously. You can change this by modifying `VITE_API_URL` in your `.env` file.

## License

MIT
