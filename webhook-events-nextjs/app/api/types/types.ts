// Define the User type
export type User = {
    id: string;
    email: string;
    name?: string; 
  };
  
  // Define the Event type
  export type Event = {
    id: string;
    data: any; // Adjust the type of `data` as needed
  };