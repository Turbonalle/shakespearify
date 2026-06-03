import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB Client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
    // 1. Get the Gemini API Key securely
    const apiKey = process.env.GEMINI_API_KEY;
    
    // CORS Headers helper
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "OPTIONS,POST"
    };

    // 2. Parse the incoming request
    let userText = "";
    try {
        const body = JSON.parse(event.body);
        userText = body.text;
    } catch (e) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Invalid request. Please send JSON with a 'text' field." })
        };
    }

    if (!userText) {
        return {
            statusCode: 400,
            headers: corsHeaders,
            body: JSON.stringify({ error: "No text provided." })
        };
    }

    // 3. RATE LIMITING WITH DYNAMODB
    try {
        // Get the user's IP Address (API Gateway HTTP API v2 payload puts it here)
        const userIp = event.requestContext?.http?.sourceIp || "unknown_ip";
        
        // Get today's date as a string (e.g. "2026-06-03")
        const today = new Date().toISOString().split('T')[0];
        const partitionKey = `${userIp}#${today}`;

        // Atomically increment the usage count. 
        // If the item doesn't exist, DynamoDB creates it starting at 0, then adds 1.
        const updateResponse = await docClient.send(new UpdateCommand({
            TableName: "ShakespearifyUsage",
            Key: {
                "ip_date": partitionKey
            },
            UpdateExpression: "ADD usageCount :inc",
            ExpressionAttributeValues: {
                ":inc": 1
            },
            ReturnValues: "UPDATED_NEW"
        }));

        const currentUsage = updateResponse.Attributes.usageCount;

        // Check if they have exceeded the 5 requests limit
        if (currentUsage > 5) {
            return {
                statusCode: 429,
                headers: corsHeaders,
                body: JSON.stringify({ error: "Too Many Requests" })
            };
        }
    } catch (dbError) {
        console.error("DynamoDB Error:", dbError);
        // If the database fails, we might still want to fail safely or allow the request.
        // For a portfolio, failing is fine to prove the DB is working.
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Internal Database Error" })
        };
    }

    // 4. Make the request to Google Gemini
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are William Shakespeare. Translate the following text into Shakespearean English. Only return the translation, no extra conversational filler.\n\nText: "${userText}"`
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error?.message || "Failed to fetch from Gemini");
        }

        const shakespeareText = data.candidates[0].content.parts[0].text;

        // 5. Return the successful response
        return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify({ translation: shakespeareText })
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            statusCode: 500,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Failed to translate text." })
        };
    }
};
