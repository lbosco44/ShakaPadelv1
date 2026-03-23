import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Leaderboard from './pages/Leaderboard'
import Calendar from './pages/Calendar'
import AddMatch from './pages/AddMatch'
import RecentMatches from './pages/RecentMatches'
import PlayerProfile from './pages/PlayerProfile'
import CreatePlayer from './pages/CreatePlayer'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Leaderboard />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/add-match" element={<AddMatch />} />
        <Route path="/matches" element={<RecentMatches />} />
        <Route path="/profile/:id" element={<PlayerProfile />} />
        <Route path="/admin/create-player" element={<CreatePlayer />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
