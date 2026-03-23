import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { pendingApprovals } from '../data/mockData'

export default function CreatePlayer() {
  const navigate = useNavigate()
  const [role, setRole] = useState('Giocatore')
  const [rating, setRating] = useState(5.0)
  const [approvals, setApprovals] = useState(pendingApprovals)

  const handleApprove = (id) => setApprovals((prev) => prev.filter((p) => p.id !== id))
  const handleReject = (id) => setApprovals((prev) => prev.filter((p) => p.id !== id))

  return (
    <div className="min-h-screen text-on-surface" style={{ background: 'radial-gradient(circle at 0% 0%, #0a0f2c 0%, #2d1b69 100%)' }}>
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#070B28]/80 backdrop-blur-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between px-6 h-20 w-full">
          <button onClick={() => navigate(-1)} className="hover:opacity-80 transition-opacity active:scale-95">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="text-primary font-headline font-bold tracking-[-0.04em] uppercase text-lg">CREA GIOCATORE</h1>
          <div className="w-6" />
        </div>
        <div className="bg-gradient-to-b from-outline-variant/20 to-transparent h-px w-full" />
      </header>

      <main className="pt-28 pb-32 px-6">
        {/* Avatar Section */}
        <section className="flex flex-col items-center mb-10">
          <div className="relative group cursor-pointer">
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center bg-surface-container-low transition-all group-hover:border-primary/50">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant group-hover:text-primary transition-colors">camera_enhance</span>
            </div>
            <div className="absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-lg">
              <span className="material-symbols-outlined text-sm text-on-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
            </div>
          </div>
          <p className="mt-4 text-on-surface-variant font-medium text-sm">Aggiungi foto profilo</p>
        </section>

        {/* Form */}
        <div className="glass-panel rounded-lg border border-white/10 p-6 shadow-2xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">Nome</label>
              <input
                type="text"
                placeholder="Es. Marco"
                className="w-full bg-surface-container-highest/30 border-0 rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">Cognome</label>
              <input
                type="text"
                placeholder="Es. Rossi"
                className="w-full bg-surface-container-highest/30 border-0 rounded-lg p-4 text-on-surface placeholder:text-on-surface-variant/40 focus:ring-2 focus:ring-primary/50 transition-all outline-none"
              />
            </div>
          </div>

          {/* Rating Slider */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">Rating iniziale</label>
              <div className="bg-primary-fixed text-on-primary-fixed px-3 py-1 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(0,210,253,0.4)]">
                {rating.toFixed(1)}
              </div>
            </div>
            <div className="relative w-full h-8 flex items-center">
              <input
                type="range"
                min="1"
                max="10"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-surface-container-highest rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>
            <div className="flex justify-between text-[10px] text-on-surface-variant font-bold uppercase tracking-widest px-1">
              <span>1.0 Beginner</span>
              <span>10.0 Pro</span>
            </div>
          </div>

          {/* Role Toggle */}
          <div className="space-y-4">
            <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider px-1">Ruolo</label>
            <div className="flex p-1.5 bg-surface-container-lowest/40 rounded-full w-fit">
              {['Giocatore', 'Admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    role === r
                      ? 'bg-primary text-on-primary-fixed shadow-lg'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full py-5 rounded-lg bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed font-headline font-extrabold text-lg tracking-tight shadow-[0_20px_40px_rgba(0,210,253,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all">
            Crea Giocatore
          </button>
        </div>

        {/* Pending Approvals */}
        {approvals.length > 0 && (
          <section className="mt-12 space-y-6">
            <h2 className="font-headline font-bold text-xl px-2">In attesa di approvazione</h2>
            <div className="grid grid-cols-1 gap-4">
              {approvals.map((user) => (
                <div key={user.id} className="glass-panel p-5 rounded-lg border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={user.avatar} alt={user.name} className="w-14 h-14 rounded-lg object-cover ring-2 ring-primary/20" />
                    <div>
                      <h3 className="font-headline font-bold text-on-surface">{user.name}</h3>
                      <p className="text-xs text-on-surface-variant font-medium">Vuole unirsi</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(user.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-error/40 text-error hover:bg-error/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">close</span>
                    </button>
                    <button
                      onClick={() => handleApprove(user.id)}
                      className="w-10 h-10 flex items-center justify-center rounded-full border border-primary/40 text-primary hover:bg-primary/10 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">check</span>
                    </button>
                  </div>
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
