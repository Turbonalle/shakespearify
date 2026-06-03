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

## Some backstory
This project initially started as a platform for me to learn cloud engineering. I wanted to keep things simple while still learning various services and tools, and utilizing them in a logical way.

The idea for *Shakespearify* came from occasionally writing in old bardic English with a friend of mine just for fun. As AI tools became more accessible, I had the idea of creating a bot that translates English into "Shakespearean", just in case my own knowledge of overly dramatic, poetic phrasing wasn't enough to convey what I wanted. It felt like the perfect way to combine learning with solving a problem for the population (or in this case - me).

This was also one of my first projects where I fully embraced AI-assisted development. Although I still prefer writing my own code, it was quite refreshing to focus more on learning the concepts rather than doing all the heavy lifting myself.

Through this project I learned a lot, including:
- how to use AWS S3 buckets, AWS API Gateways, AWS Lambda functions and Amazon DynamoDB
- how cloud providers work and convenient they can be
- how to keep systems secure by leveraging managed cloud services

I initially protected the AI with a password stored in AWS environment variables to prevent abused of my API. Later, a friend suggested implementing rate limiting instead so people could actually try it out. That ended up being an easy improvement by adding DynamoDB to the mix.

I hope you enjoy the simple, quirky translation tool. Give it a try and unlock your inner bard!