// From: https://github.com/Casturan/proper-promise-race.js
// USAGE: properRace = require('promiseProperRace.js')

function properRace(promises, count = 1, results = []) {
  promises = Array.from(promises);
  if (promises.length < count) {
    return Promise.reject('Race is not finishable or all promises rejected.');
  }
   
  let indexPromises = promises.map((p, index) => p.then(() => index, () => {throw index;}));
   
  return Promise.race(indexPromises).then(index => {
    let p = promises.splice(index, 1)[0];
    p.then(v => results.push(v));
    if (count === 1) {
      return results;
    }
    return properRace(promises, count-1, results);
  }, index => {
    promises.splice(index, 1);
    return properRace(promises, count, results);
  });
}

export default properRace