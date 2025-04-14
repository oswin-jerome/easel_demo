interface ElementDimensions {
  width: number; // in columns (1-3)
  height: number; // in rows (flexible)
  x: number; // column position (0-2)
  y: number; // row position
}

interface NewElement {
  width: number; // original width (px)
  height: number; // original height (px)
}

interface PlacementResult {
  x: number; // column position (0-2)
  y: number; // row position
  width: number; // in columns (1-3)
  height: number; // in rows
  pixelWidth: number; // actual pixel width
  pixelHeight: number; // actual pixel height
}

export function calculateNewElementPosition(existingElements: ElementDimensions[], newElement: NewElement, maxCanvasWidth: number, gridGap: number = 10): PlacementResult {
  // Calculate column width
  const columnWidth = (maxCanvasWidth - 2 * gridGap) / 3;

  // Determine how many columns the element should span (1-3)
  const desiredColumns = Math.min(3, Math.max(1, Math.ceil(newElement.width / columnWidth)));

  // Calculate aspect ratio
  const aspectRatio = newElement.height / newElement.width;

  // Calculate pixel dimensions that fit the column width
  const pixelWidth = desiredColumns * columnWidth + (desiredColumns - 1) * gridGap;
  const pixelHeight = pixelWidth * aspectRatio;

  // Convert height to grid rows (approximate)
  const rowHeight = columnWidth; // Assuming square rows for calculation
  const rowSpan = Math.max(1, Math.round(pixelHeight / rowHeight));

  // Find first available position
  for (let y = 0; ; y++) {
    for (let x = 0; x <= 3 - desiredColumns; x++) {
      if (isPositionAvailable(existingElements, x, y, desiredColumns, rowSpan)) {
        return {
          x,
          y,
          width: desiredColumns,
          height: rowSpan,
          pixelWidth,
          pixelHeight,
        };
      }
    }
  }
}

function isPositionAvailable(elements: ElementDimensions[], x: number, y: number, width: number, height: number): boolean {
  for (const el of elements) {
    if (x < el.x + el.width && x + width > el.x && y < el.y + el.height && y + height > el.y) {
      return false;
    }
  }
  return true;
}

// Example usage:
const existingElements: ElementDimensions[] = [
  { width: 2, height: 2, x: 0, y: 0 }, // Occupies columns 0-1, rows 0-1
  { width: 1, height: 1, x: 2, y: 0 }, // Occupies column 2, row 0
];

const newElement = { width: 500, height: 300 };
const maxCanvasWidth = 1200;

const placement = calculateNewElementPosition(existingElements, newElement, maxCanvasWidth);
console.log(placement);
/* Example output:
{
  x: 0,
  y: 2,
  width: 2,
  height: 1,
  pixelWidth: 793.33,  // (2 columns + 1 gap)
  pixelHeight: 476     // maintains 300/500 aspect ratio
}
*/
