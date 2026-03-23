/**
 * Run this ONCE to populate Firestore with initial data.
 * Usage: paste in browser console while the app is running,
 * or use the "Seed Database" button in the app (dev only).
 *
 * Alternatively, call seedDatabase() from CreatePlayer page.
 */

import { collection, addDoc, getDocs, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const INITIAL_PLAYERS = [
  { name: 'Marco Rossi',   rating: 8.9, wins: 24, losses: 2,  matches: 26, winRate: 92, avatar: 'https://i.pravatar.cc/150?img=12', badge: 'ELITE',        bio: 'Dominating the backcourt with surgical precision.', bestPartner: 'Luca B.', trend: [7, 8, 8.5, 8.7, 8.9], isCurrentUser: false },
  { name: 'Elena Bianchi', rating: 8.2, wins: 19, losses: 4,  matches: 23, winRate: 83, avatar: 'https://i.pravatar.cc/150?img=5',  badge: 'ELITE',        bio: 'Quick reflexes and unstoppable at the net.',         bestPartner: 'Marco R.', trend: [7.5, 7.8, 8.0, 8.1, 8.2], isCurrentUser: false },
  { name: 'Tu',            rating: 7.4, wins: 11, losses: 7,  matches: 18, winRate: 61, avatar: 'https://i.pravatar.cc/150?img=33', badge: 'ADVANCED',     bio: 'Rising fast through the ranks.',                    bestPartner: 'Elena B.', trend: [6.5, 6.8, 7.0, 7.2, 7.4], isCurrentUser: true  },
  { name: 'Luca Martini',  rating: 7.1, wins: 15, losses: 8,  matches: 23, winRate: 65, avatar: 'https://i.pravatar.cc/150?img=15', badge: 'ADVANCED',     bio: 'Consistent player with a powerful serve.',          bestPartner: 'Sofia M.', trend: [6.8, 6.9, 7.0, 7.0, 7.1], isCurrentUser: false },
  { name: 'Sofia Moretti', rating: 6.8, wins: 10, losses: 6,  matches: 16, winRate: 63, avatar: 'https://i.pravatar.cc/150?img=9',  badge: 'INTERMEDIATE', bio: 'Creative player with excellent court vision.',      bestPartner: 'Luca M.', trend: [6.2, 6.4, 6.5, 6.6, 6.8], isCurrentUser: false },
  { name: 'Andrea Greco',  rating: 6.3, wins: 8,  losses: 9,  matches: 17, winRate: 47, avatar: 'https://i.pravatar.cc/150?img=18', badge: 'INTERMEDIATE', bio: 'Learning fast and improving every match.',           bestPartner: 'Filippo S.', trend: [5.8, 6.0, 6.1, 6.2, 6.3], isCurrentUser: false },
]

export async function seedDatabase() {
  console.log('Seeding Firestore...')

  // Clear existing
  const existing = await getDocs(collection(db, 'players'))
  await Promise.all(existing.docs.map((d) => deleteDoc(d.ref)))

  // Add players
  const refs = await Promise.all(
    INITIAL_PLAYERS.map((p) => addDoc(collection(db, 'players'), { ...p, createdAt: serverTimestamp() }))
  )

  console.log(`Created ${refs.length} players.`)
  console.log('Seed complete!')
  return refs
}
