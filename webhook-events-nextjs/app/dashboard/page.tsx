'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [view, setView] = useState('events'); // New state to track which view is selected

  // Fetch data based on the selected view (events or users)
  useEffect(() => {
    if (view === 'events') {
      fetchEvents();
    } else if (view === 'users') {
      fetchUsers();
    }

    async function fetchEvents() {
      try {
        const response = await fetch('/api/webhook/user-access');
        const data = await response.json();
        console.log('Raw API response:', data);

        if (Array.isArray(data.events)) {
          setEvents(data.events);
          console.log('Fetched events:', data.events);
        } else {
          console.error('API did not return an array:', data);
          setError('Received invalid data format from API');
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to fetch events');
      }
    }

    async function fetchUsers() {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        console.log('Raw API response:', data);

        if (Array.isArray(data.users)) {
          setUsers(data.users);
          console.log('Fetched users:', data.users);
        } else {
          console.error('API did not return an array:', data);
          setError('Received invalid data format from API');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
      }
    }
  }, [view]); // Fetch data whenever the view changes

  // Log events or users whenever they change
  useEffect(() => {
    if (view === 'events') {
      console.log('Current events state:', events);
    } else if (view === 'users') {
      console.log('Current users state:', users);
    }
  }, [events, users, view]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Dashboard</h2>

      {/* Buttons to toggle between Events and Users */}
      <div className="mb-4 text-center">
        <button
          onClick={() => setView('events')}
          className={`px-4 py-2 rounded ${view === 'events' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Events
        </button>
        <button
          onClick={() => setView('users')}
          className={`ml-4 px-4 py-2 rounded ${view === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Users
        </button>
      </div>

      {/* Render Events or Users based on selected view */}
      {view === 'events' ? (
        <div>
          {Array.isArray(events) && events.length > 0 ? (
            <ul className="space-y-4">
              {events.map((evnt: any, index: number) => (
                <li
                  key={evnt.id || index}
                  className="bg-gray-100 rounded-lg p-4 shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {/* Use event's type as the name */}
                    {` ${evnt.data.type} for ${evnt.data.data.email} ` || `Event ${evnt}`}
                  </h3>
                  <pre className="bg-white p-3 rounded overflow-x-auto text-sm">
                    {JSON.stringify(evnt, null, 2)}
                  </pre>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No events to display</p>
          )}
        </div>
      ) : (
        <div>
          {Array.isArray(users) && users.length > 0 ? (
            <ul className="space-y-4">
              {users.map((user: any, index: number) => (
                <li
                  key={user.id || index}
                  className="bg-gray-100 rounded-lg p-4 shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {user.name || `User ${index + 1}`}
                  </h3>
                  <pre className="bg-white p-3 rounded overflow-x-auto text-sm">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No users to display</p>
          )}
        </div>
      )}
    </div>
  );
}