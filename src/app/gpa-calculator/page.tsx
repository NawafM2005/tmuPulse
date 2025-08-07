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

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-8 md:px-30 lg:px-42 py-8 mt-20">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-[900] text-foreground mb-4">
            <span className="text-accent">T</span><span className="text-[#f5d60b]">M</span><span className="text-primary">U</span> GPA Calculator
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-[600] text-foreground max-w-4xl mx-auto">
            Calculate your cumulative grade point average using TMU's official 4.33 GPA scale. 
            Perfect for planning your academic goals and tracking your progress.
          </p>
        </div>

        {/* Info Section */}
        <div className="bg-card-bg rounded-lg shadow-lg p-6 mb-8 border-2 border-foreground">
          <h2 className="text-2xl font-[800] text-foreground mb-4">How TMU GPA Calculation Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-[700] text-foreground mb-2">Calculation Formula:</h3>
              <ol className="list-decimal list-inside space-y-2 font-[600] text-muted">
                <li>Multiply each grade's points by the course weight</li>
                <li>Add all the products together</li>
                <li>Add all course weights together</li>
                <li>Divide total grade points by total weights</li>
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-[700] text-foreground mb-2">TMU Grade Scale (4.33 System):</h3>
              <div className="grid grid-cols-2 gap-2 text-sm font-[600] text-foreground">
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
        <div className="bg-card-bg rounded-lg shadow-lg p-6 mb-8 border-2 border-foreground">
          <h2 className="text-2xl font-[800] text-foreground mb-4">GPA to Percentage Conversion Guide</h2>
          <p className="font-[600] text-muted mb-4">
            Understanding what your GPA means in percentage terms can help you gauge your academic performance:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-success/10 p-4 rounded-lg border-2 border-success/30">
              <h3 className="font-[800] text-success mb-2">Excellent (A Range)</h3>
              <div className="space-y-1 text-sm font-[600] text-foreground">
                <div>GPA 3.67 - 4.33</div>
                <div>80% - 100%</div>
                <div className="text-xs text-muted mt-2">Outstanding academic achievement</div>
              </div>
            </div>
            <div className="bg-primary/10 p-4 rounded-lg border-2 border-primary/30">
              <h3 className="font-[800] text-primary mb-2">Good (B Range)</h3>
              <div className="space-y-1 text-sm font-[600] text-foreground">
                <div>GPA 2.67 - 3.66</div>
                <div>70% - 79%</div>
                <div className="text-xs text-muted mt-2">Above average performance</div>
              </div>
            </div>
            <div className="bg-warning/10 p-4 rounded-lg border-2 border-warning/30">
              <h3 className="font-[800] text-warning mb-2">Satisfactory (C Range)</h3>
              <div className="space-y-1 text-sm font-[600] text-foreground">
                <div>GPA 1.67 - 2.66</div>
                <div>60% - 69%</div>
                <div className="text-xs text-muted mt-2">Meeting minimum requirements</div>
              </div>
            </div>
            <div className="bg-danger/10 p-4 rounded-lg border-2 border-danger/30">
              <h3 className="font-[800] text-danger mb-2">Needs Improvement</h3>
              <div className="space-y-1 text-sm font-[600] text-foreground">
                <div>GPA 0.67 - 1.66</div>
                <div>50% - 59%</div>
                <div className="text-xs text-muted mt-2">Below academic standards</div>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-highlight rounded-lg border border-primary">
            <p className="font-[600] text-foreground text-sm">
              <strong>Note:</strong> Percentage ranges based on official TMU grading scale. A+ (90-100%), A (85-89%), A- (80-84%), 
              B+ (77-79%), B (73-76%), B- (70-72%), C+ (67-69%), C (63-66%), C- (60-62%), D+ (57-59%), D (53-56%), D- (50-52%), F (0-49%). <br></br>
            </p>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="bg-card-bg rounded-lg shadow-lg p-6 mb-8 border-2 border-foreground">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-xl sm:text-2xl font-[800] text-foreground">GPA Calculator</h2>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <button
                onClick={addCourse}
                className="bg-primary text-white font-[700] px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded hover:opacity-90 transition-all duration-200 cursor-pointer touch-manipulation"
              >
                Add Course
              </button>
              <button
                onClick={clearAll}
                className="bg-danger text-white font-[700] px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base rounded hover:opacity-90 transition-all duration-200 cursor-pointer touch-manipulation"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Course Table */}
          <div className="overflow-x-auto">
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
          <div className="mt-6 p-6 bg-card-hover rounded-lg border-2 border-foreground">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div>
                <h3 className="text-base sm:text-lg font-[800] text-foreground">Total Weight</h3>
                <p className="text-xl sm:text-2xl font-[700] text-primary">
                  {courses.reduce((sum, course) => sum + course.courseWeight, 0).toFixed(1)}
                </p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-[800] text-foreground">Total Grade Points</h3>
                <p className="text-xl sm:text-2xl font-[700] text-primary">
                  {courses.reduce((sum, course) => sum + (course.gradePoints * course.courseWeight), 0).toFixed(2)}
                </p>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-[800] text-foreground">Your GPA</h3>
                <p className="text-3xl sm:text-4xl font-[900] text-accent">
                  {calculateGPA()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Calculation */}
        <div className="bg-card-bg rounded-lg shadow-lg p-6 mb-8 border-2 border-foreground">
          <h2 className="text-2xl font-[800] text-foreground mb-4">Sample GPA Calculation</h2>
          <p className="font-[600] text-muted mb-4">
            Here's an example of how to calculate your CGPA using TMU's official method:
          </p>
          
          <div className="overflow-x-auto">
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
                <tr><td className="border border-input-border px-4 py-2 font-[600] text-foreground">Course A</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">1.00</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">A-</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">3.67</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">3.67</td></tr>
                <tr><td className="border border-input-border px-4 py-2 font-[600] text-foreground">Course B</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">1.00</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">B</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">3.00</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">3.00</td></tr>
                <tr><td className="border border-input-border px-4 py-2 font-[600] text-foreground">Course C</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">1.00</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">C</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">2.00</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">2.00</td></tr>
                <tr><td className="border border-input-border px-4 py-2 font-[600] text-foreground">Course D</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">2.00</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">B+</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">3.33</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">6.66</td></tr>
                <tr><td className="border border-input-border px-4 py-2 font-[600] text-foreground">Course E</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">1.00</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">A-</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">3.67</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">3.67</td></tr>
                <tr><td className="border border-input-border px-4 py-2 font-[600] text-foreground">Course F</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">1.00</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">B-</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">2.67</td><td className="border border-input-border px-4 py-2 text-center font-[600] text-foreground">2.67</td></tr>
                <tr className="bg-card-hover"><td className="border border-input-border px-4 py-2 font-[800] text-foreground">Total</td><td className="border border-input-border px-4 py-2 text-center font-[800] text-foreground">7.00</td><td className="border border-input-border px-4 py-2 text-center font-[800] text-foreground">N/A</td><td className="border border-input-border px-4 py-2 text-center font-[800] text-foreground">18.34</td><td className="border border-input-border px-4 py-2 text-center font-[800] text-foreground">21.67</td></tr>
              </tbody>
            </table>
          </div>
          
          <div className="bg-highlight p-4 rounded-lg border border-primary">
            <p className="font-[700] text-foreground mb-2">Calculation:</p>
            <p className="font-[600] text-foreground mb-1">CGPA = (Total Grade Points x Weight) ÷ (Total Course Weight)</p>
            <p className="font-[600] text-foreground mb-1">CGPA = 21.67 ÷ 7.00</p>
            <p className="font-[800] text-lg text-accent">CGPA = 3.10</p>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-warning rounded-lg shadow-lg p-6 border-2 border-warning">
          <h2 className="text-2xl font-[800] text-background mb-4">Important Notes</h2>
          <ul className="space-y-2 font-[600] text-background">
            <li>• This calculator uses TMU's official 4.33 GPA scale</li>
            <li>• Course weights are typically 0.5, 1.0, 1.5, or 2.0 credits</li>
            <li>• This is for estimation purposes - always verify with your official transcript</li>
          </ul>
        </div>
      </div>

      <Footer />
    </main>
  );
}
