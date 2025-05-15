
import React from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import Services from '@/components/home/Services';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import PromoSection from '@/components/home/PromoSection';
import CTASection from '@/components/home/CTASection';

const Index: React.FC = () => {
  return (
    <Layout>
      <Hero />
      <Services />
      <HowItWorks />
      <PromoSection />
      <Testimonials />
      <CTASection />
    </Layout>
  );
};

export default Index;
