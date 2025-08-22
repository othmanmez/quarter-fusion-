'use client';

import React from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import OrderWizard from '../../../components/OrderWizard';
import { OrderProvider } from '../../../contexts/OrderContext';

export default function LivraisonPage() {
  return (
    <OrderProvider>
      <main className="min-h-screen">
        <Navbar />
        <OrderWizard mode="delivery" />
        <Footer />
      </main>
    </OrderProvider>
  );
} 