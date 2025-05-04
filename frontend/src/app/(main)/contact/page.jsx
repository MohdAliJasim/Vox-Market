'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import Button from '@/app/ui/Button';
import FormField from '@/app/components/forms/FormField';
import Navbar from '@/app/components/navigation/Navbar';
import MobileMenu from '@/app/components/navigation/MobileMenu';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
      isValid = false;
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
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
      console.log('Form submitted', formData);
    }, 1500);
  };
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    
      useEffect(() => {
        // Close mobile menu on route change
        setIsMobileMenuOpen(false);
        // Scroll to top on route change
        window.scrollTo(0, 0);
      }, []);
  return (
    <div className="page-transition">
      <Navbar onMobileMenuToggle={setIsMobileMenuOpen} isMenuOpen={isMobileMenuOpen} transparentHeader/>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} /> 
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/7709087/pexels-photo-7709087.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="container-custom relative z-10 py-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg mb-0 text-white/90">
              We're here to help with any questions you may have about our marketplace.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <MapPin size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-neutral-900">Our Location</h3>
                    <p className="mt-1 text-neutral-600">
                      123 Market Street<br />
                      San Francisco, CA 94103<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <Phone size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-neutral-900">Call Us</h3>
                    <p className="mt-1 text-neutral-600">
                      Customer Support: +1 (555) 123-4567<br />
                      Seller Support: +1 (555) 987-6543<br />
                      Monday - Friday, 9am - 6pm EST
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-primary-100 text-primary-600">
                    <Mail size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-neutral-900">Email Us</h3>
                    <p className="mt-1 text-neutral-600">
                      General Inquiries: info@marketplace.com<br />
                      Customer Support: support@marketplace.com<br />
                      Seller Support: sellers@marketplace.com
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Monday - Friday:</span>
                    <span className="text-neutral-900 font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Saturday:</span>
                    <span className="text-neutral-900 font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Sunday:</span>
                    <span className="text-neutral-900 font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <div className="bg-neutral-50 rounded-xl p-8 shadow-sm">
                {!isSubmitted ? (
                  <>
                    <div className="flex items-center mb-6">
                      <MessageSquare size={24} className="text-primary-500 mr-3" />
                      <h2 className="text-2xl font-bold">Send Us a Message</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
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
                      
                      <FormField 
                        label="Subject" 
                        htmlFor="subject" 
                        error={errors.subject}
                        required
                      >
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          className="form-input"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="What is this regarding?"
                        />
                      </FormField>
                      
                      <FormField 
                        label="Message" 
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
                          placeholder="How can we help you?"
                        />
                      </FormField>
                      
                      <Button 
                        type="submit" 
                        variant="primary" 
                        fullWidth 
                        loading={isLoading}
                        disabled={isLoading}
                      >
                        Send Message
                      </Button>
                    </form>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 mx-auto flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-4">
                      <Mail size={32} />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-neutral-600 mb-6">
                      Thank you for reaching out to us. We have received your message and will get back to you as soon as possible.
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          subject: '',
                          message: ''
                        });
                      }}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <div className="aspect-video rounded-xl overflow-hidden shadow-sm">
            <iframe 
              title="Our Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.614490020087!2d80.94615951504305!3d26.846693383161333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2d2a5121b1b%3A0xd7e1fd56a8f1fd72!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1693148365630!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;