// Components
import Playground from './playground.vue';

function offset (el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + window.pageYOffset - document.documentElement.clientTop,
    left: rect.left + window.pageXOffset - document.documentElement.clientLeft
  };
}

function drawPath (startX: number, startY: number, endX: number, endY: number) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.style.fill = 'none';
  path.style.stroke = 'var(--madoc-grey-50)';
  path.style.strokeWidth = '3.5px';
  const arcWidth = 12;
  const arcHeight = Math.abs((endY - startY) / 5);
  if (endY >= startY) {
    path.setAttribute('d', [
      `M ${startX} ${startY}`,
      `h ${arcWidth}`,
      `c ${arcHeight} 0 ${arcHeight} ${arcHeight} ${arcHeight} ${arcHeight}`,
      `v ${((endY - startY)) - (arcHeight * 2)}`,
      `c 0 ${arcHeight} ${arcHeight} ${arcHeight} ${arcHeight} ${arcHeight}`,
      `h ${((endX - startX) - arcWidth - (endY === startY ? 0 : arcWidth))}`
    ].join(' '));
  } else {
    path.setAttribute('d', [
      `M ${startX} ${startY}`,
      `h ${(endX - startX) - (arcWidth * 3)}`,
      `c ${arcHeight} 0 ${arcHeight} ${-arcHeight} ${arcHeight} ${-arcHeight}`,
      `v ${(endY - startY) + (arcHeight * 2)}`,
      `c 0 ${-arcHeight} ${arcHeight} ${-arcHeight} ${arcHeight} ${-arcHeight}`,
      `h ${arcWidth}`
    ].join(' '));
  }
  return path;
}

export function connectElements (root: HTMLElement, el1: HTMLElement, el2: HTMLElement) {
  // Get SVG Root Container
  let svgElement = root.querySelector('svg.connections') as SVGSVGElement;
  if (!svgElement) {
    svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.classList.add('connections');
    svgElement.style.position = 'absolute';
    svgElement.style.inset = '0';
    svgElement.style.width = '100%';
    svgElement.style.height = '100%';
    svgElement.style.pointerEvents = 'none';
    root.appendChild(svgElement);
  }
  // Calculate Path Points
  const svgTop = offset(root).top;
  const svgLeft = offset(root).left;
  const startCoords = offset(el2);
  const endCoords = offset(el1);
  const startX = startCoords.left + (0.5 * el2.offsetWidth) - svgLeft;
  const startY = startCoords.top + (0.5 * el2.offsetHeight) - svgTop;
  const endX = endCoords.left + (0.5 * el1.offsetWidth) - svgLeft;
  const endY = endCoords.top + (0.5 * el2.offsetHeight) - svgTop;
  // Draw Path
  const path = drawPath(startX, startY, endX, endY);
  svgElement.appendChild(path);
}

export function disconnectElements (root: HTMLElement) {
  const svgElement = root.querySelector('svg.connections') as SVGSVGElement;
  if (svgElement) {
    root.removeChild(svgElement);
  }
}

function padLeft (str: string, char: string, count: number): string {
  return (Array(count).join(char) + str).slice(-count);
}

function getTimeStamp (date: Date): string {
  return `${padLeft(date.getHours().toString(), '0', 2)}:${padLeft(date.getMinutes().toString(), '0', 2)}:${padLeft(date.getSeconds().toString(), '0', 2)}`;
}

const c = {
  gray (str: string): string {
    return `\x1b[90m${str}\x1b[0m`;
  },
  cyan (str: string): string {
    return `\x1b[36m${str}\x1b[0m`;
  },
  yellow (str: string): string {
    return `\x1b[33m${str}\x1b[0m`;
  },
  red (str: string): string {
    return `\x1b[31m${str}\x1b[0m`;
  },
};

export const logger = {
  debug (msg: string): void {
    console.debug(`[${c.gray('DEBUG')}] ${c.gray(getTimeStamp(new Date()))} ${msg}`);
  },
  info (msg: string): void {
    console.info(`[${c.cyan('INFO')}] ${c.cyan(getTimeStamp(new Date()))} ${msg}`);
  },
  warn (msg: string): void {
    console.warn(`[${c.yellow('WARN')}] ${c.yellow(getTimeStamp(new Date()))} ${msg}`);
  },
  error (msg: string): void {
    console.error(`[${c.red('ERROR')}] ${c.red(getTimeStamp(new Date()))} ${msg}`);
  }
};

export interface Step {
  name: string;
  type: 'node'|'sequential'|'parallel';
  meta?: {
    state: 'in-progress'|'success'|'failure'|'unknown',
    duration: number;
    result: boolean;
  };
  children?: Step[];
}

export default [
  {
    components: [
      Playground
    ]
  }
];
