# Passwordless Authentication Sample App

A simple Next.js application demonstrating passwordless authentication using Scalekit with support for both verification codes and magic links.

## Features

- **Dual Authentication**: Support for OTP (One-Time Password) and Magic Links
- **Flexible Flow**: Users can choose between entering a code or clicking a magic link
- **Simple UI**: Clean, modern interface with step-by-step flow
- **Secure Sessions**: HTTP-only cookies with proper security settings
- **Error Handling**: User-friendly error messages and validation

## How it Works

1. **Email Entry**: User enters their email address
2. **Email Delivery**: A verification email is sent with code and/or magic link
3. **Authentication Options**: 
   - Enter the 6-digit verification code in the UI, OR
   - Click the magic link directly in the email
4. **Dashboard Access**: Successfully authenticated users are redirected to a dashboard

## Authentication Types

The app supports three passwordless authentication types based on your Scalekit configuration:

- **OTP**: Only verification codes (6-digit numbers)
- **LINK**: Only magic links (clickable URLs)
- **LINK_OTP**: Both verification codes and magic links simultaneously

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Authentication**: Scalekit SDK for passwordless authentication
- **Styling**: Tailwind CSS for modern, responsive design

## Getting Started

### Prerequisites

- Node.js 18+
- Scalekit account and environment setup

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Scalekit Configuration
SCALEKIT_ENVIRONMENT_URL=your_environment_url
SCALEKIT_CLIENT_ID=your_client_id
SCALEKIT_CLIENT_SECRET=your_client_secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Installation

1. Install dependencies:

   ```bash
   npm install
   # or
   pnpm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   # or
   pnpm dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/
│   ├── api/auth/                    # Authentication API routes
│   │   ├── callback/               # OAuth callback handler
│   │   ├── initiate/               # Start authentication flow
│   │   ├── resend/                 # Resend verification email
│   │   ├── verify/                 # Verify OTP codes
│   │   └── verify-magic-link/      # Handle magic link verification
│   ├── dashboard/                  # Protected dashboard page
│   ├── login/                      # Login page
│   └── page.tsx                    # Home page
├── lib/
│   └── scalekit.ts                 # Scalekit SDK configuration
└── README.md
```

## API Endpoints

- `POST /api/auth/initiate` - Start passwordless authentication
- `POST /api/auth/verify` - Verify OTP codes
- `GET /api/auth/verify-magic-link` - Handle magic link verification
- `POST /api/auth/resend` - Resend verification email
- `GET /api/auth/callback` - Handle OAuth callback

## Scalekit Configuration

To enable different authentication types, configure your Scalekit dashboard:

1. Navigate to **Authentication > Auth Methods**
2. Locate the **Passwordless** section
3. Choose your preferred authentication type:
   - **OTP**: Only verification codes
   - **LINK**: Only magic links  
   - **LINK_OTP**: Both codes and magic links

## Customization

This is a sample application designed to be simple and educational. You can:

- Modify the UI components in the `app/` directory
- Add additional authentication flows
- Implement user management features
- Add more protected routes
- Customize error handling and validation
- Configure different passwordless types in Scalekit dashboard

## Learn More

- [Scalekit Documentation](https://docs.scalekit.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is open source and available under the [MIT License](LICENSE).
