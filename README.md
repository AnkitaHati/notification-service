# Notification Service

## Author
**Ankita Hati**

## Project Overview

This is a Notification Service built using **Node.js**, **Express**, **MongoDB**, and **RabbitMQ**. The service is designed to send notifications to users via **Email**, **SMS**, and **In-App** messaging. It supports queuing with retry mechanisms to ensure reliability and scalability.


## Features

- Send Notifications via API
- Support for Email, SMS, and In-App types
- Retrieve all notifications for a specific user
- Queued notification processing using RabbitMQ
- Retry mechanism for failed notifications


## Tech Stack

- **[Node.js](https://nodejs.org/)** (Backend)
- **[Express.js](https://expressjs.com/)** (API Framework)
- **[MongoDB](https://www.mongodb.com/)** (Database)
- **[RabbitMQ](https://www.rabbitmq.com/)** (Queue)
- **[Postman](https://www.postman.com/)** (API Testing)


## API Endpoints

 1. Send Notification  
**POST** `/notifications`  
**Description**: Send a notification to a user.  
**Body Example**:
```json
{
  "userId": "12345",
  "type": "email",
  "message": "Welcome to our platform!"
}
```

 2. Get User Notifications

GET /users/:id/notifications

- Description: Retrieve all notifications for a specific user.

  Postman Collection
🔗 [Click here to view and import the API Collection in Postman](https://ankitahati.postman.co/workspace/Ankita-Hati's-Workspace~d9731949-e084-49d4-853c-052be74c7c28/collection/45045253-0c29e55a-459a-4863-b0cf-29e048b33748?action=share&creator=45045253)


## Setup Instructions

1) Clone the repository:

git clone <your-repo-link>
cd notification-service

2) Install dependencies:

npm install

3) Configure environment variables:
 
Create a .env file in the root directory and add:

MONGODB_URI=mongodb+srv://[username]:[password]@[cluster-url]/notifications_db
RABBITMQ_URL=amqp://localhost
PORT=3000

-Replace [username], [password], and [cluster-url] with your actual MongoDB Atlas values.

4) Start the app
Start both the main server and the worker:


node index.js       # Starts the main server
node worker.js      # Starts the background queue worker


##Bonus Features Completed
 
 Organized structure with separate files for queue handling and models
- [x] RabbitMQ queue for background processing
- [x] Retry mechanism for failed notifications  
  ⮑ If a notification fails to send, it will automatically retry **3 times** before being discarded.
  ⮑ You can test this by sending a POST via Postman with invalid data and watching the retry logic in the console.

📌 Assumptions:

* A single MongoDB collection (notifications) stores all types of notifications.
* Notification sending is mocked (actual Email/SMS providers not integrated).
* Worker listens to queue and simulates delivery status (success/failure).

## API Documentation

Interactive API documentation is available via the Postman Collection:

🔗 [View Postman Docs](https://ankitahati.postman.co/workspace/Ankita-Hati's-Workspace~d9731949-e084-49d4-853c-052be74c7c28/collection/45045253-0c29e55a-459a-4863-b0cf-29e048b33748?action=share&creator=45045253)


🛠 Future Improvements:

* Add support for real Email and SMS providers (e.g., SendGrid, Twilio)
* UI Dashboard for viewing and sending notifications
* In-app notification socket integration (real-time updates)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

🧑‍💻 Developed By
Ankita Hati