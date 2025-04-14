import { t } from "@excalidraw/excalidraw/i18n";

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
}

export function customGridLogic(existingElements: ElementDimensions[], newElement: NewElement, maxCanvasWidth: number, gridGap: number = 5): PlacementResult {
  let x = 0;
  let y = 0;
  let width = newElement.width;
  let height = newElement.height;
  let MAX = 1000;
  existingElements = sortBoxesLeftToRightTopToBottom(existingElements);

  const virtualGrid = new Map();

  if (existingElements.length > 0) {
    x = existingElements[0].x;
    MAX = MAX + existingElements[0].x;
  } else {
    height = getHeightForTargetWidth(width, height, 300);
    width = 300;
    return { x, y, width, height };
  }
  let imaginaryRow = 1;
  let imaginaryColumn = 1;
  let maxHeightSoFar = 0;
  existingElements.forEach((element) => {
    // Calculate start point
    virtualGrid.set(imaginaryRow + "," + imaginaryColumn, { width: element.width, height: element.height, x: element.x, y: element.y });
    imaginaryColumn++;
    let newX = element.x + element.width + gridGap;
    if (element.y + element.height > maxHeightSoFar) {
      maxHeightSoFar = element.height + element.y;
    }
    if (newX < MAX) {
      x = newX;
      y = element.y;
      return;
    } else {
      imaginaryRow++;
      imaginaryColumn = 1;
      x = existingElements[0].x;
      y = maxHeightSoFar + gridGap;
    }
  });

  if (imaginaryRow > 1) {
    const topElement = virtualGrid.get(imaginaryRow - 1 + "," + imaginaryColumn);
    if (topElement) y = topElement.y + topElement.height + gridGap;
  }

  height = getHeightForTargetWidth(width, height, 300);
  width = 300;

  return { x, y, width, height };
}

function getHeightForTargetWidth(originalWidth: number, originalHeight: number, targetWidth: number): number {
  const aspectRatio = originalHeight / originalWidth;
  const targetHeight = targetWidth * aspectRatio;
  return targetHeight;
}

function sortBoxesLeftToRightTopToBottom(boxes: ElementDimensions[]): ElementDimensions[] {
  return boxes.sort((a, b) => {
    // Consider a threshold to treat "same row" y values (if necessary)
    const rowThreshold = 3;

    if (Math.abs(a.y - b.y) > rowThreshold) {
      return a.y - b.y; // top to bottom
    } else {
      return a.x - b.x; // left to right within the same row
    }
  });
}
