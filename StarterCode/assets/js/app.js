const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
const svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 40); // extra padding for third label

// Append an SVG group
const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
let chosenXAxis = "poverty";
let chosenYAxis = "healthcare";


d3.csv("assets/data/data.csv").then(function (myCsvData) {

  // Parse the data
  // Format the data and convert to numerical values
  // =================================

  myCsvData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age = +data.age;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
    data.income = +data.income;
  });

  // Initialize scale functions
  // let xLinearScale = xScale(myCsvData, chosenXAxis);

  // create scales
  let xLinearScale = d3.scaleLinear()
    .domain([d3.min(myCsvData, d => d[chosenXAxis]) * 0.9,
    d3.max(myCsvData, d => d[chosenXAxis]) * 1.1
    ])
    .range([0, width]);


  // create y scales
  let yLinearScale = d3.scaleLinear()
    .domain([d3.min(myCsvData, d => d[chosenYAxis]) - 1,
    d3.max(myCsvData, d => d[chosenYAxis]) + 1
    ])
    .range([height, 0]);




  // Initialize axis functions
  let bottomAxis = d3.axisBottom(xLinearScale);
  let leftAxis = d3.axisLeft(yLinearScale);

  // Append x and y axes to the chart
  let xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  let yAxis = chartGroup.append("g")
    .call(leftAxis);

  // Create scatterplot and append initial circles
  let circlesGroup = chartGroup.selectAll("g circle")
    .data(myCsvData)
    .enter()
    .append("g");

  let circlesXY = circlesGroup.append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .classed("stateCircle", true);

  let circlesText = circlesGroup.append("text")
    .text(d => d.abbr)
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]) + 5)
    .classed("stateText", true);

  // Create group for 3 x-axis labels
  const xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height})`);

  const povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty") // value to grab for event listener
    .text("In Poverty (%)")
    .classed("active", true);

  const ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") // value to grab for event listener
    .text("Age (Median)")
    .classed("inactive", true);

  const incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("value", "income") // value to grab for event listener
    .text("Household Income (Median)")
    .classed("inactive", true);

  // Create group for 3 y-axis labels
  const ylabelsGroup = chartGroup.append("g");

  const healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -40)
    .attr("value", "healthcare") // value to grab for event listener
    .text("Lacks Healthcare (%)")
    .classed("active", true);

  const smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("value", "smokes") // value to grab for event listener
    .text("Smokes (%)")
    .classed("inactive", true);

  const obeseLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -80)
    .attr("value", "obesity") // value to grab for event listener
    .text("Obese (%)")
    .classed("inactive", true);

  // initial tooltips
  circlesGroup = updateCircleToolTip(circlesGroup, chosenXAxis, chosenYAxis);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      const value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {
        // replaces chosenXAxis with value
        chosenXAxis = value;

        // create x scale with new data
        let xLinearScale = d3.scaleLinear()
          .domain([d3.min(myCsvData, d => d[chosenXAxis]) * 0.9,
          d3.max(myCsvData, d => d[chosenXAxis]) * 1.1
          ])
          .range([0, width]);
        //

        // updates x axis with transition
        let bottomAxis = d3.axisBottom(xLinearScale);
        xAxis.transition()
          .duration(1000)
          .call(bottomAxis);
        //


        // updates circles with new x values
        circlesXY.transition()
          .duration(1000)
          .attr("cx", d => xLinearScale(d[chosenXAxis]));
        //

        // updates circles text with new x values
        circlesText.transition()
          .duration(1000)
          .attr("dx", d => xLinearScale(d[chosenXAxis]));
        //



        // updates tooltips with new info
        circlesGroup = updateCircleToolTip(circlesGroup, chosenXAxis, chosenYAxis);

        // changes classes to change bold text
        if (chosenXAxis === "age") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "income") {
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else {
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          incomeLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });

  // y axis labels event listener
  ylabelsGroup.selectAll("text")
    .on("click", function () {
      // get value of selection
      const value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenYAxis with value
        chosenYAxis = value;

        // updates y scale with new data
        let yLinearScale = d3.scaleLinear()
          .domain([d3.min(myCsvData, d => d[chosenYAxis]) - 1,
          d3.max(myCsvData, d => d[chosenYAxis]) + 1
          ])
          .range([height, 0]);

        // updates y axis with transition
        let leftAxis = d3.axisLeft(yLinearScale);
        yAxis.transition()
          .duration(1000)
          .call(leftAxis);
        //


        // updates all circles with new y values
        circlesXY.transition()
          .duration(1000)
          .attr("cy", d => yLinearScale(d[chosenYAxis]));


        // updates circles inner text in new y values

        circlesText.transition()
          .duration(1000)
          .attr("dy", d => yLinearScale(d[chosenYAxis]) + 5);



        // updates tooltips with new info
        circlesGroup = updateCircleToolTip(circlesGroup, chosenXAxis, chosenYAxis);

        // changes classes to change bold text
        if (chosenYAxis === "smokes") {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenYAxis === "obesity") {
          healthcareLabel
            .classed("active", false)
            .classed("inactive", true);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", true)
            .classed("inactive", false);
        }
        else {
          healthcareLabel
            .classed("active", true)
            .classed("inactive", false);
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
      }
    });
}
);


