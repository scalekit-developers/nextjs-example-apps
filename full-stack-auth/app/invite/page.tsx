'use client';

import { useState } from 'react';
import Link from 'next/link';
import InviteUserForm from '@/app/components/InviteUserForm';
import SuccessNotification from '@/app/components/SuccessNotification';

export default function InvitePage() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Invite Team Members
            </h1>
            <p className="text-gray-600">
              Invite new users to join your organization
            </p>
          </div>
          <Link
            href="/profile"
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Back to Profile
          </Link>
        </div>

        <InviteUserForm
          onSuccess={() => {
            setSuccessMessage('User invited successfully!');
            setShowSuccess(true);
          }}
          onError={(error) => {
            console.error('Failed to invite user:', error);
          }}
        />
      </div>

      <SuccessNotification
        message={successMessage}
        isVisible={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
