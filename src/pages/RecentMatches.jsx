import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { useRecentMatches } from '../hooks/useFirestore'

function timeAgo(ts) {
  if (!ts) return ''
  const date = ts.toDate ? ts.toDate() : new Date(ts)
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 3600) return `${Math.floor(diff / 60)}m fa`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h fa`
  if (diff < 172800) return 'Ieri'
  return date.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })
}

function ScoreBox({ value, highlight }) {
  return (
    <div className={`w-7 h-9 flex items-center justify-center rounded-sm text-xs font-black ${
      highlight
        ? 'bg-primary shadow-[0_0_8px_rgba(109,221,255,0.5)] text-on-primary'
        : 'bg-surface-container-highest border border-outline-variant/30 text-on-surface-variant'
    }`}>
      {value}
    </div>
  )
}

function MatchCard({ match }) {
  const { teamA, teamB, court, mvpId, createdAt } = match
  if (!teamA || !teamB) return null

  return (
    <article className="glass-panel rounded-lg p-5 flex flex-col gap-4 relative overflow-hidden">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
            {timeAgo(createdAt)}
          </span>
          <span className="text-xs text-on-surface-variant font-medium">{court}</span>
        </div>
        {mvpId && (
          <div className="bg-yellow-400/10 border border-yellow-400/20 px-3 py-1 rounded-full flex items-center gap-1.5">
            <span className="material-symbols-outlined text-yellow-400" style={{ fontSize: '14px', fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
            <span className="text-[10px] font-bold text-yellow-400 tracking-wide">MVP</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-2">
        {/* Team A */}
        <div className={`p-3 rounded-md flex flex-col gap-2 ${teamA.won ? 'bg-primary/10 border border-primary/20' : 'bg-surface-container border border-outline-variant/20'}`}>
          {(teamA.playerNames || []).map((name, i) => (
            <div key={i} className="flex items-center gap-2">
              {teamA.playerAvatars?.[i] && (
                <img src={teamA.playerAvatars[i]} alt={name} className="w-6 h-6 rounded-sm object-cover" />
              )}
              <span className="text-xs font-bold text-white">{name}</span>
            </div>
          ))}
        </div>

        {/* Scores */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] font-black text-outline tracking-tighter">VS</span>
          <div className="flex gap-1">
            {(teamA.sets || []).map((s, i) => <ScoreBox key={i} value={s} highlight={teamA.won} />)}
          </div>
          <div className="flex gap-1">
            {(teamB.sets || []).map((s, i) => <ScoreBox key={i} value={s} highlight={teamB.won} />)}
          </div>
        </div>

        {/* Team B */}
        <div className={`p-3 rounded-md flex flex-col gap-2 text-right ${teamB.won ? 'bg-primary/10 border border-primary/20' : 'bg-surface-container border border-outline-variant/20'}`}>
          {(teamB.playerNames || []).map((name, i) => (
            <div key={i} className="flex items-center justify-end gap-2">
              <span className="text-xs font-medium text-on-surface-variant">{name}</span>
              {teamB.playerAvatars?.[i] && (
                <img src={teamB.playerAvatars[i]} alt={name} className={`w-6 h-6 rounded-sm object-cover ${teamB.won ? '' : 'grayscale opacity-60'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rating Changes */}
      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-white/5">
        {[...(teamA.ratingChange || []), ...(teamB.ratingChange || [])].slice(0, 4).map((change, i) => (
          <div key={i} className="flex flex-col items-center">
            <span className={`text-[9px] font-bold ${change > 0 ? 'text-primary' : 'text-error'}`}>
              {change > 0 ? '+' : ''}{change}
            </span>
          </div>
        ))}
      </div>
    </article>
  )
}

export default function RecentMatches() {
  const { matches, loading } = useRecentMatches()

  return (
    <div className="min-h-screen bg-surface">
      <TopBar />
      <main className="pt-24 pb-32 px-4 max-w-2xl mx-auto space-y-8">
        <section className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight font-headline text-on-surface">Match Recenti</h2>
          <p className="text-on-surface-variant text-sm font-medium">Cronologia delle tue sfide in campo</p>
        </section>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-panel rounded-lg p-5 animate-pulse h-40" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <div className="glass-panel rounded-lg p-8 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl mb-3 block">sports_tennis</span>
            Nessuna partita ancora. Aggiungine una!
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map((match) => <MatchCard key={match.id} match={match} />)}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
