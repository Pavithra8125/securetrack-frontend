import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CallFrequencyChart = ({ data }) => {
  return (
    <div className="chart-container" style={{ backgroundColor: '#1C1C1C', padding: '20px', borderRadius: '10px' }}>
      <h3 className="chart-title" style={{ color: '#E50914', textAlign: 'center', marginBottom: '20px' }}>
        Location-wise Frequency of Suspicious Numbers
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="#333" />
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', borderColor: '#E50914', color: '#fff' }}
            itemStyle={{ color: '#fff' }}
            cursor={{ fill: '#E5091422' }}
          />
          <Legend wrapperStyle={{ color: '#fff' }} />
          <Bar dataKey="value" fill="#E50914" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CallFrequencyChart;
