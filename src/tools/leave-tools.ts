import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";

import { LeaveRepository } from "../repositories/leave-repository.js";

export function registerLeaveTools(
  server: McpServer,
  repository: LeaveRepository
) {

  // 1. Get leave balance

  server.registerTool(
    "get_leave_balance",
    {
      description:
        "Get the current leave balance of an employee.",
      inputSchema: z.object({
        employeeId: z.string()
      })
    },
    async ({ employeeId }) => {

      const balance =
        repository.getLeaveBalance(employeeId);

      if (!balance) {
        return {
          content: [
            {
              type: "text",
              text: `Employee ${employeeId} not found.`
            }
          ],
          isError: true
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(balance, null, 2)
          }
        ]
      };
    }
  );


  // 2. Get leave history

  server.registerTool(
    "get_leave_history",
    {
      description:
        "Get the leave history of an employee.",
      inputSchema: z.object({
        employeeId: z.string()
      })
    },
    async ({ employeeId }) => {

      const history =
        repository.getLeaveHistory(employeeId);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(history, null, 2)
          }
        ]
      };
    }
  );


  // 3. Get leave types

  server.registerTool(
    "get_leave_types",
    {
      description:
        "Get all available leave types.",
      inputSchema: z.object({})
    },
    async () => {

      const types =
        repository.getLeaveTypes();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(types, null, 2)
          }
        ]
      };
    }
  );


  // 4. Apply leave

  server.registerTool(
    "apply_leave",
    {
      description:
        "Apply for leave for an employee.",
      inputSchema: z.object({
        employeeId: z.string(),
        leaveType: z.enum([
          "CASUAL",
          "SICK",
          "EARNED",
          "UNPAID"
        ]),
        startDate: z.string(),
        endDate: z.string(),
        reason: z.string()
      })
    },
    async ({
      employeeId,
      leaveType,
      startDate,
      endDate,
      reason
    }) => {

      const request =
        repository.applyLeave(
          employeeId,
          leaveType,
          startDate,
          endDate,
          reason
        );

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(request, null, 2)
          }
        ]
      };
    }
  );


  // 5. Cancel leave

  server.registerTool(
    "cancel_leave",
    {
      description:
        "Cancel an existing leave request.",
      inputSchema: z.object({
        leaveId: z.string()
      })
    },
    async ({ leaveId }) => {

      try {

        const request =
          repository.cancelLeave(leaveId);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(request, null, 2)
            }
          ]
        };

      } catch (error) {

        return {
          content: [
            {
              type: "text",
              text: error instanceof Error
                ? error.message
                : "Unable to cancel leave."
            }
          ],
          isError: true
        };
      }
    }
);

 // 5. get employee details by employee Id

  server.registerTool(
    "get_employee_details_by_employeeId",
    {
      description:
        "Get employee details by employeeId.",
      inputSchema: z.object({
        employeeId: z.string()
      })
    },
    async ({ employeeId }) => {

      try {

        const request =
          repository.getEmployee(employeeId);

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(request, null, 2)
            }
          ]
        };

      } catch (error) {

        return {
          content: [
            {
              type: "text",
              text: error instanceof Error
                ? error.message
                : "Unable to find the employee details."
            }
          ],
          isError: true
        };
      }
    }
  );
}