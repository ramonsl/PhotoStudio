type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
    level: LogLevel
    message: string
    timestamp: string
    data?: any
}

class Logger {
    private log(level: LogLevel, message: string, data?: any) {
        const entry: LogEntry = {
            level,
            message,
            timestamp: new Date().toISOString(),
            data,
        }

        const logMessage = `[${entry.timestamp}] [${level.toUpperCase()}] ${message}`

        switch (level) {
            case 'error':
                console.error(logMessage, data || '')
                break
            case 'warn':
                console.warn(logMessage, data || '')
                break
            case 'debug':
                console.debug(logMessage, data || '')
                break
            default:
                console.log(logMessage, data || '')
        }
    }

    info(message: string, data?: any) {
        this.log('info', message, data)
    }

    warn(message: string, data?: any) {
        this.log('warn', message, data)
    }

    error(message: string, data?: any) {
        this.log('error', message, data)
    }

    debug(message: string, data?: any) {
        this.log('debug', message, data)
    }
}

export const logger = new Logger()
