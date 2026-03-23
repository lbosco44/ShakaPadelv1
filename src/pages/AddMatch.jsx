import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { players } from '../data/mockData'

function ScoreInput({ value, onChange }) {
  return (
    <div className="glass-panel p-2 rounded-lg flex flex-col items-center gap-1 border border-white/5">
      <button
        onClick={() => onChange(Math.min(7, value + 1))}
        className="text-primary hover:bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center"
      >
        <span className="material-symbols-outlined">add</span>
      </button>
      <span className="text-3xl font-headline font-extrabold text-white">{value}</span>
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="text-on-surface-variant hover:bg-surface-bright/20 rounded-full w-8 h-8 flex items-center justify-center"
      >
        <span className="material-symbols-outlined">remove</span>
      </button>
    </div>
  )
}

function PlayerSelector({ player, onSelect }) {
  if (player) {
    return (
      <div
        className="relative w-16 h-16 rounded-full p-1 border-2 border-primary shadow-[0_0_15px_rgba(109,221,255,0.3)] bg-surface-container cursor-pointer"
        onClick={onSelect}
      >
        <img src={player.avatar} alt={player.name} className="w-full h-full object-cover rounded-full" />
      </div>
    )
  }
  return (
    <button
      onClick={onSelect}
      className="w-16 h-16 rounded-full border-2 border-dashed border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:bg-surface-bright/20 transition-colors"
    >
      <span className="material-symbols-outlined text-2xl">add</span>
    </button>
  )
}

export default function AddMatch() {
  const navigate = useNavigate()
  const [sets, setSets] = useState(3)
  const [scores, setScores] = useState([[6, 4], [3, 6], [6, 2]])
  const [teamA, setTeamA] = useState([players[0], players[2]])
  const [teamB, setTeamB] = useState([null, null])
  const [showPicker, setShowPicker] = useState(null)

  const updateScore = (setIdx, team, val) => {
    setScores((prev) => {
      const next = prev.map((s) => [...s])
      next[setIdx][team] = val
      return next
    })
  }

  const activeSets = scores.slice(0, sets)

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-[-10%] left-[-10%] w-1/2 h-1/2 bg-tertiary/20 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] -z-10" />

      <TopBar />

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-headline font-bold tracking-tight text-white">Add Match Result</h2>
          <div className="inline-flex p-1 bg-surface-container-high rounded-full w-full">
            {[2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setSets(n)}
                className={`flex-1 py-3 px-6 rounded-full font-label font-semibold transition-all ${
                  sets === n
                    ? 'bg-gradient-to-tr from-[#6DDDFF] to-[#00D2FD] text-on-primary-fixed shadow-[0_0_15px_rgba(0,212,255,0.4)]'
                    : 'text-on-surface-variant'
                }`}
              >
                {n} Sets
              </button>
            ))}
          </div>
        </div>

        {/* Team Selector */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="space-y-3">
            <span className="block text-center text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">Team A</span>
            <div className="flex justify-center gap-3">
              {teamA.map((p, i) => (
                <PlayerSelector key={i} player={p} onSelect={() => setShowPicker({ team: 'A', slot: i })} />
              ))}
            </div>
          </div>
          <div className="pt-6">
            <div className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant/30 flex items-center justify-center">
              <span className="text-[10px] font-black italic text-on-surface-variant">VS</span>
            </div>
          </div>
          <div className="space-y-3">
            <span className="block text-center text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">Team B</span>
            <div className="flex justify-center gap-3">
              {teamB.map((p, i) => (
                <PlayerSelector key={i} player={p} onSelect={() => setShowPicker({ team: 'B', slot: i })} />
              ))}
            </div>
          </div>
        </div>

        {/* Score Entry */}
        <div className="grid grid-cols-3 gap-4">
          {activeSets.map((setScore, si) => (
            <div key={si} className="space-y-4">
              <span className="block text-center text-xs font-bold text-on-surface-variant">Set {si + 1}</span>
              <div className="space-y-2">
                <ScoreInput value={setScore[0]} onChange={(v) => updateScore(si, 0, v)} />
                <ScoreInput value={setScore[1]} onChange={(v) => updateScore(si, 1, v)} />
              </div>
            </div>
          ))}
        </div>

        {/* Rating Impact */}
        <div className="glass-panel p-6 rounded-lg border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-label text-on-surface-variant">Estimated Change</span>
            <span className="material-symbols-outlined text-on-surface-variant text-lg">info</span>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-primary" />
              <span className="font-headline font-bold text-white uppercase tracking-wider text-xs">Team A</span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-xl font-headline font-black">+0.42</span>
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 rounded-full bg-error" />
              <span className="font-headline font-bold text-white uppercase tracking-wider text-xs">Team B</span>
            </div>
            <div className="flex items-center gap-1 text-error">
              <span className="material-symbols-outlined text-sm">trending_down</span>
              <span className="text-xl font-headline font-black">-0.18</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/matches')}
          className="w-full py-5 rounded-full bg-gradient-to-tr from-[#6DDDFF] to-[#00D2FD] text-on-primary-fixed font-headline font-extrabold text-lg shadow-[0_20px_40px_rgba(0,212,255,0.3)] hover:opacity-90 active:scale-[0.98] transition-all"
        >
          Save &amp; Calculate Ratings
        </button>
      </main>

      {/* Player Picker Modal */}
      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={() => setShowPicker(null)}
        >
          <div className="glass-panel rounded-t-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-headline font-bold text-lg mb-4 text-white">Seleziona Giocatore</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {players.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    if (showPicker.team === 'A') {
                      setTeamA((prev) => { const n = [...prev]; n[showPicker.slot] = p; return n })
                    } else {
                      setTeamB((prev) => { const n = [...prev]; n[showPicker.slot] = p; return n })
                    }
                    setShowPicker(null)
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-high transition-colors"
                >
                  <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="text-left">
                    <p className="font-bold text-white text-sm">{p.name}</p>
                    <p className="text-on-surface-variant text-xs">{p.rating} rating</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
