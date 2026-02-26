import course1 from "@/assets/course-1.png";
import course2 from "@/assets/course-2.png";
import course3 from "@/assets/course-3.png";
import { Users, BookOpen, TrendingUp } from "lucide-react";

const courses = [
  {
    title: "Data Structures & Algorithms",
    instructor: "Dr. Priya Sharma",
    image: course1,
    students: 120,
    modules: 14,
    progress: 68,
  },
  {
    title: "UI/UX Design Systems",
    instructor: "Prof. Ravi Kumar",
    image: course2,
    students: 85,
    modules: 10,
    progress: 82,
  },
  {
    title: "Machine Learning",
    instructor: "Dr. Anand Mehta",
    image: course3,
    students: 96,
    modules: 12,
    progress: 45,
  },
];

export function CourseCards() {
  return (
    <div>
      <h3 className="text-lg font-bold text-foreground mb-4">Active Courses</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map((course, i) => (
          <div
            key={course.title}
            className="group rounded-2xl bg-card shadow-card overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="h-32 overflow-hidden gradient-accent flex items-center justify-center">
              <img src={course.image} alt={course.title} className="h-28 w-28 object-contain group-hover:scale-105 transition-transform duration-300" />
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
    </div>
  );
}
