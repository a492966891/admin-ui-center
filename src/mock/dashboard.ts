export const dashboardMock = {
  getStats() {
    return {
      code: 200,
      data: {
        // 4个顶部卡片数据
        cards: [
          {
            id: 'visits',
            title: '今日访问量',
            value: '42,912',
            growth: '+12.5%',
            trend: 'up',
            icon: 'View',
            color: '#5856d6',
            chartData: [30, 45, 35, 50, 49, 60, 70],
          },
          {
            id: 'users',
            title: '新增用户',
            value: '1,248',
            growth: '+8.2%',
            trend: 'up',
            icon: 'User',
            color: '#34c759',
            chartData: [10, 15, 8, 12, 19, 15, 22],
          },
          {
            id: 'orders',
            title: '今日订单量',
            value: '842',
            growth: '-3.1%',
            trend: 'down',
            icon: 'ShoppingCart',
            color: '#ff9500',
            chartData: [45, 40, 48, 42, 38, 43, 35],
          },
          {
            id: 'revenue',
            title: '今日销售额',
            value: '¥58,900',
            growth: '+15.4%',
            trend: 'up',
            icon: 'Money',
            color: '#ff3b30',
            chartData: [20, 28, 25, 35, 42, 40, 52],
          },
        ],
        // 访问量折线图
        visitChart: {
          categories: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          visits: [12000, 15000, 18000, 14000, 22000, 26000, 28000],
          visitors: [8000, 10000, 11000, 9500, 15000, 17000, 19000],
        },
        // 销售柱状图
        salesChart: {
          months: ['一月', '二月', '三月', '四月', '五月', '六月'],
          revenue: [120000, 145000, 130000, 165000, 190000, 220000],
        },
        // 来源饼图
        sourceChart: [
          { value: 1048, name: '搜索引擎' },
          { value: 735, name: '直接访问' },
          { value: 580, name: '邮件营销' },
          { value: 484, name: '联盟广告' },
          { value: 300, name: '视频广告' },
        ],
        // 性能雷达图
        performanceRadar: {
          indicators: [
            { name: 'CPU 使用率', max: 100 },
            { name: '内存占用', max: 100 },
            { name: '磁盘 I/O', max: 100 },
            { name: '网络吞吐', max: 100 },
            { name: '接口响应', max: 100 },
          ],
          values: [68, 72, 45, 80, 92],
        },
        // 最新订单表格
        recentOrders: [
          { id: 'ORD-2026001', customer: '张伟', amount: '¥1,299.00', status: 'success', date: '2026-06-03 12:10:00' },
          { id: 'ORD-2026002', customer: '李娜', amount: '¥499.00', status: 'pending', date: '2026-06-03 11:45:00' },
          { id: 'ORD-2026003', customer: '王强', amount: '¥3,500.00', status: 'success', date: '2026-06-03 11:20:00' },
          { id: 'ORD-2026004', customer: '刘洋', amount: '¥89.00', status: 'danger', date: '2026-06-03 10:55:00' },
          { id: 'ORD-2026005', customer: '陈静', amount: '¥850.00', status: 'success', date: '2026-06-03 10:30:00' },
        ],
        // 最近登录用户
        recentLogins: [
          { id: 1, name: 'admin', ip: '192.168.1.100', location: '北京/朝阳', time: '刚刚' },
          { id: 2, name: 'test', ip: '220.181.108.85', location: '广东/深圳', time: '15分钟前' },
          { id: 3, name: 'editor', ip: '117.136.8.12', location: '浙江/杭州', time: '1小时前' },
          { id: 4, name: 'admin', ip: '192.168.1.100', location: '北京/朝阳', time: '3小时前' },
          { id: 5, name: 'guest', ip: '183.60.2.14', location: '四川/成都', time: '5小时前' },
        ],
      },
      message: '获取成功',
      timestamp: Date.now(),
    };
  }
};
