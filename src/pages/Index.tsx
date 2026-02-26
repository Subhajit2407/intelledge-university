import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { WelcomeBanner } from "@/components/dashboard/WelcomeBanner";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { CourseCards } from "@/components/dashboard/CourseCards";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";

const Index = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <div className="flex gap-6">
            {/* Main content */}
            <div className="flex-1 space-y-6 min-w-0">
              <WelcomeBanner />
              <StatsCards />
              <CourseCards />
              <ActivityChart />
            </div>

            {/* Right sidebar */}
            <div className="hidden xl:flex w-72 shrink-0 flex-col gap-5">
              <CalendarWidget />
              <UpcomingTasks />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
