"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function TestCustomersPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [mockEnabled, setMockEnabled] = useState(false);

  useEffect(() => {
    // Check if mock auth is enabled
    const mockAuthEnabled =
      localStorage.getItem("mock_auth_enabled") === "true";
    setMockEnabled(mockAuthEnabled);
  }, []);

  const enableMockAuth = () => {
    localStorage.setItem("mock_auth_enabled", "true");
    setMockEnabled(true);
    window.location.reload();
  };

  const disableMockAuth = () => {
    localStorage.setItem("mock_auth_enabled", "false");
    setMockEnabled(false);
    window.location.reload();
  };

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>Test Customers Page</h1>

        <div className='bg-white rounded-lg p-6 shadow-lg mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Authentication Status</h2>
          <div className='space-y-2'>
            <p>
              <strong>Loading:</strong> {String(isLoading)}
            </p>
            <p>
              <strong>Authenticated:</strong> {String(isAuthenticated)}
            </p>
            <p>
              <strong>User:</strong>{" "}
              {user ? `${user.firstname} ${user.lastname}` : "None"}
            </p>
            <p>
              <strong>Mock Auth Enabled:</strong> {String(mockEnabled)}
            </p>
          </div>
        </div>

        <div className='bg-white rounded-lg p-6 shadow-lg mb-6'>
          <h2 className='text-xl font-semibold mb-4'>
            Mock Authentication Control
          </h2>
          <div className='space-y-4'>
            <div>
              <h3 className='font-medium mb-2'>Test Accounts:</h3>
              <div className='space-y-2 text-sm'>
                <div className='bg-gray-50 p-2 rounded'>
                  <strong>admin/admin123</strong> - Administrator
                </div>
                <div className='bg-gray-50 p-2 rounded'>
                  <strong>test/test123</strong> - Regular User
                </div>
                <div className='bg-gray-50 p-2 rounded'>
                  <strong>manager/manager123</strong> - Manager
                </div>
              </div>
            </div>

            <div className='flex space-x-4'>
              <button
                onClick={enableMockAuth}
                className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                Enable Mock Auth
              </button>
              <button
                onClick={disableMockAuth}
                className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
              >
                Disable Mock Auth
              </button>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg p-6 shadow-lg'>
          <h2 className='text-xl font-semibold mb-4'>Navigation</h2>
          <div className='space-y-2'>
            <a
              href='/dashboard'
              className='block text-blue-600 hover:underline'
            >
              Dashboard
            </a>
            <a
              href='/dashboard/customers'
              className='block text-blue-600 hover:underline'
            >
              Customers
            </a>
            <a
              href='/dashboard/accounting'
              className='block text-blue-600 hover:underline'
            >
              Accounting
            </a>
            <a href='/login' className='block text-blue-600 hover:underline'>
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
