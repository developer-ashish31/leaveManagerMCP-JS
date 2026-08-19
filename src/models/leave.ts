export type LeaveType =
  | "CASUAL"
  | "SICK"
  | "EARNED"
  | "UNPAID";

export type LeaveStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
}

export interface LeaveBalance {
  employeeId: string;
  casual: number;
  sick: number;
  earned: number;
  unpaid: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
}