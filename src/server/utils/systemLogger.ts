export interface SystemLogEntry {
  id: string;
  timestamp: string; // e.g. "AUG 26 20:00:05.09"
  isoTime: string;
  method: string;
  status: number;
  host: string;
  request: string;
  durationMs: number;
  message?: string;
  level: 'info' | 'warn' | 'error';
}

class SystemLoggerService {
  private logs: SystemLogEntry[] = [];
  private readonly MAX_LOGS = 300;

  constructor() {
    // Seed initial startup log
    this.addLog({
      method: 'SYSTEM',
      status: 200,
      host: 'system.cationgate.site',
      request: '/system/startup',
      durationMs: 0,
      message: 'CationGate API Gateway initialized & listening.',
      level: 'info'
    });
  }

  private formatVercelTimestamp(date: Date): string {
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'];
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    const secs = String(date.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(date.getMilliseconds() / 10)).padStart(2, '0');

    return `${month} ${day} ${hours}:${mins}:${secs}.${ms}`;
  }

  addLog(entry: Omit<SystemLogEntry, 'id' | 'timestamp' | 'isoTime'>) {
    const now = new Date();
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const formattedEntry: SystemLogEntry = {
      ...entry,
      id,
      timestamp: this.formatVercelTimestamp(now),
      isoTime: now.toISOString(),
    };

    this.logs.unshift(formattedEntry);
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.pop();
    }
  }

  getLogs(filter?: { status?: string; search?: string; host?: string; limit?: number }): SystemLogEntry[] {
    let result = this.logs;

    if (filter?.status) {
      if (filter.status === '5xx') {
        result = result.filter(l => l.status >= 500);
      } else if (filter.status === '4xx') {
        result = result.filter(l => l.status >= 400 && l.status < 500);
      } else if (filter.status === '2xx') {
        result = result.filter(l => l.status >= 200 && l.status < 300);
      } else if (filter.status === '3xx') {
        result = result.filter(l => l.status >= 300 && l.status < 400);
      }
    }

    if (filter?.host) {
      const h = filter.host.toLowerCase();
      result = result.filter(l => l.host.toLowerCase().includes(h));
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(l => 
        l.request.toLowerCase().includes(q) ||
        (l.message && l.message.toLowerCase().includes(q)) ||
        l.host.toLowerCase().includes(q) ||
        String(l.status).includes(q)
      );
    }

    if (filter?.limit) {
      result = result.slice(0, filter.limit);
    }

    return result;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const systemLogger = new SystemLoggerService();
