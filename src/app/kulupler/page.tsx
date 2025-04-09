import ClubList from '@/components/clubs/ClubList';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';

export default function KuluplerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-10 text-center">Topluluklarımız</h1>
        <ClubList />
      </main>
      <Footer />
    </div>
  );
}
