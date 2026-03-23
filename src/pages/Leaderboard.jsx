import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { usePlayers } from '../hooks/useFirestore'

function Sparkline({ points = [] }) {
  if (points.length < 2) return null
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const d = points
    .map((y, i) => {
      const x = (i / (points.length - 1)) * 40
      const yy = 10 - ((y - min) / range) * 9
      return `${i === 0 ? 'M' : 'L'}${x} ${yy}`
    })
    .join(' ')
  return (
    <svg className="w-full h-full" viewBox="0 0 40 10">
      <path d={d} fill="none" stroke="#6dddff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Skeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="glass-panel rounded-lg p-4 flex items-center gap-4 animate-pulse">
          <div className="w-8 h-6 bg-surface-bright rounded" />
          <div className="w-12 h-12 rounded-full bg-surface-bright" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface-bright rounded w-32" />
            <div className="h-3 bg-surface-bright rounded w-20" />
          </div>
          <div className="w-10 h-8 bg-surface-bright rounded" />
        </div>
      ))}
    </div>
  )
}

export default function Leaderboard() {
  const navigate = useNavigate()
  const { players, loading, error } = usePlayers()
  const me = players.find((p) => p.isCurrentUser)

  return (
    <div className="min-h-screen bg-[#070b28]">
      <div className="fixed top-[-10%] left-[-10%] w-1/2 h-1/2 bg-tertiary/20 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] -z-10" />

      <TopBar />

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        {/* User Stats */}
        {me && (
          <section className="mb-8 flex gap-4">
            <div className="glass-panel aspect-square w-32 rounded-lg flex flex-col justify-center items-center p-4">
              <span className="text-on-surface-variant text-[10px] uppercase tracking-widest font-label mb-1">YOUR RANK</span>
              <div className="font-headline font-extrabold text-2xl tracking-tighter text-white flex items-center gap-1">
                #{me.rank} <span className="text-primary text-lg">↑</span>
              </div>
            </div>
            <div className="glass-panel flex-1 rounded-lg flex flex-col justify-center p-4 gap-2">
              {[
                { label: 'Partite', value: me.matches ?? 0 },
                { label: 'Vittorie', value: me.wins ?? 0 },
                { label: 'Win Rate', value: `${me.winRate ?? 0}%` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="flex justify-between items-center">
                    <span className="text-white text-xs font-medium">{label}:</span>
                    <span className="text-primary font-headline font-bold text-lg">{value}</span>
                  </div>
                  <div className="w-full h-px bg-outline-variant/20 mt-2" />
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="flex justify-between items-end mb-6">
          <h2 className="font-headline font-bold text-2xl tracking-tight text-white">Global Rankings</h2>
          <span className="text-on-surface-variant text-sm">{players.length} giocatori</span>
        </div>

        {error && (
          <div className="glass-panel rounded-lg p-4 border border-error/30 text-error text-sm text-center mb-4">
            Errore nel caricamento dati. Controlla la connessione.
          </div>
        )}

        {loading ? <Skeleton /> : (
          <div className="space-y-4">
            {players.map((player) =>
              player.isCurrentUser ? (
                <div
                  key={player.id}
                  className="relative p-[1px] rounded-lg bg-gradient-to-tr from-primary to-secondary cursor-pointer"
                  onClick={() => navigate(`/profile/${player.id}`)}
                >
                  <div className="bg-surface-container rounded-lg p-4 flex items-center gap-4">
                    <PlayerRow player={player} />
                  </div>
                </div>
              ) : (
                <div
                  key={player.id}
                  className="glass-panel rounded-lg p-4 flex items-center gap-4 transition-transform active:scale-[0.98] cursor-pointer"
                  onClick={() => navigate(`/profile/${player.id}`)}
                >
                  <PlayerRow player={player} />
                </div>
              )
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

function PlayerRow({ player }) {
  return (
    <>
      <div className="w-8 flex justify-center">
        <span className={`font-headline font-black text-lg ${
          player.rank === 1 ? 'text-yellow-400' :
          player.isCurrentUser ? 'text-white' :
          'text-on-surface-variant opacity-60'
        }`}>
          {player.rank}
        </span>
      </div>
      <div className="relative">
        <div className={`w-12 h-12 rounded-full overflow-hidden bg-surface-container border ${
          player.isCurrentUser ? 'border-primary border-2' : 'border-white/5'
        }`}>
          <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
        </div>
        {player.rank === 1 && (
          <div className="absolute -bottom-1 -right-1 bg-yellow-400 w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#070B28]">
            <span className="material-symbols-outlined text-black" style={{ fontSize: '10px', fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-headline font-bold text-white text-base leading-tight">{player.name}</h3>
          {player.isCurrentUser && (
            <span className="bg-primary/20 text-primary text-[8px] uppercase font-black px-1.5 py-0.5 rounded tracking-widest">You</span>
          )}
        </div>
        <p className="text-on-surface-variant font-label text-xs">{player.wins ?? 0}V - {player.losses ?? 0}S</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="font-headline font-black text-2xl text-primary tracking-tighter leading-none">{player.rating?.toFixed(1)}</div>
        <div className="w-12 h-4 opacity-60">
          <Sparkline points={player.trend} />
        </div>
      </div>
    </>
  )
}
