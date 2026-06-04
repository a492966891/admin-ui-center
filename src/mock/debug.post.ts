// server/api/mock/debug.post.ts
import fs from 'fs';
import path from 'path';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const logFilePath = path.join(process.cwd(), 'debug_output.txt');
  
  const logContent = `
========================================
TIMESTAMP: ${new Date().toISOString()}
ROW DATA: ${JSON.stringify(body.row, null, 2)}
STACK TRACE:
${body.stack}
========================================
\n`;

  fs.appendFileSync(logFilePath, logContent, 'utf-8');
  
  return {
    code: 200,
    message: 'Debug info logged successfully',
  };
});
