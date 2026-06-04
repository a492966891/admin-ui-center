export const debugMock = {
  logDebug(body: any) {
    const { row, stack } = body || {};
    
    console.group('%c[前端调试日志收集 Mock]', 'color: #ff3b30; font-weight: bold;');
    console.log('时间:', new Date().toISOString());
    console.log('行数据:', row);
    console.log('堆栈跟踪:', stack);
    console.groupEnd();

    return {
      code: 200,
      message: 'Debug info logged successfully (in console)',
      timestamp: Date.now()
    };
  }
};
