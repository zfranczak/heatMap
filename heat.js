let URL =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

document.addEventListener('DOMContentLoaded', () => {
  fetch(URL)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      //Extract data into Variables
      const year = data.monthlyVariance.map((d) => d.year);
      const yearDomain = d3.extent(year);

      data.monthlyVariance.forEach((d) => {
        d.month -= 1;
      });
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
      const h = 800;
      const w = 1800;
      const strokeColor = 'black';

      //Set colors for heat map
      let colorsArray = [
        {
          minTemp: 0,
          maxTemp: 3.81,
          color: '#076469',
        },
        {
          minTemp: 3.82,
          maxTemp: 5.01,
          color: '#179399',
        },
        {
          minTemp: 5.02,
          maxTemp: 6.11,
          color: '#58b9c7',
        },
        {
          minTemp: 6.12,
          maxTemp: 7.21,
          color: '#afe5ed',
        },
        {
          minTemp: 7.22,
          maxTemp: 8.41,
          color: '#f0df81',
        },
        {
          minTemp: 8.42,
          maxTemp: 9.51,
          color: '#f2b957',
        },
        {
          minTemp: 9.52,
          maxTemp: 10.61,
          color: '#eb8723',
        },
        {
          minTemp: 10.62,
          maxTemp: 11.81,
          color: '#fa5534',
        },
        {
          minTemp: 11.82,
          maxTemp: 14,
          color: '#fc2828',
        },
      ];

      //Months
      const monthArray = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      //Functions for binding Colors with Variance
      function colorFunc(variance) {
        let actualTemp = baseTemp + variance;
        actualTemp = actualTemp.toFixed(1);
        const colorObj = colorsArray.find(
          (color) => actualTemp >= color.minTemp && actualTemp < color.maxTemp
        );
        return colorObj ? colorObj.color : '#ffffff';
      }

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
        .attr('fill', '#E5E2E0')
        .attr('stroke', strokeColor);

      //add scale
      const xScale = d3
        .scaleLinear()
        .domain(yearDomain)
        .range([50, w - 100]);

      const yScale = d3
        .scaleLinear()
        .domain([-0.5, 11.5])
        .range([100, h - 100]);

      // Define custom tick values for each month
      const customTickValues = Array.from(Array(12).keys());

      //add axes
      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat(d3.format('d'))
        .tickSize(10, 1);

      const yAxis = d3
        .axisLeft()
        .scale(yScale)
        .tickValues(customTickValues)
        .tickFormat((month) => monthArray[month])
        .tickSize(10, 1);

      const tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .attr('id', 'tooltip')
        .style('opacity', 0);

      // Append Axis Containers to SVG
      const xAxisContainer = svg
        .append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(21, ${h - 100})`);
      const yAxisContainer = svg
        .append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(70, 0)`);

      // Call the axis functions
      xAxisContainer.attr('id', 'x-axis').call(xAxis);
      yAxisContainer.attr('id', 'y-axis').call(yAxis);

      //Add rectangles
      rectContainer = svg.append('g').attr('class', 'heatRect');
      // Join data to rectangles
      const heatRect = rectContainer
        .selectAll('.heatRect') // Select all rectangles in the container
        .data(data.monthlyVariance) // Bind data to rectangles
        .enter() // Enter selection
        .append('rect') // Append rectangle for each data point
        .attr('class', 'cell')
        .attr('x', (d) => xScale(d.year) + 21) // Set x position using the xScale
        .attr('y', (d) => yScale(d.month) - 25) // Set y position using the yScale
        .attr('width', 4)
        .attr('height', 50)
        .attr('data-year', (d) => d.year) // Set data-year attribute
        .attr('data-month', (d) => d.month) // Set data-month attribute
        .attr('data-temp', (d) => d.variance) // Set data-temp attribute
        .style('fill', (d) => colorFunc(d.variance));

      //add tooltips

      //Legend
      const rectWidth = 50;
      const rectHeight = 20;
      const rectPadding = 0;

      // Calculate the number of ticks to add between each value in legendDomain
      const numTicksBetween = 8;

      let extendedTicks = legendDomain.flatMap((d, i, arr) => {
        if (i < arr.length - 1) {
          const interval = (arr[i + 1] - d) / (numTicksBetween + 1);
          return d3
            .range(0, numTicksBetween + 1)
            .map((tick) => d + tick * interval);
        }
        return d;
      });

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
        ])
        .range([0, colorsArray.length * (rectWidth + rectPadding) + 88]);

      const legendXAxis = d3
        .axisBottom(legendXScale)
        .tickValues(extendedTicks) // Use extended ticks
        .tickFormat(d3.format('.1f')); // Format ticks to one decimal place

      // Append legend axis and rectangles as a group
      const legendGroup = svg
        .append('g')
        .attr('class', 'legend-group')
        .attr('transform', `translate(20, ${h - 50})`)
        .attr('id', 'legend');

      // Append legend axis
      const legendAxisGroup = legendGroup
        .append('g')
        .attr('class', 'legend-axis')
        .attr('transform', `translate(-1, 20)`);

      legendAxisGroup.call(legendXAxis);

      // Append legend rectangles
      const legendRects = legendGroup
        .selectAll('.colorLegend')
        .data(colorsArray)
        .enter()
        .append('rect')
        .attr('class', 'colorLegend')
        .attr('x', (d, i) => (i + 1) * (rectWidth + rectPadding) - 6)
        .attr('width', rectWidth)
        .attr('height', rectHeight)
        .attr('stroke', strokeColor)
        .style('fill', (d) => d.color);

      //Add Titles
      svg
        .append('text')
        .attr('id', 'title')
        .attr('x', w / 2)
        .attr('y', 30)
        .style('text-anchor', 'middle')
        .style('font-size', '30px')
        .text('Monthly Global Land-Surface Temperature');

      //Subtitle
      svg
        .append('text')
        .attr('id', 'description')
        .attr('x', w / 2)
        .attr('y', 60)
        .attr('text-anchor', 'middle')
        .style('font-size', '20px')
        .text('1753 - 2015: base temperature 8.66℃');

      // Attach event listeners to the rectangles to show/hide the tooltip
      heatRect
        .on('mouseover', (event, d) => {
          const actualTemp = parseFloat((baseTemp + d.variance).toFixed(1));
          const tooltipContent = `${d.year} - ${
            monthArray[d.month]
          } <br> Temp Change: ${actualTemp}°C <br> Variance: ${d.variance.toFixed(
            1
          )}°C`;
          const cellColor = colorFunc(d.variance);
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip
            .html(tooltipContent)
            .attr('data-year', d.year)
            .style('left', event.pageX + 10 + 'px')
            .style('top', event.pageY - 28 + 'px')
            .style('border-color', cellColor); // Set background color of the tooltip
        })
        .on('mouseout', () => {
          tooltip.transition().duration(500).style('opacity', 0);
        });
    });
});
