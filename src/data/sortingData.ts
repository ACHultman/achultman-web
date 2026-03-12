export interface SortStep {
  array: number[];
  comparing: [number, number] | null;
  swapping: [number, number] | null;
  sorted: number[];
  pivot?: number;
  description: string;
}

export interface SortAlgorithm {
  name: string;
  complexity: { best: string; average: string; worst: string; space: string };
  description: string;
  color: string;
}

export const ALGORITHMS: Record<string, SortAlgorithm> = {
  bubbleSort: {
    name: 'Bubble Sort',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    description: 'Repeatedly swaps adjacent elements if they are in the wrong order.',
    color: 'red',
  },
  selectionSort: {
    name: 'Selection Sort',
    complexity: { best: 'O(n²)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    description: 'Finds the minimum element and places it at the beginning.',
    color: 'orange',
  },
  insertionSort: {
    name: 'Insertion Sort',
    complexity: { best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    description: 'Builds sorted array one element at a time by inserting into correct position.',
    color: 'yellow',
  },
  mergeSort: {
    name: 'Merge Sort',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)',
    },
    description: 'Divides array in half, recursively sorts, then merges.',
    color: 'green',
  },
  quickSort: {
    name: 'Quick Sort',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(log n)',
    },
    description: 'Picks a pivot and partitions elements around it.',
    color: 'blue',
  },
  heapSort: {
    name: 'Heap Sort',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(1)',
    },
    description: 'Builds a max-heap and repeatedly extracts the maximum.',
    color: 'purple',
  },
};

function snapshot(
  arr: number[],
  comparing: [number, number] | null,
  swapping: [number, number] | null,
  sorted: number[],
  description: string,
  pivot?: number
): SortStep {
  return {
    array: [...arr],
    comparing,
    swapping,
    sorted: [...sorted],
    ...(pivot !== undefined && { pivot }),
    description,
  };
}

export function generateBubbleSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const n = arr.length;
  const sorted: number[] = [];

  steps.push(snapshot(arr, null, null, sorted, 'Starting Bubble Sort'));

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      steps.push(snapshot(arr, [j, j + 1], null, sorted, `Comparing ${arr[j]} and ${arr[j + 1]}`));
      if (arr[j]! > arr[j + 1]!) {
        [arr[j], arr[j + 1]] = [arr[j + 1]!, arr[j]!];
        steps.push(
          snapshot(arr, null, [j, j + 1], sorted, `Swapping ${arr[j + 1]} and ${arr[j]}`)
        );
        swapped = true;
      }
    }
    sorted.push(n - 1 - i);
    steps.push(
      snapshot(arr, null, null, sorted, `Element ${arr[n - 1 - i]} is now in final position`)
    );
    if (!swapped) break;
  }

  for (let i = 0; i < n; i++) {
    if (!sorted.includes(i)) sorted.push(i);
  }
  steps.push(snapshot(arr, null, null, sorted, 'Bubble Sort complete!'));
  return steps;
}

export function generateSelectionSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const n = arr.length;
  const sorted: number[] = [];

  steps.push(snapshot(arr, null, null, sorted, 'Starting Selection Sort'));

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push(snapshot(arr, null, null, sorted, `Looking for minimum starting at index ${i}`));

    for (let j = i + 1; j < n; j++) {
      steps.push(
        snapshot(arr, [minIdx, j], null, sorted, `Comparing ${arr[minIdx]} and ${arr[j]}`)
      );
      if (arr[j]! < arr[minIdx]!) {
        minIdx = j;
        steps.push(snapshot(arr, [minIdx, j], null, sorted, `New minimum found: ${arr[minIdx]}`));
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx]!, arr[i]!];
      steps.push(
        snapshot(arr, null, [i, minIdx], sorted, `Swapping ${arr[minIdx]} to position ${i}`)
      );
    }
    sorted.push(i);
    steps.push(snapshot(arr, null, null, sorted, `${arr[i]} is now in final position`));
  }

  sorted.push(n - 1);
  steps.push(snapshot(arr, null, null, sorted, 'Selection Sort complete!'));
  return steps;
}

export function generateInsertionSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const n = arr.length;
  const sorted: number[] = [0];

  steps.push(snapshot(arr, null, null, sorted, 'Starting Insertion Sort'));

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;
    steps.push(snapshot(arr, [i, j], null, sorted, `Inserting ${key} into sorted portion`));

    while (j >= 0 && arr[j]! > key!) {
      steps.push(snapshot(arr, [j, j + 1], null, sorted, `Comparing ${arr[j]} and ${key}`));
      arr[j + 1] = arr[j]!;
      steps.push(
        snapshot(arr, null, [j, j + 1], sorted, `Shifting ${arr[j]} right`)
      );
      j--;
    }
    arr[j + 1] = key!;

    sorted.length = 0;
    for (let k = 0; k <= i; k++) sorted.push(k);
    steps.push(snapshot(arr, null, null, sorted, `${key} inserted at position ${j + 1}`));
  }

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(snapshot(arr, null, null, allSorted, 'Insertion Sort complete!'));
  return steps;
}

export function generateMergeSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const n = arr.length;
  const finalSorted: number[] = [];

  steps.push(snapshot(arr, null, null, [], 'Starting Merge Sort'));

  function mergeSort(start: number, end: number): void {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    steps.push(
      snapshot(arr, [start, end], null, finalSorted, `Dividing [${start}..${end}] at mid=${mid}`)
    );

    mergeSort(start, mid);
    mergeSort(mid + 1, end);

    const left = arr.slice(start, mid + 1);
    const right = arr.slice(mid + 1, end + 1);
    let i = 0;
    let j = 0;
    let k = start;

    while (i < left.length && j < right.length) {
      steps.push(
        snapshot(
          arr,
          [start + i, mid + 1 + j],
          null,
          finalSorted,
          `Merging: comparing ${left[i]} and ${right[j]}`
        )
      );
      if (left[i]! <= right[j]!) {
        arr[k] = left[i]!;
        i++;
      } else {
        arr[k] = right[j]!;
        j++;
      }
      steps.push(
        snapshot(arr, null, [k, k], finalSorted, `Placed ${arr[k]} at position ${k}`)
      );
      k++;
    }

    while (i < left.length) {
      arr[k] = left[i]!;
      steps.push(
        snapshot(arr, null, [k, k], finalSorted, `Placed remaining ${arr[k]} at position ${k}`)
      );
      i++;
      k++;
    }

    while (j < right.length) {
      arr[k] = right[j]!;
      steps.push(
        snapshot(arr, null, [k, k], finalSorted, `Placed remaining ${arr[k]} at position ${k}`)
      );
      j++;
      k++;
    }

    if (start === 0 && end === n - 1) {
      for (let idx = start; idx <= end; idx++) {
        if (!finalSorted.includes(idx)) finalSorted.push(idx);
      }
    }

    steps.push(
      snapshot(arr, null, null, finalSorted, `Merged subarray [${start}..${end}]`)
    );
  }

  mergeSort(0, n - 1);

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(snapshot(arr, null, null, allSorted, 'Merge Sort complete!'));
  return steps;
}

export function generateQuickSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const n = arr.length;
  const finalSorted: number[] = [];

  steps.push(snapshot(arr, null, null, [], 'Starting Quick Sort'));

  function quickSort(low: number, high: number): void {
    if (low >= high) {
      if (low === high && !finalSorted.includes(low)) {
        finalSorted.push(low);
        steps.push(
          snapshot(arr, null, null, finalSorted, `Element ${arr[low]} is in final position`)
        );
      }
      return;
    }

    const pivotVal = arr[high];
    steps.push(
      snapshot(
        arr,
        null,
        null,
        finalSorted,
        `Partitioning [${low}..${high}], pivot = ${pivotVal}`,
        high
      )
    );

    let i = low - 1;
    for (let j = low; j < high; j++) {
      steps.push(
        snapshot(
          arr,
          [j, high],
          null,
          finalSorted,
          `Comparing ${arr[j]} with pivot ${pivotVal}`,
          high
        )
      );
      if (arr[j]! < pivotVal!) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j]!, arr[i]!];
          steps.push(
            snapshot(
              arr,
              null,
              [i, j],
              finalSorted,
              `Swapping ${arr[j]} and ${arr[i]}`,
              high
            )
          );
        }
      }
    }

    const pivotPos = i + 1;
    if (pivotPos !== high) {
      [arr[pivotPos], arr[high]] = [arr[high]!, arr[pivotPos]!];
      steps.push(
        snapshot(
          arr,
          null,
          [pivotPos, high],
          finalSorted,
          `Placing pivot ${pivotVal} at position ${pivotPos}`,
          pivotPos
        )
      );
    }

    finalSorted.push(pivotPos);
    steps.push(
      snapshot(
        arr,
        null,
        null,
        finalSorted,
        `Pivot ${pivotVal} is now in final position ${pivotPos}`,
        pivotPos
      )
    );

    quickSort(low, pivotPos - 1);
    quickSort(pivotPos + 1, high);
  }

  quickSort(0, n - 1);

  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(snapshot(arr, null, null, allSorted, 'Quick Sort complete!'));
  return steps;
}

export function generateHeapSortSteps(input: number[]): SortStep[] {
  const arr = [...input];
  const steps: SortStep[] = [];
  const n = arr.length;
  const finalSorted: number[] = [];

  steps.push(snapshot(arr, null, null, [], 'Starting Heap Sort'));

  function heapify(size: number, root: number): void {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      steps.push(
        snapshot(arr, [largest, left], null, finalSorted, `Comparing ${arr[largest]} and ${arr[left]}`)
      );
      if (arr[left]! > arr[largest]!) largest = left;
    }

    if (right < size) {
      steps.push(
        snapshot(
          arr,
          [largest, right],
          null,
          finalSorted,
          `Comparing ${arr[largest]} and ${arr[right]}`
        )
      );
      if (arr[right]! > arr[largest]!) largest = right;
    }

    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest]!, arr[root]!];
      steps.push(
        snapshot(
          arr,
          null,
          [root, largest],
          finalSorted,
          `Swapping ${arr[largest]} and ${arr[root]}`
        )
      );
      heapify(size, largest);
    }
  }

  // Build max heap
  steps.push(snapshot(arr, null, null, finalSorted, 'Building max heap'));
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }
  steps.push(snapshot(arr, null, null, finalSorted, 'Max heap built'));

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i]!, arr[0]!];
    steps.push(
      snapshot(
        arr,
        null,
        [0, i],
        finalSorted,
        `Moving max ${arr[i]} to position ${i}`
      )
    );
    finalSorted.push(i);
    steps.push(
      snapshot(arr, null, null, finalSorted, `${arr[i]} is in final position`)
    );
    heapify(i, 0);
  }

  finalSorted.push(0);
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push(snapshot(arr, null, null, allSorted, 'Heap Sort complete!'));
  return steps;
}

export function generateRandomArray(size: number): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 96) + 5);
}

export const ARRAY_PRESETS: { name: string; array: number[] }[] = [
  { name: 'Random 20', array: generateRandomArray(20) },
  {
    name: 'Nearly Sorted',
    array: [5, 10, 15, 20, 18, 25, 30, 35, 33, 40, 45, 50, 48, 55, 60, 65, 63, 70, 75, 80],
  },
  {
    name: 'Reversed',
    array: [100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50, 45, 40, 35, 30, 25, 20, 15, 10, 5],
  },
  {
    name: 'Few Unique',
    array: [10, 30, 10, 50, 30, 10, 50, 30, 10, 50, 30, 10, 50, 30, 10, 30, 50, 10, 30, 50],
  },
];
