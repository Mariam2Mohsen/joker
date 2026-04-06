import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Button from '../components/UI/Button';
import { Input } from '../components/UI/Input';
import toast from 'react-hot-toast';

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MapPinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m22 2-7 20-4-9-9-4Z" />
    <path d="M22 2 11 13" />
  </svg>
);

const ContactInfoItem = ({ icon, title, details }) => (
  <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#FEFAF6]/10 transition-colors duration-300">
    <div className="mt-1 text-[#DAC0A3] bg-[#102C57] p-3 rounded-full shadow-lg border border-[#EADBC8]/20">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-bold text-[#DAC0A3] mb-1">{title}</h3>
      {details.map((detail, idx) => (
        <p key={idx} className="text-[#FEFAF6]/80 text-sm leading-relaxed">{detail}</p>
      ))}
    </div>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#FEFAF6] py-16 md:py-24 relative overflow-hidden flex items-center">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#DAC0A3]/20 blur-3xl opacity-50"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-[#102C57]/10 blur-3xl opacity-50"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-16 md:mb-20">
              <h4 className="text-[#DAC0A3] font-black uppercase tracking-[0.3em] text-sm mb-4">Get In Touch</h4>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#102C57] tracking-tight">
                Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#102C57] to-[#DAC0A3]">Conversation</span>
              </h1>
              <p className="mt-6 text-base md:text-lg text-[#102C57]/70 max-w-2xl mx-auto leading-relaxed">
                Whether you have a question about services, pricing, or want to partner with us, our team is ready to answer all your questions.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch shadow-[0_20px_50px_rgba(16,44,87,0.08)] rounded-3xl overflow-hidden bg-white/60 backdrop-blur-xl border border-[#EADBC8]/50">
              
              {/* Left Column - Contact Details Showcase */}
              <div className="lg:col-span-5 bg-[#102C57] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between">
                {/* Decorative blob in dark section */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#DAC0A3]/20 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
                
                <div className="relative z-10 mb-12">
                  <h2 className="text-3xl font-bold text-[#FEFAF6] mb-4">Contact Information</h2>
                  <p className="text-[#FEFAF6]/70 leading-relaxed">
                    Fill up the form and our team will get back to you within 24 hours. We're here to help!
                  </p>
                </div>

                <div className="relative z-10 space-y-8 flex-grow flex flex-col justify-center">
                  <ContactInfoItem 
                    icon={<PhoneIcon />}
                    title="Phone"
                    details={['+1 (555) 123-4567', '+1 (555) 987-6543']}
                  />
                  <ContactInfoItem 
                    icon={<MailIcon />}
                    title="Email"
                    details={['support@jokerproject.com', 'contact@jokerproject.com']}
                  />
                  <ContactInfoItem 
                    icon={<MapPinIcon />}
                    title="Headquarters"
                    details={['123 Innovation Drive', 'Tech District, NY 10001', 'United States']}
                  />
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="lg:col-span-7 p-8 md:p-12 bg-white relative z-10">
                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col h-full justify-center">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Your Name"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      error={errors.name}
                      required
                    />
                    <Input
                      label="Your Email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      error={errors.email}
                      required
                    />
                  </div>
                  
                  <Input
                    label="Subject"
                    name="subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={handleChange}
                    error={errors.subject}
                    required
                  />

                  <div className="w-full flex flex-col gap-1.5 relative group">
                    <label className="text-[11px] font-black uppercase tracking-[0.2em] transition-colors duration-300 text-[#102C57]">
                      Message <span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows="6"
                      className={`w-full p-4 bg-[#FEFAF6] rounded-xl outline-none text-[#102C57] text-sm font-medium transition-all duration-300 border-2 resize-none
                        ${errors.message
                          ? 'border-red-400 bg-red-50/30 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                          : 'border-[#EADBC8]/60 focus:border-[#102C57] focus:bg-white shadow-sm'
                        }`}
                      placeholder="Write your message here..."
                      value={formData.message}
                      onChange={handleChange}
                    ></textarea>
                    {errors.message && (
                      <span className="text-red-600 text-[9px] font-bold uppercase tracking-wider mt-1 px-1 flex justify-end animate-in fade-in slide-in-from-top-1">
                        {errors.message}
                      </span>
                    )}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      size="lg" 
                      isLoading={isSubmitting}
                      icon={<SendIcon />}
                      iconPosition="right"
                      className="w-full md:w-auto px-10 shadow-xl"
                    >
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
