import Link from 'next/link';
import Image from 'next/image';

interface ContestItem {
  id: string;
  title: string;
  coverImage?: string | null;
  endDate?: string | null;
  _count?: { contestants?: number };
  participantCount?: number;
}

interface HomeContestsSectionProps {
  contests: ContestItem[];
}

function getDaysLeft(endDate?: string | null): number {
  if (!endDate) return 0;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function HomeContestsSection({ contests }: HomeContestsSectionProps) {
  if (!contests || contests.length === 0) return null;

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'rgba(91,124,255,0.15)' }} />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-[120px]" style={{ background: 'rgba(123,97,255,0.15)' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-6 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-white/80">Concours en direct</span>
          </div>
          <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4" style={{ textShadow: '0 0 40px rgba(91,124,255,0.4)' }}>
            Participez aux votes
          </h2>
          <p className="text-xl text-white/50 max-w-2xl mx-auto">Soutenez vos favoris et gagnez des places exclusives</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {contests.map((contest, index) => {
            const participants = contest._count?.contestants ?? contest.participantCount ?? 0;
            const daysLeft = getDaysLeft(contest.endDate);
            const image = contest.coverImage;

            return (
              <Link key={contest.id} href={`/votes/${contest.id}`} className="group">
                <div className="relative rounded-3xl overflow-hidden transition-all duration-500 group-hover:scale-[1.02] card-shine" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="relative h-52 bg-white/5">
                    {image && (
                      <Image src={image} alt={contest.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f23] via-[#0f0f23]/40 to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
                        <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                          TOP {index + 1}
                        </span>
                      </div>
                      {daysLeft > 0 && (
                        <div className="px-3 py-1.5 rounded-full" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
                          <span className="text-xs font-bold text-white">{daysLeft}j restants</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'rgba(15,15,35,0.6)' }}>
                      <div className="px-7 py-3.5 rounded-full flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform" style={{ background: 'linear-gradient(135deg, #5B7CFF, #7B61FF)' }}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="font-bold text-white text-sm">Voter maintenant</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-4 group-hover:text-[#A8D4FF] transition-colors line-clamp-2">{contest.title}</h3>
                    {participants > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-white/50">Participation</span>
                          <span className="text-white font-semibold">{participants.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${Math.min(100, (participants / 4000) * 100)}%`, background: 'linear-gradient(90deg, #5B7CFF, #7B61FF, #A8D4FF)', boxShadow: '0 0 10px rgba(91,124,255,0.5)' }} />
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-sm text-white/50">{participants > 0 ? `${participants.toLocaleString()} participants` : 'Nouveau concours'}</span>
                      <span className="text-sm font-semibold text-[#5B7CFF] flex items-center gap-1">
                        Voir
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ boxShadow: '0 0 50px rgba(91,124,255,0.2), inset 0 0 50px rgba(91,124,255,0.05)' }} />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/votes" className="inline-flex items-center gap-2 px-8 py-4 bg-white/8 border border-white/15 rounded-full text-white font-semibold hover:bg-white/15 transition-all backdrop-blur-sm">
            Découvrir tous les concours
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6" /></svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
