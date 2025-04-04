const MAX_WINDOW_SIZE = 10;
let numberWindow = [];

function insertNewNumbers(numbersToAdd) {
  if (!Array.isArray(numbersToAdd)) {
    throw new Error("Input must be an array");
  }
  const previousWindow = [...numberWindow];
  const inserted = [];

  for (const number of numbersToAdd) {
    if (typeof number !== 'number' || isNaN(number)) {
      continue; 
    }

    if (!numberWindow.includes(number)) {
      if (numberWindow.length >= MAX_WINDOW_SIZE) {
        numberWindow.shift();
      }
      numberWindow.push(number);
      inserted.push(number);
    }
  }
  return {
    oldWindow: previousWindow,
    currentWindow: [...numberWindow],
    newlyAdded: inserted,
    average: getAverage(numberWindow)
  };
}
function getAverage(list) {
  if (list.length === 0) return 0;
  const total = list.reduce((sum, val) => sum + val, 0);
  return parseFloat((total / list.length).toFixed(2));
}

module.exports = { insertNewNumbers };
