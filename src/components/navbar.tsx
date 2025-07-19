import tmuLogo from '../assets/tmu-monkey-logo.png';


export default function Navbar() {
  return (
    <nav className="bg-black/30 backdrop-blur-xl text-white px-20 py-2 flex flex-row justify-between items-center gap-30 fixed top-0 left-0 w-full text-[15px] border-b-2 border-secondary z-50">
        
        <a href='/'>
            <div className="text-xl font-bold flex flex-row hover:cursor-pointer items-center">
            <img src={tmuLogo.src} alt="TMU Logo" className="h-15 w-15" />

            <p className="text-accent">TMU</p>
            <p className="text-secondary">.planner</p>
        </div>
        </a>

        <ul className="flex space-x-3 font-bold text-[15px]">
            <li>
            <a href="#" className="p-2 rounded-[10px] hover:bg-secondary hover:text-black transition-colors duration-200">Catalogue</a>
            </li>
            <li>
            <a href="#" className="p-2 rounded-[10px] hover:bg-secondary hover:text-black transition-colors duration-200">Degree Planner</a>
            </li>
            <li>
            <a href="#" className="p-2 rounded-[10px] hover:bg-secondary hover:text-black transition-colors duration-200">Schedule Builder</a>
            </li>
            <li>
            <a href="#" className="p-2 rounded-[10px] hover:bg-secondary hover:text-black transition-colors duration-200">Transcript Parser</a>
            </li>
        </ul>

        <ul>
            <li>
            <a href="#" className="px-5 py-2 rounded-[5px] bg-red-400 hover:bg-red-800 transition-colors duration-100 font-bold text-[15px]">Login</a>
            </li>
        </ul>
    </nav>
  );
}
