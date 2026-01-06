import React from 'react';
import ConsNav from './components/consnav';
import DrugTransactionCard from './components/drugTransactionCard';

const ConsumerPage = () => {
  return (
    <div className="min-h-screen bg-med-cream font-sans">
      <ConsNav />
      <div className="pt-24 pb-12 px-4 md:px-8 max-w-7xl mx-auto flex justify-center">
        <div className="w-full max-w-4xl">
          <DrugTransactionCard />
        </div>
      </div>
    </div>
  );
};

export default ConsumerPage;
