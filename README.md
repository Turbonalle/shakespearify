# Shakespearify 🎭

A full-stack, serverless web application that uses Artificial Intelligence to translate modern English into Shakespearean prose.

## 🚀 Live Demo
*https://shakespearify-turbonalle-2026.s3.eu-north-1.amazonaws.com/index.html*

## 🛠️ Architecture & Tech Stack
This project was built from scratch on **Amazon Web Services (AWS)** using a serverless architecture to ensure high availability, deep security, and seamless scalability.

### Frontend
* **Tech:** Vanilla HTML, CSS, JavaScript
* **Hosting:** Amazon S3 (Static Website Hosting)
* **Design:** Custom premium glassmorphism UI with responsive design.

### Backend (Serverless)
* **AWS API Gateway:** Acts as the secure HTTP entry point, managing CORS and routing REST requests.
* **AWS Lambda (Node.js):** Executes the backend business logic on-demand, minimizing compute costs.
* **Amazon DynamoDB:** A fast, flexible NoSQL database used to track user interactions and enforce limits.
* **AI Integration:** Google Gemini 2.5 Flash API.

## 🔒 Security & Engineering Highlights
* **Secure API Key Management:** The Gemini API key is completely obfuscated from the client side. It is stored securely within AWS Lambda Environment Variables, meaning it never touches the frontend.
* **Backend Rate Limiting:** To prevent API quota abuse and spam, the Lambda function extracts the client's IP address from the API Gateway payload. It then queries DynamoDB to enforce a strict daily translation limit per user. 
* **NoSQL Lazy Loading Pattern:** The rate-limiting logic utilizes a composite primary key (`IP#Date`). This eliminates the need for complex nightly CRON jobs to reset daily usage, allowing the database to elegantly and naturally manage rolling daily quotas.

## 💻 Local Development
1. Clone the repository.
2. Run a local web server (e.g., `npx serve`).
3. Open `http://localhost:3000` in your browser.
*(Note: Requires the AWS Backend to be active to process translations).*
