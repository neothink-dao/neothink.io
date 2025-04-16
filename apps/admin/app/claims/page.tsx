import React from 'react';
import { ClaimTable } from './ClaimTable';

export default function ClaimsPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-white">Token Claims Management</h2>
      <div className="bg-slate-800 rounded-lg p-4 shadow-lg text-slate-200">
        <ClaimTable />
      </div>
    </div>
  );
}
