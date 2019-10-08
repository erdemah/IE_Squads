var width = 800,
    height = 700,
    centered;

//var height = 681.4285714285714;
//var width = height*7/5;
//conicConformal,mercator
//var projection = d3.geoMercator()
//.rotate([-132, 0])
//.center([0, -27])
////.parallels([-18, -36]) //for conicConformal
//.scale(Math.min(height * 1.3, width * 1.5))
//.translate([width / 2, height / 2])
//.precision(0.1);

var projection = d3.geoConicConformal()
    .parallels([-18, -36])
    .rotate([-132, 0])
    .scale(width*1.3)
    .center([0, -27])
    .translate([width / 2, height / 2])
//    .clipExtent([[0, 0], [width, height]])
    .precision(0.2);

var path = d3.geoPath()
.projection(projection);
//key:state, value:average_salary
var mean_salary_dict = new Object();
// key:Long_state, value:abrev_state
var state_name_dict = new Object();
// key:salary, value:state
//var salary_state_dict = new Object();
//copy of salary_array => the same reference
var salary_array_copy = null;
//to color the map of Australia
var color_state = d3.scaleLinear();
var range_of_color = ["rgb(255, 255, 229)","rgb(255, 247, 188)","rgb(254, 227, 145)","rgb(254, 196, 79)",
                          "rgb(254, 153, 41)","rgb(236, 112, 20)","rgb(204, 76, 2)","rgb(140, 45, 4)"];
//modifies the color scale
function color_state_renew(domain_x,range_x){
    return color_state.domain(domain_x).range(range_x);
}

//AVG_SALARY_MAP
//tooltip for Map
var tooltip = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);

var svg = d3.select("#map").append("svg")
.attr("width", width)
.attr("height", height);
//.attr("class","choropleth")
//.on("click", clicked)

var g = svg.append("g");

//LEGEND
var width_legend = 250,
    height_legend = 95;

var legend = svg.append("g")
.attr("transform", "translate(240, 540)")
.attr("class","leg");
legend.append("rect")
    .attr("width", width_legend)
    .attr("height", height_legend);

//Converts salaries from string to integer
function type(d){
    d.avg_salary = parseInt(d.avg_salary);
    return d;
}
//function type_2(d){
//    d.avg_salary = parseInt(d.avg_salary);
//    d.job_post = parseInt(d.job_post);
//    return d;
//}
function legend_color(d) {
    return color_state(mean_salary_dict[d.properties.STATE_NAME]);
}

function clicked(d) {
    d3.event.stopPropagation();
    var x, y, k;
    var color_array = ["rgb(255, 255, 229)","rgb(255, 247, 188)","rgb(254, 227, 145)","rgb(254, 196, 79)",
                       "rgb(254, 153, 41)","rgb(236, 112, 20)","rgb(204, 76, 2)","rgb(140, 45, 4)"];
    //x and y stores the center coordinates of the clicked state
    if (d && centered !== d) {
        var centroid = path.centroid(d);
        x = centroid[0];
        y = centroid[1];
        //degree of scale
        k = 2;
        centered = d;
        //restarting color_state
        color_state
            .domain(salary_array_copy)
            .range(color_array);
        //coloring once clicked
        d3.selectAll("path").style("fill",function(d){
            //color back to previous coloring
            return color_state(mean_salary_dict[d.properties.STATE_NAME]);
        });
        var clicked_state_name = d.properties.STATE_NAME;
//        console.log(clicked_state_name);
        //legend will also turn blue based on the clicked state
        d3.selectAll(".little_square").style("fill", function(d){
            //color domain and range will be reconstructed since the current color of a particular map has changed
            color_state_renew(salary_array_copy,color_array);
            var salary_on_clicked_state = mean_salary_dict[clicked_state_name];
            var color_on_clicked_state = color_state(salary_on_clicked_state);
//            console.log(color_on_clicked_state);
            for(var i=0; i<color_array.length;i++){
                if(color_array[i] == color_on_clicked_state){
                    color_array[i] = "rgb(47, 88, 161)";
                }
            }
            //update color_state (one square turning blue)
            color_state
            .domain(salary_array_copy)
            .range(color_array);
            return color_state(mean_salary_dict[d.properties.STATE_NAME]);
        });
        //Ruler will also turn blue based on the clicked state
//        d3.select('.leg').selectAll(".little_ruler").style("fill", ["red","blue","purple", "red","blue","purple", "red","black"]);
        d3.selectAll(".little_ruler").remove();
        d3.json("datasets/about_your_pay/au_states_3.json", function(error, australia) {
            var rects = d3.select('.leg').selectAll("little_ruler")
            .data(australia.features)
            .enter().append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("class","little_ruler")
            .attr("x",function(d,i){
                return i*15 + 70; 
            })
            .attr("y",function(){
                return 70;
            })
            .style("fill", function(d,i){
                var ruler_color = d3.scaleLinear();
                ruler_color.domain([7,6,5,4,3,2,1,0]).range(color_array);
                return ruler_color(i);
            });
        });
        d3.select(this).style("fill", d3.rgb(47, 88, 161));
        tooltip.transition()
			.duration(1000)
			.style("opacity", 1);
//        console.log(d);
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong>" + d.properties.STATE_NAME + 
			"<table><tbody><tr><td>Average Salary: </td><td>" +"$" + mean_salary_dict[d.properties.STATE_NAME] + "</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 150) + "px")
			.style("top", (d3.event.pageY -190) + "px");
    } else {
        x = width / 2;
        y = height / 2;
        k = 1;
        centered = null;
        //color_state back to normal coloring
        color_state_renew(salary_array_copy,range_of_color);
        //states back to usual coloring
        d3.select(this).style("fill",function(d){
            //map color back to previous coloring
            return color_state(mean_salary_dict[d.properties.STATE_NAME]);
        });
        //legend usual coloring
        d3.selectAll(".little_square").style("fill", function(d){
            return color_state(mean_salary_dict[d.properties.STATE_NAME]);
        });
        //renewing ruler color
        d3.selectAll(".little_ruler").remove();
        d3.json("au_states_3.json", function(error, australia) {
            var rects = d3.select('.leg').selectAll("little_ruler")
            .data(australia.features)
            .enter().append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("class","little_ruler")
            .attr("x",function(d,i){
                return i*15 + 70; 
            })
            .attr("y",function(){
                return 70;
            })
            .style("fill", function(d,i){
                var ruler_color = d3.scaleLinear();
                ruler_color.domain([7,6,5,4,3,2,1,0]).range(range_of_color);
                return ruler_color(i);
            });
        });
        //REMOVING TOOLTIP
        tooltip.transition()
			.duration(250)
			.style("opacity", 0);
    }
    g.selectAll("path")
        .classed("active", centered && function(d) { return d === centered; });
    g.transition()
        .duration(1000)
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
        .style("stroke-width", 1 / k + "px");
}
//FOR AUSTRALIA MAP
d3.csv("datasets/about_your_pay/avg_salary_state.csv", type, function(data){
    //this array will store the mean salary for each state
    var mean_salary_array = new Array(data.length);
    for(var i=0; i<data.length;i++){
        mean_salary_dict[data[i].STATE_NAME] = data[i].avg_salary;
        mean_salary_array[i] = data[i].avg_salary;
//        salary_state_dict[data[i].avg_salary] = data[i].STATE_NAME;
    }
    for(var i=0; i<data.length;i++){
        state_name_dict[data[i].STATE_NAME] = data[i].state
    }
    //ascending
    mean_salary_array.sort();
    //color_conversion = rgb(140, 45, 4) == #8c2d04
    //204, 76, 2 == #cc4c02, #ec7014 == 236, 112, 20, #fe9929 == 254, 153, 41,
    // #fec44f == 254, 196, 79, #fee391 == 254, 227, 145, #fff7bc == 255, 247, 188, #ffffe5 == 255, 255, 229
    salary_array_copy = mean_salary_array.slice();
    color_state_renew (mean_salary_array,range_of_color)
    
    //GEOJSON STARTS
    d3.json("datasets/about_your_pay/au_states_3.json", function(error, australia) {
        if (error) throw error;
        //LEGEND
        d3.select('.leg').selectAll("little_square")
        .data(australia.features)
        .enter().append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","little_square")
        .attr("x",function(d,i){
            if(i < 4){
                return (i)*55 + 15; 
            }
            else{
                return (i-4)*55 + 15; 
            }
        })
        .attr("y",function(d,i){
            if(i < 4){
                return 15;
            }
            else{
                return 45;
            }
        })
        .style("fill", legend_color);
        //LEGEND ENDS
        //TEXT FOR LEGEND
        var texts = d3.select('.leg').selectAll("little_text")
        .data(australia.features)
        .enter().append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","little_text")
        .style("fill","black")
        .attr("x",function(d,i){
//            console.log(d);
            if(i == 0 || i == 4){
                return 32; 
            }
            else if (i == 1 || i == 5){
                return 90; 
            }
            else if (i == 2 || i == 6){
                return 145;
            }
            else if(i==3 || i == 7){
                return 200;
            }
            else{
                return 250;
            }
        })
        .attr("y",function(d,i){
            if(i < 4){
                return 27;
            }
            else{
                return 56;
            }
        })
        .text(function(d){
            return state_name_dict[d.properties.STATE_NAME];
        });
        //LEGEND ENDS
        //RULER FOR THE LEGEND STARTS
        var rects = d3.select('.leg').selectAll("little_ruler")
        .data(australia.features)
        .enter().append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","little_ruler")
        .attr("x",function(d,i){
            return i*15 + 70; 
        })
        .attr("y",function(){
            return 70;
        })
        .style("fill", function(d,i){
            var ruler_color = d3.scaleLinear();
            ruler_color.domain([7,6,5,4,3,2,1,0]).range(range_of_color);
            return ruler_color(i);
        });
        
        //RULER FOR THE LEGEND ENDS
        // RULER HIGHEST AND LOWEST TEXT
        d3.select('.leg')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","little_text")
        .style("fill","black")
        .attr("x",15)
        .attr("y",80)
        .text("Highest");
        d3.select('.leg')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","little_text")
        .style("fill","black")
        .attr("x",195)
        .attr("y",80)
        .text("Lowest");
//        var paths = g.selectAll("#states").data(australia.features)
//        .enter()
//        .append("path")
//        .attr("id", "states")
//        .attr("d", path)
//        .on("click", clicked)
//        .style("fill",function(d) { 
//    //        console.log(d.properties.STATE_NAME);
//            return color_state(mean_salary_dict[d.properties.STATE_NAME])
//        });
        //or
        g.append("g").attr("id", "states").selectAll("path").data(australia.features)
            .enter()
            .append("path")
            .attr("d", path)
            .on("click", clicked)
            .style("fill",function(d) { 
                return color_state(mean_salary_dict[d.properties.STATE_NAME]);
            });
    });
    //GEOJSON ENDS
});
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//VIC circle visualization, category salary
var svg_vic_categ = d3.select("#vic_categ").append("svg")
.attr("width", width)
.attr("height", height-200);
//adding group to svg
var g_vic = svg_vic_categ.append("g").attr("transform", "translate(30, -100)");

//LEGEND CIRCLE VIC
var vic_legend_w = 555,
    vic_legend_h = 40;

var legend_vic = svg_vic_categ.append("g")
.attr("transform", "translate(120, 410)")
.attr("class","leg_vic");

legend_vic.append("rect")
    .attr("width", vic_legend_w)
    .attr("height", vic_legend_h);

d3.csv("datasets/about_your_pay/vic_categ_salary.csv", type, function(data){
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
    
    var circles_vic = g_vic.selectAll("circle").data(data);
    circles_vic.enter().append("circle")
        .attr("class","vic_circle")
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
        console.log(d);
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
        d3.selectAll('.vic_circle')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND VIC
    var data_legend = new Array(data.length*2);
    for(var i=0; i<data_legend.length; i++){
        data_legend[i]= i;
    }
    d3.select('.leg_vic').selectAll("vic_rect_legend")
    .data(data_legend)
    .enter().append("rect")
    .attr("width", 15)
    .attr("height", 20)
    .attr("class","vic_rect_legend")
    .attr("x",function(d){
        return 60 +d*20;
    })
    .attr("y",function(){
        return 10;
    })
    .style("fill", function(d){
        var to_fill = d3.scaleLinear();
        to_fill.domain([0,data_legend.length]).range([0,1]);
        return d3.interpolatePlasma(to_fill(d));
    });
    //LEGEND VIC ENDS
    d3.select('.leg_vic')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_vic_text")
        .style("fill","black")
        .attr("x",3)
        .attr("y",25)
        .text("Highest");
        d3.select('.leg_vic')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_vic_text")
        .style("fill","black")
        .attr("x",500)
        .attr("y",25)
        .text("Lowest");
});
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//TREEMAP VICTORIA
//VIC, TREEMAP, job posts
// set the dimensions and margins of the graph
var margin_treemap = {top: 100, right: 50, bottom: 50, left: 100};
var svg_vic_job_post = d3.select("#vic_job_post").append("svg")
.attr("width", width-200)
.attr("height", height-100);
    //adding group to svg
var g_vic_job_post = svg_vic_job_post.append("g")
.attr("transform", "translate(50,50)");
//+ margin_treemap.left + "," + margin_treemap.top + ","+ margin_treemap.right + "," + margin_treemap.bottom +")");

//LEGEND FOR TREEMAP VIC -------------
var vic_treemap_legend = svg_vic_job_post.append("g")
.attr("transform", "translate(130, 490)")
.attr("class","leg_treemap_vic");
vic_treemap_legend.append("rect")
    .attr("width", vic_legend_w-200)
    .attr("height", vic_legend_h);
//LEGEND FOR TREEMAP END --------------
d3.csv("datasets/about_your_pay/job_post_vic.csv", type, function(data){
//    console.log(data.length);
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
//    console(root);
    root.sum(function(d) {
        //+symbol converts string to integer
        return +d.job_post;
    });
    d3.treemap()
    .size([width-300, height-300])
    .padding(4)
    (root);
//    console.log(root.leaves());
    g_vic_job_post
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("class","rect_tree_vic")
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
        var to_fill = d3.scaleLinear();
        //reversing color
        var my_color = d3.schemeSpectral[11];
        my_color.sort(function(a,b){
            return b-a;
        })
        to_fill.domain(job_post_array).range(my_color);
        return to_fill(d.value);
    })
    .on("mouseover", function(d){
//        console.log(d);
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
        d3.selectAll('.rect_tree_vic')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND RECTANGLES VICTORIA TREEMAP
    var data_legend = new Array(data.length-1);
    for(var i=0; i<data_legend.length; i++){
        data_legend[i]= i;
    }
    d3.select('.leg_treemap_vic').selectAll("vic_rect_legend_treemap")
    .data(data_legend)
    .enter().append("rect")
    .attr("width", 15)
    .attr("height", 20)
    .attr("class","vic_rect_legend_treemap")
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
    //LEGEND VIC TREEMAP ENDS
    //LEGEND VIC ENDS
    d3.select('.leg_treemap_vic')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_vic_text")
        .style("fill","black")
        .attr("x",12)
        .attr("y",25)
        .text("Highest");
    d3.select('.leg_treemap_vic')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_vic_text")
        .style("fill","black")
        .attr("x",295)
        .attr("y",25)
        .text("Lowest");
    
      // and to add the text labels
//    g_vic_job_post
//        .selectAll("text")
//        .data(root.leaves())
//        .enter()
//        .append("text")
//        .attr("x", function(d){ return d.x0+10})    // +10 to adjust position (more right)
//        .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
//        .text(function(d){ return d.data.category})
//        .attr("font-size", "15px")
//        .attr("fill", "white");
});


