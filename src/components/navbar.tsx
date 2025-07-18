export default function Navbar() {
  return (
    <nav className="bg-black text-white px-6 py-4 flex flex-row justify-between items-center gap-50">
      <div className="text-xl font-bold">
        TMU.courses
      </div>

      <ul className="flex space-x-6">
        <li>
          <a href="#" className="hover:text-yellow-400 transition-colors duration-200">Course Catalogue</a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-400 transition-colors duration-200">Courses Planner</a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-400 transition-colors duration-200">Schedule Builder</a>
        </li>
        <li>
          <a href="#" className="hover:text-yellow-400 transition-colors duration-200">Transcript Parser</a>
        </li>
      </ul>

      <ul>
        <li>
          <a href="#" className="hover:text-yellow-400 transition-colors duration-200">Login</a>
        </li>
      </ul>
    </nav>
  );
}
