import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'

const COL = 'players'

export async function getPlayers() {
  const q = query(collection(db, COL), orderBy('rating', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getPlayer(id) {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function createPlayer(data) {
  return addDoc(collection(db, COL), {
    ...data,
    rating: data.rating ?? 5.0,
    wins: 0,
    losses: 0,
    matches: 0,
    winRate: 0,
    trend: [5, 5, 5, 5, 5],
    createdAt: serverTimestamp(),
  })
}

export async function updatePlayerRating(id, delta, won) {
  const snap = await getDoc(doc(db, COL, id))
  if (!snap.exists()) return
  const p = snap.data()
  const newWins = won ? p.wins + 1 : p.wins
  const newLosses = won ? p.losses : p.losses + 1
  const newMatches = p.matches + 1
  const newRating = parseFloat(Math.max(1, Math.min(10, p.rating + delta)).toFixed(2))
  const newTrend = [...(p.trend || []).slice(-4), newRating]
  await updateDoc(doc(db, COL, id), {
    rating: newRating,
    wins: newWins,
    losses: newLosses,
    matches: newMatches,
    winRate: Math.round((newWins / newMatches) * 100),
    trend: newTrend,
  })
}
