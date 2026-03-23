import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { createPlayer } from '../services/playerService'
import { usePlayers } from '../hooks/useFirestore'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

const BADGES = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'PRO', 'ELITE']

export default function CreatePlayer() {
  const navigate = useNavigate()
  const { players } = usePlayers()
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')
  const [rating, setRating] = useState(5.0)
  const [role, setRole] = useState('Giocatore')
  const [badge, setBadge] = useState('INTERMEDIATE')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  // Auto-assign badge based on rating
  const autoBadge = (r) => {
    if (r <= 3) return 'BEGINNER'
    if (r <= 5) return 'INTERMEDIATE'
    if (r <= 7) return 'ADVANCED'
    if (r <= 8.5) return 'PRO'
    return 'ELITE'
  }

  const handleRatingChange = (val) => {
    setRating(val)
    setBadge(autoBadge(val))
  }

  async function handleCreate() {
    if (!nome.trim() || !cognome.trim()) { setError('Inserisci nome e cognome'); return }
    setSaving(true)
    setError(null)
    try {
      await createPlayer({
        name: `${nome.trim()} ${cognome.trim()}`,
        avatar: `https://i.pravatar.cc/150?u=${nome}${cognome}${Date.now()}`,
        rating,
        badge,
        role,
        bio: '',
        bestPartner: '',
        isCurrentUser: false,
      })
      setSuccess(true)
      setNome('')
      setCognome('')
      setRating(5.0)
      setTimeout(() => setSuccess(false), 3000)
    } catch (e) {
      setError('Errore nella creazione. Riprova.')
    }
    setSaving(false)
  }

  async function markAsCurrentUser(playerId) {
    // Remove isCurrentUser from all, then set on selected
    const batch = players.map((p) =>
      updateDoc(doc(db, 'players', p.id), { isCurrentUser: p.id === playerId })
    )
    await Promise.all(batch)
  }

  return (
    <div className="min-h-screen text-on-surface" style={{ background: 'radial-gradient(circle at 0% 0%, #0a0f2c 0%, #2d1b69 100%)' }}>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#070B28]/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between px-6 h-20">
          <button onClick={() => navigate(-1)} className="hover:opacity-80 transition-opacity active:scale-95">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="text-primary font-headline font-bold tracking-[-0.04em] uppercase text-lg">CREA GIOCATORE</h1>
          <div className="w-6" />
        </div>
        <div className="bg-gradient-to-b from-outline-variant/20 to-transparent h-px w-full" />
      </header>

      <main className="pt-28 pb-32 px-6 max-w-lg mx-auto">
        {/* Avatar */}
        <section className="flex flex-col items-center mb-10">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center bg-surface-container-low group-hover:border-primary/50 transition-all">
              {nome || cognome ? (
                <span className="text-4xl font-headline font-black text-primary">
                  {(nome[0] || '') + (cognome[0] || '')}
                </span>
              ) : (
                <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors">camera_enhance</span>
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-lg">
              <span className="material-symbols-outlined text-sm text-on-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            </div>
          </div>
          <p className="mt-4 text-on-surface-variant font-medium text-sm">Foto profilo auto-generata</p>
        </section>

        {/* Form */}
        <div className="glass-panel rounded-lg border border-white/10 p-6 shadow-2xl space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">Nome</label>
              <input type="text" placeholder="Es. Marco" value={nome} onChange={(e) => setNome(e.target.value)}
                className="w-full bg-surface-container-highest/30 border-0 rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">Cognome</label>
              <input type="text" placeholder="Es. Rossi" value={cognome} onChange={(e) => setCognome(e.target.value)}
                className="w-full bg-surface-container-highest/30 border-0 rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/50 outline-none" />
            </div>
          </div>

          {/* Rating Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">Rating iniziale</label>
              <div className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(0,210,253,0.4)]">
                {rating.toFixed(1)}
              </div>
            </div>
            <input type="range" min="1" max="10" step="0.1" value={rating}
              onChange={(e) => handleRatingChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary" />
            <div className="flex justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-widest px-1">
              <span>1.0 Beginner</span>
              <span>10.0 Pro</span>
            </div>
          </div>

          {/* Badge Preview */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Badge:</span>
            <span className="bg-primary/20 text-primary text-xs font-black px-3 py-1 rounded-full tracking-widest">{badge}</span>
          </div>

          {/* Role */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">Ruolo</label>
            <div className="flex p-1.5 bg-surface-container-lowest/40 rounded-full w-fit">
              {['Giocatore', 'Admin'].map((r) => (
                <button key={r} onClick={() => setRole(r)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${role === r ? 'bg-primary text-on-primary-fixed shadow-lg' : 'text-on-surface-variant hover:text-on-surface'}`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-error text-sm">{error}</p>}
          {success && <p className="text-primary text-sm">Giocatore creato con successo!</p>}

          <button onClick={handleCreate} disabled={saving}
            className="w-full py-5 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-headline font-extrabold text-lg shadow-[0_20px_40px_rgba(0,210,253,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
            {saving ? 'Creazione...' : 'Crea Giocatore'}
          </button>
        </div>

        {/* Players list with "set as me" */}
        {players.length > 0 && (
          <section className="mt-12 space-y-4">
            <h2 className="font-headline font-bold text-xl px-2">Giocatori registrati</h2>
            <div className="space-y-3">
              {players.map((p) => (
                <div key={p.id} className="glass-panel p-4 rounded-lg border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div>
                      <h3 className="font-bold text-on-surface text-sm">{p.name}</h3>
                      <p className="text-xs text-on-surface-variant">{p.rating?.toFixed(1)} · {p.badge}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => markAsCurrentUser(p.id)}
                    className={`text-xs font-bold px-3 py-1 rounded-full border transition-all ${p.isCurrentUser ? 'bg-primary text-on-primary-fixed border-primary' : 'border-primary/40 text-primary hover:bg-primary/10'}`}
                  >
                    {p.isCurrentUser ? 'Sei tu' : 'Sono io'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
