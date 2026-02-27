import Link from 'next/link';
import Image from 'next/image';

const categories = [
  { name: 'Concerts', count: '2.5K+', image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=80', color: 'from-purple-600 to-pink-600' },
  { name: 'Festivals', count: '850+', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&q=80', color: 'from-orange-500 to-red-600' },
  { name: 'Spectacles', count: '1.2K+', image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=600&q=80', color: 'from-blue-600 to-cyan-500' },
  { name: 'Sports', count: '950+', image: 'https://images.unsplash.com/photo-1461896836934-4e2c221bfd66?w=600&q=80', color: 'from-green-600 to-emerald-500' },
  { name: 'Conférences', count: '680+', image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80', color: 'from-indigo-600 to-purple-600' },
  { name: 'Expositions', count: '420+', image: 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=600&q=80', color: 'from-pink-600 to-rose-600' },
  { name: 'Gastronomie', count: '320+', image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80', color: 'from-amber-500 to-orange-600' },
  { name: 'Famille', count: '540+', image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80', color: 'from-teal-500 to-cyan-600' },
];

export default function HomeCategoriesSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob pointer-events-none" />
      <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#5B7CFF]/10 to-[#7B61FF]/10 rounded-full mb-4 text-sm font-bold text-[#5B7CFF] border border-[#5B7CFF]/20">
            Catégories
          </span>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Explorez par catégorie</h2>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">Trouvez l&apos;événement parfait selon vos passions</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-5">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              href={`/events?category=${cat.name}`}
              className="group relative overflow-hidden rounded-2xl h-52 sm:h-60 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="absolute inset-0">
                <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-70 group-hover:opacity-85 transition-opacity duration-500`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="relative z-10 p-5 h-full flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white drop-shadow-md">{cat.name}</h3>
                  <p className="text-sm text-white/85 drop-shadow-md">{cat.count} événements</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-white/25 backdrop-blur-sm rounded-full p-2 w-fit border border-white/30">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
