import { Link } from "react-router-dom"

function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-800 shadow">
      <div className="text-2xl font-bold text-blue-600">CSTECH</div>
      <Link to={'/login'} className="bg-blue-500 cursor-pointer text-sm font-semibold text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
        Login
      </Link>
    </header>
  )
}

export default Header