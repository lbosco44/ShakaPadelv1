import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  writeBatch,
  doc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { calculateRatingChanges } from './ratingService'
import { getPlayer } from './playerService'

const COL = 'matches'

export async function getRecentMatches(n = 20) {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'), limit(n))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/**
 * Save a completed match and update all player ratings atomically.
 * @param {object} matchData
 * @param {string[]} matchData.teamAIds
 * @param {string[]} matchData.teamBIds
 * @param {number[][]} matchData.sets  e.g. [[6,4],[3,6],[7,5]]
 * @param {string} matchData.court
 * @param {string|null} matchData.mvpId
 */
export async function saveMatch({ teamAIds, teamBIds, sets, court, mvpId = null }) {
  // Fetch current ratings
  const [playersA, playersB] = await Promise.all([
    Promise.all(teamAIds.map(getPlayer)),
    Promise.all(teamBIds.map(getPlayer)),
  ])

  const ratingsA = playersA.map((p) => p.rating)
  const ratingsB = playersB.map((p) => p.rating)

  const { teamA: deltaA, teamB: deltaB } = calculateRatingChanges(ratingsA, ratingsB, sets)

  const setsWonA = sets.filter(([a, b]) => a > b).length
  const setsWonB = sets.filter(([a, b]) => b > a).length
  const teamAWon = setsWonA > setsWonB

  const batch = writeBatch(db)

  // Update each player's rating
  teamAIds.forEach((id, i) => {
    const p = playersA[i]
    const newRating = parseFloat(Math.max(1, Math.min(10, p.rating + deltaA[i])).toFixed(2))
    const newWins = teamAWon ? p.wins + 1 : p.wins
    const newLosses = teamAWon ? p.losses : p.losses + 1
    const newMatches = p.matches + 1
    const newTrend = [...(p.trend || []).slice(-4), newRating]
    batch.update(doc(db, 'players', id), {
      rating: newRating,
      wins: newWins,
      losses: newLosses,
      matches: newMatches,
      winRate: Math.round((newWins / newMatches) * 100),
      trend: newTrend,
    })
  })

  teamBIds.forEach((id, i) => {
    const p = playersB[i]
    const newRating = parseFloat(Math.max(1, Math.min(10, p.rating + deltaB[i])).toFixed(2))
    const newWins = !teamAWon ? p.wins + 1 : p.wins
    const newLosses = !teamAWon ? p.losses : p.losses + 1
    const newMatches = p.matches + 1
    const newTrend = [...(p.trend || []).slice(-4), newRating]
    batch.update(doc(db, 'players', id), {
      rating: newRating,
      wins: newWins,
      losses: newLosses,
      matches: newMatches,
      winRate: Math.round((newWins / newMatches) * 100),
      trend: newTrend,
    })
  })

  await batch.commit()

  // Save match document
  await addDoc(collection(db, COL), {
    court,
    mvpId,
    teamA: {
      playerIds: teamAIds,
      playerNames: playersA.map((p) => p.name),
      playerAvatars: playersA.map((p) => p.avatar),
      sets: sets.map(([a]) => a),
      ratingChange: deltaA,
      won: teamAWon,
    },
    teamB: {
      playerIds: teamBIds,
      playerNames: playersB.map((p) => p.name),
      playerAvatars: playersB.map((p) => p.avatar),
      sets: sets.map(([, b]) => b),
      ratingChange: deltaB,
      won: !teamAWon,
    },
    createdAt: serverTimestamp(),
  })
}
