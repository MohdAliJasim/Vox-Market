'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Plus, Save, X } from 'lucide-react';
import Button from '@/app/ui/Button';
import FormField from '@/app/components/forms/FormField';
import { categories } from '@/app/constants/categories';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const AddProductPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error('You can upload a maximum of 5 images');
      return;
    }

    const newImages = files.map(file => file);
    setImages(prev => [...prev, ...newImages]);

    const newPreviewImages = files.map(file => URL.createObjectURL(file));
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async (imageFiles) => {
    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
        
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        return response.data.secure_url;
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.price || !formData.description || !formData.category || !formData.stock) {
        toast.error('Please fill all required fields');
        return;
      }

      if (images.length === 0) {
        toast.error('Please upload at least one image');
        return;
      }

      // Upload images to Cloudinary
      const imageUrls = await uploadImagesToCloudinary(images);

      // Prepare product data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        imageUrl: imageUrls[0], // Using first image as main image
        additionalImages: imageUrls.slice(1) // Other images as additional images
      };

      // Get token from localStorage
      const token = localStorage.getItem('Sellertoken');

      // Submit to backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/p/addProduct`,
        productData,
        {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Product added successfully!');
        router.push('/seller/manage-product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast.error(error.response?.data?.message || 'Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
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
              <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

              <form onSubmit={handleSubmit}>
                {/* Image Upload Section */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Product Images (Max 5)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-neutral-50"
                        >
                          <X size={14} className="text-neutral-600" />
                        </button>
                      </div>
                    ))}
                    {previewImages.length < 5 && (
                      <label className="aspect-square rounded-lg border-2 border-dashed border-neutral-300 hover:border-primary-500 cursor-pointer flex items-center justify-center">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="text-center">
                          <Upload size={24} className="mx-auto text-neutral-400" />
                          <span className="mt-2 block text-sm text-neutral-500">Add Image</span>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <FormField label="Product Title" htmlFor="name" required>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter product title"
                    />
                  </FormField>

                  <FormField label="Description" htmlFor="description" required>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="form-input"
                      placeholder="Describe your product"
                    />
                  </FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField label="Price" htmlFor="price" required>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                    </FormField>

                    <FormField label="Stock Quantity" htmlFor="stock" required>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="0"
                        min="0"
                      />
                    </FormField>

                    <FormField label="Category" htmlFor="category" required className="md:col-span-2">
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/seller/manage-product')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={<Plus size={16} />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Product'}
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

export default AddProductPage;


// 'use client'

// import React, { useState } from 'react'
// import { Formik, Form, Field, ErrorMessage } from 'formik'
// import { useRouter } from 'next/navigation'
// import axios from 'axios'
// import toast from 'react-hot-toast'
// import { ChevronRight, Plus, DollarSign, Tag, Package, ImageIcon, Upload } from 'lucide-react'
// import Link from 'next/link'

// const AddProduct = () => {
//   const router = useRouter()
//   const [imagePreview, setImagePreview] = useState(null);
//   const token = localStorage.getItem('Sellertoken')

//   const initialValues = {
//     productName: '',
//     price: '',
//     description: '',
//     category: '',
//     stock: '',
//     image: null,
//   }

//   const validate = (values) => {
//     const errors = {}
//     if (!values.productName) errors.productName = 'Product Name is required'
//     if (!values.price) errors.price = 'Price is required'
//     if (!values.description) errors.description = 'Description is required'
//     if (!values.category) errors.category = 'Category is required'
//     if (!values.stock) errors.stock = 'Stock quantity is required'
//     if (!values.image) errors.image = 'Image is required'
//     return errors
//   }

//   const onSubmit = async (values, { resetForm, setSubmitting }) => {
//     setSubmitting(true);
//     try {
//       const imageUrl = await uploadImageToCloudinary(values.image);
//       console.log('Image URL:', imageUrl);

    
//     const newProduct = {
//       name: values.productName,
//       price: values.price,
//       description: values.description,
//       category: values.category,
//       stock: values.stock,
//       imageUrl: imageUrl, // Add the image URL here
//     };
  
//     try {
//       const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/p/addProduct`,newProduct, {
//         headers: {
//           'x-auth-token': token
//         }
//       });

//       console.log(response.status)
//       resetForm()
//       setImagePreview(null)
//       toast.success('Product Added Successfully')
//       router.replace('/seller/manage-product');
//     } catch (err) {
//       console.error(err)
//       toast.error('Failed to add product')
//     } finally {
//       setSubmitting(false)
//     }

//   } catch (error) {
//     console.error('Image upload failed:', error);
//     toast.error("Image upload failed");
//     setSubmitting(false);
//   }
//   }

//   const handleImageChange = (event, setFieldValue) => {
//     const file = event.currentTarget.files[0]
//     setFieldValue('image', file)
//     if (file) {
//       const reader = new FileReader()
//       reader.onloadend = () => {
//         setImagePreview(reader.result)
//       }
//       reader.readAsDataURL(file)
//     } else {
//       setImagePreview(null)
//     }
//   }

//   const uploadImageToCloudinary = async (imageFile) => {
//     try {
//       // Initialize form data
//       const fd = new FormData();
//       fd.append('file', imageFile);
//       fd.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET); // Add your Cloudinary upload preset here
//       fd.append('cloud_name', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME); // Add your Cloudinary cloud name here
  
//       // Make the POST request to Cloudinary's API
//       const response = await axios.post(
//         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,fd);
  
//       // The URL of the uploaded image
//       const imageUrl = response.data.secure_url;
//       console.log('Image uploaded successfully. URL:', imageUrl);
//       return imageUrl;
//     } catch (error) {
//       console.error('Error uploading image:', error);
//       throw error;
//     }
//   };

//   return (
//     <>
     
//       <div className="max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md mt-6 md:mt-12 font-poppins">
//         <h2 className="text-3xl font-semibold text-center mb-2">Add Your Product</h2>
//         <p className="text-center text-gray-600 mb-8">Fill the details to add your product to the store.</p>

//         <Formik
//           initialValues={initialValues}
//           validate={validate}
//           onSubmit={onSubmit}
//         >
//           {({ isSubmitting, setFieldValue }) => (
//             <Form className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="productName" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
//                   <div className="relative">
//                     <Field
//                       type="text"
//                       name="productName"
//                       id="productName"
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2F6EB8] focus:ring focus:ring-[#2F6EB8] focus:ring-opacity-50 pl-10"
//                       placeholder="Enter product name"
//                     />
//                     <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   </div>
//                   <ErrorMessage name="productName" component="p" className="mt-1 text-sm text-red-600" />
//                 </div>

//                 <div>
//                   <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
//                   <div className="relative">
//                     <Field
//                       type="number"
//                       name="price"
//                       id="price"
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2F6EB8] focus:ring focus:ring-[#2F6EB8] focus:ring-opacity-50 pl-10"
//                       placeholder="Enter price"
//                     />
//                     <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   </div>
//                   <ErrorMessage name="price" component="p" className="mt-1 text-sm text-red-600" />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                 <Field
//                   as="textarea"
//                   name="description"
//                   id="description"
//                   rows="4"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2F6EB8] focus:ring focus:ring-[#2F6EB8] focus:ring-opacity-50"
//                   placeholder="Enter product description"
//                 />
//                 <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-600" />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                   <div className="relative">
//                     <Field
//                       type="text"
//                       name="category"
//                       id="category"
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2F6EB8] focus:ring focus:ring-[#2F6EB8] focus:ring-opacity-50 pl-10"
//                       placeholder="Enter category"
//                     />
//                     <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   </div>
//                   <ErrorMessage name="category" component="p" className="mt-1 text-sm text-red-600" />
//                 </div>

//                 <div>
//                   <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
//                   <div className="relative">
//                     <Field
//                       type="number"
//                       name="stock"
//                       id="stock"
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#2F6EB8] focus:ring focus:ring-[#2F6EB8] focus:ring-opacity-50 pl-10"
//                       placeholder="Enter stock quantity"
//                     />
//                     <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   </div>
//                   <ErrorMessage name="stock" component="p" className="mt-1 text-sm text-red-600" />
//                 </div>
//               </div>

//               <div>
//                 <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
//                 <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                   <div className="space-y-1 text-center">
//                     <svg
//                       className="mx-auto h-12 w-12 text-gray-400"
//                       stroke="currentColor"
//                       fill="none"
//                       viewBox="0 0 48 48"
//                       aria-hidden="true"
//                     >
//                       <path
//                         d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                         strokeWidth={2}
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                     <div className="flex text-sm text-gray-600">
//                       <label
//                         htmlFor="image"
//                         className="relative cursor-pointer bg-white rounded-md font-medium text-[#2F6EB8] hover:text-[#265a94] focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#2F6EB8]"
//                       >
//                         <span>Upload a file</span>
//                         <input
//                           id="image"
//                           name="image"
//                           type="file"
//                           accept="image/*"
//                           className="sr-only"
//                           onChange={(event) => handleImageChange(event, setFieldValue)}
//                         />
//                       </label>
//                       <p className="pl-1">or drag and drop</p>
//                     </div>
//                     <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
//                   </div>
//                 </div>
//                 <ErrorMessage name="image" component="p" className="mt-1 text-sm text-red-600" />
//               </div>

//               {imagePreview && (
//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Image Preview</label>
//                   <img src={imagePreview} alt="Preview" className="max-w-full h-auto max-h-64 rounded-lg" />
//                 </div>
//               )}

//               <div>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2F6EB8] hover:bg-[#265a94] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2F6EB8]"
//                 >
//                   {isSubmitting ? (
//                     <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
//                     </svg>
//                   ) : (
//                     <Plus className="h-5 w-5 mr-2" />
//                   )}
//                   {isSubmitting ? 'Adding Product...' : 'Add Product'}
//                 </button>
//               </div>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </>
//   )
// }

// export default AddProduct