import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Hero from '../components/Home/Hero';
import CategoriesSection from '../components/Home/CategoriesSection';
import ServicesSection from '../components/Home/ServicesSection';
import ProvidersSection from '../components/Home/ProvidersSection';
import HowItWorksSection from '../components/Home/HowItWorksSection';
import TestimonialsSection from '../components/Home/TestimonialsSection';
import CTASection from '../components/Home/CTASection';

const Home = () => (
  <MainLayout>
    <Hero />
    <CategoriesSection />
    <HowItWorksSection />
    <ServicesSection />
    <ProvidersSection />
    <TestimonialsSection />
    <CTASection />
  </MainLayout>
);

export default Home;
