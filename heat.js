let URL =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

document.addEventListener('DOMContentLoaded', () => {
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      //Extract data into Variables
      const year = data.monthlyVariance.map((d) => d.year);
      const month = data.monthlyVariance.map((d) => d.month);
      const variance = data.monthlyVariance.map((d) => d.variance);
    });
});
