// function used for updating circles group with new tooltip
function updateCircleToolTip(circlesGroup, chosenXAxis, chosenYAxis) {
    // format number to USD currency
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });

    let xpercentsign = "";
    let xlabel = "";
    if (chosenXAxis === "poverty") {
        xlabel = "Poverty";
        xpercentsign = "%";
    } else if (chosenXAxis === "age") {
        xlabel = "Age";
    } else {
        xlabel = "Income";
    }

    let ypercentsign = "";
    let ylabel = "";
    if (chosenYAxis === "healthcare") {
        ylabel = "Healthcare";
        ypercentsign = "%";
    } else if (chosenYAxis === "smokes") {
        ylabel = "Smokes";
        ypercentsign = "%";
    } else {
        ylabel = "Obesity";
        ypercentsign = "%";
    }

    const toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([50, -75])
        .html(function (d) {
            if (chosenXAxis === "income") {
                let incomelevel = formatter.format(d[chosenXAxis]);

                return (`${d.state}<br>${xlabel}: ${incomelevel.substring(0, incomelevel.length - 3)}${xpercentsign}<br>${ylabel}: ${d[chosenYAxis]}${ypercentsign}`)
            } else {
                return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}${xpercentsign}<br>${ylabel}: ${d[chosenYAxis]}${ypercentsign}`)
            };
        });

    circlesGroup.call(toolTip);

    // mouseover event
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
        // trying to highlight chosen circle
        // circlesGroup.append("circle")
        //   .attr("cx", d3.event.pageX)
        //   .attr("cy", d3.event.pageY)
        //   .attr("r", 15)
        //   .attr("stroke", "black")
        //   .attr("fill", "none");
    })
        // onmouseout event
        .on("mouseout", function (data) {
            toolTip.hide(data, this);
        });

    return circlesGroup;
}