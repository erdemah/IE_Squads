var svg_qld_categ = d3.select("#qld_categ").append("svg")
.attr("width", width)
.attr("height", height-200);
//adding group to svg
var g_qld = svg_qld_categ.append("g").attr("transform", "translate(30, -100)");

//LEGEND CIRCLE QLD
var qld_legend_w = 555,
    qld_legend_h = 40;

var legend_qld = svg_qld_categ.append("g")
.attr("transform", "translate(120, 410)")
.attr("class","leg_qld");

legend_qld.append("rect")
    .attr("width", qld_legend_w)
    .attr("height", qld_legend_h);

d3.csv("qld_categ_salary.csv", type, function(data){
    var salary_categ = new Array(data.length);
    for(var i=0; i<data.length;i++){
        salary_categ[i] = data[i]["avg_salary"];
    }
    //sorting salary
    salary_categ.sort(function(a, b){
    return a - b;
    });
    salary_scale = d3.scaleLinear();
    salary_scale.domain([salary_categ[0],salary_categ[10]]).range([10,50]);
    
    var circles_qld = g_qld.selectAll(".qld_circle").data(data);
    circles_qld.enter().append("circle")
        .attr("class","qld_circle")
        .attr("cx", function (d,i){
        if (i == 0){
            return 260;
            }
        else if(i==1){
            return 340;
        }
        else if(i==2){
            return 290;
        }
        else if(i==3){
            return 365;
        }
        else if(i==3){
            return 370;
        }
        else if(i==4){
            return 440;
        }
        else if(i==5){
            return 310;
        }
        else if(i==6){
            return 405;
        }
        else if(i==7){
            return 435;
        }
        else if(i==8){
            return 470;
        }
        else if(i==9){
            return 500;
        }
        else if(i==10){
            return 480;
        }
        else{
            return 250 + i*40; 
        }
    })
        .attr("cy", function (d,i){
        if (i == 0){
            return 250;
            }
        else if (i == 1){
            return 210;
                 }
        else if (i == 2){
            return 315;
                 }
        else if (i == 3){
            return 310;
                 }
        else if (i == 4){
            return 250;
                 }
        else if(i==5){
            return 400;
        }
        else if(i==6){
            return 400;
        }
        else if(i==7){
            return 325;
        }
        else if(i==8){
            return 360;
        }
        else if(i==9){
            return 310;
        }
        else if(i==10){
            return 425;
        }
    })
        .attr("r",  function (d){ 
        return salary_scale(d.avg_salary); 
    })
        .style("fill", function(d){
        var to_fill = d3.scaleLinear();
        to_fill.domain([salary_categ[0],salary_categ[10]]).range([1,0]);
        return d3.interpolatePlasma(to_fill(d.avg_salary));
    })
    .on("mouseover", function(d){
        d3.select(this).style("stroke","rgb(0, 181, 24)")
            .style("stroke-width", "3");
        tooltip.transition()
			.duration(500)
			.style("opacity", 1);
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong>" + d.category + 
			"<table><tbody><tr><td>Average Salary: </td><td>" +"$" + d.avg_salary + "</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 10) + "px")
			.style("top", (d3.event.pageY +10) + "px");
    })
    .on("mouseout", function(d){
        d3.selectAll('.qld_circle')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND CIRCLE QLD
    var data_legend = new Array(data.length*2);
    for(var i=0; i<data_legend.length; i++){
        data_legend[i]= i;
    }
    d3.select('.leg_qld').selectAll("qld_rect_legend")
    .data(data_legend)
    .enter().append("circle")
//    .attr("width", 15)
//    .attr("height", 20)
    .attr("class","qld_rect_legend")
    .attr("cx",function(d){
        return 63 +d*20;
    })
    .attr("cy",function(){
        return 18;
    })
    .attr("r",8)
    .style("fill", function(d){
        var to_fill = d3.scaleLinear();
        to_fill.domain([0,data_legend.length]).range([0,1]);
        return d3.interpolatePlasma(to_fill(d));
    });
    //LEGEND QLD ENDS
    d3.select('.leg_qld')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_qld_text")
        .style("fill","black")
        .attr("x",3)
        .attr("y",23)
        .text("Highest");
        d3.select('.leg_qld')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_qld_text")
        .style("fill","black")
        .attr("x",500)
        .attr("y",23)
        .text("Lowest");
});
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//TREEMAP QUEENSLAND
//QLD, TREEMAP, job posts
// set the dimensions and margins of the graph
var margin_treemap = {top: 100, right: 50, bottom: 50, left: 100};
var svg_qld_job_post = d3.select("#qld_job_post").append("svg")
.attr("width", width-200)
.attr("height", height-100);
    //adding group to svg
var g_qld_job_post = svg_qld_job_post.append("g")
.attr("transform", "translate(50,50)");
//+ margin_treemap.left + "," + margin_treemap.top + ","+ margin_treemap.right + "," + margin_treemap.bottom +")");

//LEGEND FOR TREEMAP QLD -------------
var qld_treemap_legend = svg_qld_job_post.append("g")
.attr("transform", "translate(130, 490)")
.attr("class","leg_treemap_qld");
qld_treemap_legend.append("rect")
    .attr("width", qld_legend_w-200)
    .attr("height", qld_legend_h);
//LEGEND FOR TREEMAP END --------------
d3.csv("job_post_qld.csv", type, function(data){
//    //reversing color
//    var my_color = d3.schemeSpectral[11];
//    my_color.sort(function(a,b){
//        return b-a;
//    })
    var job_post_array = new Array(data.length-1);
    //oth index in the data is null
    for(var i=1; i<data.length;i++){
//        if(data[i-1]["job_post"] == ""){
//            continue;
//        }
        job_post_array[i-1] = parseInt(data[i]["job_post"]);
    }
//    job_post_array.pop();
    //sorting salary
    job_post_array.sort(function(a, b){
    return a - b;
    });
    var root = d3.stratify()
    .id(function(d){ 
        return d.category;
    })
    .parentId(function(d){
        return d.state;
    })(data);
    root.sum(function(d) {
        //+symbol converts string to integer
        return +d.job_post;
    });
    d3.treemap()
    .size([width-300, height-300])
    .padding(4)
    (root);
    g_qld_job_post
        .selectAll(".rect_tree_qld")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("class","rect_tree_qld")
        .attr('x', function (d) { 
        return d.x0; 
    })
        .attr('y', function (d) { 
        return d.y0; 
    })
        .attr('width', function (d) {
        return d.x1 - d.x0; 
    })
        .attr('height', function (d) { 
        return d.y1 - d.y0; 
    })
//        .style("stroke", "black")
        .style("fill", function(d){
        //reversing color
        var my_color = d3.schemeSpectral[11];
        my_color.sort(function(a,b){
            return b-a;
        })
        var to_fill = d3.scaleOrdinal();
        to_fill.domain(job_post_array).range(my_color);
        return to_fill(d.value);
    })
    .on("mouseover", function(d){
        d3.select(this).style("stroke","black")
            .style("stroke-width", "1");
        tooltip.transition()
			.duration(500)
			.style("opacity", 1);
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong>" + d.id + 
			"<table><tbody><tr><td></td><td>" + d.value + " jobs available</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 10) + "px")
			.style("top", (d3.event.pageY +10) + "px");
    })
    .on("mouseout", function(d){
        d3.selectAll('.rect_tree_qld')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND RECTANGLES QUEENSLAND TREEMAP
    var data_legend = new Array(data.length-1);
    for(var i=0; i<data_legend.length; i++){
        data_legend[i]= i;
    }
    d3.select('.leg_treemap_qld').selectAll(".qld_rect_legend_treemap")
    .data(data_legend)
    .enter().append("rect")
    .attr("width", 15)
    .attr("height", 20)
    .attr("class","qld_rect_legend_treemap")
    .attr("x",function(d){
        return 73 +d*20;
    })
    .attr("y",function(){
        return 10;
    })
    .style("fill", function(d){
        var to_fill = d3.scaleLinear();
        //reversing color
        var my_color = d3.schemeSpectral[11];
        my_color.sort(function(a,b){
            return b-a;
        })
        to_fill.domain(data_legend).range(my_color);
        return to_fill(d);
    });
    //LEGEND QLD TREEMAP ENDS
    //LEGEND QLD ENDS
    d3.select('.leg_treemap_qld')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_qld_text")
        .style("fill","black")
        .attr("x",12)
        .attr("y",25)
        .text("Highest");
    d3.select('.leg_treemap_qld')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_qld_text")
        .style("fill","black")
        .attr("x",295)
        .attr("y",25)
        .text("Lowest");
    
      // and to add the text labels
    g_qld_job_post
        .selectAll(".text_in_tree_qld")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("class","text_in_tree_qld")
        .attr("x", function(d){ 
        return d.x0+10;
    })    // +10 to adjust position (more right)
        .attr("y", function(d){ 
        return d.y0+20;
    })    // +20 to adjust position (lower)
        .attr("font-size", "0.9em")
        .attr("fill", "black")
        .text(function(d,i){ 
        d3.select(this)
        .attr("x", function(d){ 
            return d.x0+5;
        })
        .attr("y", function(d){ 
            return d.y0+13;
        })
        .classed("text_in_tree_qld2", i >7 )
        return d.data.abr;
    });
});
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//NSW circle visualization, category salary
var svg_nsw_categ = d3.select("#nsw_categ").append("svg")
.attr("width", width)
.attr("height", height-200);
//adding group to svg
var g_nsw = svg_nsw_categ.append("g").attr("transform", "translate(30, -100)");

//LEGEND CIRCLE NSW
var nsw_legend_w = 555,
    nsw_legend_h = 40;

var legend_nsw = svg_nsw_categ.append("g")
.attr("transform", "translate(120, 410)")
.attr("class","leg_nsw");

legend_nsw.append("rect")
    .attr("width", nsw_legend_w)
    .attr("height", nsw_legend_h);

d3.csv("nsw_categ_salary.csv", type, function(data){
    var salary_categ = new Array(data.length);
    for(var i=0; i<data.length;i++){
        salary_categ[i] = data[i]["avg_salary"];
    }
    //sorting salary
    salary_categ.sort(function(a, b){
    return a - b;
    });
    salary_scale = d3.scaleLinear();
    salary_scale.domain([salary_categ[0],salary_categ[10]]).range([10,50]);
    
    var circles_nsw = g_nsw.selectAll(".nsw_circle").data(data);
    circles_nsw.enter().append("circle")
        .attr("class","nsw_circle")
        .attr("cx", function (d,i){
        if (i == 0){
            return 260;
            }
        else if(i==1){
            return 340;
        }
        else if(i==2){
            return 290;
        }
        else if(i==3){
            return 365;
        }
        else if(i==3){
            return 370;
        }
        else if(i==4){
            return 440;
        }
        else if(i==5){
            return 310;
        }
        else if(i==6){
            return 405;
        }
        else if(i==7){
            return 435;
        }
        else if(i==8){
            return 470;
        }
        else if(i==9){
            return 500;
        }
        else if(i==10){
            return 480;
        }
        else{
            return 250 + i*40; 
        }
    })
        .attr("cy", function (d,i){
        if (i == 0){
            return 250;
            }
        else if (i == 1){
            return 210;
                 }
        else if (i == 2){
            return 315;
                 }
        else if (i == 3){
            return 310;
                 }
        else if (i == 4){
            return 250;
                 }
        else if(i==5){
            return 400;
        }
        else if(i==6){
            return 400;
        }
        else if(i==7){
            return 325;
        }
        else if(i==8){
            return 360;
        }
        else if(i==9){
            return 310;
        }
        else if(i==10){
            return 425;
        }
    })
        .attr("r",  function (d){ 
        return salary_scale(d.avg_salary); 
    })
        .style("fill", function(d){
        var to_fill = d3.scaleLinear();
        to_fill.domain([salary_categ[0],salary_categ[10]]).range([1,0]);
        return d3.interpolatePlasma(to_fill(d.avg_salary));
    })
    .on("mouseover", function(d){
        d3.select(this).style("stroke","rgb(0, 181, 24)")
            .style("stroke-width", "3");
        tooltip.transition()
			.duration(500)
			.style("opacity", 1);
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong>" + d.category + 
			"<table><tbody><tr><td>Average Salary: </td><td>" +"$" + d.avg_salary + "</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 10) + "px")
			.style("top", (d3.event.pageY +10) + "px");
    })
    .on("mouseout", function(d){
        d3.selectAll('.nsw_circle')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND CIRCLE NSW
    var data_legend = new Array(data.length*2);
    for(var i=0; i<data_legend.length; i++){
        data_legend[i]= i;
    }
    d3.select('.leg_nsw').selectAll("nsw_rect_legend")
    .data(data_legend)
    .enter().append("circle")
//    .attr("width", 15)
//    .attr("height", 20)
    .attr("class","nsw_rect_legend")
    .attr("cx",function(d){
        return 63 +d*20;
    })
    .attr("cy",function(){
        return 18;
    })
    .attr("r",8)
    .style("fill", function(d){
        var to_fill = d3.scaleLinear();
        to_fill.domain([0,data_legend.length]).range([0,1]);
        return d3.interpolatePlasma(to_fill(d));
    });
    //LEGEND NSW ENDS
    d3.select('.leg_nsw')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_nsw_text")
        .style("fill","black")
        .attr("x",3)
        .attr("y",23)
        .text("Highest");
        d3.select('.leg_nsw')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_nsw_text")
        .style("fill","black")
        .attr("x",500)
        .attr("y",23)
        .text("Lowest");
});
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//TREEMAP NEW SOUTH WALES
//NSW, TREEMAP, job posts
// set the dimensions and margins of the graph
var margin_treemap = {top: 100, right: 50, bottom: 50, left: 100};
var svg_nsw_job_post = d3.select("#nsw_job_post").append("svg")
.attr("width", width-200)
.attr("height", height-100);
    //adding group to svg
var g_nsw_job_post = svg_nsw_job_post.append("g")
.attr("transform", "translate(50,50)");
//+ margin_treemap.left + "," + margin_treemap.top + ","+ margin_treemap.right + "," + margin_treemap.bottom +")");

//LEGEND FOR TREEMAP NSW -------------
var nsw_treemap_legend = svg_nsw_job_post.append("g")
.attr("transform", "translate(130, 490)")
.attr("class","leg_treemap_nsw");
nsw_treemap_legend.append("rect")
    .attr("width", nsw_legend_w-200)
    .attr("height", nsw_legend_h);
//LEGEND FOR TREEMAP END --------------
d3.csv("job_post_nsw.csv", type, function(data){
//    //reversing color
//    var my_color = d3.schemeSpectral[11];
//    my_color.sort(function(a,b){
//        return b-a;
//    })
    var job_post_array = new Array(data.length);
    for(var i=0; i<data.length;i++){
        if(data[i]["job_post"] == ""){
            continue;
        }
        job_post_array[i] = parseInt(data[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return a - b;
    });
    var root = d3.stratify()
    .id(function(d){ 
        return d.category;
    })
    .parentId(function(d){
        return d.state;
    })(data);
    root.sum(function(d) {
        //+symbol converts string to integer
        return +d.job_post;
    });
    d3.treemap()
    .size([width-300, height-300])
    .padding(4)
    (root);
    g_nsw_job_post
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("class","rect_tree_nsw")
        .attr('x', function (d) { 
        return d.x0; 
    })
        .attr('y', function (d) { 
        return d.y0; 
    })
        .attr('width', function (d) {
        return d.x1 - d.x0; 
    })
        .attr('height', function (d) { 
        return d.y1 - d.y0; 
    })
//        .style("stroke", "black")
        .style("fill", function(d){
        //reversing color
        var my_color = d3.schemeSpectral[11];
        my_color.sort(function(a,b){
            return b-a;
        })
        var to_fill = d3.scaleLinear();
        to_fill.domain(job_post_array).range(my_color);
        return to_fill(d.value);
    })
    .on("mouseover", function(d){
        d3.select(this).style("stroke","black")
            .style("stroke-width", "1");
        tooltip.transition()
			.duration(500)
			.style("opacity", 1);
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong>" + d.id + 
			"<table><tbody><tr><td></td><td>" + d.value + " jobs available</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 10) + "px")
			.style("top", (d3.event.pageY +10) + "px");
    })
    .on("mouseout", function(d){
        d3.selectAll('.rect_tree_nsw')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND RECTANGLES NEW SOUTH WALES TREEMAP
    var data_legend = new Array(data.length-1);
    for(var i=0; i<data_legend.length; i++){
        data_legend[i]= i;
    }
    d3.select('.leg_treemap_nsw').selectAll(".nsw_rect_legend_treemap")
    .data(data_legend)
    .enter().append("rect")
    .attr("width", 15)
    .attr("height", 20)
    .attr("class","nsw_rect_legend_treemap")
    .attr("x",function(d){
        return 73 +d*20;
    })
    .attr("y",function(){
        return 10;
    })
    .style("fill", function(d){
        var to_fill = d3.scaleLinear();
        //reversing color
        var my_color = d3.schemeSpectral[11];
        my_color.sort(function(a,b){
            return b-a;
        })
        to_fill.domain(data_legend).range(my_color);
        return to_fill(d);
    });
    //LEGEND NSW TREEMAP ENDS
    //LEGEND NSW ENDS
    d3.select('.leg_treemap_nsw')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_nsw_text")
        .style("fill","black")
        .attr("x",12)
        .attr("y",25)
        .text("Highest");
    d3.select('.leg_treemap_nsw')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_nsw_text")
        .style("fill","black")
        .attr("x",295)
        .attr("y",25)
        .text("Lowest");
    
      // and to add the text labels
    g_nsw_job_post
        .selectAll(".text_in_tree_nsw")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("class","text_in_tree_nsw")
        .attr("x", function(d){ 
        return d.x0+10;
    })    // +10 to adjust position (more right)
        .attr("y", function(d){ 
        return d.y0+20;
    })    // +20 to adjust position (lower)
        .attr("font-size", "0.9em")
        .attr("fill", "black")
        .text(function(d,i){ 
        d3.select(this)
        .attr("x", function(d){ 
            return d.x0+5;
        })
        .attr("y", function(d){ 
            return d.y0+13;
        })
        .classed("text_in_tree_nsw2", i >7 )
        return d.data.abr;
    });
});
//datasets/about_your_pay/