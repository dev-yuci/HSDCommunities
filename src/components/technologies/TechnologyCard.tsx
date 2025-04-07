import React from 'react';

interface TechnologyCardProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  url?: string;
}

const TechnologyCard: React.FC<TechnologyCardProps> = ({ title, description, icon, color, url }) => {
  const colorClasses = {
    // Ana arka plan renkleri
    green: 'from-green-400 to-green-600',
    blue: 'from-blue-400 to-blue-600',
    red: 'from-red-400 to-red-600',
    purple: 'from-purple-400 to-purple-600',
    orange: 'from-orange-400 to-orange-600',
    gray: 'from-gray-400 to-gray-600',
    black: 'from-gray-700 to-gray-900',
    lime: 'from-lime-400 to-lime-600', 
    sky: 'from-sky-400 to-sky-600',
    indigo: 'from-indigo-400 to-indigo-600',
    cyan: 'from-cyan-400 to-cyan-600',
    yellow: 'from-yellow-400 to-yellow-600'
  }[color] || 'from-gray-400 to-gray-600';

  // İkon arka plan renkleri (daha açık tonlar)
  const iconBgClass = {
    green: 'bg-green-100 text-green-600',
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    gray: 'bg-gray-100 text-gray-600',
    black: 'bg-gray-100 text-gray-800',
    lime: 'bg-lime-100 text-lime-600',
    sky: 'bg-sky-100 text-sky-600',
    indigo: 'bg-indigo-100 text-indigo-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    yellow: 'bg-yellow-100 text-yellow-600'
  }[color] || 'bg-gray-100 text-gray-600';

  // İkon gölge renkleri
  const iconShadowClass = {
    green: 'shadow-green-200',
    blue: 'shadow-blue-200',
    red: 'shadow-red-200',
    purple: 'shadow-purple-200',
    orange: 'shadow-orange-200',
    gray: 'shadow-gray-200',
    black: 'shadow-gray-200',
    lime: 'shadow-lime-200',
    sky: 'shadow-sky-200',
    indigo: 'shadow-indigo-200',
    cyan: 'shadow-cyan-200',
    yellow: 'shadow-yellow-200'
  }[color] || 'shadow-gray-200';

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col group border border-gray-100">
      <div className="p-6 flex flex-col h-full">
        {/* İkon ve Başlık */}
        <div className="flex flex-col items-center mb-6 relative">
          {/* Arka plan gradyanı */}
          <div className={`absolute top-0 -right-6 -left-6 h-32 rounded-b-full bg-gradient-to-b ${colorClasses} opacity-5 -z-10 group-hover:opacity-10 transition-opacity duration-300`}></div>
          
          {/* İkon */}
          <div className={`w-16 h-16 text-3xl flex items-center justify-center rounded-full ${iconBgClass} mb-4 shadow-lg ${iconShadowClass} group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>
          
          {/* Başlık */}
          <h3 className="text-xl font-bold text-center leading-tight group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:text-transparent group-hover:from-gray-900 group-hover:to-gray-500 transition-all duration-300">
            {title}
          </h3>
        </div>
        
        {/* Görsel ayırıcı */}
        <div className={`w-12 h-1 mx-auto mb-4 rounded-full bg-gradient-to-r ${colorClasses} opacity-50 group-hover:opacity-100 group-hover:w-16 transition-all duration-300 ease-in-out`}></div>
        
        {/* Açıklama */}
        <p className="text-gray-600 text-sm mb-5 flex-grow text-center">{description}</p>
        
        {/* Bağlantı düğmesi */}
        {url && (
          <div className="mt-auto flex justify-center">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-lg transition-all duration-300 bg-white border border-gray-200 text-gray-700 hover:bg-gradient-to-r ${colorClasses} hover:text-white hover:border-transparent hover:shadow-lg group-hover:shadow-md`}
            >
              İncele
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5H19.5V10.5M19.5 4.5L10.5 13.5"
                />
              </svg>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnologyCard;
