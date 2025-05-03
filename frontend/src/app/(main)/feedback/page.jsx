'use client';
import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import Button from '@/app/ui/Button';
import FormField from '@/app/components/forms/FormField';

const FeedbackPage = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    feedbackType: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleRatingHover = (hoveredValue) => {
    setHoveredRating(hoveredValue);
  };

  const handleRatingLeave = () => {
    setHoveredRating(0);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate form
    let isValid = true;
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    if (!formData.feedbackType) {
      newErrors.feedbackType = 'Please select a feedback type';
      isValid = false;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Feedback message is required';
      isValid = false;
    }
    
    if (rating === 0) {
      newErrors.rating = 'Please provide a rating';
      isValid = false;
    }
    
    if (!isValid) {
      setErrors(newErrors);
      return;
    }
    
    // Simulate form submission
    setIsLoading(true);
    
    // Mock API call delay
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      // In a real app, you would handle the form submission response here
      console.log('Feedback submitted', { ...formData, rating });
    }, 1500);
  };

  return (
    <div className="page-transition">
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="container-custom relative z-10 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Share Your Feedback</h1>
            <p className="text-lg mb-0 text-white/90">
              Your opinion matters to us. Help us improve our marketplace by sharing your thoughts and experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-neutral-50 rounded-xl shadow-sm overflow-hidden"
          >
            {!isSubmitted ? (
              <div className="p-8">
                <div className="flex items-center mb-6">
                  <MessageSquare size={24} className="text-primary-500 mr-3" />
                  <h2 className="text-2xl font-bold">Your Feedback</h2>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <FormField 
                      label="Name" 
                      htmlFor="name" 
                      error={errors.name}
                      required
                    >
                      <input
                        id="name"
                        name="name"
                        type="text"
                        className="form-input"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                      />
                    </FormField>
                    
                    <FormField 
                      label="Email" 
                      htmlFor="email" 
                      error={errors.email}
                      required
                    >
                      <input
                        id="email"
                        name="email"
                        type="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your email address"
                      />
                    </FormField>
                  </div>
                  
                  <FormField 
                    label="Feedback Type" 
                    htmlFor="feedbackType" 
                    error={errors.feedbackType}
                    required
                  >
                    <select
                      id="feedbackType"
                      name="feedbackType"
                      className="form-input"
                      value={formData.feedbackType}
                      onChange={handleChange}
                    >
                      <option value="">Select feedback type</option>
                      <option value="general">General Feedback</option>
                      <option value="website">Website Experience</option>
                      <option value="products">Product Quality</option>
                      <option value="shipping">Shipping & Delivery</option>
                      <option value="customer-service">Customer Service</option>
                      <option value="suggestion">Suggestion</option>
                    </select>
                  </FormField>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      Your Rating <span className="text-error-500">*</span>
                    </label>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((starValue) => (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => handleRatingClick(starValue)}
                          onMouseEnter={() => handleRatingHover(starValue)}
                          onMouseLeave={handleRatingLeave}
                          className="p-1"
                        >
                          <Star
                            size={32}
                            className={`
                              ${(starValue <= (hoveredRating || rating)) 
                                ? 'text-amber-400 fill-amber-400' 
                                : 'text-neutral-300'}
                              transition-colors duration-150
                            `}
                          />
                        </button>
                      ))}
                    </div>
                    {errors.rating && (
                      <p className="mt-1 text-sm text-error-500">{errors.rating}</p>
                    )}
                  </div>
                  
                  <FormField 
                    label="Your Feedback" 
                    htmlFor="message" 
                    error={errors.message}
                    required
                  >
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      className="form-input"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please share your thoughts, suggestions, or experiences with our marketplace..."
                    />
                  </FormField>
                  
                  <Button 
                    type="submit" 
                    variant="primary" 
                    fullWidth 
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    Submit Feedback
                  </Button>
                </form>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-12"
              >
                <div className="w-20 h-20 mx-auto flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-6">
                  <ThumbsUp size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-2">Thank You for Your Feedback!</h3>
                <p className="text-neutral-600 mb-8 max-w-lg mx-auto">
                  We appreciate you taking the time to share your thoughts with us. Your feedback is valuable and helps us improve our marketplace experience for everyone.
                </p>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsSubmitted(false);
                    setRating(0);
                    setFormData({
                      name: '',
                      email: '',
                      feedbackType: '',
                      message: ''
                    });
                  }}
                >
                  Submit Another Feedback
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Why Feedback Matters Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <h2 className="text-2xl font-bold text-center mb-12">Why Your Feedback Matters</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-4">
                <Star size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Improve Our Services</h3>
              <p className="text-neutral-600">
                Your feedback helps us identify areas where we can improve and enhance the shopping experience for all our customers.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary-100 text-secondary-600 mb-4">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Influence Future Development</h3>
              <p className="text-neutral-600">
                Your suggestions and ideas directly impact our roadmap and help shape the future features and services we offer.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-accent-100 text-accent-600 mb-4">
                <ThumbsUp size={24} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Build a Better Community</h3>
              <p className="text-neutral-600">
                Sharing your experiences helps other shoppers make informed decisions and contributes to building a stronger marketplace community.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeedbackPage;