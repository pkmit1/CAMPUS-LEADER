"use client";

import React, { useEffect, useState } from 'react';
import FeedForm from '@/components/dashboard_Component/FeedForm';
import DashboardCard from '@/components/dashboard_Component/dashboardCard';

export default function Page() {
  
  return (
    <div>
      
      <DashboardCard />
      <FeedForm />
    </div>
  );
}
