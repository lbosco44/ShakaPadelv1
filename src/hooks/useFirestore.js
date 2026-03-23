import { useState, useEffect } from 'react'
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  doc,
} from 'firebase/firestore'
import { db } from '../firebase'

/** Real-time players list ordered by rating */
export function usePlayers() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const q = query(collection(db, 'players'), orderBy('rating', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPlayers(snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() })))
        setLoading(false)
      },
      (err) => { setError(err); setLoading(false) }
    )
    return unsub
  }, [])

  return { players, loading, error }
}

/** Real-time single player */
export function usePlayer(id) {
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const unsub = onSnapshot(doc(db, 'players', id), (snap) => {
      setPlayer(snap.exists() ? { id: snap.id, ...snap.data() } : null)
      setLoading(false)
    })
    return unsub
  }, [id])

  return { player, loading }
}

/** Real-time recent matches */
export function useRecentMatches(n = 20) {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'matches'), orderBy('createdAt', 'desc'), limit(n))
    const unsub = onSnapshot(q, (snap) => {
      setMatches(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [n])

  return { matches, loading }
}

/** Real-time matches for a specific player */
export function usePlayerMatches(playerId) {
  const { matches, loading } = useRecentMatches(50)
  const playerMatches = matches.filter(
    (m) =>
      m.teamA?.playerIds?.includes(playerId) ||
      m.teamB?.playerIds?.includes(playerId)
  )
  return { matches: playerMatches, loading }
}
