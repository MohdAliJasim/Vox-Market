'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye, MoreVertical, AlertCircle } from 'lucide-react';
import Button from '@/app/ui/Button';
import { categories } from '@/app/constants/categories';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import SellerLayout from '../SellerLayout';

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('Sellertoken');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/p/getall`, {
          headers: {
            'x-auth-token': token
          }
        });
        setProducts(res.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        toast.error('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const deleteProduct = async () => {
    try {
      const token = localStorage.getItem('Sellertoken');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/p/deletebyid/${productToDelete._id}`, {
        headers: {
          'x-auth-token': token
        }
      });
      toast.success('Product deleted successfully');
      setProducts(products.filter(product => product._id !== productToDelete._id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low-high':
          return a.price - b.price;
        case 'price-high-low':
          return b.price - a.price;
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        default: // newest
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  if (isLoading) {
    return (
      <div className="container-custom py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Manage Products</h1>
            <p className="text-neutral-600">
              {filteredProducts.length} products found
            </p>
          </div>
          <Button
            to="/seller/add-product"
            variant="primary"
            icon={<Plus size={16} />}
            className="mt-4 sm:mt-0"
          >
            Add New Product
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-input"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-input"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        {filteredProducts.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-neutral-50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Product</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Category</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Price</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Stock</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Status</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div className="ml-4">
                            <div className="font-medium text-neutral-900">{product.name}</div>
                            <div className="text-sm text-neutral-500">ID: {product._id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-neutral-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900">${product.price.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm font-medium ${
                          product.stock > 10 ? 'text-success-500' : 'text-error-500'
                        }`}>
                          {product.stock} in stock
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock > 0
                            ? 'bg-success-100 text-success-800'
                            : 'bg-error-100 text-error-800'
                        }`}>
                          {product.stock > 0 ? 'Active' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Eye size={14} />}
                            to={`/product-details/${product._id}`}
                          >
                            View
                          </Button>
                          <Link href={`/seller/products/update/${product._id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              icon={<Edit size={14} />}
                            >
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<Trash2 size={14} />}
                            className="text-error-500 hover:text-error-600"
                            onClick={() => {
                              setProductToDelete(product);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-1">No products found</h3>
            <p className="text-neutral-600">
              Try adjusting your search or add a new product.
            </p>
          </div>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-sm p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete {productToDelete?.name}?</p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={deleteProduct}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
    </SellerLayout>
  );
};

export default ManageProductsPage;


