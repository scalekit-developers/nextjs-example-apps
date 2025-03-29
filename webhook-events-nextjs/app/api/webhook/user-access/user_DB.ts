import { User } from '../../types/types';


class UserMockDB {
  private users: User[] = [];

 
  // Function to create user
  async createUser(user: Omit<User, 'id'>): Promise<void> {
    // Generate an auto-incremented ID
    const generatedId = `${this.users.length + 1}`;

    // Create the new user object
    const newUser: User = { id: generatedId, ...user };

    // Add the new user to the database (array in this case)
    this.users.push(newUser);
    console.log('User created:', newUser);
  }
 
  // Function to update a user
  async updateUser(email: string, updatedData: Partial<User>): Promise<boolean> {
    const index = this.users.findIndex((u) => u.email === email);

    if (index !== -1) {
      // Prevent updating the 'id' and 'email' properties
      const { id, email: userEmail, ...dataToUpdate } = updatedData;

      // Merge the filtered updated data with the existing user data
      this.users[index] = { ...this.users[index], ...dataToUpdate };

      console.log(`User updated:`, this.users[index]);
      return true;
    }

    console.log(`User not found for update: ${email}`);
    return false;
  }


  async getUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    return user || null;
  }

  async deleteUserByEmail(email: string): Promise<boolean> {
    const index = this.users.findIndex((u) => u.email === email);
    if (index !== -1) {
      const deletedUser = this.users.splice(index, 1);
      console.log(`User deleted:`, deletedUser[0]);
      return true;
    }
    console.log(`User not found for deletion: ${email}`);
    return false;
  }

  async getAllUsers(): Promise<User[]> {
    return this.users;
  }
}

const userMockDB = new UserMockDB();
export default userMockDB;