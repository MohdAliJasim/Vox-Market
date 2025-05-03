'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Save, Building, Globe } from 'lucide-react';
import Button from '@/app/ui/Button';
import FormField from '@/app/components/forms/FormField';

const SellerProfilePage = () => {
  const [formData, setFormData] = useState({
    businessName: 'Tech Gadgets Store',
    ownerName: 'Jane Smith',
    email: 'jane@techgadgets.com',
    phone: '+1 (555) 987-6543',
    address: '456 Commerce St, Business City, USA',
    website: 'www.techgadgets.com',
    description: 'Leading provider of high-quality tech gadgets and accessories.',
    avatar: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
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
              <h1 className="text-2xl font-bold mb-6">Seller Profile</h1>

              <form onSubmit={handleSubmit}>
                {/* Store Logo Section */}
                <div className="mb-8 flex items-center">
                  <div className="relative">
                    <img
                      src={formData.avatar}
                      alt="Store Logo"
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
                    <h3 className="font-medium">Store Logo</h3>
                    <p className="text-sm text-neutral-500">
                      Upload your store logo or brand image
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Business Name" htmlFor="businessName">
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Owner Name" htmlFor="ownerName">
                    <input
                      type="text"
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
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

                  <FormField label="Website" htmlFor="website">
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Business Address" htmlFor="address">
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </FormField>

                  <FormField label="Business Description" htmlFor="description" className="md:col-span-2">
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="form-input"
                    />
                  </FormField>
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

export default SellerProfilePage;