let gui;

let arr = [...Array(126).keys()]; // array with shape [order (int), [r, g, b]]
let curr = 0; // number of elements sorted
let colors = [
  [255, 138, 128],
  [161, 136, 127],
  [234, 128, 252],
  [121, 134, 203],
  [100, 181, 246],
  [77, 182, 172],
  [132, 255, 255],
  [251, 192, 45],
  [233, 30, 99]
]; // color buckets for arr values
let xdist = 7; // length of each individual segment
let dist = 1; // y-dist between paths
let yShift = 0; // distance of graph from top
let xShift = 0; // distance of graph to right
let totalWidth = 0; // total width of the graph
let totalHeight = 0; // total height of graph
let moveDown = 1.5; // move lines down
let testArr = [...Array(64).keys()]; // arr for testing
let thickness = 1.4; // line thickness
let history = new Object(); // dictionary that maps integer to index values over time

let insertion = false; // flag to turn on insertion sort vis
let selection = false; // flag to turn on selection sort vis
let bubble = true; // flag to turn on bubble sort vis
let pancake = false; // flag to turn on pancake sort vis
let cocktail = false; // flag to turn on cocktail sort vis

let curve = false; // visualize move as curve
let worstCase = false; // enable worst case starting list

let n = arr.length; // pancake sort value for arr index
let start = 0; // cocktail sort var
let end = arr.length - 1; // cocktail sort var

function setup() {
  createCanvas(windowWidth, windowHeight);
  gui = new guify({
    title: "Sorting Visualization",
    theme: 'dark', // dark, light, yorha, or theme object
    align: 'right', // left, right
    width: 300,
    barMode: 'none', // none, overlay, above, offset
    panelMode: 'inner',
    opacity: 0.95,
    open: true
  });

  gui.Register({
    type: 'folder',
    label: 'Sorting Algorithms',
    open: false
  });

  gui.Register([{
    type: 'button',
    label: 'Insertion Sort',
    action: () => {
      initialize();
      resetSorts();
      insertion = true;
    }
  }, {
    type: 'button',
    label: 'Selection Sort',
    action: () => {
      initialize();
      resetSorts();
      selection = true;
    }
  }, {
    type: 'button',
    label: 'Bubble Sort',
    action: () => {
      initialize();
      resetSorts();
      bubble = true;
    }
  }, {
    type: 'button',
    label: 'Cocktail Sort',
    action: () => {
      initialize();
      resetSorts();
      cocktail = true;
    }
  }, {
    type: 'button',
    label: 'Pancake Sort',
    action: () => {
      initialize();
      resetSorts();
      pancake = true;
    }
  }], {
    folder: "Sorting Algorithms"
  });

  gui.Register([{
    type: 'checkbox',
    label: 'curve',
    object: this,
    onChange: (data) => {
        curve = data;
    }
  },
  {
    type: 'checkbox',
    label: 'flip',
    object: this,
    onChange: (data) => {
        worstCase = data;
    }
  },
  {
    type: 'button',
    label: 'Reset',
    action: () => {
      initialize();
    }
  }]);
  // TODO: Compute approximate number of iterations required.
  colors = shuffle(colors);
  testArr = shuffle(testArr);
  let rangev = arr.length / colors.length;
  xdist = windowWidth / (arr.length * 1.2);
  for (let i = 0; i < arr.length; i++) {
    if (i <= rangev) {
      arr[i] = [arr[i], colors[0]];
    } else if (i <= rangev * 2 && i > rangev) {
      arr[i] = [arr[i], colors[1]];
    } else if (i <= rangev * 3 && i > rangev * 2) {
      arr[i] = [arr[i], colors[2]];
    } else if (i <= rangev * 4 && i > rangev * 3) {
      arr[i] = [arr[i], colors[3]];
    } else if (i <= rangev * 5 && i > rangev * 4) {
      arr[i] = [arr[i], colors[4]];
    } else if (i <= rangev * 6 && i > rangev * 5) {
      arr[i] = [arr[i], colors[5]];
    } else if (i <= rangev * 7 && i > rangev * 6) {
      arr[i] = [arr[i], colors[6]];
    } else if (i <= rangev * 8 && i > rangev * 7) {
      arr[i] = [arr[i], colors[7]];
    } else {
      arr[i] = [arr[i], colors[8]];
    }
  }
  if (worstCase) {
    arr = arr.reverse();
  } else {
    arr = shuffle(arr);
  }
  background(255, 243, 224);
  dist = ((windowHeight / 1.5) / arr.length) * 1.4;
  totalWidth = arr.length * xdist;
  xShift = (windowWidth - totalWidth) / 2;
  totalHeight = arr.length * dist;
  yShift = (windowHeight - totalHeight) / 2;
  moveDown = thickness - .6;
  for (let i = 0; i < arr.length; i++) {
    history[arr[i][0]] = new Object();
    history[arr[i][0]]["color"] = arr[i][1];
    history[arr[i][0]]["path"] = [i];
  }
}

function draw() {
  console.log(curve);
  if (curr < arr.length) {
    if (selection) {
      arr, min_idx = selectionSort(arr, curr);
    } else if (insertion) {
      arr, min_idx = insertionSort(arr, curr);
    } else if (bubble) {
      arr = bubbleSort(arr);
    } else if (pancake) {
      arr, n = pancakeSort(arr, n);
    } else if (cocktail) {
      arr, start, end = cocktailSort(arr, curr, start, end);
    }
    for (let i = 0; i < arr.length; i++) {
      history[arr[i][0]]["path"].push(i);
    }
    renderHistory(curr);
  }
  curr += 1;
}

function renderHistory(curr) {
  for (let i = 0; i < arr.length; i++) {
    let path = history[i]["path"];
  let color = history[i]["color"];
  for (let j = curr; j < path.length; j++) {
    if (path[j] != path[j-1] && j > 0) {
      let prev = path[j-1];
      let curr = path[j];
      let h = abs(prev - curr); // diff between indices
      let right = xShift + xdist * (j + 2 * h / 30);
      let left = xShift + xdist * (j - 3 * h / 30);
      let righty = dist * (min(prev, curr) + h/100) + yShift;
      let lefty = dist * (max(prev, curr) - h/100) + yShift;
      let p1 = [xShift + xdist * (j), dist * prev + yShift + moveDown];
      let p2 = [right, righty + moveDown];
      let p3 = [left, lefty + moveDown];
      let p4 = [xShift + xdist * (j+1), dist * path[j] + yShift + moveDown];
      if (curve) {
        if (prev > curr) {
          p2 = [right, lefty + moveDown];
          p3 = [left, righty + moveDown];
        }
        stroke(color[0], color[1], color[2]);
        strokeWeight(thickness);
        noFill();
        bezier(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1], p4[0], p4[1]);
      } else {
        stroke(color[0], color[1], color[2]);
        strokeWeight(thickness);
        line(p1[0], p1[1], p4[0], p4[1]);
      }
    } else {
      fill(color[0], color[1], color[2]);
      noStroke();
      rect(xShift + xdist * j, dist * path[j] + yShift, xdist, thickness);
    }
  }
  }
}

// ---------------------------------------------
// SELECTION SORT
// ---------------------------------------------
function selectionSort(arr, numSorted) {
  let min_val = 999;
  let min_idx = 0;
  for (let i = numSorted; i < arr.length; i++) {
    if (arr[i][0] < min_val) {
      min_val = arr[i][0];
      min_idx = i;
    }
  }
  let min_idx_color = arr[min_idx][1];
  arr[min_idx] = arr[numSorted];
  arr[numSorted] = [min_val, min_idx_color];
  return arr, min_idx;
}

// ---------------------------------------------
// INSERTION SORT
// ---------------------------------------------
function insertionSort(arr, numSorted) {
  let j = numSorted;
  while (j > 0 && arr[j-1][0] > arr[j][0]) {
    [arr[j], arr[j-1]] = [arr[j-1], arr[j]];
    j = j - 1;
  }
  return (arr, j);
}

// ---------------------------------------------
// BUBBLE SORT
// ---------------------------------------------
function bubbleSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i][0] > arr[i+1][0]) {
      [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
    }
  }
  return arr;
}

// ---------------------------------------------
// PANCAKE SORT
// ---------------------------------------------
function pancakeSort(arr, n) {
  let mi = findMax(arr, n);
  if (mi != n-1) {
    flip(arr, mi);
    flip(arr, n-1);
  }
  n -= 1;
  return arr, n;
}

// ---------------------------------------------
// COCKTAIL SORT
// ---------------------------------------------
function cocktailSort(arr, n, start, end) {
  if (n % 2 == 0) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i][0] > arr[i+1][0]) {
        [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
      }
    }
    return arr, end - 1, start;
  } else {
    for (let i = arr.length; i < 0; i--) {
      if (arr[i][0] > arr[i+1][0]) {
        [arr[i], arr[i+1]] = [arr[i+1], arr[i]];
      }
    }
    return arr, end, start + 1; 
  }
}

// UTILITY FUNCTIONS

// flip array from 0 to i
function flip(arr, i) {
  let start = 0;
  while (start < i) {
    [arr[start], arr[i]] = [arr[i], arr[start]];
    start += 1;
    i -= 1;
  }
}

// returns index of max element in arr[0:n]
function findMax(arr, n) {
  let mi, i;
  for (mi = 0, i = 0; i < n; i++) {
    if (arr[i][0] > arr[mi][0]) {
      mi = i;
    }
  }
  return mi;
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function initialize() {
  arr = [...Array(126).keys()]; // array with shape [order (int), [r, g, b]]
  curr = 0; // number of elements sorted
  colors = [
    [255, 138, 128],
    [161, 136, 127],
    [234, 128, 252],
    [121, 134, 203],
    [100, 181, 246],
    [77, 182, 172],
    [132, 255, 255],
    [251, 192, 45],
    [233, 30, 99]
  ]; // color buckets for arr values
  xdist = 7; // length of each individual segment
  dist = 1; // y-dist between paths
  yShift = 0; // distance of graph from top
  xShift = 0; // distance of graph to right
  totalWidth = 0; // total width of the graph
  totalHeight = 0; // total height of graph
  moveDown = 1.5; // move lines down
  testArr = [...Array(64).keys()]; // arr for testing
  thickness = 1.4; // line thickness
  history = new Object(); // dictionary that maps integer to index values over time

  n = arr.length; // pancake sort value for arr index
  start = 0; // cocktail sort var
  end = arr.length - 1; // cocktail sort var
  colors = shuffle(colors);
  testArr = shuffle(testArr);
  let rangev = arr.length / colors.length;
  xdist = windowWidth / (arr.length * 1.2);
  for (let i = 0; i < arr.length; i++) {
    if (i <= rangev) {
      arr[i] = [arr[i], colors[0]];
    } else if (i <= rangev * 2 && i > rangev) {
      arr[i] = [arr[i], colors[1]];
    } else if (i <= rangev * 3 && i > rangev * 2) {
      arr[i] = [arr[i], colors[2]];
    } else if (i <= rangev * 4 && i > rangev * 3) {
      arr[i] = [arr[i], colors[3]];
    } else if (i <= rangev * 5 && i > rangev * 4) {
      arr[i] = [arr[i], colors[4]];
    } else if (i <= rangev * 6 && i > rangev * 5) {
      arr[i] = [arr[i], colors[5]];
    } else if (i <= rangev * 7 && i > rangev * 6) {
      arr[i] = [arr[i], colors[6]];
    } else if (i <= rangev * 8 && i > rangev * 7) {
      arr[i] = [arr[i], colors[7]];
    } else {
      arr[i] = [arr[i], colors[8]];
    }
  }
  if (worstCase) {
    arr = arr.reverse();
  } else {
    arr = shuffle(arr);
  }
  background(255, 243, 224);
  dist = ((windowHeight / 1.5) / arr.length) * 1.4;
  totalWidth = arr.length * xdist;
  xShift = (windowWidth - totalWidth) / 2;
  totalHeight = arr.length * dist;
  yShift = (windowHeight - totalHeight) / 2;
  moveDown = thickness - .6;
  for (let i = 0; i < arr.length; i++) {
    history[arr[i][0]] = new Object();
    history[arr[i][0]]["color"] = arr[i][1];
    history[arr[i][0]]["path"] = [i];
  }
}

function resetSorts() {
  pancake = false;
  insertion = false;
  selection = false;
  bubble = false;
  cocktail = false;
}