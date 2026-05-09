// Simple A* Pathfinding implementation for a grid

class Node {
  constructor(x, y, isWall) {
    this.x = x;
    this.y = y;
    this.isWall = isWall;
    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.parent = null;
  }
}

export const aStar = (gridSizeX, gridSizeY, startCoords, targetCoords, obstacles) => {
  // Initialize grid
  let grid = new Array(gridSizeX);
  for (let i = 0; i < gridSizeX; i++) {
    grid[i] = new Array(gridSizeY);
    for (let j = 0; j < gridSizeY; j++) {
      grid[i][j] = new Node(i, j, false);
    }
  }

  // Set obstacles
  obstacles.forEach(obs => {
    if (obs.x < gridSizeX && obs.y < gridSizeY) {
      grid[obs.x][obs.y].isWall = true;
    }
  });

  const start = grid[startCoords.x][startCoords.y];
  const target = grid[targetCoords.x][targetCoords.y];
  
  // A spot might be an obstacle but if it's the target, we must temporarily make it not a wall to reach it
  const targetWasWall = target.isWall;
  target.isWall = false;

  let openSet = [start];
  let closedSet = [];
  let path = [];
  let visitedNodes = []; // For visualization

  while (openSet.length > 0) {
    // Find node with lowest f cost
    let lowestIndex = 0;
    for (let i = 0; i < openSet.length; i++) {
      if (openSet[i].f < openSet[lowestIndex].f) {
        lowestIndex = i;
      }
    }
    
    let current = openSet[lowestIndex];
    visitedNodes.push({x: current.x, y: current.y});

    // If reached target
    if (current === target) {
      let temp = current;
      path.push({x: temp.x, y: temp.y});
      while (temp.parent) {
        path.push({x: temp.parent.x, y: temp.parent.y});
        temp = temp.parent;
      }
      
      // Restore wall state
      if (targetWasWall) target.isWall = true;
      
      return { path: path.reverse(), visitedNodes };
    }

    // Move current from open to closed
    openSet.splice(lowestIndex, 1);
    closedSet.push(current);

    // Get neighbors
    let neighbors = [];
    const {x, y} = current;
    
    if (x > 0) neighbors.push(grid[x - 1][y]); // Left
    if (x < gridSizeX - 1) neighbors.push(grid[x + 1][y]); // Right
    if (y > 0) neighbors.push(grid[x][y - 1]); // Up
    if (y < gridSizeY - 1) neighbors.push(grid[x][y + 1]); // Down

    for (let i = 0; i < neighbors.length; i++) {
      let neighbor = neighbors[i];
      
      if (!closedSet.includes(neighbor) && !neighbor.isWall) {
        let tempG = current.g + 1; // distance between neighbors is 1
        
        let newPath = false;
        if (openSet.includes(neighbor)) {
          if (tempG < neighbor.g) {
            neighbor.g = tempG;
            newPath = true;
          }
        } else {
          neighbor.g = tempG;
          newPath = true;
          openSet.push(neighbor);
        }

        if (newPath) {
          // Heuristic (Manhattan distance)
          neighbor.h = Math.abs(neighbor.x - target.x) + Math.abs(neighbor.y - target.y);
          neighbor.f = neighbor.g + neighbor.h;
          neighbor.parent = current;
        }
      }
    }
  }

  // Restore wall state
  if (targetWasWall) target.isWall = true;

  // No path found
  return { path: [], visitedNodes };
};
