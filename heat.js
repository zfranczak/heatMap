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

      let colorsArray = [
        {
          varianceThreshold: 1,
          color: '#076469',
        },
        {
          varianceThreshold: 2,
          color: '#179399',
        },
        {
          varianceThreshold: 3,
          color: '#58b9c7',
        },
        {
          varianceThreshold: 4,
          color: '#afe5ed',
        },
        {
          varianceThreshold: 5,
          color: '#f0df81',
        },
        {
          varianceThreshold: 6,
          color: '#f2b957',
        },
        {
          varianceThreshold: 7,
          color: '#eb8723',
        },
        {
          varianceThreshold: 8,
          color: '#fa5534',
        },
        {
          varianceThreshold: 9,
          color: '#fc2828',
        },
      ];

      const svg = d3
        .select('body')
        .append('svg')
        .attr('width', 500)
        .attr('height', 200);

      const rectWidth = 50;
      const rectHeight = 20;
      const rectPadding = 5;

      svg
        .selectAll('rect')
        .data(colorsArray)
        .enter()
        .append('rect')
        .attr('class', 'colorLegend')
        .attr('x', (d, i) => i * (rectWidth + rectPadding))
        .attr('y', 50)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .style('fill', (d) => d.color);
    });
});
