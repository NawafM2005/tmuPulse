import Navbar from "@/components/navbar";
import plus from "@/assets/plus.png";

export default function Planner() {

  const semesters = [
  {
    name: "Semester 1",
    courses: ["CPS 109", "CPS 209", "CPS 309", "CPS 409", "CPS 509"],
  },
  {
    name: "Semester 2",
    courses: ["MTH 110", "MTH 210", "CPS 212", "CPS 305", "CPS 530"],
  },
  {
    name: "Semester 3",
    courses: ["CPS 406", "CPS 590", "CPS 633", "CPS 706", "CPS 721"],
  },
  {
    name: "Semester 4",
    courses: ["CPS 412", "CPS 512", "CPS 612", "CPS 712", "CPS 812"],
  },
];

  return (
    <main className="flex flex-col min-h-screen items-center justify-center bg-foreground">
      <Navbar/>

      <div className="flex flex-col items-center justify-center p-8 w-full max-w-6xl mt-30 gap-4 text-center">
            <h1 className="text-[70px] font-[800] text-secondary" >Degree Planner</h1>
            <p className="text-[20px] font-[400] text-white"> Take control of your academic journey. Use the degree planner to map out future semesters, organize required courses, and stay on track for graduation. Visualize your progress and plan what’s next with clarity.</p>
      </div> 

      <div className="overflow-x-auto w-full max-w-6xl mt-10 space-y-8 mb-20">
        {semesters.map((semester, i) => (
          <table
            key={i}
            className="table-auto border-collapse border border-white/30 w-full text-white"
          >
            <thead className="bg-white/10">
              <tr>
                <th
                  colSpan={semester.courses.length + 1}
                  className="border border-white/30 px-4 py-2 text-left text-xl"
                >
                  {semester.name}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {semester.courses.map((course, j) => (
                  <td
                    key={j}
                    className="border border-white/30 px-4 py-2 text-center"
                  >
                    {course}
                  </td>
                ))}
                 <td className="bg-secondary cursor-pointer hover:opacity-80 transition-opacity duration-200">
                    <img
                      src={plus.src}
                      alt="add course"
                      className="w-6 h-6 object-contain mx-auto"
                    />
                  </td>
              </tr>
            </tbody>
          </table>
        ))}
      </div>
    </main>
  );
}