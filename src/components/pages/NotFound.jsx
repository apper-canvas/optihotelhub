import React from 'react';
import { Link } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <ApperIcon name="AlertTriangle" size={64} className="mx-auto text-orange-500 mb-4" />
          <h1 className="text-6xl font-bold text-gray-800 mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full">
              <ApperIcon name="Home" size={16} className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Link to="/rooms" className="flex-1">
              <Button variant="outline" className="w-full text-sm">
                <ApperIcon name="Building" size={14} className="mr-1" />
                Rooms
              </Button>
            </Link>
            <Link to="/guests" className="flex-1">
              <Button variant="outline" className="w-full text-sm">
                <ApperIcon name="Users" size={14} className="mr-1" />
                Guests
              </Button>
            </Link>
            <Link to="/bookings" className="flex-1">
              <Button variant="outline" className="w-full text-sm">
                <ApperIcon name="Calendar" size={14} className="mr-1" />
                Bookings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;