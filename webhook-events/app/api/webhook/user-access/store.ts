type Event = {
  id: string;
  data: any;
};

class EventMockDB {
  private events: Event[] = [];

  async insertEvent(event: any): Promise<void> {
    const id = `${this.events.length + 1}`; // Simulate auto-increment ID
    this.events.push({ id, data: event });
    console.log('Event inserted:', event);
  }

  async getAllEvents(): Promise<Event[]> {
    console.log(`Retrieved ${this.events.length} events`);
    return this.events;
  }

}

const eventMockDB = new EventMockDB();
export default eventMockDB;