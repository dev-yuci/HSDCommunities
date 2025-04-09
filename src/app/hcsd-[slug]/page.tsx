import clubs from '@/data/clubsData';
import { notFound } from 'next/navigation';
import { ClubData } from '@/data/clubsData';

interface Props {
  params: { slug: string };
}

export default function ClubDetailPage({ params }: Props) {
  const club = clubs.find(
    (club: ClubData) => `hcsd-${club.university.toLowerCase().replace(/\s+/g, '-')}` === params.slug
  );

  if (!club) return notFound();

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-16 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-4">{club.name}</h1>
      <p className="text-xl text-gray-300 mb-2">{club.university}</p>
      <p className="text-md text-gray-400 mb-2">{club.city}</p>
      <p className="mt-6 text-gray-300">{club.description}</p>

      {club.website && (
        <p className="mt-4 text-blue-400">
          Web: <a href={club.website} target="_blank" rel="noopener noreferrer">{club.website}</a>
        </p>
      )}
      {club.contactEmail && (
        <p className="mt-2 text-blue-400">İletişim: {club.contactEmail}</p>
      )}
    </div>
  );
}