let URL =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

document.addEventListener('DOMContentLoaded', () => {
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      //Extract data into Variables
      const year = data.monthlyVariance.map((d) => d.year);
      const yearDomain = d3.extent(year);

      const month = data.monthlyVariance.map((d) => d.month);
      const monthDomain = d3.extent(month);

      const variance = data.monthlyVariance.map((d) => d.variance);
      const varianceDomain = d3.extent(variance);

      console.log('Year Domain: ', yearDomain);
      console.log('Month Domain: ', monthDomain);
      console.log('Variance Domain: ', varianceDomain);

      //SVG Variables
      const h = 1000;
      const w = 500;
      const strokeColor = 'black';

      //Set colors for heat map
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
        .attr('width', h)
        .attr('height', w);

      svg
        .append('rect')
        .attr('class', 'background')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('fill', ' #E5E2E0')
        .attr('stroke', strokeColor);

      //Legend
      const rectWidth = 50;
      const rectHeight = 20;
      const rectPadding = 0;

      svg
        .selectAll('.colorLegend')
        .data(colorsArray)
        .enter()
        .append('rect')
        .attr('class', 'colorLegend')
        .attr('x', (d, i) => i * (rectWidth + rectPadding))
        .attr('y', w - 50)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('stroke', strokeColor)
        .style('fill', (d) => d.color);
    });
});
