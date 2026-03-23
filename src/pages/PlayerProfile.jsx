import { useParams, useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { usePlayer, usePlayerMatches } from '../hooks/useFirestore'

const BADGE_COLORS = {
  ELITE: 'bg-tertiary-container/30 border-tertiary-dim/20 text-tertiary-fixed',
  PRO: 'bg-primary/10 border-primary/20 text-primary',
  ADVANCED: 'bg-secondary-container/30 border-secondary/20 text-secondary',
  INTERMEDIATE: 'bg-surface-bright border-outline-variant/30 text-on-surface-variant',
}

export default function PlayerProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { player, loading } = usePlayer(id)
  const { matches } = usePlayerMatches(id)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070B28]">
        <div className="glass-panel rounded-full px-6 py-3 text-on-surface-variant animate-pulse">Caricamento...</div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070B28]">
        <div className="text-on-surface-variant">Giocatore non trovato.</div>
      </div>
    )
  }

  const badgeClass = BADGE_COLORS[player.badge] || BADGE_COLORS.INTERMEDIATE

  return (
    <div className="min-h-screen text-on-surface antialiased pb-32 bg-[#070B28]">
      {/* Top App Bar */}
      <header className="fixed top-0 z-50 flex justify-between items-center w-full px-6 h-16 bg-[#070B28]/40 backdrop-blur-xl">
        <button onClick={() => navigate(-1)} className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary">arrow_back</span>
          <span className="font-headline font-bold tracking-tighter text-xl text-primary">SHAKA PADEL</span>
        </button>
        <div className="w-10 h-10 rounded-full border-2 border-primary/30 overflow-hidden">
          <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
        </div>
      </header>

      <main className="pt-16">
        {/* Hero */}
        <section className="relative px-6 pt-10 pb-8 bg-gradient-to-b from-[#0A0F2C] to-[#1A0A3C]">
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-[#6DDDFF] to-[#B3A2F7]">
                <img src={player.avatar} alt={player.name} className="w-full h-full rounded-full border-4 border-[#070B28] object-cover" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-[#6DDDFF] to-[#00D2FD] px-3 py-1 rounded-full shadow-lg border-2 border-[#070B28]">
                <span className="text-white font-headline font-extrabold text-sm">{player.rating?.toFixed(1)} ↑</span>
              </div>
            </div>
            <h1 className="font-headline font-bold text-3xl tracking-tight mb-2">{player.name}</h1>
            {player.badge && (
              <div className={`inline-flex items-center px-4 py-1 rounded-full border mb-4 ${badgeClass}`}>
                <span className="text-xs font-bold tracking-widest uppercase">{player.badge}</span>
              </div>
            )}
            {player.bio && (
              <p className="text-on-surface-variant max-w-xs text-sm leading-relaxed mb-8">{player.bio}</p>
            )}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
              {[
                { label: 'Partite', value: player.matches ?? 0 },
                { label: 'Vittorie', value: player.wins ?? 0 },
                { label: 'Win Rate', value: `${player.winRate ?? 0}%` },
                { label: 'Best Partner', value: player.bestPartner || '—' },
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
                <p className="text-on-surface-variant text-xs">Ultimi aggiornamenti</p>
              </div>
              <div className="text-right">
                <p className="text-primary font-headline font-extrabold text-2xl">{player.rating?.toFixed(1)}</p>
                <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Oggi</p>
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

        {/* Recent Matches */}
        <section className="px-6 mt-10">
          <div className="flex justify-between items-end mb-6">
            <h2 className="font-headline font-bold text-xl">Recent Performance</h2>
            <button className="text-primary text-sm font-semibold" onClick={() => navigate('/matches')}>View All</button>
          </div>

          {matches.length === 0 ? (
            <div className="glass-panel rounded-lg p-6 text-center text-on-surface-variant text-sm">
              Nessuna partita ancora.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {matches.slice(0, 5).map((match) => {
                const inA = match.teamA?.playerIds?.includes(id)
                const myTeam = inA ? match.teamA : match.teamB
                const oppTeam = inA ? match.teamB : match.teamA
                const won = myTeam?.won
                const myIdx = myTeam?.playerIds?.indexOf(id) ?? 0
                const delta = myTeam?.ratingChange?.[myIdx]

                return (
                  <div key={match.id} className="glass-panel p-4 rounded-lg flex items-center justify-between">
                    <div className="flex flex-col items-center gap-2 w-24">
                      <div className="flex gap-1">
                        {(oppTeam?.playerAvatars || []).slice(0, 2).map((av, i) => (
                          <img key={i} src={av} alt="" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                        ))}
                      </div>
                      <div className="flex gap-1">
                        {(oppTeam?.playerNames || []).slice(0, 2).map((name, i) => (
                          <span key={i} className="text-[9px] text-on-surface-variant truncate">{name}</span>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex gap-1 mb-1">
                        {(myTeam?.sets || []).map((s, i) => (
                          <div key={i} className={`w-8 h-8 flex items-center justify-center rounded border font-bold text-sm ${won ? 'bg-primary/20 text-primary border-primary/30' : 'bg-surface-container-highest text-on-surface-variant/60 border-transparent'}`}>{s}</div>
                        ))}
                      </div>
                      <div className="flex gap-1 mb-2">
                        {(oppTeam?.sets || []).map((s, i) => (
                          <div key={i} className={`w-8 h-8 flex items-center justify-center rounded border font-bold text-sm ${!won ? 'bg-primary/20 text-primary border-primary/30' : 'bg-surface-container-highest text-on-surface-variant/60 border-transparent'}`}>{s}</div>
                        ))}
                      </div>
                      <span className={`text-[10px] font-bold tracking-widest uppercase ${won ? 'text-primary' : 'text-error'}`}>
                        {won ? 'WIN' : 'LOSS'}
                      </span>
                    </div>

                    {delta !== undefined && (
                      <div className={`px-3 py-1 rounded-full border ${delta >= 0 ? 'bg-primary/10 border-primary/20' : 'bg-error/10 border-error/20'}`}>
                        <span className={`font-bold text-xs ${delta >= 0 ? 'text-primary' : 'text-error'}`}>
                          {delta >= 0 ? '+' : ''}{delta}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
