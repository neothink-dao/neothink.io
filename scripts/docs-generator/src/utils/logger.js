import chalk from 'chalk';
class Logger {
    getTimestamp() {
        return new Date().toISOString();
    }
    info(message, ...args) {
        console.log(chalk.blue(`[${this.getTimestamp()}] INFO:`), chalk.white(message), ...args);
    }
    success(message, ...args) {
        console.log(chalk.green(`[${this.getTimestamp()}] SUCCESS:`), chalk.white(message), ...args);
    }
    warning(message, ...args) {
        console.log(chalk.yellow(`[${this.getTimestamp()}] WARNING:`), chalk.white(message), ...args);
    }
    error(message, error) {
        console.error(chalk.red(`[${this.getTimestamp()}] ERROR:`), chalk.white(message));
        if (error) {
            if (error instanceof Error) {
                console.error(chalk.red('Stack trace:'), error.stack);
            }
            else {
                console.error(chalk.red('Error details:'), error);
            }
        }
    }
    debug(message, ...args) {
        if (process.env.DEBUG) {
            console.log(chalk.gray(`[${this.getTimestamp()}] DEBUG:`), chalk.white(message), ...args);
        }
    }
}
export const logger = new Logger();
//# sourceMappingURL=logger.js.map