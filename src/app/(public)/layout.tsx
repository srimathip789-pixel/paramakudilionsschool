import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Topbar from '@/components/layout/Topbar';


export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Topbar />
      <Header />
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
