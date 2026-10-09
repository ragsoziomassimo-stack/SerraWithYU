// Logica pura del labirinto: generazione (backtracker ricorsivo) e ricerca di brevi percorsi.
export type Cell = { x: number; y: number };
export type Maze = boolean[][]; // true = pietra (percorribile), false = bosco

const DIRS: Cell[] = [
  { x: 1, y: 0 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: -1 },
];

export const sameCell = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y;

// `cells` = celle per lato; la griglia finale ha (2*cells+1) caselle per lato.
export function generateMaze(cells: number): Maze {
  const size = cells * 2 + 1;
  const maze: Maze = Array.from({ length: size }, () => Array<boolean>(size).fill(false));
  const stack: Cell[] = [{ x: 1, y: 1 }];
  maze[1][1] = true;
  while (stack.length > 0) {
    const cur = stack[stack.length - 1];
    const options = DIRS.map((d) => ({ x: cur.x + d.x * 2, y: cur.y + d.y * 2, d })).filter(
      (n) => n.x > 0 && n.y > 0 && n.x < size - 1 && n.y < size - 1 && !maze[n.y][n.x],
    );
    if (options.length === 0) {
      stack.pop();
      continue;
    }
    const pick = options[Math.floor(Math.random() * options.length)];
    maze[cur.y + pick.d.y][cur.x + pick.d.x] = true;
    maze[pick.y][pick.x] = true;
    stack.push({ x: pick.x, y: pick.y });
  }
  return maze;
}

// Percorso breve (max `maxLen` passi) tra due caselle di pietra; serve a seguire il dito se salta qualche casella.
export function shortRoute(maze: Maze, from: Cell, to: Cell, maxLen: number): Cell[] | null {
  if (!maze[to.y]?.[to.x]) return null;
  const queue: { cell: Cell; route: Cell[] }[] = [{ cell: from, route: [] }];
  const seen = new Set<string>([`${from.x},${from.y}`]);
  while (queue.length > 0) {
    const item = queue.shift();
    if (!item) break;
    if (sameCell(item.cell, to)) return item.route;
    if (item.route.length >= maxLen) continue;
    for (const d of DIRS) {
      const next = { x: item.cell.x + d.x, y: item.cell.y + d.y };
      const key = `${next.x},${next.y}`;
      if (!maze[next.y]?.[next.x] || seen.has(key)) continue;
      seen.add(key);
      queue.push({ cell: next, route: [...item.route, next] });
    }
  }
  return null;
}
