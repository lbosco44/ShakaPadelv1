/**
 * Elo-based rating system adapted for padel doubles.
 * K factor scales with rating gap and number of sets played.
 */

const K_BASE = 32

function expectedScore(ratingA, ratingB) {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 4))
}

function teamRating(players) {
  return players.reduce((sum, r) => sum + r, 0) / players.length
}

/**
 * Calculate rating changes after a match.
 * @param {number[]} teamARatings - ratings of team A players
 * @param {number[]} teamBRatings - ratings of team B players
 * @param {number[][]} sets - e.g. [[6,4],[3,6],[7,5]] (teamA score, teamB score)
 * @returns {{ teamA: number[], teamB: number[] }} delta per player
 */
export function calculateRatingChanges(teamARatings, teamBRatings, sets) {
  const avgA = teamRating(teamARatings)
  const avgB = teamRating(teamBRatings)

  const setsWonA = sets.filter(([a, b]) => a > b).length
  const setsWonB = sets.filter(([a, b]) => b > a).length
  const teamAWon = setsWonA > setsWonB

  const scoreA = teamAWon ? 1 : 0
  const scoreB = teamAWon ? 0 : 1

  const expectedA = expectedScore(avgA, avgB)
  const expectedB = expectedScore(avgB, avgA)

  // Scale K by how dominant the win was (set difference)
  const dominance = Math.abs(setsWonA - setsWonB) / sets.length
  const kFactor = K_BASE * (0.8 + 0.4 * dominance)

  const deltaA = parseFloat(((kFactor * (scoreA - expectedA)) / 10).toFixed(2))
  const deltaB = parseFloat(((kFactor * (scoreB - expectedB)) / 10).toFixed(2))

  return {
    teamA: teamARatings.map(() => deltaA),
    teamB: teamBRatings.map(() => deltaB),
  }
}

export function newRating(current, delta) {
  return parseFloat(Math.max(1, Math.min(10, current + delta)).toFixed(2))
}
