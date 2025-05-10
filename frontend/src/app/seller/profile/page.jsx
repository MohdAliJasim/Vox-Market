'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Save, Building, Globe } from 'lucide-react';
import Button from '@/app/ui/Button';
import FormField from '@/app/components/forms/FormField';
import SellerLayout from '../SellerLayout';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const SellerProfilePage = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    description: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
   const fetchSellerProfile = async () => {
  try {
    const token = localStorage.getItem('sellerToken');
    
    if (!token) {
      router.push('/seller-login');
      return;
    }

    const response = await axios.get('http://localhost:5000/s/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const sellerData = response.data;
    
    setFormData({
      businessName: sellerData.businessName || '',
      ownerName: sellerData.name || '',
      email: sellerData.email || '',
      phone: sellerData.phoneNumber || '',
      address: sellerData.businessAddress ? 
        `${sellerData.businessAddress.street || ''}, ${sellerData.businessAddress.city || ''}, ${sellerData.businessAddress.state || ''}, ${sellerData.businessAddress.zipCode || ''}` 
        : '',
      website: '',
      description: '',
      avatar: sellerData.profileImage || 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    });
  } catch (err) {
    console.error('Detailed error:', {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status
    });
    setError(err.response?.data?.message || 'Failed to fetch profile data');
    
    // If unauthorized, redirect to login
    if (err.response?.status === 401) {
      router.push('/seller-login');
    }
  } finally {
    setLoading(false);
  }
};

    fetchSellerProfile();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('sellerToken');
      
      // Prepare the data for the backend
      const [street, city, state, zipCode] = formData.address.split(',').map(item => item.trim());
      
      const updateData = {
        name: formData.ownerName,
        email: formData.email,
        phoneNumber: formData.phone,
        businessName: formData.businessName,
        businessAddress: {
          street,
          city,
          state,
          zipCode
        },
        profileImage: formData.avatar
      };

      const response = await axios.put('http://localhost:5000/s/profile', updateData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Profile updated successfully:', response.data);
      // Optionally show a success message to the user
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      console.error('Error updating seller profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SellerLayout>
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <p>Loading profile data...</p>
            </div>
          </div>
        </div>
      </SellerLayout>
    );
  }

  if (error) {
    return (
      <SellerLayout>
        <div className="container-custom py-12">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <p className="text-red-500">{error}</p>
            </div>
          </div>
        </div>
      </SellerLayout>
    );
  }

  return (
    <SellerLayout>
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
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SellerLayout>
  );
};

export default SellerProfilePage;