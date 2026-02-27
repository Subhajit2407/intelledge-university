import { Users, BookOpen, TrendingUp, Presentation } from "lucide-react";
import { useEffect, useState } from "react";

export function CourseCards() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    const teacherRecords = JSON.parse(localStorage.getItem("teacher_student_records") || "[]");
    const currentStudent = JSON.parse(localStorage.getItem("student_profile_data") || "{}");
    const myRecord = teacherRecords.find((r: any) => r.name === currentStudent.name || r.roll === currentStudent.roll);

    if (myRecord && myRecord.subjects && myRecord.subjects.length > 0) {
      const dynamicCourses = myRecord.subjects.map((sub: any) => ({
        title: sub.name,
        instructor: "Assigned Faculty",
        students: 60,
        modules: parseInt(sub.credits || "3") * 3,
        progress: sub.totalClasses ? Math.round((sub.attendedClasses / sub.totalClasses) * 100) : 0,
      }));
      setCourses(dynamicCourses);
    }
  }, []);

  return (
    <div>
      <h3 className="text-lg font-bold text-foreground mb-4">Active Courses</h3>
      {courses.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-border p-12 text-center">
          <Presentation className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm font-medium text-muted-foreground">No active courses. Faculty sync pending.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {courses.map((course, i) => (
            <div
              key={course.title + i}
              className="group rounded-2xl bg-card shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="h-32 overflow-hidden gradient-accent flex items-center justify-center">
                <Presentation className="h-16 w-16 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <h4 className="text-sm font-bold text-foreground mb-1 truncate">{course.title}</h4>
                <p className="text-xs text-muted-foreground mb-3">{course.instructor}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-primary" /> {course.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3 text-primary" /> {course.modules}
                  </span>
                  <span className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-primary" /> {course.progress}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
