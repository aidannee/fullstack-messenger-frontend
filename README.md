# fullstack-messenger-frontend
<img src="https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1555&q=80"></img>


# Simple CRUD Messaging App

Welcome to my first messenger!
This project is a simple CRUD (Create, Read, Update, Delete) messaging app developed using React, Tailwind CSS, and Express for the frontend and backend, respectively.

## Overview

The application allows users to post messages without a login feature. It incorporates a responsive design using Tailwind CSS, detects users' light or dark mode preferences, and dynamically updates message display.

## Features

- **Create:** Users can submit new messages with a username.
- **Read:** Messages are displayed in real-time.
- **Update:** Editing functionality for messages.
- **Delete:** Ability to delete messages.

## Tech Stack

- **Frontend:** React, Tailwind CSS
- **Backend:** Express, Sequelize (PostgreSQL)

## Getting Started

To run this project locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2. Install dependencies:

    ```bash
    # Install frontend dependencies
    cd frontend
    npm install

    # Install backend dependencies
    cd ../backend
    npm install
    ```

3. Set up the database:
    - Ensure PostgreSQL is installed and running.
    - Update the `.env` file in the backend directory with your database details.

4. Start the servers:
    - Start the backend server:

        ```bash
        cd backend
        npm start
        ```

    - Start the frontend server:

        ```bash
        cd frontend
        npm start
        ```

5. Open your browser and navigate to `http://localhost:3000` to view the application.


Feel free to contribute or suggest improvements by creating issues or pull requests.

