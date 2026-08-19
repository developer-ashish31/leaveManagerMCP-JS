import {
  employees,
  leaveBalances,
  leaveRequests
} from "../data/dummy-db.js";

import {
  LeaveRequest,
  LeaveType
} from "../models/leave.js";

export class LeaveRepository {

  getEmployee(employeeId: string) {
    return employees.find(
      employee => employee.id === employeeId
    );
  }

  getLeaveBalance(employeeId: string) {
    return leaveBalances.find(
      balance => balance.employeeId === employeeId
    );
  }

  getLeaveHistory(employeeId: string) {
    return leaveRequests.filter(
      request => request.employeeId === employeeId
    );
  }

  getLeaveTypes() {
    return [
      {
        type: "CASUAL",
        description: "Casual leave"
      },
      {
        type: "SICK",
        description: "Sick leave"
      },
      {
        type: "EARNED",
        description: "Earned leave"
      },
      {
        type: "UNPAID",
        description: "Unpaid leave"
      }
    ];
  }

  applyLeave(
    employeeId: string,
    leaveType: LeaveType,
    startDate: string,
    endDate: string,
    reason: string
  ): LeaveRequest {

    const request: LeaveRequest = {
      id: `LR${String(leaveRequests.length + 1).padStart(3, "0")}`,
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason,
      status: "PENDING",
      createdAt: new Date().toISOString()
    };

    leaveRequests.push(request);

    return request;
  }

  cancelLeave(leaveId: string) {

    const request = leaveRequests.find(
      request => request.id === leaveId
    );

    if (!request) {
      throw new Error("Leave request not found");
    }

    request.status = "CANCELLED";

    return request;
  }
}