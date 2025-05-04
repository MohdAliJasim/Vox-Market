"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Plus, Save, X } from "lucide-react";
import Button from "@/app/ui/Button";
import FormField from "@/app/components/forms/FormField";
import { categories } from "@/app/constants/categories";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import SellerLayout from "../SellerLayout";

const AddProductPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error("You can upload a maximum of 5 images");
      return;
    }

    const newImages = files.map((file) => file);
    setImages((prev) => [...prev, ...newImages]);

    const newPreviewImages = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviewImages]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadImagesToCloudinary = async (imageFiles) => {
    try {
      const uploadPromises = imageFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
        );

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
        return response.data.secure_url;
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (
        !formData.name ||
        !formData.price ||
        !formData.description ||
        !formData.category ||
        !formData.stock
      ) {
        toast.error("Please fill all required fields");
        return;
      }

      if (images.length === 0) {
        toast.error("Please upload at least one image");
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
        additionalImages: imageUrls.slice(1), // Other images as additional images
      };

      // Get token from localStorage
      const token = localStorage.getItem("Sellertoken");

      // Submit to backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/p/addProduct`,
        productData,
        {
          headers: {
            "x-auth-token": token,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Product added successfully!");
        router.push("/seller/manage-product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.message || "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                <h1 className="text-2xl font-bold mb-6">Add New Product</h1>

                <form onSubmit={handleSubmit}>
                  {/* Image Upload Section */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Product Images (Max 5)
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      {previewImages.map((image, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg overflow-hidden"
                        >
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
                            <Upload
                              size={24}
                              className="mx-auto text-neutral-400"
                            />
                            <span className="mt-2 block text-sm text-neutral-500">
                              Add Image
                            </span>
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

                    <FormField
                      label="Description"
                      htmlFor="description"
                      required
                    >
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

                      <FormField
                        label="Stock Quantity"
                        htmlFor="stock"
                        required
                      >
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

                      <FormField
                        label="Category"
                        htmlFor="category"
                        required
                        className="md:col-span-2"
                      >
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="form-input"
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
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
                      onClick={() => router.push("/seller/manage-product")}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      icon={<Plus size={16} />}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add Product"}
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

export default AddProductPage;
