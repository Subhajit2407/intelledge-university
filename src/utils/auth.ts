
export type UserRole = "student" | "teacher" | "admin";

export interface User {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
    avatar?: string;
}

export const getCurrentRole = (): UserRole => {
    return (localStorage.getItem("intelledge_role") as UserRole) || "student";
};

export const setRole = (role: UserRole) => {
    localStorage.setItem("intelledge_role", role);
};

export const logout = () => {
    localStorage.removeItem("intelledge_role");
    localStorage.removeItem("student_setup_complete");
    window.location.href = "/login";
};
