import { useParams, useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { players, recentMatches } from '../data/mockData'

const BADGE_COLORS = {
  ELITE: 'bg-tertiary-container/30 border-tertiary-dim/20 text-tertiary-fixed',
  PRO: 'bg-primary/10 border-primary/20 text-primary',
  ADVANCED: 'bg-secondary-container/30 border-secondary/20 text-secondary',
  INTERMEDIATE: 'bg-surface-bright border-outline-variant/30 text-on-surface-variant',
}

export default function PlayerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const player = players.find((p) => p.id === Number(id)) || players[0]

  const myMatches = recentMatches.filter((m) =>
    [...m.teamA.players, ...m.teamB.players].some((p) => p.name === player.name.split(' ')[0])
  )

  return (
    <div className="min-h-screen text-on-surface antialiased pb-32" style={{ backgroundColor: '#070B28' }}>
      {/* Top App Bar */}
      <header className="fixed top-0 z-50 flex justify-between items-center w-full px-6 h-16 bg-[#070B28]/40 backdrop-blur-xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">arrow_back</span>
          <span className="font-headline font-bold tracking-tighter text-xl text-primary tracking-[-0.04em]">SHAKA PADEL</span>
        </button>
        <div className="w-10 h-10 rounded-full border-2 border-primary/30 overflow-hidden">
          <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
        </div>
      </header>

      <main className="pt-16">
        {/* Profile Hero */}
        <section className="relative px-6 pt-10 pb-8 bg-gradient-to-b from-[#0A0F2C] to-[#1A0A3C]">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#6DDDFF] to-[#B3A2F7]">
                <img
                  src={player.avatar}
                  alt={player.name}
                  className="w-full h-full rounded-full border-4 border-[#070B28] object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-[#6DDDFF] to-[#00D2FD] px-3 py-1 rounded-full shadow-lg border-2 border-[#070B28]">
                <span className="text-white font-headline font-extrabold text-sm">{player.rating} {player.isCurrentUser ? '↑' : ''}</span>
              </div>
            </div>

            <h1 className="font-headline font-bold text-3xl tracking-tight mb-2">{player.name}</h1>
            <div className={`inline-flex items-center px-4 py-1 rounded-full border mb-4 ${BADGE_COLORS[player.badge] || BADGE_COLORS.INTERMEDIATE}`}>
              <span className="text-xs font-bold tracking-widest uppercase">{player.badge}</span>
            </div>
            <p className="text-on-surface-variant max-w-xs text-sm leading-relaxed mb-8">{player.bio}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {[
                { label: 'Matches', value: player.matches },
                { label: 'Wins', value: player.wins },
                { label: 'Win Rate', value: `${player.winRate}%` },
                { label: 'Best Partner', value: player.bestPartner },
              ].map(({ label, value }) => (
                <div key={label} className="glass-panel p-4 rounded-lg flex flex-col items-center">
                  <span className="text-on-surface-variant text-[10px] font-medium uppercase tracking-wider mb-1">{label}</span>
                  <span className="font-headline font-bold text-xl">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Index Progression */}
        <section className="px-6 -mt-4">
          <div className="glass-panel p-6 rounded-lg relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline font-bold text-lg mb-0.5">Index Progression</h3>
                <p className="text-on-surface-variant text-xs">Last 30 Days</p>
              </div>
              <div className="text-right">
                <p className="text-primary font-headline font-extrabold text-2xl">{player.rating}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Today</p>
              </div>
            </div>
            <div className="h-24 w-full relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 100">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#6DDDFF" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#6DDDFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,80 Q50,75 100,60 T200,40 T300,55 T400,20" fill="none" stroke="#6DDDFF" strokeLinecap="round" strokeWidth="3" />
                <path d="M0,80 Q50,75 100,60 T200,40 T300,55 T400,20 V100 H0 Z" fill="url(#chartGradient)" />
                <circle cx="400" cy="20" r="4" fill="#6DDDFF" />
                <circle cx="400" cy="20" r="8" fill="#6DDDFF" fillOpacity="0.2" />
              </svg>
            </div>
          </div>
        </section>

        {/* Recent Performance */}
        <section className="px-6 mt-10">
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-headline font-bold text-xl">Recent Performance</h2>
            <button className="text-primary text-sm font-semibold" onClick={() => navigate('/matches')}>
              View All
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {recentMatches.map((match) => {
              const inA = match.teamA.players.some((p) => p.name === player.name.split(' ')[0])
              const won = inA ? match.teamA.won : match.teamB.won
              const myIdx = inA
                ? match.teamA.players.findIndex((p) => p.name === player.name.split(' ')[0])
                : match.teamB.players.findIndex((p) => p.name === player.name.split(' ')[0])
              const ratingChange = inA
                ? match.teamA.ratingChange[myIdx]
                : match.teamB.ratingChange[myIdx]

              const opponents = inA ? match.teamB.players : match.teamA.players
              const opponentSets = inA ? match.teamB.sets : match.teamA.sets
              const mySets = inA ? match.teamA.sets : match.teamB.sets

              return (
                <div key={match.id} className="glass-panel p-4 rounded-lg flex items-center justify-between">
                  <div className="flex flex-col items-center gap-2 w-24">
                    <div className="flex gap-1">
                      {opponents.slice(0, 2).map((p, i) => (
                        <img key={i} src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {opponents.slice(0, 2).map((p, i) => (
                        <span key={i} className="text-[10px] text-on-surface-variant">{p.name}</span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="flex gap-1 mb-1">
                      {mySets.map((s, i) => (
                        <div key={i} className={`w-8 h-8 flex items-center justify-center rounded border font-bold text-sm ${won ? 'bg-primary/20 text-primary border-primary/30' : 'bg-surface-container-highest text-on-surface-variant/60 border-transparent'}`}>{s}</div>
                      ))}
                    </div>
                    <div className="flex gap-1 mb-2">
                      {opponentSets.map((s, i) => (
                        <div key={i} className={`w-8 h-8 flex items-center justify-center rounded border font-bold text-sm ${!won ? 'bg-primary/20 text-primary border-primary/30' : 'bg-surface-container-highest text-on-surface-variant/60 border-transparent'}`}>{s}</div>
                      ))}
                    </div>
                    <span className={`text-[10px] font-bold tracking-widest uppercase ${won ? 'text-primary' : 'text-error'}`}>
                      {won ? 'WIN' : 'LOSS'}
                    </span>
                  </div>

                  {ratingChange !== undefined && (
                    <div className={`px-3 py-1 rounded-full border ${ratingChange > 0 ? 'bg-primary/10 border-primary/20' : 'bg-error/10 border-error/20'}`}>
                      <span className={`font-bold text-xs ${ratingChange > 0 ? 'text-primary' : 'text-error'}`}>
                        {ratingChange > 0 ? '+' : ''}{ratingChange}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
