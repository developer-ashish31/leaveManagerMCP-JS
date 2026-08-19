import {
  Employee,
  LeaveBalance,
  LeaveRequest
} from "../models/leave.js";

export const employees: Employee[] = [
  {
    id: "EMP001",
    name: "Ashish Kushwaha",
    email: "ashish@example.com",
    department: "Engineering"
  },
  {
    id: "EMP002",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    department: "Engineering"
  }
];

export const leaveBalances: LeaveBalance[] = [
  {
    employeeId: "EMP001",
    casual: 8,
    sick: 5,
    earned: 12,
    unpaid: 0
  },
  {
    employeeId: "EMP002",
    casual: 6,
    sick: 4,
    earned: 10,
    unpaid: 0
  }
];

export const leaveRequests: LeaveRequest[] = [
  {
    id: "LR001",
    employeeId: "EMP001",
    leaveType: "CASUAL",
    startDate: "2026-08-20",
    endDate: "2026-08-21",
    reason: "Personal work",
    status: "APPROVED",
    createdAt: "2026-08-10"
  }
];