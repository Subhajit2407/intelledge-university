// Persistent Storage Engine for IntellEdge AI
// Using localStorage as a mock database with an async-like API for easy future cloud migration.

export interface Subject {
    id: string;
    name: string;
    code: string;
    instructor: string;
    totalClasses: number;
    attendedClasses: number;
    credits: number;
    grade?: string;
}

export interface TeacherRecord {
    id: string;
    name: string;
    roll: string;
    score: string;
    attendance: string;
    semester: string;
    subjects?: Subject[];
}

export interface Alert {
    id: string;
    title: string;
    message: string;
    timestamp: string;
    type: "warning" | "info" | "success";
    studentId: string;
}

class IntellEdgeDB {
    private static getStored<T>(key: string): T[] {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    private static setStored<T>(key: string, data: T[]): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Student Records
    static async getRecords(): Promise<TeacherRecord[]> {
        return this.getStored<TeacherRecord>("teacher_student_records");
    }

    static async addRecord(record: Omit<TeacherRecord, "id">): Promise<TeacherRecord> {
        const records = await this.getRecords();
        const newRecord = { ...record, id: Date.now().toString(), subjects: [] };
        this.setStored("teacher_student_records", [...records, newRecord]);
        return newRecord;
    }

    static async updateRecord(id: string, updates: Partial<TeacherRecord>): Promise<void> {
        const records = await this.getRecords();
        const updated = records.map((r) => (r.id === id ? { ...r, ...updates } : r));
        this.setStored("teacher_student_records", updated);
    }

    static async deleteRecord(id: string): Promise<void> {
        const records = await this.getRecords();
        this.setStored("teacher_student_records", records.filter((r) => r.id !== id));
    }

    // Subjects (Academic Vault)
    static async addSubject(studentId: string, subject: Omit<Subject, "id">): Promise<void> {
        const records = await this.getRecords();
        const student = records.find(r => r.id === studentId || r.roll === studentId);
        if (student) {
            const newSub = { ...subject, id: Date.now().toString() };
            student.subjects = [...(student.subjects || []), newSub];
            this.setStored("teacher_student_records", records);
        }
    }

    // Alerts/Notifications
    static async sendAlert(alert: Omit<Alert, "id" | "timestamp">): Promise<void> {
        const alerts = this.getStored<Alert>("intelledge_alerts");
        const newAlert = {
            ...alert,
            id: Date.now().toString(),
            timestamp: new Date().toISOString()
        };
        this.setStored("intelledge_alerts", [...alerts, newAlert]);
    }

    static async getAlerts(studentId: string): Promise<Alert[]> {
        const alerts = this.getStored<Alert>("intelledge_alerts");
        return alerts.filter(a => a.studentId === studentId || a.studentId === "ALL");
    }
}

export default IntellEdgeDB;
