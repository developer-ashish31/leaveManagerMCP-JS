import { McpServer } from "@modelcontextprotocol/server";
import { serveStdio } from "@modelcontextprotocol/server/stdio";

import { LeaveRepository } from "./repositories/leave-repository.js";
import { registerLeaveTools } from "./tools/leave-tools.js";

function createServer() {

  const server = new McpServer({
    name: "leave-manager",
    version: "1.0.0"
  });

  const repository =
    new LeaveRepository();

  registerLeaveTools(
    server,
    repository
  );

  return server;
}

void serveStdio(createServer);

console.error(
  "Leave Manager MCP server running..."
);