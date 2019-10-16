var width = 860,
    height = 500,
    barHeight = height / 2 - 40;

var formatNumber = d3.format("s");

var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var svg = d3.select('#leave_vis').append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width/2 + "," + height/2 + ")");

d3.json("datasets/about_leave/leave.json", function(error, data) {

    var statesNames = data.map(function(d) { return d.status; });
    var ageNames = data[0].profession.map(function(d) { return d.name; });

    var barScale = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d3.max(d.profession, function(d) { return d.value; }); })])
        .range([0, barHeight]);

    var numBarsStates = statesNames.length ;
    var numBarsAges = ageNames.length ;

    var x = d3.scale.linear()
        .domain([0, d3.max(data, function(d) { return d3.max(d.profession, function(d) { return d.value; }); })])
        .range([0, -barHeight]);

    var xAxis = d3.svg.axis()
        .scale(x).orient("left")
        .ticks(5)
        .tickFormat(formatNumber);

    var circles = svg.selectAll("circle")
        .data(x.ticks(5))
        .enter().append("circle")
        .attr("r", function(d) {return barScale(d);})
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-dasharray", "2,2")
        .style("stroke-width",".5px");

    var states = svg.selectAll(".state")
        .data(data)
        .enter().append("g")
        .attr("class", "state")
        .attr("transform", function(d,i) { return "rotate(" + (i * 360 / numBarsStates) + ")"; });

    var arc = d3.svg.arc()
        .startAngle(function(d,i) { return (i * 2 * Math.PI) / (numBarsAges*numBarsStates); })
        .endAngle(function(d,i) { return ((i + 1) * 2 * Math.PI) / (numBarsAges*numBarsStates); })
        .innerRadius(0);

    var segments = states.selectAll("path")
        .data(function(d) { return d.profession; })
        .enter().append("path")
        .each(function(d) { d.outerRadius = 0; })
        .style("fill", function (d) { return color(d.name); })
        .attr("d", arc)
        .on("mouseover",function(d){
            console.log(d.value);
            d3.select(this).style("stroke","rgb(0,0,255)")
                .style("stroke-width","1.5");
        })
        .on("mouseout",function(){
            d3.select(this).style("stroke","none")
                .style("stroke-width","0");
        });

    segments.transition().ease("elastic").duration(1200).delay(function(d,i,u) { return u * 200 + 400;})
        .attrTween("d", function(d,index) {
            var i = d3.interpolate(d.outerRadius, barScale(d.value));
            return function(t) { d.outerRadius = i(t); return arc(d,index); };
        });

    svg.append("circle")
        .attr("r", barHeight)
        .classed("outer", true)
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width","1.5px");

    states.selectAll("line")
        .data(function(d) { return d.profession; })
        .enter().append("line")
        .attr("y2", function(d,i) { return i===0 ? -barHeight - 20 : -barHeight; })
        .style("stroke", "black")
        .style("stroke-width", function(d,i) { return i===0 ? "1px" : "0.2px"; })
        .attr("transform", function(d, i) { return "rotate(" + (i * 360 / (numBarsAges*numBarsStates)) + ")"; });

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis);

    // Labels
    var labelRadius = barHeight * 1.025;

    var labels = svg.append("g")
        .classed("labels", true);

    labels.append("def")
        .append("path")
        .attr("id", "label-path")
        .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

    labels.selectAll("text")
        .data(statesNames)
        .enter().append("text")
        .style("text-anchor", "middle")
        .style("font-weight","bold")
        .style("fill", function(d, i) {return "#3e3e3e";})
        .append("textPath")
        .attr("xlink:href", "#label-path")
        .attr("startOffset", function(d, i) {return i * 100 / numBarsStates + 50 / numBarsStates + '%';})
        .text(function(d) {
            return d.toUpperCase();
        });

    // legend
    var legend = svg.selectAll(".legend")
        .data(ageNames.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate("+ -width/2 + "," + (-(height/2 - 20) + (i * 20)) + ")"; });

    legend.append("rect")
        .attr("x", width - 33)
        .attr("width", 18)
        .attr("height", 18)
        .attr("transform", "translate(15, -5)")
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 39)
        .attr("y", 9)
        .attr("dy", ".35em")
        .attr("transform", "translate(15, -5)")
        .style("text-anchor", "end")
        .attr("font-size","0.75em")
        .text(function(d) { return d; });

});

d3.select(self.frameElement).style("height", height + "px");
