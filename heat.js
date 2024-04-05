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

      const baseTemp = data.baseTemperature;
      const legendDomain = [
        parseFloat((varianceDomain[0] + baseTemp).toFixed(1)) + 1,
        parseFloat((varianceDomain[1] + baseTemp).toFixed(1)) - 1,
      ];

      console.log('Base Temperature: ', legendDomain);
      console.log('Year Domain: ', yearDomain);
      console.log('Month Domain: ', monthDomain);
      console.log('Variance Domain: ', varianceDomain);

      //SVG Variables
      const h = 500;
      const w = 1000;
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
        .attr('width', w)
        .attr('height', h);

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

      // Calculate the number of ticks to add between each value in legendDomain
      const numTicksBetween = 8; // Adjust as needed

      let extendedTicks = legendDomain.flatMap((d, i, arr) => {
        if (i < arr.length - 1) {
          const interval = (arr[i + 1] - d) / (numTicksBetween + 1);
          return d3
            .range(0, numTicksBetween + 1)
            .map((tick) => d + tick * interval);
        }
        return d;
      });

      // Add a blank tick before and after
      extendedTicks = [
        legendDomain[0] - 1,
        ...extendedTicks,
        legendDomain[legendDomain.length - 1] + 1,
      ];

      // Create legend scale with extended ticks
      const legendXScale = d3
        .scaleLinear()
        .domain([
          legendDomain[0] - 1,
          legendDomain[legendDomain.length - 1] + 1,
        ]) // Include the blank ticks
        .range([0, colorsArray.length * (rectWidth + rectPadding) + 88]);

      const legendXAxis = d3
        .axisBottom(legendXScale)
        .tickValues(extendedTicks) // Use extended ticks
        .tickFormat(d3.format('.1f')); // Format ticks to one decimal place

      // Append legend axis and rectangles as a group
      const legendGroup = svg
        .append('g')
        .attr('class', 'legend-group')
        .attr('transform', `translate(20, ${h - 50})`); // Adjust the y-position as needed

      // Append legend axis
      const legendAxisGroup = legendGroup
        .append('g')
        .attr('class', 'legend-axis')
        .attr('transform', `translate(-1, 20)`); // Adjust the y-position of the axis within the group

      legendAxisGroup.call(legendXAxis);

      // Append legend rectangles
      const legendRects = legendGroup
        .selectAll('.colorLegend')
        .data(colorsArray)
        .enter()
        .append('rect')
        .attr('class', 'colorLegend')
        .attr('x', (d, i) => (i + 1) * (rectWidth + rectPadding) - 6) // Start from the second tick
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('stroke', strokeColor)
        .style('fill', (d) => d.color);
    });
});
