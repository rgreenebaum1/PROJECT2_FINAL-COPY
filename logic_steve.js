// Define SVG area dimensions
var svgWidth = 5000;
var svgHeight = 460;

// Define the chart's margins as an object
var chartMargin = {
  top: 30,
  right: 60,
  bottom: 30,
  left: 60
};

// Define dimensions of the chart area
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

// Select body, append SVG area to it, and set the dimensions
var svg = d3.select("body")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append a group to the SVG area and shift ('translate') it to the right and to the bottom
var chartGroup = svg.append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

// Load data from csv
d3.csv("divvy_price_data.csv").then(function(Data) {

  console.log(Data);

  // Cast the hours value to a number for each piece of tvData
  // tvData.forEach(function(d) {
  //   d.hours = +d.hours;
  // });

  // Configure a band scale for the horizontal axis with a padding of 0.1 (10%)
  var xBandScale = d3.scaleBand()
    .domain(Data.map(d => d.neighborhood))
    .range([0, chartWidth])
    .padding(0.1);

  // Create a linear scale for the vertical axis.
  var yLinearScale = d3.scaleLinear()
    .domain([20, 700])
    .range([chartHeight, 0]);

  // Create two new functions passing our scales in as arguments
  // These will be used to create the chart's axes
  var bottomAxis = d3.axisBottom(xBandScale);
  var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

  // Append two SVG group elements to the chartGroup area,
  // and create the bottom and left axes inside of them
  chartGroup.append("g")
    .call(leftAxis);

  chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(bottomAxis);

  // Create one SVG rectangle per piece
  // Use the linear and band scales to position each rectangle within the chart
  chartGroup.selectAll(".bar")
    .data(Data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => xBandScale(d.neighborhood))
    .attr("y", d => yLinearScale(d.sale_price))
    .attr("width", xBandScale.bandwidth())
    .attr("height", d => chartHeight - yLinearScale(d.sale_price));

}).catch(function(error) {
  console.log(error);
});



// var url = "/api/steve_research";
// d3.json(url).then(function(response) {

//   console.log(response);

//   var data = [response];

//   var layout = {
//     title: "Neighborhoods",
//     xaxis: {
//       title: "Neighborhood"
//     },
//     yaxis: {
//       title: "Sale Price"
//     }
//   };

//   Plotly.newPlot("plot", data, layout);
// });


// var labels = jsonfile.jsonarray.map(function(e) {
//   return e.neighborhood;
// });
// var data = jsonfile.jsonarray.map(function(e) {
//   return e.sale_price;
// });
// var labels

// var data

// fetch("http://127.0.0.1:5000/api/steve_research").then(function (response){
//   return response.json();
// }).then(function (data) {
//   console.log(JSON.parse(data));
//   labels = data.map(function(e) {return e.neighborhood})
//   data = data.map(function(e) {return e.sale_price})
// })

// console.log(labels)
// console.log(data)

// var ctx = canvas.getContext('2d');
// var config = {
//   type: 'bar',
//   data: {
//      labels: labels,
//      datasets: [{
//         label: 'bar',
//         data: data,
//         backgroundColor: 'rgba(0, 119, 204, 0.3)'
//      }]
//   }
// };

// var chart = new Chart(ctx, config);