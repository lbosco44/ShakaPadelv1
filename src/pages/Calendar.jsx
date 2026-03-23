import { useState } from 'react'
import TopBar from '../components/TopBar'
import BottomNav from '../components/BottomNav'
import { calendarMatches } from '../data/mockData'

const weekDays = [
  { day: 'Mon', num: 11 },
  { day: 'Tue', num: 12 },
  { day: 'Wed', num: 13 },
  { day: 'Thu', num: 14 },
  { day: 'Fri', num: 15 },
  { day: 'Sat', num: 16 },
  { day: 'Sun', num: 17 },
]

export default function Calendar() {
  const [activeDay, setActiveDay] = useState(14)

  return (
    <div className="min-h-screen" style={{ background: 'radial-gradient(circle at 0% 0%, #10163a 0%, transparent 50%), radial-gradient(circle at 100% 100%, #1b224c 0%, transparent 50%), #070b28' }}>
      <TopBar />

      <main className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
        {/* Week Selector */}
        <section className="mb-10">
          <div className="flex flex-col gap-4">
            <h2 className="font-headline font-bold text-xl tracking-tight px-1 text-on-surface">Calendar</h2>
            <div className="glass-panel rounded-full p-2 flex justify-between items-center">
              {weekDays.map(({ day, num }) => (
                <button
                  key={num}
                  onClick={() => setActiveDay(num)}
                  className={`flex flex-col items-center justify-center w-12 h-14 transition-all rounded-full ${
                    activeDay === num
                      ? 'bg-gradient-to-tr from-cyan-400 to-cyan-600 text-white shadow-[0_0_15px_rgba(0,212,255,0.5)]'
                      : 'text-slate-400'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest mb-1">{day}</span>
                  <span className="text-sm font-headline font-extrabold">{num}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Match Cards */}
        <div className="space-y-6">
          {calendarMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  )
}

function MatchCard({ match }) {
  const isPlayed = match.status === 'played'
  const isLeague = match.tag === 'League'

  return (
    <div className={`glass-panel rounded-lg p-6 relative overflow-hidden ${isLeague ? 'border-l-4 border-primary' : ''} ${isPlayed ? 'opacity-80' : ''}`}>
      {/* Tag */}
      <div className="absolute top-0 right-0 p-4">
        {isPlayed ? (
          <button className="bg-gradient-to-tr from-cyan-400 to-cyan-600 text-on-primary-fixed text-[11px] font-black uppercase tracking-widest px-5 py-2 rounded-full shadow-[0_4px_12px_rgba(0,212,255,0.3)] active:scale-95 transition-transform">
            Risultati
          </button>
        ) : (
          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${isLeague ? 'bg-surface-bright/40 text-on-surface border-white/10' : 'bg-primary/20 text-primary border-primary/30'}`}>
            {match.tag}
          </span>
        )}
      </div>

      {/* Date/Time/Court */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`p-3 rounded-md flex flex-col items-center ${isPlayed ? 'bg-surface-container-low opacity-60' : 'bg-surface-container-high'}`}>
          <span className="text-[10px] font-bold text-on-surface-variant uppercase">{match.month}</span>
          <span className={`text-xl font-headline font-black ${isPlayed ? 'text-slate-400' : 'text-primary'}`}>{match.day}</span>
        </div>
        <div>
          <h3 className={`text-lg font-bold font-headline leading-tight ${isPlayed ? 'text-slate-300' : ''}`}>{match.time}</h3>
          <p className="text-on-surface-variant text-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">location_on</span>
            {match.court}
          </p>
        </div>
      </div>

      {/* Teams */}
      <div className="grid grid-cols-7 items-center gap-2">
        <TeamSide team={match.teamA} isPlayed={isPlayed} />
        <div className="col-span-1 flex flex-col items-center">
          {isPlayed && match.score ? (
            <>
              <div className="text-xl font-black font-headline text-white">{match.score}</div>
              <span className="text-[8px] font-bold uppercase text-outline">Final</span>
            </>
          ) : (
            <span className="text-xs font-black text-outline tracking-widest">VS</span>
          )}
        </div>
        <TeamSide team={match.teamB} isPlayed={isPlayed} />
      </div>
    </div>
  )
}

function TeamSide({ team, isPlayed }) {
  if (!team.players.length) {
    return (
      <div className="col-span-3 flex flex-col items-center gap-3">
        <div className="w-12 h-12 bg-surface-container-highest rounded-sm flex items-center justify-center border-2 border-dashed border-outline-variant">
          <span className="material-symbols-outlined text-outline">person_add</span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-tighter text-primary">TBD</span>
      </div>
    )
  }
  return (
    <div className="col-span-3 flex flex-col items-center gap-3">
      <div className="flex -space-x-3">
        {team.players.map((p, i) => (
          <div key={i} className="relative">
            <img
              src={p.avatar}
              alt=""
              className={`w-12 h-12 rounded-sm border-2 border-surface object-cover ${isPlayed ? 'grayscale' : ''}`}
            />
            {p.rating && (
              <div className="absolute -bottom-1 -right-1 bg-surface-container-highest text-[8px] font-bold px-1 rounded border border-outline-variant">
                {p.rating}
              </div>
            )}
          </div>
        ))}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-tighter text-on-surface-variant">{team.name}</span>
    </div>
  )
}
