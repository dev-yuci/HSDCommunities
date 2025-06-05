'use client';

import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import Select from 'react-select';

interface DailyStat {
  date: string;
  views: number;
  reads: number;
}

interface BlogStatsPanelProps {
  title: string;
  dateRange: string;
}

function formatNumber(n?: number) {
  if (typeof n !== "number" || isNaN(n)) return "0";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function getDaysInMonth(monthYear: string) {
  const [monthName, yearStr] = monthYear.split(' ');
  const year = Number(yearStr);
  const monthOrder = [
    "January","February","March","April","May","June","July","August","September","October","November","December"
  ];
  const month = monthOrder.indexOf(monthName);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = (i + 1).toString().padStart(2, '0');
    return `${year}-${(month + 1).toString().padStart(2, '0')}-${day}`;
  });
}

export default function BlogStatsPanel({
  title,
  dateRange,
}: BlogStatsPanelProps) {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<{ value: string; label: string }>({ value: "", label: "" });
  const [months, setMonths] = useState<string[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/medium-stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        setStats(data.stats);

        const monthsArr: string[] = Array.from(
          new Set(
            data.stats.map((item: any) => {
              const date = new Date(item.pubDate);
              return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
            })
          )
        );
        monthsArr.sort((a, b) => {
          const [monthA, yearA] = a.split(' ');
          const [monthB, yearB] = b.split(' ');
          if (yearA !== yearB) return Number(yearB) - Number(yearA);
          const monthOrder = [
            "January","February","March","April","May","June","July","August","September","October","November","December"
          ];
          return monthOrder.indexOf(monthB) - monthOrder.indexOf(monthA);
        });
        setMonths(monthsArr);
        setSelectedMonth({ value: monthsArr[0] || "", label: monthsArr[0] || "" });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  const monthOptions = months.map((month: string) => ({ value: month, label: month }));

  const filteredStats = stats.filter(item => {
    const date = new Date(item.pubDate);
    const monthYear = date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    return monthYear === selectedMonth.value;
  });

  const totalViews = filteredStats.reduce((sum, item) => sum + (item.views || 0), 0);
  const totalReads = filteredStats.reduce((sum, item) => sum + (item.reads || 0), 0);

  const daysInMonth = getDaysInMonth(selectedMonth.value);

  const dailyStats: DailyStat[] = daysInMonth.map(date => {
    const stat = filteredStats.find(item => item.pubDate.slice(0, 10) === date);
    return {
      date,
      views: stat?.views || 0,
      reads: stat?.reads || 0,
    };
  });

  return (
    <div className="bg-white rounded-xl shadow p-8 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div>
          <div className="mb-2 text-sm text-gray-500">{dateRange}</div>
          <h2 className="text-2xl font-bold">{title}</h2>
        </div>
        <Select
          options={monthOptions}
          value={selectedMonth}
          onChange={(option) => {
            if (option) setSelectedMonth(option as { value: string; label: string });
          }}
        />
      </div>
      <div className="flex gap-10 items-end mb-8">
        <div>
          <div className="text-4xl font-extrabold text-gray-900">{formatNumber(totalViews)}</div>
          <div className="text-gray-500 text-lg font-medium">Views</div>
        </div>
        <div>
          <div className="text-4xl font-extrabold text-gray-900">{formatNumber(totalReads)}</div>
          <div className="text-gray-500 text-lg font-medium">Reads</div>
        </div>
      </div>
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dailyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={d => d.slice(-2)} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#82ca9d" name="Views" dot={false} />
            <Line type="monotone" dataKey="reads" stroke="#2b7cff" name="Reads" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
