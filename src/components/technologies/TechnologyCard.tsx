// ✅ components/technologies/TechnologyCard.tsx
import React from 'react';

interface TechnologyCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  url?: string;
}

const TechnologyCard: React.FC<TechnologyCardProps> = ({ title, description, icon, color, url }) => {
  const colorClass = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    gray: 'bg-gray-500',
    black: 'bg-black',
    lime: 'bg-lime-500'
  }[color] || 'bg-gray-500';

  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 flex flex-col justify-between h-full">
      <div>
        <div className={`w-12 h-12 text-white text-xl flex items-center justify-center rounded-full ${colorClass} mb-4`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      </div>
      <div className="mt-auto flex justify-end">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="white"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5H19.5V10.5M19.5 4.5L10.5 13.5"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default TechnologyCard;
