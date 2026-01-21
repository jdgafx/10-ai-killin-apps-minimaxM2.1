import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Zap } from 'lucide-react';
import { Card } from '@packages/shared-ui';

interface ROIDataPoint {
  role: string;
  cost: number;
  value: number;
  roi: number;
}

const roiData: ROIDataPoint[] = [
  { role: 'Junior Dev', cost: 60, value: 45, roi: -25 },
  { role: 'Senior Dev', cost: 120, value: 180, roi: 50 },
];

const breakdownData = [
  { category: 'Junior Dev', Cost: 60, 'Value Created': 45 },
  { category: 'Senior Dev', Cost: 120, 'Value Created': 180 },
];

const roiExplanation = [
  { point: '💰 Cost', junior: '$60/hr', senior: '$120/hr (2x)' },
  { point: '⚡ Value', junior: '$45/hr', senior: '$180/hr (4x)' },
  { point: '📈 ROI', junior: '-25%', senior: '+50%' },
  { point: '🎯 Winner', junior: '❌', senior: '✅ Senior' },
];

function App() {
  const [showBreakdown, setShowBreakdown] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Return on Investment Comparison
          </h1>
          <p className="text-gray-600">
            Why hiring senior developers delivers 4x value at only 2x cost
          </p>
        </div>

        {/* Main Comparison Chart */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-blue-600" />
            Cost vs Value: Side-by-Side Comparison
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={breakdownData} barGap={20}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis label={{ value: 'Amount ($/hr)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value: number | undefined) => `$${value}/hr`}
                contentStyle={{ borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="Cost" fill="#ef4444" name="Cost (Red = Expense)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Value Created" fill="#10b981" name="Value Created (Green = Revenue)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-blue-800">
              <strong>Key Insight:</strong> The green bars (value) are what matters. Senior Dev creates 
              <span className="text-green-600 font-semibold"> 4x more value</span> despite only costing 
              <span className="text-red-600 font-semibold"> 2x more</span>.
            </p>
          </div>
        </Card>

        {/* ROI Bar Chart */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Actual ROI (Value - Cost)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={roiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis label={{ value: 'ROI ($/hr)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value: number | undefined) => `$${value}/hr`} />
              <Legend />
              <Bar dataKey="roi" fill="#3b82f6" name="Net ROI" radius={[4, 4, 0, 0]}>
                {roiData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.roi > 0 ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
              <Line type="monotone" dataKey="cost" stroke="#ef4444" strokeWidth={2} dot={{ r: 6 }} name="Cost" />
              <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ r: 6 }} name="Value" />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <p className="text-sm text-green-800 font-medium">
              ✅ Senior Dev ROI: <span className="text-green-600 font-bold">+$50/hr</span> (Positive!) <br/>
              ❌ Junior Dev ROI: <span className="text-red-600 font-bold">-$25/hr</span> (Losing money!)
            </p>
          </div>
        </Card>

        {/* Simple Breakdown Table */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            The Math, Simply Stated
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 bg-red-50">Junior Dev</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700 bg-green-50">Senior Dev</th>
                </tr>
              </thead>
              <tbody>
                {roiExplanation.map((row, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3 px-4 font-medium text-gray-800">{row.point}</td>
                    <td className="text-center py-3 px-4 text-red-600 font-semibold">{row.junior}</td>
                    <td className="text-center py-3 px-4 text-green-600 font-semibold">{row.senior}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Bottom Line Summary */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl text-white">
          <h3 className="text-xl font-bold mb-3">The Bottom Line</h3>
          <p className="text-lg leading-relaxed">
            When you pay a senior developer <strong>2x more</strong> ($120 vs $60), you get 
            <strong> 4x more value</strong> ($180 vs $45). That's not just a better deal—it's the only 
            math that works. <span className="font-bold text-yellow-300">Senior developers pay for themselves.</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
