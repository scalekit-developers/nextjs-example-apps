import { NextRequest, NextResponse } from 'next/server';
import eventMockDB from './store';
import { ScalekitClient } from '@scalekit-sdk/node';
import { processUserUpsert, processUserDelete } from './user_event_handlers';

// Utility: Validate required environment variables
const requiredEnvVars = ['SCALEKIT_ENV_URL', 'SCALEKIT_CLIENT_ID', 'SCALEKIT_CLIENT_SECRET', 'SCALEKIT_WEBHOOK_SECRET'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`${varName} is required`);
  }
});

// Initialize Scalekit client
const scalekit = new ScalekitClient(
  process.env.SCALEKIT_ENV_URL!,
  process.env.SCALEKIT_CLIENT_ID!,
  process.env.SCALEKIT_CLIENT_SECRET!,
);

/**
 * Webhook Endpoint: /api/webhook/user-access
 * Handles POST requests to process Scalekit webhook events.
 */

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    // Convert headers to a plain object
    const headers = Object.fromEntries(req.headers.entries());
    const secret = process.env.SCALEKIT_WEBHOOK_SECRET!;

    // Verify the webhook payload
    await scalekit.verifyWebhookPayload(secret, headers, JSON.stringify(event));
    console.log('Webhook verification passed');

    // Store the event
    await eventMockDB.insertEvent(event);

    // Process the event asynchronously
    setImmediate(async () => await processEvent(event));

    // Return success response
    return NextResponse.json({ message: 'Webhook received' }, { status: 201 });
  } catch (error: any) {
    console.error('Error verifying webhook:', error.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
}

/**
 * Handles specific event processing.
 */
async function processEvent(event: any) {
  try {
    console.log('Processing event:', event);

    switch (event.type) {
      case 'scalekit.dir.user.create':
      case 'scalekit.dir.user.update':
        await processUserUpsert(event);
        break;
      case 'scalekit.dir.user.delete':
        await processUserDelete(event);
        break;
      default:
        console.warn(`Unhandled event type: ${event.type}`);
    }
  } catch (error: any) {
    console.error('Error processing event:', error.message);
  }
}

/**
 * Fetches all stored events.
 */
export async function GET(req: NextRequest) {
  try {
    const events = await eventMockDB.getAllEvents();
    return NextResponse.json({ message: 'Events retrieved', events }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching events:', error.message);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

