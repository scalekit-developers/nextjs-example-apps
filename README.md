# Next.js example apps for Scalekit

This repository contains Next.js example applications demonstrating how to integrate with ScaleKit services.

## Available Examples

### 1. Webhook Events

This example demonstrates how to listen to webhook events from ScaleKit. It shows:

- Setting up webhook endpoints in a Next.js application
- Processing user events from ScaleKit
- Validating webhook signatures for security
- Handling different event types

**Key Features:**

- Secure webhook handling
- Event processing and validation
- Integration with ScaleKit's event system

### 2. Full Stack Authentication

This example showcases the full stack authentication capabilities of ScaleKit, including:

- Authentication (AuthN) implementation
- Hosted login box integration
- Secure session management
- User management functionality (coming soon)
- Logout implementation

**Key Features:**

- Complete authentication flow
- Session handling
- Secure user identity management

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- ScaleKit credentials (client ID and secret)
- .env file with required environment variables

### Installation

1. Clone this repository
2. Navigate to the desired example directory
3. Run `npm install` or `yarn` to install dependencies
4. Create a `.env` file with your ScaleKit credentials (see `.env.example` in each project)
5. Run `npm run dev` or `yarn dev` to start the development server

## Environment Variables

Each example requires specific environment variables. Check the `.env.example` file in each project directory for details.

## Support

For assistance, please contact ScaleKit support or open an issue in this repository.

## Contributing

We welcome contributions! Please feel free to submit a pull request with any improvements or additional examples.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
