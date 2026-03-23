import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { usePlayers } from '../hooks/useFirestore'
import { saveMatch } from '../services/matchService'
import { calculateRatingChanges } from '../services/ratingService'

function ScoreInput({ value, onChange }) {
  return (
    <div className="glass-panel p-2 rounded-lg flex flex-col items-center gap-1 border border-white/5">
      <button onClick={() => onChange(Math.min(7, value + 1))} className="text-primary hover:bg-primary/10 rounded-full w-8 h-8 flex items-center justify-center">
        <span className="material-symbols-outlined">add</span>
      </button>
      <span className="text-3xl font-headline font-extrabold text-white">{value}</span>
      <button onClick={() => onChange(Math.max(0, value - 1))} className="text-on-surface-variant hover:bg-surface-bright/20 rounded-full w-8 h-8 flex items-center justify-center">
        <span className="material-symbols-outlined">remove</span>
      </button>
    </div>
  )
}

function PlayerSlot({ player, onSelect }) {
  if (player) {
    return (
      <div onClick={onSelect} className="relative w-16 h-16 rounded-full p-1 border-2 border-primary shadow-[0_0_15px_rgba(109,221,255,0.3)] bg-surface-container cursor-pointer">
        <img src={player.avatar} alt={player.name} className="w-full h-full object-cover rounded-full" />
        <div className="absolute -bottom-5 left-0 right-0 text-center">
          <span className="text-[9px] text-on-surface-variant font-bold truncate block">{player.name.split(' ')[0]}</span>
        </div>
      </div>
    )
  }
  return (
    <button onClick={onSelect} className="w-16 h-16 rounded-full border-2 border-dashed border-outline-variant/40 flex items-center justify-center text-on-surface-variant hover:bg-surface-bright/20 transition-colors">
      <span className="material-symbols-outlined text-2xl">add</span>
    </button>
  )
}

export default function AddMatch() {
  const navigate = useNavigate()
  const { players, loading } = usePlayers()
  const [numSets, setNumSets] = useState(3)
  const [scores, setScores] = useState([[6, 4], [3, 6], [6, 2]])
  const [teamA, setTeamA] = useState([null, null])
  const [teamB, setTeamB] = useState([null, null])
  const [court, setCourt] = useState('')
  const [showPicker, setShowPicker] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const updateScore = (si, team, val) =>
    setScores((prev) => { const n = prev.map((s) => [...s]); n[si][team] = val; return n })

  const activeSets = scores.slice(0, numSets)

  // Live rating preview
  const ratingPreview = (() => {
    const pA = teamA.filter(Boolean)
    const pB = teamB.filter(Boolean)
    if (pA.length < 2 || pB.length < 2) return null
    const { teamA: dA, teamB: dB } = calculateRatingChanges(
      pA.map((p) => p.rating),
      pB.map((p) => p.rating),
      activeSets
    )
    return { deltaA: dA[0], deltaB: dB[0] }
  })()

  const canSubmit = teamA.every(Boolean) && teamB.every(Boolean)

  async function handleSave() {
    if (!canSubmit) return
    setSaving(true)
    setError(null)
    try {
      await saveMatch({
        teamAIds: teamA.map((p) => p.id),
        teamBIds: teamB.map((p) => p.id),
        sets: activeSets,
        court: court || 'Campo sconosciuto',
      })
      navigate('/matches')
    } catch (e) {
      setError('Errore nel salvataggio. Riprova.')
      setSaving(false)
    }
  }

  // Prevent selecting same player twice
  const selectedIds = [...teamA, ...teamB].filter(Boolean).map((p) => p.id)
  const availablePlayers = players.filter(
    (p) => !selectedIds.includes(p.id) || (showPicker && { A: teamA, B: teamB }[showPicker.team][showPicker.slot]?.id === p.id)
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-[-10%] left-[-10%] w-1/2 h-1/2 bg-tertiary/20 rounded-full blur-[120px] -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px] -z-10" />
      <TopBar />

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto space-y-8">
        <div className="space-y-6">
          <h2 className="text-3xl font-headline font-bold tracking-tight text-white">Add Match Result</h2>

          {/* Sets toggle */}
          <div className="inline-flex p-1 bg-surface-container-high rounded-full w-full">
            {[2, 3].map((n) => (
              <button key={n} onClick={() => setNumSets(n)} className={`flex-1 py-3 px-6 rounded-full font-label font-semibold transition-all ${numSets === n ? 'bg-gradient-to-tr from-[#6DDDFF] to-[#00D2FD] text-on-primary-fixed shadow-[0_0_15px_rgba(0,212,255,0.4)]' : 'text-on-surface-variant'}`}>
                {n} Sets
              </button>
            ))}
          </div>

          {/* Court input */}
          <input
            type="text"
            placeholder="Es. Campo 2 – Club Padel Master"
            value={court}
            onChange={(e) => setCourt(e.target.value)}
            className="w-full bg-surface-container-high border-0 rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
          />
        </div>

        {/* Team Selector */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          <div className="space-y-3">
            <span className="block text-center text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">Team A</span>
            <div className="flex justify-center gap-4 pb-6">
              {teamA.map((p, i) => <PlayerSlot key={i} player={p} onSelect={() => setShowPicker({ team: 'A', slot: i })} />)}
            </div>
          </div>
          <div className="pt-6">
            <div className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant/30 flex items-center justify-center">
              <span className="text-[10px] font-black italic text-on-surface-variant">VS</span>
            </div>
          </div>
          <div className="space-y-3">
            <span className="block text-center text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase">Team B</span>
            <div className="flex justify-center gap-4 pb-6">
              {teamB.map((p, i) => <PlayerSlot key={i} player={p} onSelect={() => setShowPicker({ team: 'B', slot: i })} />)}
            </div>
          </div>
        </div>

        {/* Scores */}
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

        {/* Rating preview */}
        <div className="glass-panel p-6 rounded-lg border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-label text-on-surface-variant">Estimated Rating Change</span>
            <span className="material-symbols-outlined text-on-surface-variant text-lg">info</span>
          </div>
          {ratingPreview ? (
            <>
              <div className="flex items-center justify-between py-2 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full bg-primary" />
                  <span className="font-headline font-bold text-white uppercase tracking-wider text-xs">Team A</span>
                </div>
                <div className={`flex items-center gap-1 ${ratingPreview.deltaA >= 0 ? 'text-primary' : 'text-error'}`}>
                  <span className="material-symbols-outlined text-sm">{ratingPreview.deltaA >= 0 ? 'trending_up' : 'trending_down'}</span>
                  <span className="text-xl font-headline font-black">{ratingPreview.deltaA >= 0 ? '+' : ''}{ratingPreview.deltaA}</span>
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 rounded-full bg-error" />
                  <span className="font-headline font-bold text-white uppercase tracking-wider text-xs">Team B</span>
                </div>
                <div className={`flex items-center gap-1 ${ratingPreview.deltaB >= 0 ? 'text-primary' : 'text-error'}`}>
                  <span className="material-symbols-outlined text-sm">{ratingPreview.deltaB >= 0 ? 'trending_up' : 'trending_down'}</span>
                  <span className="text-xl font-headline font-black">{ratingPreview.deltaB >= 0 ? '+' : ''}{ratingPreview.deltaB}</span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-on-surface-variant text-sm text-center py-2">Seleziona tutti i giocatori per vedere la preview</p>
          )}
        </div>

        {error && <p className="text-error text-sm text-center">{error}</p>}

        <button
          onClick={handleSave}
          disabled={!canSubmit || saving}
          className="w-full py-5 rounded-full bg-gradient-to-tr from-[#6DDDFF] to-[#00D2FD] text-on-primary-fixed font-headline font-extrabold text-lg shadow-[0_20px_40px_rgba(0,212,255,0.3)] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? 'Salvataggio...' : 'Save & Calculate Ratings'}
        </button>
      </main>

      {/* Player Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowPicker(null)}>
          <div className="glass-panel rounded-t-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-headline font-bold text-lg mb-4 text-white">
              Seleziona — {showPicker.team === 'A' ? 'Team A' : 'Team B'}
            </h3>
            {loading ? (
              <p className="text-on-surface-variant text-sm text-center py-4">Caricamento giocatori...</p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {availablePlayers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      const setter = showPicker.team === 'A' ? setTeamA : setTeamB
                      setter((prev) => { const n = [...prev]; n[showPicker.slot] = p; return n })
                      setShowPicker(null)
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-high transition-colors"
                  >
                    <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="text-left flex-1">
                      <p className="font-bold text-white text-sm">{p.name}</p>
                      <p className="text-on-surface-variant text-xs">{p.rating?.toFixed(1)} rating · {p.wins ?? 0}V {p.losses ?? 0}S</p>
                    </div>
                    <span className="text-primary font-headline font-black text-lg">{p.rating?.toFixed(1)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
