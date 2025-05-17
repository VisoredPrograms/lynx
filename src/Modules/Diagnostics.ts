import { styleText } from 'node:util';

// Define ForegroundColors type alias explicitly
type ForegroundColors =
  | 'black'
  | 'blackBright'
  | 'blue'
  | 'blueBright'
  | 'cyan'
  | 'cyanBright'
  | 'gray'
  | 'green'
  | 'greenBright'
  | 'grey'
  | 'magenta'
  | 'magentaBright'
  | 'red'
  | 'redBright'
  | 'white'
  | 'whiteBright'
  | 'yellow'
  | 'yellowBright';

// Log style configuration type
type LogStyle = {
  prefix: string;
  color: ForegroundColors;
  method: (...args: any[]) => void;
};

// Print a styled log message with a symbol prefix
export function log(type: 'info' | 'warn' | 'error', message: string): void {
  const styles: Record<'info' | 'warn' | 'error', LogStyle> = {
    info: { prefix: '(!)', color: 'blue', method: console.log },
    warn: { prefix: '(!)', color: 'yellow', method: console.warn },
    error: { prefix: '(!!)', color: 'red', method: console.error },
  };

  const style = styles[type];
  style.method(`${style.prefix} ${styleText(style.color, message)}`);
}
