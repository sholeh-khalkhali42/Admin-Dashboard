import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'ژانویه', فروش: 4000 },
  { name: 'فوریه', فروش: 3000 },
  { name: 'مارس', فروش: 5000 },
  { name: 'آوریل', فروش: 4000 },
  { name: 'می', فروش: 6000 },
  { name: 'ژوئن', فروش: 7000 },
];

const Chart = () => {
  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center">داشبورد تحلیلی فروش</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="فروش" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CHart;
