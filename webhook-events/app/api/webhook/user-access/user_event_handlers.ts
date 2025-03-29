import userDB from './user_DB';
import { Event } from '../../types/types';



// Function to upsert (create or update) a user
export async function processUserUpsert(event: Event): Promise<void> {
  const { email, ...updates } = event.data;

  if (!email) {
    console.error('Missing user email for upsert operation:');
    return;
  }

  // Check if the user already exists
  const existingUser = await userDB.getUserByEmail(email);
  if (existingUser) {
    // Update existing user
    await userDB.updateUser(email, { ...updates });
    console.log(`User with email ${email} updated.`);
  } else {

    const { id, ...validUpdates } = updates; // Remove 'id' and pass only valid fields
    await userDB.createUser({ email, ...validUpdates });
    console.log(`User with email ${email} created.`);
  }
}



// Function to process user delete
export async function processUserDelete(event: Event): Promise<void> {
    const { email } = event.data;
  if (!email) {
    console.error('Missing user email for delete:', { email });
    return;
  }
    await userDB.deleteUserByEmail(email);
    
  }

