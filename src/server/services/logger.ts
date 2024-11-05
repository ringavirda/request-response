import { singleton } from "tsyringe";
import chalk from "chalk";

@singleton()
export class Logger {
  public info(part: string, message: string) {
    console.log(
      chalk.gray(
        `[${part} ${"INFO"} ${new Date().toLocaleTimeString()}]: ${message}`,
      ),
    );
  }
  public warn(part: string, message: string) {
    console.log(
      chalk.yellow(
        `[${part} ${chalk.underline("WARN")} ${new Date().toLocaleTimeString()}}]: ${message}`,
      ),
    );
  }
  public error(part: string, message: string) {
    console.log(
      chalk.red(
        `[${part} ${chalk.bold.underline("ERROR")} ${new Date().toLocaleTimeString()}()}]: ${message}`,
      ),
    );
  }
}
