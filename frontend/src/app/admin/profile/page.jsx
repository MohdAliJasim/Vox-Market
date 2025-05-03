'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Camera, Save, Shield, Key } from 'lucide-react';
import Button from '@/app/ui/Button';
import FormField from '@/app/components/forms/FormField';

const AdminProfilePage = () => {
  const [formData, setFormData] = useState({
    name: 'Admin User',
    email: 'admin@marketplace.com',
    phone: '+1 (555) 123-4567',
    role: 'Super Admin',
    lastLogin: '2024-03-15 14:30',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Profile updated:', formData);
  };

  return (
    <div className="container-custom py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Admin Profile</h1>
                <div className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {formData.role}
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Admin Avatar Section */}
                <div className="mb-8 flex items-center">
                  <div className="relative">
                    <img
                      src={formData.avatar}
                      alt="Admin Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:bg-neutral-50"
                    >
                      <Camera size={16} className="text-neutral-600" />
                    </button>
                  </div>
                  <div className="ml-6">
                    <h3 className="font-medium">Profile Photo</h3>
                    <p className="text-sm text-neutral-500">
                      Last login: {formData.lastLogin}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Name" htmlFor="name">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Email" htmlFor="email">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Phone" htmlFor="phone">
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Role" htmlFor="role">
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role}
                      readOnly
                      className="form-input bg-neutral-50"
                    />
                  </FormField>
                </div>

                <div className="mt-8 border-t border-neutral-200 pt-6">
                  <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <Button
                      variant="outline"
                      icon={<Key size={16} />}
                      className="w-full sm:w-auto"
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      icon={<Shield size={16} />}
                      className="w-full sm:w-auto"
                    >
                      Two-Factor Authentication
                    </Button>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    icon={<Save size={16} />}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminProfilePage;