# User Invitation Feature

This feature allows authenticated users to invite new team members to join their organization using ScaleKit's user management APIs.

## Features

- **User Invitation Form**: A clean, responsive form for collecting user information
- **Validation**: Client-side and server-side validation for required fields
- **Error Handling**: Proper error handling and user feedback
- **Success Notifications**: Visual feedback when invitations are successful
- **Protected Routes**: Invitation page requires authentication

## API Endpoint

### POST `/api/invite`

Creates a new user and adds them to the organization using ScaleKit's `createUserAndMembership` method.

**Request Body:**

```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "externalId": "ext_12345a67b89c", // Optional
  "metadata": {
    "department": "Engineering", // Optional
    "location": "NYC Office" // Optional
  }
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "usr_84728664737972753",
    "email": "user@example.com",
    "name": "John Doe",
    "firstName": "John",
    "lastName": "Doe"
  },
  "message": "User invited successfully"
}
```

## Components

### InviteUserForm

A React component that provides a form for inviting users with the following fields:

- Email (required)
- First Name (required)
- Last Name (required)
- External ID (optional)
- Department (optional)
- Location (optional)

### SuccessNotification

A reusable notification component that displays success messages with auto-dismiss functionality.

## Pages

### `/invite`

The main invitation page that includes:

- Page header with navigation
- InviteUserForm component
- Success notification handling

## Environment Variables

Make sure to set the following environment variable:

```
SCALEKIT_ORGANIZATION_ID=org_69615647365005430
```

**Note**: For demo purposes, the code will use `org_69615647365005430` as the default organization ID if the environment variable is not set.

## Usage

1. **Access the invitation page**: Navigate to `/invite` (requires authentication)
2. **Fill out the form**: Enter the required user information
3. **Submit**: Click "Invite User" to send the invitation
4. **Success**: A notification will appear confirming the invitation was sent

## Navigation

- **From Profile Page**: Click the "Invite User" button in the profile page navigation
- **Back to Profile**: Use the "Back to Profile" button on the invite page

## Error Handling

The feature handles various error scenarios:

- Missing required fields
- Invalid email format
- User already exists
- Network errors
- ScaleKit API errors

## Security

- The invitation page is protected by authentication middleware
- Only authenticated users can access the invitation functionality
- Server-side validation ensures data integrity
