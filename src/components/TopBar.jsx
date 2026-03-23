import { useNavigate } from 'react-router-dom'

export default function TopBar({ title, showBack = false, showSettings = true }) {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-4 bg-[#070B28]/60 backdrop-blur-3xl shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center text-primary hover:opacity-80 transition-opacity active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        ) : (
          <div
            className="w-10 h-10 rounded-full border-2 border-primary/30 overflow-hidden bg-surface-container cursor-pointer"
            onClick={() => navigate('/profile/3')}
          >
            <img
              src="https://i.pravatar.cc/150?img=33"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        {title ? (
          <h1 className="text-primary font-headline font-bold tracking-tighter text-lg uppercase">
            {title}
          </h1>
        ) : (
          <h1 className="font-headline font-bold tracking-tighter text-white text-xl">
            Shaka 🤙 Padel Index
          </h1>
        )}
      </div>
      {showSettings && (
        <button
          onClick={() => navigate('/admin/create-player')}
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:opacity-80 transition-opacity active:scale-95 duration-200"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
      )}
    </header>
  )
}
