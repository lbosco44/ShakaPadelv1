import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { players } from '../data/mockData'

function Sparkline({ points, color = '#6dddff' }) {
  const d = points.map((y, i) => `${i === 0 ? 'M' : 'L'}${(i / (points.length - 1)) * 40} ${10 - y}`).join(' ')
  return (
    <svg className="w-full h-full" viewBox="0 0 40 10">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function Leaderboard() {
  const navigate = useNavigate()
  const me = players.find((p) => p.isCurrentUser)

  return (
    <div className="min-h-screen bg-[#070b28]">
      {/* Ambient background */}
      <div className="fixed top-[-10%] left-[-10%] w-1/2 h-1/2 bg-tertiary/20 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] -z-10" />

      <TopBar />

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        {/* User Stats */}
        <section className="mb-8 flex gap-4">
          <div className="glass-panel aspect-square w-32 rounded-lg flex flex-col justify-center items-center p-4">
            <span className="text-on-surface-variant text-[10px] uppercase tracking-widest font-label mb-1">YOUR RANK</span>
            <div className="font-headline font-extrabold text-2xl tracking-tighter text-white flex items-center gap-1">
              #{me?.rank}{' '}
              <span className="text-primary text-lg">↑2</span>
            </div>
          </div>
          <div className="glass-panel flex-1 rounded-lg flex flex-col justify-center p-4 gap-2">
            <div className="flex justify-between items-center">
              <span className="text-white text-xs font-medium">Partite Giocate:</span>
              <span className="text-primary font-headline font-bold text-lg">{me?.matches}</span>
            </div>
            <div className="w-full h-px bg-outline-variant/20" />
            <div className="flex justify-between items-center">
              <span className="text-white text-xs font-medium">Vittorie:</span>
              <span className="text-primary font-headline font-bold text-lg">{me?.wins}</span>
            </div>
            <div className="w-full h-px bg-outline-variant/20" />
            <div className="flex justify-between items-center">
              <span className="text-white text-xs font-medium">Win Rate:</span>
              <span className="text-primary font-headline font-bold text-lg">{me?.winRate}%</span>
            </div>
          </div>
        </section>

        {/* Rankings */}
        <div className="flex justify-between items-end mb-6">
          <h2 className="font-headline font-bold text-2xl tracking-tight text-white">Global Rankings</h2>
          <button className="text-primary font-label text-sm font-semibold hover:opacity-80 transition-opacity">
            View All
          </button>
        </div>

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
      </main>

      <BottomNav />
    </div>
  )
}

function PlayerRow({ player }) {
  return (
    <>
      <div className="w-8 flex justify-center">
        <span className={`font-headline font-black text-lg ${player.rank === 1 ? 'text-secondary-dim' : player.isCurrentUser ? 'text-white' : 'text-on-surface-variant opacity-60'}`}>
          {player.rank}
        </span>
      </div>
      <div className="relative">
        <div className={`w-12 h-12 rounded-full overflow-hidden bg-surface-container border ${player.isCurrentUser ? 'border-primary border-2' : 'border-white/5'}`}>
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
        <p className="text-on-surface-variant font-label text-xs">{player.wins}W - {player.losses}L</p>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="font-headline font-black text-2xl text-primary tracking-tighter leading-none">{player.rating}</div>
        <div className="w-12 h-4 opacity-60">
          <Sparkline points={player.trend} />
        </div>
      </div>
    </>
  )
}
