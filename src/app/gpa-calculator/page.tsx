'use client';

import { useState } from 'react';
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface Course {
  id: string;
  courseName: string;
  courseWeight: number;
  grade: string;
  gradePoints: number;
}

const gradeScale = {
  'A+': 4.33,
  'A': 4.00,
  'A-': 3.67,
  'B+': 3.33,
  'B': 3.00,
  'B-': 2.67,
  'C+': 2.33,
  'C': 2.00,
  'C-': 1.67,
  'D+': 1.33,
  'D': 1.00,
  'D-': 0.67,
  'F': 0.00
};

export default function GPACalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', courseName: '', courseWeight: 1.0, grade: '', gradePoints: 0 }
  ]);

  const addCourse = () => {
    const newCourse: Course = {
      id: Date.now().toString(),
      courseName: '',
      courseWeight: 1.0,
      grade: '',
      gradePoints: 0
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map(course => {
      if (course.id === id) {
        const updatedCourse = { ...course, [field]: value };
        if (field === 'grade') {
          updatedCourse.gradePoints = gradeScale[value as keyof typeof gradeScale] || 0;
        }
        return updatedCourse;
      }
      return course;
    }));
  };

  const calculateGPA = () => {
    const totalGradePoints = courses.reduce((sum, course) => {
      return sum + (course.gradePoints * course.courseWeight);
    }, 0);
    
    const totalWeight = courses.reduce((sum, course) => {
      return sum + course.courseWeight;
    }, 0);

    return totalWeight > 0 ? (totalGradePoints / totalWeight).toFixed(2) : '0.00';
  };

  const clearAll = () => {
    setCourses([{ id: '1', courseName: '', courseWeight: 1.0, grade: '', gradePoints: 0 }]);
  };

  const sampleCourses = [
    { name: 'Course A', weight: 1.00, grade: 'A-', points: 3.67, weightedPoints: 3.67 },
    { name: 'Course B', weight: 1.00, grade: 'B', points: 3.00, weightedPoints: 3.00 },
    { name: 'Course C', weight: 1.00, grade: 'C', points: 2.00, weightedPoints: 2.00 },
    { name: 'Course D', weight: 2.00, grade: 'B+', points: 3.33, weightedPoints: 6.66 },
    { name: 'Course E', weight: 1.00, grade: 'A-', points: 3.67, weightedPoints: 3.67 },
    { name: 'Course F', weight: 1.00, grade: 'B-', points: 2.67, weightedPoints: 2.67 },
  ];

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 sm:px-8 md:px-30 lg:px-42 py-8 mt-20">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-[900] text-foreground mb-4">
            <span className="text-accent">T</span><span className="text-[#f5d60b]">M</span><span className="text-primary">U</span> GPA Calculator
          </h1>
          <p className="text-xs sm:text-base md:text-lg font-[600] text-foreground max-w-4xl mx-auto">
            Calculate your cumulative grade point average using TMU&apos;s official 4.33 GPA scale. 
            Perfect for planning your academic goals and tracking your progress.
          </p>
        </div>

        {/* Info Section */}
        <div className="bg-card-bg rounded-lg shadow-lg p-4 sm:p-6 mb-8 border-2 border-foreground">
          <h2 className="text-xl sm:text-2xl font-[800] text-foreground mb-4">How TMU GPA Calculation Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-base sm:text-lg font-[700] text-foreground mb-2">Calculation Formula:</h3>
              <ol className="list-decimal list-inside space-y-2 font-[600] text-muted text-sm sm:text-base">
                <li>Multiply each grade&apos;s points by the course weight</li>
                <li>Add all the products together</li>
                <li>Add all course weights together</li>
                <li>Divide total grade points by total weights</li>
              </ol>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-[700] text-foreground mb-2">TMU Grade Scale (4.33 System):</h3>
              <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-[600] text-foreground">
                <div className="space-y-1">
                  <div>A+ (90-100%) = 4.33</div>
                  <div>A (85-89%) = 4.00</div>
                  <div>A- (80-84%) = 3.67</div>
                  <div>B+ (77-79%) = 3.33</div>
                  <div>B (73-76%) = 3.00</div>
                  <div>B- (70-72%) = 2.67</div>
                  <div>C+ (67-69%) = 2.33</div>
                </div>
                <div className="space-y-1">
                  <div>C (63-66%) = 2.00</div>
                  <div>C- (60-62%) = 1.67</div>
                  <div>D+ (57-59%) = 1.33</div>
                  <div>D (53-56%) = 1.00</div>
                  <div>D- (50-52%) = 0.67</div>
                  <div>F (0-49%) = 0.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GPA to Percentage Conversion */}
        <div className="bg-card-bg rounded-lg shadow-lg p-4 sm:p-6 mb-8 border-2 border-foreground">
          <h2 className="text-xl sm:text-2xl font-[800] text-foreground mb-4">GPA to Percentage Conversion Guide</h2>
          <p className="font-[600] text-muted mb-4 text-sm sm:text-base">
            Understanding what your GPA means in percentage terms can help you gauge your academic performance:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-success/10 p-4 rounded-lg border-2 border-success/30">
              <h3 className="font-[800] text-success mb-2 text-sm sm:text-base">Excellent (A Range)</h3>
              <div className="space-y-1 text-xs sm:text-sm font-[600] text-foreground">
                <div>GPA 3.67 - 4.33</div>
                <div>80% - 100%</div>
                <div className="text-xs text-muted mt-2">Outstanding academic achievement</div>
              </div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/30">
              <h3 className="font-[800] text-primary mb-2 text-sm sm:text-base">Good (B Range)</h3>
              <div className="space-y-1 text-xs sm:text-sm font-[600] text-foreground">
                <div>GPA 2.67 - 3.66</div>
                <div>70% - 79%</div>
                <div className="text-xs text-muted mt-2">Above average performance</div>
              </div>
            </div>
            <div className="bg-warning/10 p-4 rounded-lg border-2 border-warning/30">
              <h3 className="font-[800] text-warning mb-2 text-sm sm:text-base">Satisfactory (C Range)</h3>
              <div className="space-y-1 text-xs sm:text-sm font-[600] text-foreground">
                <div>GPA 1.67 - 2.66</div>
                <div>60% - 69%</div>
                <div className="text-xs text-muted mt-2">Meeting minimum requirements</div>
              </div>
            </div>
            <div className="bg-danger/10 p-4 rounded-lg border-2 border-danger/30">
              <h3 className="font-[800] text-danger mb-2 text-sm sm:text-base">Needs Improvement</h3>
              <div className="space-y-1 text-xs sm:text-sm font-[600] text-foreground">
                <div>GPA 0.67 - 1.66</div>
                <div>50% - 59%</div>
                <div className="text-xs text-muted mt-2">Below academic standards</div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-highlight rounded-lg border border-primary">
            <p className="font-[600] text-foreground text-xs sm:text-sm">
              <strong>Note:</strong> Percentage ranges based on official TMU grading scale. A+ (90-100%), A (85-89%), A- (80-84%), 
              B+ (77-79%), B (73-76%), B- (70-72%), C+ (67-69%), C (63-66%), C- (60-62%), D+ (57-59%), D (53-56%), D- (50-52%), F (0-49%). <br></br>
            </p>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="bg-card-bg rounded-lg shadow-lg p-4 sm:p-6 mb-8 border-2 border-foreground">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-[800] text-foreground">GPA Calculator</h2>
            <div className="flex flex-row gap-2 sm:gap-4">
              <button
                onClick={addCourse}
                className="flex-1 sm:flex-none bg-primary text-white font-[700] px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded hover:opacity-90 transition-all duration-200 cursor-pointer touch-manipulation"
              >
                Add Course
              </button>
              <button
                onClick={clearAll}
                className="flex-1 sm:flex-none bg-danger text-white font-[700] px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded hover:opacity-90 transition-all duration-200 cursor-pointer touch-manipulation"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Mobile Card View (Visible on small screens) */}
          <div className="md:hidden space-y-4">
            {courses.map((course, index) => (
              <div key={course.id} className="bg-background p-4 rounded-lg border border-input-border shadow-sm">
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-input-border">
                  <h3 className="font-[800] text-foreground text-sm">Course #{index + 1}</h3>
                  <button
                    onClick={() => removeCourse(course.id)}
                    disabled={courses.length === 1}
                    className="bg-danger text-white font-[700] px-2 py-1 text-xs rounded hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-[700] text-foreground mb-1">Course Name</label>
                    <input
                      type="text"
                      value={course.courseName}
                      onChange={(e) => updateCourse(course.id, 'courseName', e.target.value)}
                      placeholder="e.g. MTH110"
                      className="w-full p-2 border border-input-border bg-input-bg text-foreground rounded font-[600] focus:border-input-focus focus:outline-none text-sm"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-[700] text-foreground mb-1">Weight</label>
                      <select
                        value={course.courseWeight}
                        onChange={(e) => updateCourse(course.id, 'courseWeight', parseFloat(e.target.value))}
                        className="w-full p-2 border border-input-border bg-input-bg text-foreground rounded font-[600] focus:border-input-focus focus:outline-none text-sm"
                      >
                        <option value={0.5}>0.5</option>
                        <option value={1.0}>1.0</option>
                        <option value={1.5}>1.5</option>
                        <option value={2.0}>2.0</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-[700] text-foreground mb-1">Grade</label>
                      <select
                        value={course.grade}
                        onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                        className="w-full p-2 border border-input-border bg-input-bg text-foreground rounded font-[600] focus:border-input-focus focus:outline-none text-sm"
                      >
                        <option value="">Select</option>
                        {Object.keys(gradeScale).map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-card-hover p-2 rounded border border-input-border">
                    <div className="text-center">
                      <div className="text-[10px] font-[600] text-muted uppercase">Points</div>
                      <div className="font-[800] text-foreground">{course.gradePoints.toFixed(2)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-[600] text-muted uppercase">Weighted</div>
                      <div className="font-[800] text-foreground">{(course.gradePoints * course.courseWeight).toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (Hidden on small screens) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse border border-input-border">
              <thead>
                <tr className="bg-card-hover">
                  <th className="border border-input-border px-2 sm:px-4 py-2 sm:py-3 text-left font-[800] text-foreground text-xs sm:text-sm">Course Name</th>
                  <th className="border border-input-border px-2 sm:px-4 py-2 sm:py-3 text-left font-[800] text-foreground text-xs sm:text-sm">Weight</th>
                  <th className="border border-input-border px-2 sm:px-4 py-2 sm:py-3 text-left font-[800] text-foreground text-xs sm:text-sm">Grade</th>
                  <th className="border border-input-border px-2 sm:px-4 py-2 sm:py-3 text-left font-[800] text-foreground text-xs sm:text-sm">Grade Points</th>
                  <th className="border border-input-border px-2 sm:px-4 py-2 sm:py-3 text-left font-[800] text-foreground text-xs sm:text-sm">Weighted Points</th>
                  <th className="border border-input-border px-2 sm:px-4 py-2 sm:py-3 text-left font-[800] text-foreground text-xs sm:text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course, index) => (
                  <tr key={course.id} className={index % 2 === 0 ? 'bg-card-bg' : 'bg-card-hover'}>
                    <td className="border border-input-border px-1 sm:px-4 py-2 sm:py-3">
                      <input
                        type="text"
                        value={course.courseName}
                        onChange={(e) => updateCourse(course.id, 'courseName', e.target.value)}
                        placeholder="e.g. MTH110"
                        className="w-full p-1 sm:p-2 border border-input-border bg-input-bg text-foreground rounded font-[600] focus:border-input-focus focus:outline-none text-xs sm:text-sm"
                      />
                    </td>
                    <td className="border border-input-border px-1 sm:px-4 py-2 sm:py-3">
                      <select
                        value={course.courseWeight}
                        onChange={(e) => updateCourse(course.id, 'courseWeight', parseFloat(e.target.value))}
                        className="w-full p-1 sm:p-2 border border-input-border bg-input-bg text-foreground rounded font-[600] focus:border-input-focus focus:outline-none text-xs sm:text-sm"
                      >
                        <option value={0.5}>0.5</option>
                        <option value={1.0}>1.0</option>
                        <option value={1.5}>1.5</option>
                        <option value={2.0}>2.0</option>
                      </select>
                    </td>
                    <td className="border border-input-border px-1 sm:px-4 py-2 sm:py-3">
                      <select
                        value={course.grade}
                        onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                        className="w-full p-1 sm:p-2 border border-input-border bg-input-bg text-foreground rounded font-[600] focus:border-input-focus focus:outline-none text-xs sm:text-sm"
                      >
                        <option value="">Select Grade</option>
                        {Object.keys(gradeScale).map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border border-input-border px-1 sm:px-4 py-2 sm:py-3 text-center font-[600] text-foreground text-xs sm:text-sm">
                      {course.gradePoints.toFixed(2)}
                    </td>
                    <td className="border border-input-border px-1 sm:px-4 py-2 sm:py-3 text-center font-[600] text-foreground text-xs sm:text-sm">
                      {(course.gradePoints * course.courseWeight).toFixed(2)}
                    </td>
                    <td className="border border-input-border px-1 sm:px-4 py-2 sm:py-3 text-center">
                      <button
                        onClick={() => removeCourse(course.id)}
                        disabled={courses.length === 1}
                        className="bg-danger text-white font-[700] px-1 py-1 sm:px-3 sm:py-1 text-xs rounded hover:opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer touch-manipulation min-h-[32px] min-w-[60px]"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Results */}
          <div className="mt-6 p-4 sm:p-6 bg-card-hover rounded-lg border-2 border-foreground">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-2 sm:p-0 bg-background sm:bg-transparent rounded border sm:border-0 border-input-border">
                <h3 className="text-sm sm:text-lg font-[800] text-foreground">Total Weight</h3>
                <p className="text-lg sm:text-2xl font-[700] text-primary">
                  {courses.reduce((sum, course) => sum + course.courseWeight, 0).toFixed(1)}
                </p>
              </div>
              <div className="p-2 sm:p-0 bg-background sm:bg-transparent rounded border sm:border-0 border-input-border">
                <h3 className="text-sm sm:text-lg font-[800] text-foreground">Total Grade Points</h3>
                <p className="text-lg sm:text-2xl font-[700] text-primary">
                  {courses.reduce((sum, course) => sum + (course.gradePoints * course.courseWeight), 0).toFixed(2)}
                </p>
              </div>
              <div className="p-2 sm:p-0 bg-background sm:bg-transparent rounded border sm:border-0 border-input-border">
                <h3 className="text-sm sm:text-lg font-[800] text-foreground">Your GPA</h3>
                <p className="text-2xl sm:text-4xl font-[900] text-accent">
                  {calculateGPA()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Calculation */}
        <div className="bg-card-bg rounded-lg shadow-lg p-4 sm:p-6 mb-8 border-2 border-foreground">
          <h2 className="text-xl sm:text-2xl font-[800] text-foreground mb-4">Sample GPA Calculation</h2>
          <p className="font-[600] text-muted mb-4 text-sm sm:text-base">
            Here&apos;s an example of how to calculate your CGPA using TMU&apos;s official method:
          </p>
          
          {/* Mobile View */}
          <div className="md:hidden space-y-3 mb-4">
            {sampleCourses.map((course, index) => (
              <div key={index} className="bg-background p-3 rounded border border-input-border text-sm">
                <div className="flex justify-between font-[800] text-foreground mb-2">
                  <span>{course.name}</span>
                  <span>{course.grade}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted font-[600] block">Weight</span>
                    <span className="font-[600] text-foreground">{course.weight.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted font-[600] block">Points</span>
                    <span className="font-[600] text-foreground">{course.points.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-muted font-[600] block">WxP</span>
                    <span className="font-[600] text-foreground">{course.weightedPoints.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
            {/* Total Row Mobile */}
            <div className="bg-card-hover p-3 rounded border border-input-border text-sm">
                <div className="flex justify-between font-[800] text-foreground mb-2">
                  <span>Total</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-muted font-[600] block">Weight</span>
                    <span className="font-[800] text-foreground">7.00</span>
                  </div>
                  <div>
                    <span className="text-muted font-[600] block">Points</span>
                    <span className="font-[800] text-foreground">18.34</span>
                  </div>
                  <div>
                    <span className="text-muted font-[600] block">WxP</span>
                    <span className="font-[800] text-foreground">21.67</span>
                  </div>
                </div>
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse border border-input-border mb-4">
              <thead>
                <tr className="bg-card-hover">
                  <th className="border border-input-border px-4 py-2 font-[800] text-foreground">Course</th>
                  <th className="border border-input-border px-4 py-2 font-[800] text-foreground">Weight</th>
                  <th className="border border-input-border px-4 py-2 font-[800] text-foreground">Grade</th>
                  <th className="border border-input-border px-4 py-2 font-[800] text-foreground">Grade Points</th>
                  <th className="border border-input-border px-4 py-2 font-[800] text-foreground">Grade Points x Weight</th>
                </tr>
              </thead>
              <tbody>
                {sampleCourses.map((course, index) => (
                  <tr key={index}>
                    <td className="border border-input-border px-4 py-2 font-[600] text-foreground">{course.name}</td>
                    <td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">{course.weight.toFixed(2)}</td>
                    <td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">{course.grade}</td>
                    <td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">{course.points.toFixed(2)}</td>
                    <td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">{course.weightedPoints.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-card-hover">
                    <td className="border border-input-border px-4 py-2 font-[800] text-foreground">Total</td>
                    <td className="border border-input-border px-4 py-2 text-center font-[800] text-foreground">7.00</td>
                    <td className="border border-input-border px-4 py-2 text-center font-[800] text-foreground">N/A</td>
                    <td className="border border-input-border px-4 py-2 text-center font-[800] text-foreground">18.34</td>
                    <td className="border border-input-border px-4 py-2 text-center font-[800] text-foreground">21.67</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-highlight p-4 rounded-lg border border-primary">
            <p className="font-[700] text-foreground mb-2 text-sm sm:text-base">Calculation:</p>
            <p className="font-[600] text-foreground mb-1 text-xs sm:text-base">CGPA = (Total Grade Points x Weight) ÷ (Total Course Weight)</p>
            <p className="font-[600] text-foreground mb-1 text-xs sm:text-base">CGPA = 21.67 ÷ 7.00</p>
            <p className="font-[800] text-lg text-accent">CGPA = 3.10</p>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-warning rounded-lg shadow-lg p-4 sm:p-6 border-2 border-warning">
          <h2 className="text-xl sm:text-2xl font-[800] text-background mb-4">Important Notes</h2>
          <ul className="space-y-2 font-[600] text-background text-sm sm:text-base">
            <li>• This calculator uses TMU&apos;s official 4.33 GPA scale</li>
            <li>• Course weights are typically 0.5, 1.0, 1.5, or 2.0 credits</li>
            <li>• This is for estimation purposes - always verify with your official transcript</li>
          </ul>
        </div>
      </div>

      <Footer />
    </main>
  );
}
