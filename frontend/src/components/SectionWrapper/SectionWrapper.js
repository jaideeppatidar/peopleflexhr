import React from 'react';

const SectionWrapper = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-lg font-bold text-blue-600 mb-4">{title}</h2>
    <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
      {children}
    </div>
  </div>
);

export default SectionWrapper;
