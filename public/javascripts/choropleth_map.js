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
    .scale(width)
    .center([0, -27])
    .translate([width / 2, height / 2.5])
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
.attr("transform", "translate(240, 440)")
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
        //legend will also turn blue based on the clicked state
        d3.selectAll(".little_square").style("fill", function(d){
            //color domain and range will be reconstructed since the current color of a particular map has changed
            color_state_renew(salary_array_copy,color_array);
            var salary_on_clicked_state = mean_salary_dict[clicked_state_name];
            var color_on_clicked_state = color_state(salary_on_clicked_state);
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
            var rects = d3.select('.leg').selectAll(".little_ruler")
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
        var salary_str = mean_salary_dict[d.properties.STATE_NAME].toString();
        if(salary_str.length == 5){
            salary_str = [salary_str.slice(0,2),",",salary_str.slice(2)].join('')
        }
        else{
            salary_str = [salary_str.slice(0,3),",",salary_str.slice(3)].join('')
        }
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.properties.STATE_NAME + 
			"<table><tbody><tr><td style='font-family:Architects Daughter, cursive;'>Average Salary: " +"$" + "<span style='font-family:Architects Daughter, cursive;'>" + salary_str +"</span>" + "</td></tr></tbody</table>")
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
        d3.json("datasets/about_your_pay/au_states_3.json", function(error, australia) {
            var rects = d3.select('.leg').selectAll(".little_ruler")
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
        d3.select('.leg').selectAll(".little_square")
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
        var texts = d3.select('.leg').selectAll(".little_text")
        .data(australia.features)
        .enter().append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","little_text")
        .style("fill","black")
        .attr("x",function(d,i){
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
        var rects = d3.select('.leg').selectAll(".little_ruler")
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

d3.csv("datasets/about_your_pay/Vic_salary.csv", type, function(data_vic_circle){
    var salary_categ = new Array(data_vic_circle.length);
    for(var i=0; i<data_vic_circle.length;i++){
        salary_categ[i] = data_vic_circle[i]["avg_salary"];
    }
    //sorting salary
    salary_categ.sort(function(a, b){
    return a - b;
    });
    salary_scale = d3.scaleLinear();
    salary_scale.domain([salary_categ[0],salary_categ[10]]).range([10,50]);
    
    var circles_vic = g_vic.selectAll(".vic_circle").data(data_vic_circle);
    circles_vic.enter().append("circle")
        .attr("class","vic_circle")
        .attr("cx", function (d,i){
        if (i == 0){
            return 260;
            }
        else if(i==1){
            return 360;
        }
        else if(i==2){
            return 270;
        }
        else if(i==3){
            return 365;
        }
        else if(i==4){
            return 440;
        }
        else if(i==5){
            return 310;
        }
        else if(i==6){
            return 430;
        }
        else if(i==7){
            return 370;
        }
        else if(i==8){
            return 435;
        }
        else if(i==9){
            return 490;
        }
        else if(i==10){
            return 330;
        }
        else{
            return 250 + i*40; 
        }
    })
        .attr("cy", function (d,i){
        if (i == 0){
            return 245;
            }
        else if (i == 1){
            return 210;
                 }
        else if (i == 2){
            return 350;
                 }
        else if (i == 3){
            return 370;
                 }
        else if (i == 4){
            return 250;
                 }
        else if(i==5){
            return 430;
        }
        else if(i==6){
            return 325;
        }
        else if(i==7){
            return 295;
        }
        else if(i==8){
            return 390;
        }
        else if(i==9){
            return 300;
        }
        else if(i==10){
            return 275;
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
        var salary_str = d.avg_salary.toString();
        if(salary_str.length == 5){
            salary_str = [salary_str.slice(0,2),",",salary_str.slice(2)].join('')
        }
        else{
            salary_str = [salary_str.slice(0,3),",",salary_str.slice(3)].join('')
        }
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.category + 
			"<table><tbody><tr><td style='font-family:Architects Daughter, cursive;'>Average Salary: </td><td style='font-family:Architects Daughter, cursive;'>" +"$" + salary_str + "</td></tr></tbody></table>")
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
    //LEGEND CIRCLE VIC
    var data_legend = new Array(data_vic_circle.length*2);
    for(var i=0; i<data_legend.length; i++){
        data_legend[i]= i;
    }
    d3.select('.leg_vic').selectAll(".vic_rect_legend")
    .data(data_legend)
    .enter().append("circle")
//    .attr("width", 15)
//    .attr("height", 20)
    .attr("class","vic_rect_legend")
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
    //LEGEND VIC ENDS
    d3.select('.leg_vic')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_vic_text")
        .style("fill","black")
        .attr("x",3)
        .attr("y",23)
        .text("Highest");
        d3.select('.leg_vic')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_vic_text")
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
//TREEMAP VICTORIA
//VIC, TREEMAP, job posts
// set the dimensions and margins of the graph
var margin_treemap = {top: 100, right: 50, bottom: 50, left: 100};
var svg_vic_job_post = d3.select("#vic_job_post").append("svg")
.attr("width", width-200)
.attr("height", height-100);
    //adding group to svg
var g_vic_job_post = svg_vic_job_post.append("g")
.attr("transform", "translate(100,100)");
//+ margin_treemap.left + "," + margin_treemap.top + ","+ margin_treemap.right + "," + margin_treemap.bottom +")");
//treemap legend coloring
//key:abr, value:color
var treemap_legend_color = new Object();
//LEGEND FOR TREEMAP VIC -------------
var vic_treemap_legend = svg_vic_job_post.append("g")
.attr("transform", "translate(130, 490)")
.attr("class","leg_treemap_vic");
vic_treemap_legend.append("rect")
    .attr("width", vic_legend_w-200)
    .attr("height", vic_legend_h);
//LEGEND FOR TREEMAP END --------------
d3.csv("datasets/about_your_pay/Vic_post_Tree.csv", type, function(data_vic_treemap){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return b-a;
    })
    var job_post_array = new Array(data_vic_treemap.length-1);
    //oth index in the data is null
    for(var i=1; i<data_vic_treemap.length;i++){
        job_post_array[i-1] = parseInt(data_vic_treemap[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return a - b;
    });
    var to_fill = d3.scaleLinear();
    to_fill.domain(job_post_array).range(my_color);
    var root = d3.stratify()
    .id(function(d){ 
        return d.category;
    })
    .parentId(function(d){
        return d.state;
    })(data_vic_treemap);
    root.sum(function(d) {
        //+symbol converts string to integer
        return +d.job_post;
    });
    d3.treemap()
    .size([width-300, height-300])
    .padding(4)
    (root);
    g_vic_job_post
        .selectAll(".rect_tree_vic")
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
        return d3.interpolateSpectral(parseFloat(d.data.color));
    })
    .on("mouseover", function(d){
        d3.select(this).style("stroke","black")
            .style("stroke-width", "1");
        tooltip.transition()
			.duration(500)
			.style("opacity", 1);
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.id + 
			"<table><tbody><tr><td></td><td style='font-family:Architects Daughter, cursive;'>" + d.value + " jobs available</td></tr></tbody></table>")
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
    //LEGEND VIC ENDS
    //LEGEND HIGHEST AND LOWEST AS TEXT
    d3.select('.leg_treemap_vic')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_vic_text")
        .style("fill","black")
        .attr("x",12)
        .attr("y",-75)
        .text("Highest");
    d3.select('.leg_treemap_vic')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_vic_text")
        .style("fill","black")
        .attr("x",295)
        .attr("y", -75)
        .text("Lowest");
    //LEGEND VIC TREEMAP ENDS
      // and to add the text labels ON THE TREEMAP
    g_vic_job_post
        .selectAll(".text_in_tree_vic")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("class","text_in_tree_vic")
        .attr("x", function(d){ 
        return d.x0+10;
    })    // +10 to adjust position (more right)
        .attr("y", function(d){ 
        return d.y0+20;
    })    // +20 to adjust position (lower)
        .attr("font-size", "0.9em")
        .attr("fill", "black")
        .attr("x", function(d,i){
            if(i==10){
                return d.x0+3;
            }
            else{
                return d.x0+5;
            }
    })
        .attr("y", function(d,i){
            if(i<8){
                return d.y0+13;
            }
            else{
                return d.y0 + 10;
            }
        })
        .text(function(d,i){
        d3.select(this)
        .classed("text_in_tree_vic2", i >7)
            if(d.data.abr == "A&E"){
                return "A";
            }
            else{
                return d.data.abr;
            }
    });
});
//LEGEND RECTANGLES VICTORIA TREEMAP
d3.csv("datasets/about_your_pay/Vic_post_legend.csv", type, function(data_vic_treemap_legend){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return b-a;
    })
    var job_post_array = new Array(data_vic_treemap_legend.length);
    //oth index in the data is null
    for(var i=0; i<data_vic_treemap_legend.length;i++){
        job_post_array[i] = parseInt(data_vic_treemap_legend[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return a - b;
    });
    var to_fill = d3.scaleOrdinal();
    to_fill.domain(job_post_array).range(my_color);
    d3.select('.leg_treemap_vic').selectAll(".vic_rect_legend_treemap")
    .data(data_vic_treemap_legend)
    .enter().append("rect")
    .attr("width", 15)
    .attr("height", 20)
    .attr("class","vic_rect_legend_treemap")
    .attr("x",function(d,i){
        return 69 +i*20;
    })
    .attr("y",function(){
        return -90;
    })
    .style("fill", function(d){
        return d3.interpolateSpectral(parseFloat(parseFloat(d.color)));
    });
});
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//QLD circle visualization, category salary
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

d3.csv("datasets/about_your_pay/Qld_salary.csv", type, function(data_qld_circle){
    var salary_categ = new Array(data_qld_circle.length);
    for(var i=0; i<data_qld_circle.length;i++){
        salary_categ[i] = data_qld_circle[i]["avg_salary"];
    }
    //sorting salary
    salary_categ.sort(function(a, b){
    return a - b;
    });
    salary_scale = d3.scaleLinear();
    salary_scale.domain([salary_categ[0],salary_categ[10]]).range([10,50]);
    
    var circles_qld = g_qld.selectAll(".qld_circle").data(data_qld_circle);
    circles_qld.enter().append("circle")
        .attr("class","qld_circle")
        .attr("cx", function (d,i){
        if (i == 0){
            return 260;
            }
        else if(i==1){
            return 360;
        }
        else if(i==2){
            return 270;
        }
        else if(i==3){
            return 365;
        }
        else if(i==4){
            return 440;
        }
        else if(i==5){
            return 310;
        }
        else if(i==6){
            return 430;
        }
        else if(i==7){
            return 370;
        }
        else if(i==8){
            return 435;
        }
        else if(i==9){
            return 490;
        }
        else if(i==10){
            return 330;
        }
        else{
            return 250 + i*40; 
        }
    })
        .attr("cy", function (d,i){
        if (i == 0){
            return 245;
            }
        else if (i == 1){
            return 210;
                 }
        else if (i == 2){
            return 350;
                 }
        else if (i == 3){
            return 370;
                 }
        else if (i == 4){
            return 250;
                 }
        else if(i==5){
            return 430;
        }
        else if(i==6){
            return 325;
        }
        else if(i==7){
            return 295;
        }
        else if(i==8){
            return 390;
        }
        else if(i==9){
            return 300;
        }
        else if(i==10){
            return 275;
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
        var salary_str = d.avg_salary.toString()
        if(salary_str.length == 5){
            salary_str = [salary_str.slice(0,2),",",salary_str.slice(2)].join('')
        }
        else{
            salary_str = [salary_str.slice(0,3),",",salary_str.slice(3)].join('')
        }
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.category + 
			"<table><tbody><tr><td style='font-family:Architects Daughter, cursive;'>Average Salary: </td><td style='font-family:Architects Daughter, cursive;'>" +"$" + salary_str + "</td></tr></tbody></table>")
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
    var data_legend = new Array(data_qld_circle.length*2);
    for(var i=0; i<data_legend.length; i++){
        data_legend[i]= i;
    }
    d3.select('.leg_qld').selectAll(".qld_rect_legend")
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
.attr("transform", "translate(100,100)");
//+ margin_treemap.left + "," + margin_treemap.top + ","+ margin_treemap.right + "," + margin_treemap.bottom +")");
//treemap legend coloring
//key:abr, value:color
var treemap_legend_color = new Object();
//LEGEND FOR TREEMAP QLD -------------
var qld_treemap_legend = svg_qld_job_post.append("g")
.attr("transform", "translate(130, 490)")
.attr("class","leg_treemap_qld");
qld_treemap_legend.append("rect")
    .attr("width", qld_legend_w-200)
    .attr("height", qld_legend_h);
//LEGEND FOR TREEMAP END --------------
d3.csv("datasets/about_your_pay/Qld_post_Tree.csv", type, function(data_qld_treemap){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return b-a;
    })
    var job_post_array = new Array(data_qld_treemap.length-1);
    //oth index in the data is null
    for(var i=1; i<data_qld_treemap.length;i++){
        job_post_array[i-1] = parseInt(data_qld_treemap[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return a - b;
    });
    var to_fill = d3.scaleLinear();
    to_fill.domain(job_post_array).range(my_color);
    var root = d3.stratify()
    .id(function(d){ 
        return d.category;
    })
    .parentId(function(d){
        return d.state;
    })(data_qld_treemap);
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
        return d3.interpolateRdYlGn(parseFloat(d.data.color));
    })
    .on("mouseover", function(d){
        d3.select(this).style("stroke","black")
            .style("stroke-width", "1");
        tooltip.transition()
			.duration(500)
			.style("opacity", 1);
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.id + 
			"<table><tbody><tr><td></td><td style='font-family:Architects Daughter, cursive;'>" + d.value + " jobs available</td></tr></tbody></table>")
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
    //LEGEND QLD ENDS
    //LEGEND HIGHEST AND LOWEST AS TEXT
    d3.select('.leg_treemap_qld')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_qld_text")
        .style("fill","black")
        .attr("x",12)
        .attr("y",-75)
        .text("Highest");
    d3.select('.leg_treemap_qld')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_qld_text")
        .style("fill","black")
        .attr("x",295)
        .attr("y",-75)
        .text("Lowest");
    //LEGEND QLD TREEMAP ENDS
      // and to add the text labels ON THE TREEMAP
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
        .attr("x", function(d){
            if(i<8){
                return d.x0+5;
            }
            else{
                return d.x0+1;
            }
    })
        .attr("y", function(d,i){
            if(i<8){
                return d.y0+13;
            }
            else{
                return d.y0 + 10;
            }
        })
        .text(function(d,i){ 
        d3.select(this)
        .classed("text_in_tree_qld2", i >7)
        return d.data.abr;
    });
});
//LEGEND RECTANGLES QUEENSLAND TREEMAP
d3.csv("datasets/about_your_pay/Qld_post_legend.csv", type, function(data_qld_treemap_legend){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return a-b;
    });
    var job_post_array = new Array(data_qld_treemap_legend.length);
    //oth index in the data is null
    for(var i=0; i<data_qld_treemap_legend.length;i++){
        job_post_array[i] = parseInt(data_qld_treemap_legend[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return b - a;
    });
    var to_fill = d3.scaleOrdinal();
    to_fill.domain(job_post_array).range(my_color);
    d3.select('.leg_treemap_qld').selectAll(".qld_rect_legend_treemap")
    .data(data_qld_treemap_legend)
    .enter().append("rect")
    .attr("width", 15)
    .attr("height", 20)
    .attr("class","qld_rect_legend_treemap")
    .attr("x",function(d,i){
        return 69 +i*20;
    })
    .attr("y",function(){
        return -90;
    })
    .style("fill", function(d){
        return d3.interpolateRdYlGn(parseFloat(parseFloat(d.color)));
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

d3.csv("datasets/about_your_pay/Nsw_salary.csv", type, function(data_nsw_circle){
    var salary_categ = new Array(data_nsw_circle.length);
    for(var i=0; i<data_nsw_circle.length;i++){
        salary_categ[i] = data_nsw_circle[i]["avg_salary"];
    }
    //sorting salary
    salary_categ.sort(function(a, b){
    return a - b;
    });
    salary_scale = d3.scaleLinear();
    salary_scale.domain([salary_categ[0],salary_categ[10]]).range([10,50]);
    
    var circles_nsw = g_nsw.selectAll(".nsw_circle").data(data_nsw_circle);
    circles_nsw.enter().append("circle")
        .attr("class","nsw_circle")
        .attr("cx", function (d,i){
        if (i == 0){
            return 260;
            }
        else if(i==1){
            return 360;
        }
        else if(i==2){
            return 270;
        }
        else if(i==3){
            return 365;
        }
        else if(i==4){
            return 440;
        }
        else if(i==5){
            return 310;
        }
        else if(i==6){
            return 430;
        }
        else if(i==7){
            return 370;
        }
        else if(i==8){
            return 435;
        }
        else if(i==9){
            return 490;
        }
        else if(i==10){
            return 330;
        }
        else{
            return 250 + i*40; 
        }
    })
        .attr("cy", function (d,i){
        if (i == 0){
            return 245;
            }
        else if (i == 1){
            return 210;
                 }
        else if (i == 2){
            return 350;
                 }
        else if (i == 3){
            return 370;
                 }
        else if (i == 4){
            return 250;
                 }
        else if(i==5){
            return 430;
        }
        else if(i==6){
            return 325;
        }
        else if(i==7){
            return 295;
        }
        else if(i==8){
            return 390;
        }
        else if(i==9){
            return 300;
        }
        else if(i==10){
            return 275;
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
        var salary_str = d.avg_salary.toString()
        if(salary_str.length == 5){
            salary_str = [salary_str.slice(0,2),",",salary_str.slice(2)].join('')
        }
        else{
            salary_str = [salary_str.slice(0,3),",",salary_str.slice(3)].join('')
        }
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.category + 
			"<table><tbody><tr><td style='font-family:Architects Daughter, cursive;'>Average Salary: </td><td style='font-family:Architects Daughter, cursive;'>" +"$" + salary_str + "</td></tr></tbody></table>")
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
    var data_legend = new Array(data_nsw_circle.length*2);
    for(var i=0; i<data_legend.length; i++){
        data_legend[i]= i;
    }
    d3.select('.leg_nsw').selectAll(".nsw_rect_legend")
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
.attr("transform", "translate(100,100)");
//+ margin_treemap.left + "," + margin_treemap.top + ","+ margin_treemap.right + "," + margin_treemap.bottom +")");
//treemap legend coloring
//key:abr, value:color
var treemap_legend_color = new Object();
//LEGEND FOR TREEMAP NSW -------------
var nsw_treemap_legend = svg_nsw_job_post.append("g")
.attr("transform", "translate(130, 490)")
.attr("class","leg_treemap_nsw");
nsw_treemap_legend.append("rect")
    .attr("width", nsw_legend_w-200)
    .attr("height", nsw_legend_h);
//LEGEND FOR TREEMAP END --------------
d3.csv("datasets/about_your_pay/NSW_post_Tree.csv", type, function(data_nsw_treemap){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return b-a;
    })
    var job_post_array = new Array(data_nsw_treemap.length-1);
    //oth index in the data is null
    for(var i=1; i<data_nsw_treemap.length;i++){
        job_post_array[i-1] = parseInt(data_nsw_treemap[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return a - b;
    });
    var to_fill = d3.scaleLinear();
    to_fill.domain(job_post_array).range(my_color);
    var root = d3.stratify()
    .id(function(d){ 
        return d.category;
    })
    .parentId(function(d){
        return d.state;
    })(data_nsw_treemap);
    root.sum(function(d) {
        //+symbol converts string to integer
        return +d.job_post;
    });
    d3.treemap()
    .size([width-300, height-300])
    .padding(4)
    (root);
    g_nsw_job_post
        .selectAll(".rect_tree_nsw")
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
        return d3.interpolateRdYlBu(parseFloat(d.data.color));
    })
    .on("mouseover", function(d){
        d3.select(this).style("stroke","black")
            .style("stroke-width", "1");
        tooltip.transition()
			.duration(500)
			.style("opacity", 1);
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.id + 
			"<table><tbody><tr><td></td><td style='font-family:Architects Daughter, cursive;'>" + d.value + " jobs available</td></tr></tbody></table>")
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
    //LEGEND NSW ENDS
    //LEGEND HIGHEST AND LOWEST AS TEXT
    d3.select('.leg_treemap_nsw')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_nsw_text")
        .style("fill","black")
        .attr("x",12)
        .attr("y",-75)
        .text("Highest");
    d3.select('.leg_treemap_nsw')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_nsw_text")
        .style("fill","black")
        .attr("x",295)
        .attr("y",-75)
        .text("Lowest");
    //LEGEND NSW TREEMAP ENDS
      // and to add the text labels ON THE TREEMAP
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
        .attr("x", function(d){
        if(i<8){
            return d.x0+5;
        }
        else{
            return d.x0+1;
        }
    })
        .attr("y", function(d,i){
            if(i<8){
                return d.y0+13;
            }
            else{
                return d.y0 + 10;
            }
        })
        .text(function(d,i){
        d3.select(this)
        .classed("text_in_tree_nsw2", i >7)
        return d.data.abr;
    });
});
//LEGEND RECTANGLES NEW SOUTH WALES TREEMAP
d3.csv("datasets/about_your_pay/NSW_post_legend.csv", type, function(data_nsw_treemap_legend){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return b-a;
    })
    var job_post_array = new Array(data_nsw_treemap_legend.length);
    //oth index in the data is null
    for(var i=0; i<data_nsw_treemap_legend.length;i++){
        job_post_array[i] = parseInt(data_nsw_treemap_legend[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return a - b;
    });
    var to_fill = d3.scaleOrdinal();
    to_fill.domain(job_post_array).range(my_color);
    d3.select('.leg_treemap_nsw').selectAll(".nsw_rect_legend_treemap")
    .data(data_nsw_treemap_legend)
    .enter().append("rect")
    .attr("width", 15)
    .attr("height", 20)
    .attr("class","nsw_rect_legend_treemap")
    .attr("x",function(d,i){
        return 69 +i*20;
    })
    .attr("y",function(){
        return -90;
    })
    .style("fill", function(d){
        return d3.interpolateRdYlBu(parseFloat(parseFloat(d.color)));
    });
});
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//TAS circle visualization, category salary
var svg_tas_categ = d3.select("#tas_categ").append("svg")
.attr("width", width)
.attr("height", height-200);
//adding group to svg
var g_tas = svg_tas_categ.append("g").attr("transform", "translate(30, -100)");

//LEGEND CIRCLE TAS
var tas_legend_w = 555,
    tas_legend_h = 40;

var legend_tas = svg_tas_categ.append("g")
.attr("transform", "translate(120, 410)")
.attr("class","leg_tas");

legend_tas.append("rect")
    .attr("width", tas_legend_w)
    .attr("height", tas_legend_h);

d3.csv("datasets/about_your_pay/Tas_salary.csv", type, function(data_tas_circle){
    var salary_categ = new Array(data_tas_circle.length);
    for(var i=0; i<data_tas_circle.length;i++){
        salary_categ[i] = data_tas_circle[i]["avg_salary"];
    }
    //sorting salary
    salary_categ.sort(function(a, b){
    return a - b;
    });
    salary_scale = d3.scaleLinear();
    salary_scale.domain([salary_categ[0],salary_categ[10]]).range([10,50]);
    
    var circles_tas = g_tas.selectAll(".tas_circle").data(data_tas_circle);
    circles_tas.enter().append("circle")
        .attr("class","tas_circle")
        .attr("cx", function (d,i){
        if (i == 0){
            return 260;
            }
        else if(i==1){
            return 360;
        }
        else if(i==2){
            return 270;
        }
        else if(i==3){
            return 365;
        }
        else if(i==4){
            return 440;
        }
        else if(i==5){
            return 310;
        }
        else if(i==6){
            return 430;
        }
        else if(i==7){
            return 370;
        }
        else if(i==8){
            return 435;
        }
        else if(i==9){
            return 490;
        }
        else if(i==10){
            return 330;
        }
        else{
            return 250 + i*40; 
        }
    })
        .attr("cy", function (d,i){
        if (i == 0){
            return 245;
            }
        else if (i == 1){
            return 210;
                 }
        else if (i == 2){
            return 350;
                 }
        else if (i == 3){
            return 370;
                 }
        else if (i == 4){
            return 250;
                 }
        else if(i==5){
            return 430;
        }
        else if(i==6){
            return 325;
        }
        else if(i==7){
            return 295;
        }
        else if(i==8){
            return 390;
        }
        else if(i==9){
            return 300;
        }
        else if(i==10){
            return 275;
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
        var salary_str = d.avg_salary.toString()
        if(salary_str.length == 5){
            salary_str = [salary_str.slice(0,2),",",salary_str.slice(2)].join('')
        }
        else{
            salary_str = [salary_str.slice(0,3),",",salary_str.slice(3)].join('')
        }
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.category + 
			"<table><tbody><tr><td style='font-family:Architects Daughter, cursive;'>Average Salary: </td><td style='font-family:Architects Daughter, cursive;'>" +"$" + salary_str + "</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 10) + "px")
			.style("top", (d3.event.pageY +10) + "px");
    })
    .on("mouseout", function(d){
        d3.selectAll('.tas_circle')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND CIRCLE TAS
    var data_legend = new Array(data_tas_circle.length*2);
    for(var i=0; i<data_legend.length; i++){
        data_legend[i]= i;
    }
    d3.select('.leg_tas').selectAll(".tas_rect_legend")
    .data(data_legend)
    .enter().append("circle")
//    .attr("width", 15)
//    .attr("height", 20)
    .attr("class","tas_rect_legend")
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
    //LEGEND TAS ENDS
    d3.select('.leg_tas')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_tas_text")
        .style("fill","black")
        .attr("x",3)
        .attr("y",23)
        .text("Highest");
        d3.select('.leg_tas')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_tas_text")
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
//TREEMAP TASMANIA
//TAS, TREEMAP, job posts
// set the dimensions and margins of the graph
var margin_treemap = {top: 100, right: 50, bottom: 50, left: 100};
var svg_tas_job_post = d3.select("#tas_job_post").append("svg")
.attr("width", width-200)
.attr("height", height-100);
    //adding group to svg
var g_tas_job_post = svg_tas_job_post.append("g")
.attr("transform", "translate(100,100)");
//+ margin_treemap.left + "," + margin_treemap.top + ","+ margin_treemap.right + "," + margin_treemap.bottom +")");
//treemap legend coloring
//key:abr, value:color
var treemap_legend_color = new Object();
//LEGEND FOR TREEMAP TAS -------------
var tas_treemap_legend = svg_tas_job_post.append("g")
.attr("transform", "translate(130, 490)")
.attr("class","leg_treemap_tas");
tas_treemap_legend.append("rect")
    .attr("width", tas_legend_w-200)
    .attr("height", tas_legend_h);
//LEGEND FOR TREEMAP END --------------
d3.csv("datasets/about_your_pay/Tas_post_Tree.csv", type, function(data_tas_treemap){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return b-a;
    })
    var job_post_array = new Array(data_tas_treemap.length-1);
    //oth index in the data is null
    for(var i=1; i<data_tas_treemap.length;i++){
        job_post_array[i-1] = parseInt(data_tas_treemap[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return a - b;
    });
    var to_fill = d3.scaleLinear();
    to_fill.domain(job_post_array).range(my_color);
    var root = d3.stratify()
    .id(function(d){ 
        return d.category;
    })
    .parentId(function(d){
        return d.state;
    })(data_tas_treemap);
    root.sum(function(d) {
        //+symbol converts string to integer
        return +d.job_post;
    });
    d3.treemap()
    .size([width-300, height-300])
    .padding(4)
    (root);
    g_tas_job_post
        .selectAll(".rect_tree_tas")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("class","rect_tree_tas")
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
        return d3.interpolateRdBu(parseFloat(d.data.color));
    })
    .on("mouseover", function(d){
        d3.select(this).style("stroke","black")
            .style("stroke-width", "1");
        tooltip.transition()
			.duration(500)
			.style("opacity", 1);
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.id + 
			"<table><tbody><tr><td></td><td style='font-family:Architects Daughter, cursive;'>" + d.value + " jobs available</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 10) + "px")
			.style("top", (d3.event.pageY +10) + "px");
    })
    .on("mouseout", function(d){
        d3.selectAll('.rect_tree_tas')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND TAS ENDS
    //LEGEND HIGHEST AND LOWEST AS TEXT
    d3.select('.leg_treemap_tas')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_tas_text")
        .style("fill","black")
        .attr("x",12)
        .attr("y",-75)
        .text("Highest");
    d3.select('.leg_treemap_tas')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_tas_text")
        .style("fill","black")
        .attr("x",295)
        .attr("y",-75)
        .text("Lowest");
    //LEGEND TAS TREEMAP ENDS
      // and to add the text labels ON THE TREEMAP
    g_tas_job_post
        .selectAll(".text_in_tree_tas")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("class","text_in_tree_tas")
        .attr("x", function(d){ 
        return d.x0+10;
    })    // +10 to adjust position (more right)
        .attr("y", function(d){ 
        return d.y0+20;
    })    // +20 to adjust position (lower)
        .attr("font-size", "0.9em")
        .attr("fill", "black")
        .attr("x", function(d){
            if(i<10){
                return d.x0+5;
            }
            else{
                return d.x0+4;
            }
    })
        .attr("y", function(d,i){
            return d.y0+13;
        })
        .text(function(d,i){
        d3.select(this)
        .classed("text_in_tree_tas2", i >9)
        return d.data.abr;
    });
});
//LEGEND RECTANGLES TASMANIA TREEMAP
d3.csv("datasets/about_your_pay/Tas_post_legend.csv", type, function(data_tas_treemap_legend){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return a-b;
    });
    var job_post_array = new Array(data_tas_treemap_legend.length);
    //oth index in the data is null
    for(var i=0; i<data_tas_treemap_legend.length;i++){
        job_post_array[i] = parseInt(data_tas_treemap_legend[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return b - a;
    });
    var to_fill = d3.scaleOrdinal();
    to_fill.domain(job_post_array).range(my_color);
    d3.select('.leg_treemap_tas').selectAll(".tas_rect_legend_treemap")
    .data(data_tas_treemap_legend)
    .enter().append("rect")
    .attr("width", 15)
    .attr("height", 20)
    .attr("class","tas_rect_legend_treemap")
    .attr("x",function(d,i){
        return 69 +i*20;
    })
    .attr("y",function(){
        return -90;
    })
    .style("fill", function(d){
        return d3.interpolateRdBu(parseFloat(parseFloat(d.color)));
    });
});
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//WA circle visualization, category salary
var svg_wa_categ = d3.select("#wa_categ").append("svg")
.attr("width", width)
.attr("height", height-200);
//adding group to svg
var g_wa = svg_wa_categ.append("g").attr("transform", "translate(30, -100)");

//LEGEND CIRCLE WA
var wa_legend_w = 555,
    wa_legend_h = 40;

var legend_wa = svg_wa_categ.append("g")
.attr("transform", "translate(120, 410)")
.attr("class","leg_wa");

legend_wa.append("rect")
    .attr("width", wa_legend_w)
    .attr("height", wa_legend_h);

d3.csv("datasets/about_your_pay/Wa_salary.csv", type, function(data_wa_circle){
    var salary_categ = new Array(data_wa_circle.length);
    for(var i=0; i<data_wa_circle.length;i++){
        salary_categ[i] = data_wa_circle[i]["avg_salary"];
    }
    //sorting salary
    salary_categ.sort(function(a, b){
    return a - b;
    });
    salary_scale = d3.scaleLinear();
    salary_scale.domain([salary_categ[0],salary_categ[10]]).range([10,50]);
    
    var circles_wa = g_wa.selectAll(".wa_circle").data(data_wa_circle);
    circles_wa.enter().append("circle")
        .attr("class","wa_circle")
        .attr("cx", function (d,i){
        if (i == 0){
            return 260;
            }
        else if(i==1){
            return 360;
        }
        else if(i==2){
            return 270;
        }
        else if(i==3){
            return 365;
        }
        else if(i==4){
            return 440;
        }
        else if(i==5){
            return 310;
        }
        else if(i==6){
            return 430;
        }
        else if(i==7){
            return 370;
        }
        else if(i==8){
            return 435;
        }
        else if(i==9){
            return 490;
        }
        else if(i==10){
            return 330;
        }
        else{
            return 250 + i*40; 
        }
    })
        .attr("cy", function (d,i){
        if (i == 0){
            return 245;
            }
        else if (i == 1){
            return 210;
                 }
        else if (i == 2){
            return 350;
                 }
        else if (i == 3){
            return 370;
                 }
        else if (i == 4){
            return 250;
                 }
        else if(i==5){
            return 430;
        }
        else if(i==6){
            return 325;
        }
        else if(i==7){
            return 295;
        }
        else if(i==8){
            return 390;
        }
        else if(i==9){
            return 300;
        }
        else if(i==10){
            return 275;
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
        var salary_str = d.avg_salary.toString()
        if(salary_str.length == 5){
            salary_str = [salary_str.slice(0,2),",",salary_str.slice(2)].join('')
        }
        else{
            salary_str = [salary_str.slice(0,3),",",salary_str.slice(3)].join('')
        }
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.category + 
			"<table><tbody><tr><td style='font-family:Architects Daughter, cursive;'>Average Salary: </td><td style='font-family:Architects Daughter, cursive;'>" +"$" + salary_str + "</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 10) + "px")
			.style("top", (d3.event.pageY +10) + "px");
    })
    .on("mouseout", function(d){
        d3.selectAll('.wa_circle')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND CIRCLE WA
    var data_legend = new Array(data_wa_circle.length*2);
    for(var i=0; i<data_legend.length; i++){
        data_legend[i]= i;
    }
    d3.select('.leg_wa').selectAll(".wa_rect_legend")
    .data(data_legend)
    .enter().append("circle")
//    .attr("width", 15)
//    .attr("height", 20)
    .attr("class","wa_rect_legend")
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
    //LEGEND WA ENDS
    d3.select('.leg_wa')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_wa_text")
        .style("fill","black")
        .attr("x",3)
        .attr("y",23)
        .text("Highest");
        d3.select('.leg_wa')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_wa_text")
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
//TREEMAP WESTERN AUSTRALIA
//WA, TREEMAP, job posts
// set the dimensions and margins of the graph
var margin_treemap = {top: 100, right: 50, bottom: 50, left: 100};
var svg_wa_job_post = d3.select("#wa_job_post").append("svg")
.attr("width", width-200)
.attr("height", height-100);
    //adding group to svg
var g_wa_job_post = svg_wa_job_post.append("g")
.attr("transform", "translate(100,100)");
//+ margin_treemap.left + "," + margin_treemap.top + ","+ margin_treemap.right + "," + margin_treemap.bottom +")");
//treemap legend coloring
//key:abr, value:color
var treemap_legend_color = new Object();
//LEGEND FOR TREEMAP WA -------------
var wa_treemap_legend = svg_wa_job_post.append("g")
.attr("transform", "translate(130, 490)")
.attr("class","leg_treemap_wa");
wa_treemap_legend.append("rect")
    .attr("width", wa_legend_w-200)
    .attr("height", wa_legend_h);
//LEGEND FOR TREEMAP END --------------
d3.csv("datasets/about_your_pay/Wa_post_Tree.csv", type, function(data_wa_treemap){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return b-a;
    })
    var job_post_array = new Array(data_wa_treemap.length-1);
    //oth index in the data is null
    for(var i=1; i<data_wa_treemap.length;i++){
        job_post_array[i-1] = parseInt(data_wa_treemap[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return a - b;
    });
    var to_fill = d3.scaleLinear();
    to_fill.domain(job_post_array).range(my_color);
    var root = d3.stratify()
    .id(function(d){ 
        return d.category;
    })
    .parentId(function(d){
        return d.state;
    })(data_wa_treemap);
    root.sum(function(d) {
        //+symbol converts string to integer
        return +d.job_post;
    });
    d3.treemap()
    .size([width-300, height-300])
    .padding(4)
    (root);
    g_wa_job_post
        .selectAll(".rect_tree_wa")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("class","rect_tree_wa")
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
        return d3.interpolatePuOr(parseFloat(d.data.color));
    })
    .on("mouseover", function(d){
        d3.select(this).style("stroke","black")
            .style("stroke-width", "1");
        tooltip.transition()
			.duration(500)
			.style("opacity", 1);
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.id + 
			"<table><tbody><tr><td></td><td style='font-family:Architects Daughter, cursive;'>" + d.value + " jobs available</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 10) + "px")
			.style("top", (d3.event.pageY +10) + "px");
    })
    .on("mouseout", function(d){
        d3.selectAll('.rect_tree_wa')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND WA ENDS
    //LEGEND HIGHEST AND LOWEST AS TEXT
    d3.select('.leg_treemap_wa')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_wa_text")
        .style("fill","black")
        .attr("x",12)
        .attr("y",-75)
        .text("Highest");
    d3.select('.leg_treemap_wa')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_wa_text")
        .style("fill","black")
        .attr("x",295)
        .attr("y",-75)
        .text("Lowest");
    //LEGEND WA TREEMAP ENDS
      // and to add the text labels ON THE TREEMAP
    g_wa_job_post
        .selectAll(".text_in_tree_wa")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("class","text_in_tree_wa")
        .attr("x", function(d){ 
        return d.x0+10;
    })    // +10 to adjust position (more right)
        .attr("y", function(d){ 
        return d.y0+20;
    })    // +20 to adjust position (lower)
        .attr("font-size", "0.9em")
        .attr("fill", "black")
        .attr("x", function(d){
            if(i<8){
                return d.x0+5;
            }
            else{
                return d.x0+1;
            }
    })
        .attr("y", function(d,i){
            if(i<8){
                return d.y0+13;
            }
            else{
                return d.y0 + 10;
            }
        })
        .text(function(d,i){ 
        d3.select(this)
        .classed("text_in_tree_wa2", i >7)
        return d.data.abr;
    });
});
//LEGEND RECTANGLES QUEENSLAND TREEMAP
d3.csv("datasets/about_your_pay/Wa_post_legend.csv", type, function(data_wa_treemap_legend){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return a-b;
    });
    var job_post_array = new Array(data_wa_treemap_legend.length);
    //oth index in the data is null
    for(var i=0; i<data_wa_treemap_legend.length;i++){
        job_post_array[i] = parseInt(data_wa_treemap_legend[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return b - a;
    });
    var to_fill = d3.scaleOrdinal();
    to_fill.domain(job_post_array).range(my_color);
    d3.select('.leg_treemap_wa').selectAll(".wa_rect_legend_treemap")
    .data(data_wa_treemap_legend)
    .enter().append("rect")
    .attr("width", 15)
    .attr("height", 20)
    .attr("class","wa_rect_legend_treemap")
    .attr("x",function(d,i){
        return 69 +i*20;
    })
    .attr("y",function(){
        return -90;
    })
    .style("fill", function(d){
        return d3.interpolatePuOr(parseFloat(parseFloat(d.color)));
    });
});
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//SA circle visualization, category salary
var svg_sa_categ = d3.select("#sa_categ").append("svg")
.attr("width", width)
.attr("height", height-200);
//adding group to svg
var g_sa = svg_sa_categ.append("g").attr("transform", "translate(30, -100)");

//LEGEND CIRCLE SA
var sa_legend_w = 555,
    sa_legend_h = 40;

var legend_sa = svg_sa_categ.append("g")
.attr("transform", "translate(120, 410)")
.attr("class","leg_sa");

legend_sa.append("rect")
    .attr("width", sa_legend_w)
    .attr("height", sa_legend_h);

d3.csv("datasets/about_your_pay/Sa_salary.csv", type, function(data_sa_circle){
    var salary_categ = new Array(data_sa_circle.length);
    for(var i=0; i<data_sa_circle.length;i++){
        salary_categ[i] = data_sa_circle[i]["avg_salary"];
    }
    //sorting salary
    salary_categ.sort(function(a, b){
    return a - b;
    });
    salary_scale = d3.scaleLinear();
    salary_scale.domain([salary_categ[0],salary_categ[10]]).range([10,50]);
    
    var circles_sa = g_sa.selectAll(".sa_circle").data(data_sa_circle);
    circles_sa.enter().append("circle")
        .attr("class","sa_circle")
        .attr("cx", function (d,i){
        if (i == 0){
            return 260;
            }
        else if(i==1){
            return 360;
        }
        else if(i==2){
            return 270;
        }
        else if(i==3){
            return 365;
        }
        else if(i==4){
            return 440;
        }
        else if(i==5){
            return 310;
        }
        else if(i==6){
            return 430;
        }
        else if(i==7){
            return 370;
        }
        else if(i==8){
            return 435;
        }
        else if(i==9){
            return 490;
        }
        else if(i==10){
            return 330;
        }
        else{
            return 250 + i*40; 
        }
    })
        .attr("cy", function (d,i){
        if (i == 0){
            return 245;
            }
        else if (i == 1){
            return 210;
                 }
        else if (i == 2){
            return 350;
                 }
        else if (i == 3){
            return 370;
                 }
        else if (i == 4){
            return 250;
                 }
        else if(i==5){
            return 430;
        }
        else if(i==6){
            return 325;
        }
        else if(i==7){
            return 295;
        }
        else if(i==8){
            return 390;
        }
        else if(i==9){
            return 300;
        }
        else if(i==10){
            return 275;
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
        var salary_str = d.avg_salary.toString()
        if(salary_str.length == 5){
            salary_str = [salary_str.slice(0,2),",",salary_str.slice(2)].join('')
        }
        else{
            salary_str = [salary_str.slice(0,3),",",salary_str.slice(3)].join('')
        }
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.category + 
			"<table><tbody><tr><td style='font-family:Architects Daughter, cursive;'>Average Salary: </td><td style='font-family:Architects Daughter, cursive;'>" +"$" + salary_str + "</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 10) + "px")
			.style("top", (d3.event.pageY +10) + "px");
    })
    .on("mouseout", function(d){
        d3.selectAll('.sa_circle')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND CIRCLE SA
    var data_legend = new Array(data_sa_circle.length*2);
    for(var i=0; i<data_legend.length; i++){
        data_legend[i]= i;
    }
    d3.select('.leg_sa').selectAll(".sa_rect_legend")
    .data(data_legend)
    .enter().append("circle")
//    .attr("width", 15)
//    .attr("height", 20)
    .attr("class","sa_rect_legend")
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
    //LEGEND SA ENDS
    d3.select('.leg_sa')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_sa_text")
        .style("fill","black")
        .attr("x",3)
        .attr("y",23)
        .text("Highest");
        d3.select('.leg_sa')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_sa_text")
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
//TREEMAP SOUTH AUSTRALIA
//SA, TREEMAP, job posts
// set the dimensions and margins of the graph
var margin_treemap = {top: 100, right: 50, bottom: 50, left: 100};
var svg_sa_job_post = d3.select("#sa_job_post").append("svg")
.attr("width", width-200)
.attr("height", height-100);
    //adding group to svg
var g_sa_job_post = svg_sa_job_post.append("g")
.attr("transform", "translate(100,100)");
//+ margin_treemap.left + "," + margin_treemap.top + ","+ margin_treemap.right + "," + margin_treemap.bottom +")");
//treemap legend coloring
//key:abr, value:color
var treemap_legend_color = new Object();
//LEGEND FOR TREEMAP SA -------------
var sa_treemap_legend = svg_sa_job_post.append("g")
.attr("transform", "translate(130, 490)")
.attr("class","leg_treemap_sa");
sa_treemap_legend.append("rect")
    .attr("width", sa_legend_w-200)
    .attr("height", sa_legend_h);
//LEGEND FOR TREEMAP END --------------
d3.csv("datasets/about_your_pay/Sa_post_Tree.csv", type, function(data_sa_treemap){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return b-a;
    })
    var job_post_array = new Array(data_sa_treemap.length-1);
    //oth index in the data is null
    for(var i=1; i<data_sa_treemap.length;i++){
        job_post_array[i-1] = parseInt(data_sa_treemap[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return a - b;
    });
    var to_fill = d3.scaleLinear();
    to_fill.domain(job_post_array).range(my_color);
    var root = d3.stratify()
    .id(function(d){ 
        return d.category;
    })
    .parentId(function(d){
        return d.state;
    })(data_sa_treemap);
    root.sum(function(d) {
        //+symbol converts string to integer
        return +d.job_post;
    });
    d3.treemap()
    .size([width-300, height-300])
    .padding(4)
    (root);
    g_sa_job_post
        .selectAll(".rect_tree_sa")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("class","rect_tree_sa")
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
        return d3.interpolateSpectral(parseFloat(d.data.color));
    })
    .on("mouseover", function(d){
        d3.select(this).style("stroke","black")
            .style("stroke-width", "1");
        tooltip.transition()
			.duration(500)
			.style("opacity", 1);
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.id + 
			"<table><tbody><tr><td></td><td style='font-family:Architects Daughter, cursive;'>" + d.value + " jobs available</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 10) + "px")
			.style("top", (d3.event.pageY +10) + "px");
    })
    .on("mouseout", function(d){
        d3.selectAll('.rect_tree_sa')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND SA ENDS
    //LEGEND HIGHEST AND LOWEST AS TEXT
    d3.select('.leg_treemap_sa')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_sa_text")
        .style("fill","black")
        .attr("x",12)
        .attr("y",-75)
        .text("Highest");
    d3.select('.leg_treemap_sa')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_sa_text")
        .style("fill","black")
        .attr("x",295)
        .attr("y",-75)
        .text("Lowest");
    //LEGEND SA TREEMAP ENDS
      // and to add the text labels ON THE TREEMAP
    g_sa_job_post
        .selectAll(".text_in_tree_sa")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("class","text_in_tree_sa")
        .attr("x", function(d){ 
        return d.x0+10;
    })    // +10 to adjust position (more right)
        .attr("y", function(d){ 
        return d.y0+20;
    })    // +20 to adjust position (lower)
        .attr("font-size", "0.9em")
        .attr("fill", "black")
        .attr("x", function(d){
        return d.x0+5;
    })
        .attr("y", function(d,i){
            if(i<8){
                return d.y0+13;
            }
            else{
                return d.y0 + 10;
            }
        })
        .text(function(d,i){
            d3.select(this)
                .classed("text_in_tree_sa2", i >7)
            if(d.data.abr == "CA"){
                return "";
            }
            else{
                return d.data.abr; }
    });
});
//LEGEND RECTANGLES SOUTH AUSTRALIA TREEMAP
d3.csv("datasets/about_your_pay/Sa_post_legend.csv", type, function(data_sa_treemap_legend){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return b-a;
    })
    var job_post_array = new Array(data_sa_treemap_legend.length);
    //oth index in the data is null
    for(var i=0; i<data_sa_treemap_legend.length;i++){
        job_post_array[i] = parseInt(data_sa_treemap_legend[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return a - b;
    });
    var to_fill = d3.scaleOrdinal();
    to_fill.domain(job_post_array).range(my_color);
    d3.select('.leg_treemap_sa').selectAll(".sa_rect_legend_treemap")
    .data(data_sa_treemap_legend)
    .enter().append("rect")
    .attr("width", 15)
    .attr("height", 20)
    .attr("class","sa_rect_legend_treemap")
    .attr("x",function(d,i){
        return 69 +i*20;
    })
    .attr("y",function(){
        return -90;
    })
    .style("fill", function(d){
        return d3.interpolateSpectral(parseFloat(parseFloat(d.color)));
    });
});
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//ACT circle visualization, category salary
var svg_act_categ = d3.select("#act_categ").append("svg")
.attr("width", width)
.attr("height", height-200);
//adding group to svg
var g_act = svg_act_categ.append("g").attr("transform", "translate(30, -100)");

//LEGEND CIRCLE act
var act_legend_w = 555,
    act_legend_h = 40;

var legend_act = svg_act_categ.append("g")
.attr("transform", "translate(120, 410)")
.attr("class","leg_act");

legend_act.append("rect")
    .attr("width", act_legend_w)
    .attr("height", act_legend_h);

d3.csv("datasets/about_your_pay/Act_salary.csv", type, function(data_act_circle){
    var salary_categ = new Array(data_act_circle.length);
    for(var i=0; i<data_act_circle.length;i++){
        salary_categ[i] = data_act_circle[i]["avg_salary"];
    }
    //sorting salary
    salary_categ.sort(function(a, b){
    return a - b;
    });
    salary_scale = d3.scaleLinear();
    salary_scale.domain([salary_categ[0],salary_categ[10]]).range([10,50]);
    
    var circles_act = g_act.selectAll(".act_circle").data(data_act_circle);
    circles_act.enter().append("circle")
        .attr("class","act_circle")
        .attr("cx", function (d,i){
        if (i == 0){
            return 260;
            }
        else if(i==1){
            return 360;
        }
        else if(i==2){
            return 270;
        }
        else if(i==3){
            return 365;
        }
        else if(i==4){
            return 440;
        }
        else if(i==5){
            return 310;
        }
        else if(i==6){
            return 430;
        }
        else if(i==7){
            return 370;
        }
        else if(i==8){
            return 435;
        }
        else if(i==9){
            return 490;
        }
        else if(i==10){
            return 330;
        }
        else{
            return 250 + i*40; 
        }
    })
        .attr("cy", function (d,i){
        if (i == 0){
            return 245;
            }
        else if (i == 1){
            return 210;
                 }
        else if (i == 2){
            return 350;
                 }
        else if (i == 3){
            return 370;
                 }
        else if (i == 4){
            return 250;
                 }
        else if(i==5){
            return 430;
        }
        else if(i==6){
            return 325;
        }
        else if(i==7){
            return 295;
        }
        else if(i==8){
            return 390;
        }
        else if(i==9){
            return 300;
        }
        else if(i==10){
            return 275;
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
        var salary_str = d.avg_salary.toString()
        if(salary_str.length == 5){
            salary_str = [salary_str.slice(0,2),",",salary_str.slice(2)].join('')
        }
        else{
            salary_str = [salary_str.slice(0,3),",",salary_str.slice(3)].join('')
        }
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.category + 
			"<table><tbody><tr><td style='font-family:Architects Daughter, cursive;'>Average Salary: </td><td style='font-family:Architects Daughter, cursive;'>" +"$" + salary_str + "</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 10) + "px")
			.style("top", (d3.event.pageY +10) + "px");
    })
    .on("mouseout", function(d){
        d3.selectAll('.act_circle')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND CIRCLE act
    var data_legend = new Array(data_act_circle.length*2);
    for(var i=0; i<data_legend.length; i++){
        data_legend[i]= i;
    }
    d3.select('.leg_act').selectAll(".act_rect_legend")
    .data(data_legend)
    .enter().append("circle")
//    .attr("width", 15)
//    .attr("height", 20)
    .attr("class","act_rect_legend")
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
    //LEGEND act ENDS
    d3.select('.leg_act')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_act_text")
        .style("fill","black")
        .attr("x",3)
        .attr("y",23)
        .text("Highest");
        d3.select('.leg_act')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_act_text")
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
//TREEMAP ACT
//act, TREEMAP, job posts
// set the dimensions and margins of the graph
var margin_treemap = {top: 100, right: 50, bottom: 50, left: 100};
var svg_act_job_post = d3.select("#act_job_post").append("svg")
.attr("width", width-200)
.attr("height", height-100);
    //adding group to svg
var g_act_job_post = svg_act_job_post.append("g")
.attr("transform", "translate(100,100)");
//+ margin_treemap.left + "," + margin_treemap.top + ","+ margin_treemap.right + "," + margin_treemap.bottom +")");
//treemap legend coloring
//key:abr, value:color
var treemap_legend_color = new Object();
//LEGEND FOR TREEMAP act -------------
var act_treemap_legend = svg_act_job_post.append("g")
.attr("transform", "translate(130, 490)")
.attr("class","leg_treemap_act");
act_treemap_legend.append("rect")
    .attr("width", act_legend_w-200)
    .attr("height", act_legend_h);
//LEGEND FOR TREEMAP END --------------
d3.csv("datasets/about_your_pay/Act_post_Tree.csv", type, function(data_act_treemap){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return b-a;
    })
    var job_post_array = new Array(data_act_treemap.length-1);
    //oth index in the data is null
    for(var i=1; i<data_act_treemap.length;i++){
        job_post_array[i-1] = parseInt(data_act_treemap[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return a - b;
    });
    var to_fill = d3.scaleLinear();
    to_fill.domain(job_post_array).range(my_color);
    var root = d3.stratify()
    .id(function(d){ 
        return d.category;
    })
    .parentId(function(d){
        return d.state;
    })(data_act_treemap);
    root.sum(function(d) {
        //+symbol converts string to integer
        return +d.job_post;
    });
    d3.treemap()
    .size([width-300, height-300])
    .padding(4)
    (root);
    g_act_job_post
        .selectAll(".rect_tree_act")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("class","rect_tree_act")
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
        return d3.interpolatePiYG(parseFloat(d.data.color));
    })
    .on("mouseover", function(d){
        d3.select(this).style("stroke","black")
            .style("stroke-width", "1");
        tooltip.transition()
			.duration(500)
			.style("opacity", 1);
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.id + 
			"<table><tbody><tr><td></td><td style='font-family:Architects Daughter, cursive;'>" + d.value + " jobs available</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 10) + "px")
			.style("top", (d3.event.pageY +10) + "px");
    })
    .on("mouseout", function(d){
        d3.selectAll('.rect_tree_act')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND act ENDS
    //LEGEND HIGHEST AND LOWEST AS TEXT
    d3.select('.leg_treemap_act')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_act_text")
        .style("fill","black")
        .attr("x",12)
        .attr("y",-75)
        .text("Highest");
    d3.select('.leg_treemap_act')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_act_text")
        .style("fill","black")
        .attr("x",295)
        .attr("y",-75)
        .text("Lowest");
    //LEGEND act TREEMAP ENDS
      // and to add the text labels ON THE TREEMAP
    g_act_job_post
        .selectAll(".text_in_tree_act")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("class","text_in_tree_act")
        .attr("x", function(d){ 
        return d.x0+10;
    })    // +10 to adjust position (more right)
        .attr("y", function(d){ 
        return d.y0+20;
    })    // +20 to adjust position (lower)
        .attr("font-size", "0.9em")
        .attr("fill", "black")
        .attr("x", function(d){
            if(i<8){
                return d.x0+5;
            }
            else{
                return d.x0+1;
            }
    })
        .attr("y", function(d,i){
            if(i<8){
                return d.y0+13;
            }
            else{
                return d.y0 + 10;
            }
        })
        .text(function(d,i){ 
        d3.select(this)
        .classed("text_in_tree_act2", i >7)
        return d.data.abr;
    });
});
//LEGEND RECTANGLES QUEENSLAND TREEMAP
d3.csv("datasets/about_your_pay/Act_post_legend.csv", type, function(data_act_treemap_legend){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return a-b;
    });
    var job_post_array = new Array(data_act_treemap_legend.length);
    //oth index in the data is null
    for(var i=0; i<data_act_treemap_legend.length;i++){
        job_post_array[i] = parseInt(data_act_treemap_legend[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return b - a;
    });
    var to_fill = d3.scaleOrdinal();
    to_fill.domain(job_post_array).range(my_color);
    d3.select('.leg_treemap_act').selectAll(".act_rect_legend_treemap")
    .data(data_act_treemap_legend)
    .enter().append("rect")
    .attr("width", 15)
    .attr("height", 20)
    .attr("class","act_rect_legend_treemap")
    .attr("x",function(d,i){
        return 69 +i*20;
    })
    .attr("y",function(){
        return -90;
    })
    .style("fill", function(d){
        return d3.interpolatePiYG(parseFloat(parseFloat(d.color)));
    });
});
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------
//NT circle visualization, category salary
var svg_nt_categ = d3.select("#nt_categ").append("svg")
.attr("width", width)
.attr("height", height-200);
//adding group to svg
var g_nt = svg_nt_categ.append("g").attr("transform", "translate(30, -100)");

//LEGEND CIRCLE nt
var nt_legend_w = 555,
    nt_legend_h = 40;

var legend_nt = svg_nt_categ.append("g")
.attr("transform", "translate(120, 410)")
.attr("class","leg_nt");

legend_nt.append("rect")
    .attr("width", nt_legend_w)
    .attr("height", nt_legend_h);

d3.csv("datasets/about_your_pay/Nt_salary.csv", type, function(data_nt_circle){
    var salary_categ = new Array(data_nt_circle.length);
    for(var i=0; i<data_nt_circle.length;i++){
        salary_categ[i] = data_nt_circle[i]["avg_salary"];
    }
    //sorting salary
    salary_categ.sort(function(a, b){
    return a - b;
    });
    salary_scale = d3.scaleLinear();
    salary_scale.domain([salary_categ[0],salary_categ[10]]).range([10,50]);
    
    var circles_nt = g_nt.selectAll(".nt_circle").data(data_nt_circle);
    circles_nt.enter().append("circle")
        .attr("class","nt_circle")
        .attr("cx", function (d,i){
        if (i == 0){
            return 260;
            }
        else if(i==1){
            return 360;
        }
        else if(i==2){
            return 270;
        }
        else if(i==3){
            return 368;
        }
        else if(i==4){
            return 450;
        }
        else if(i==5){
            return 310;
        }
        else if(i==6){
            return 435;
        }
        else if(i==7){
            return 370;
        }
        else if(i==8){
            return 435;
        }
        else if(i==9){
            return 490;
        }
        else if(i==10){
            return 330;
        }
        else{
            return 250 + i*40; 
        }
    })
        .attr("cy", function (d,i){
        if (i == 0){
            return 245;
            }
        else if (i == 1){
            return 210;
                 }
        else if (i == 2){
            return 350;
                 }
        else if (i == 3){
            return 370;
                 }
        else if (i == 4){
            return 240;
                 }
        else if(i==5){
            return 430;
        }
        else if(i==6){
            return 321;
        }
        else if(i==7){
            return 290;
        }
        else if(i==8){
            return 390;
        }
        else if(i==9){
            return 300;
        }
        else if(i==10){
            return 275;
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
        var salary_str = d.avg_salary.toString()
        if(salary_str.length == 5){
            salary_str = [salary_str.slice(0,2),",",salary_str.slice(2)].join('')
        }
        else{
            salary_str = [salary_str.slice(0,3),",",salary_str.slice(3)].join('')
        }
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.category + 
			"<table><tbody><tr><td style='font-family:Architects Daughter, cursive;'>Average Salary: </td><td style='font-family:Architects Daughter, cursive;'>" +"$" + salary_str + "</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 10) + "px")
			.style("top", (d3.event.pageY +10) + "px");
    })
    .on("mouseout", function(d){
        d3.selectAll('.nt_circle')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND CIRCLE nt
    var data_legend = new Array(data_nt_circle.length*2);
    for(var i=0; i<data_legend.length; i++){
        data_legend[i]= i;
    }
    d3.select('.leg_nt').selectAll(".nt_rect_legend")
    .data(data_legend)
    .enter().append("circle")
//    .attr("width", 15)
//    .attr("height", 20)
    .attr("class","nt_rect_legend")
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
    //LEGEND nt ENDS
    d3.select('.leg_nt')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_nt_text")
        .style("fill","black")
        .attr("x",3)
        .attr("y",23)
        .text("Highest");
        d3.select('.leg_nt')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_nt_text")
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
//TREEMAP NT
//NT, TREEMAP, job posts
// set the dimensions and margins of the graph
var margin_treemap = {top: 100, right: 50, bottom: 50, left: 100};
var svg_nt_job_post = d3.select("#nt_job_post").append("svg")
.attr("width", width-200)
.attr("height", height-100);
    //adding group to svg
var g_nt_job_post = svg_nt_job_post.append("g")
.attr("transform", "translate(100,100)");
//+ margin_treemap.left + "," + margin_treemap.top + ","+ margin_treemap.right + "," + margin_treemap.bottom +")");
//treemap legend coloring
//key:abr, value:color
var treemap_legend_color = new Object();
//LEGEND FOR TREEMAP nt -------------
var nt_treemap_legend = svg_nt_job_post.append("g")
.attr("transform", "translate(130, 490)")
.attr("class","leg_treemap_nt");
nt_treemap_legend.append("rect")
    .attr("width", nt_legend_w-200)
    .attr("height", nt_legend_h);
//LEGEND FOR TREEMAP END --------------
d3.csv("datasets/about_your_pay/Nt_post_Tree.csv", type, function(data_nt_treemap){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return b-a;
    })
    var job_post_array = new Array(data_nt_treemap.length-1);
    //oth index in the data is null
    for(var i=1; i<data_nt_treemap.length;i++){
        job_post_array[i-1] = parseInt(data_nt_treemap[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return a - b;
    });
    var to_fill = d3.scaleLinear();
    to_fill.domain(job_post_array).range(my_color);
    var root = d3.stratify()
    .id(function(d){ 
        return d.category;
    })
    .parentId(function(d){
        return d.state;
    })(data_nt_treemap);
    root.sum(function(d) {
        //+symbol converts string to integer
        return +d.job_post;
    });
    d3.treemap()
    .size([width-300, height-300])
    .padding(4)
    (root);
    g_nt_job_post
        .selectAll(".rect_tree_nt")
        .data(root.leaves())
        .enter()
        .append("rect")
        .attr("class","rect_tree_nt")
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
        return d3.interpolatePRGn(parseFloat(d.data.color));
    })
    .on("mouseover", function(d){
        d3.select(this).style("stroke","black")
            .style("stroke-width", "1");
        tooltip.transition()
			.duration(500)
			.style("opacity", 1);
        //ADDING TOOLTIP
        tooltip.html(
			"<p><strong style='font-family:Architects Daughter, cursive;'>" + d.id + 
			"<table><tbody><tr><td></td><td style='font-family:Architects Daughter, cursive;'>" + d.value + " jobs available</td></tr></tbody></table>")
			.style("left", (d3.event.pageX - 10) + "px")
			.style("top", (d3.event.pageY +10) + "px");
    })
    .on("mouseout", function(d){
        d3.selectAll('.rect_tree_nt')
            .attr("stroke", "none")
            .style("stroke-width","0"); 
        tooltip.transition()
			.duration(500)
			.style("opacity", 0); 
    });
    //LEGEND nt ENDS
    //LEGEND HIGHEST AND LOWEST AS TEXT
    d3.select('.leg_treemap_nt')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_nt_text")
        .style("fill","black")
        .attr("x",12)
        .attr("y",-75)
        .text("Highest");
    d3.select('.leg_treemap_nt')
        .append("text")
        .attr("width", 15)
        .attr("height", 15)
        .attr("class","leg_nt_text")
        .style("fill","black")
        .attr("x",295)
        .attr("y",-75)
        .text("Lowest");
    //LEGEND nt TREEMAP ENDS
      // and to add the text labels ON THE TREEMAP
    g_nt_job_post
        .selectAll(".text_in_tree_nt")
        .data(root.leaves())
        .enter()
        .append("text")
        .attr("class","text_in_tree_nt")
        .attr("x", function(d){ 
        return d.x0+10;
    })    // +10 to adjust position (more right)
        .attr("y", function(d){ 
        return d.y0+20;
    })    // +20 to adjust position (lower)
        .attr("font-size", "0.9em")
        .attr("fill", "black")
        .attr("x", function(d){
            if(i<8){
                return d.x0+5;
            }
            else{
                return d.x0+1;
            }
    })
        .attr("y", function(d,i){
            if(i<8){
                return d.y0+13;
            }
            else{
                return d.y0 + 10;
            }
        })
        .text(function(d,i){ 
        d3.select(this)
        .classed("text_in_tree_nt2", i >7)
        return d.data.abr;
    });
});
//LEGEND RECTANGLES QUEENSLAND TREEMAP
d3.csv("datasets/about_your_pay/Nt_post_legend.csv", type, function(data_nt_treemap_legend){
    //reversing color
    var my_color = d3.schemeSpectral[11];
    my_color.sort(function(a,b){
        return a-b;
    });
    var job_post_array = new Array(data_nt_treemap_legend.length);
    //oth index in the data is null
    for(var i=0; i<data_nt_treemap_legend.length;i++){
        job_post_array[i] = parseInt(data_nt_treemap_legend[i]["job_post"]);
    }
    //sorting salary
    job_post_array.sort(function(a, b){
    return b - a;
    });
    var to_fill = d3.scaleOrdinal();
    to_fill.domain(job_post_array).range(my_color);
    d3.select('.leg_treemap_nt').selectAll(".nt_rect_legend_treemap")
    .data(data_nt_treemap_legend)
    .enter().append("rect")
    .attr("width", 15)
    .attr("height", 20)
    .attr("class","nt_rect_legend_treemap")
    .attr("x",function(d,i){
        return 69 +i*20;
    })
    .attr("y",function(){
        return -90;
    })
    .style("fill", function(d){
        return d3.interpolatePRGn(parseFloat(parseFloat(d.color)));
    });
});
////------------------------------------------------------------------------------------------------
////------------------------------------------------------------------------------------------------
////------------------------------------------------------------------------------------------------
////------------------------------------------------------------------------------------------------
////------------------------------------------------------------------------------------------------
////------------------------------------------------------------------------------------------------
////WAGE GPRAH
//// set the dimensions and margins of the graph
//var margin_ying = {top: 10, right: 30, bottom: 30, left: 60},
//    width = 800 - margin_ying.left - margin_ying.right,
//    height = 600 - margin_ying.top - margin_ying.bottom;
//
//// append the svg object to the body of the page
//var svg_wage = d3.select("#ying_wage")
//  .append("svg")
//    .attr("width", width + margin_ying.left + margin_ying.right)
//    .attr("height", height + margin_ying.top + margin_ying.bottom)
//  .append("g")
//    .attr("transform",
//          "translate(" + margin_ying.left + "," + margin_ying.top + ")");
//
////Read the data
//d3.csv("Pay_raise.csv", function(data) {
//    console.log(data)
//    // List of groups (here I have one group per column)
//    var allGroup = d3.map(data, function(d){return(d.Industry)}).keys()
//    console.log(allGroup)
//    // add the options to the button
//    d3.select("#selectButton")
//      .selectAll('myOptions')
//     	.data(allGroup)
//      .enter()
//    	.append('option')
//      .text(function (d) { 
//        return d; 
//    }) // text showed in the menu
//      .attr("value", function (d) { return d; }) // corresponding value returned by the button
//
//    // A color scale: one color for each group
//    var myColor = d3.scaleOrdinal()
//      .domain(allGroup)
//      .range(d3.schemeCategory20);
//
//    // Add X axis --> it is a date format
//    var x = d3.scaleLinear()
//      .domain(d3.extent(data, function(d) { return parseInt(d.Year); }))
//      .range([ 0, width ]);
//    svg_wage.append("g")
//      .attr("transform", "translate(0," + height + ")")
//      .call(d3.axisBottom(x).ticks(7));
//
//    // Add Y axis
//    var y = d3.scaleLinear()
//      .domain([0, d3.max(data, function(d) { return +d.Wage; })])
//      .range([ height, 0 ]);
//    svg_wage.append("g")
//      .call(d3.axisLeft(y));
//    
//    var tooltip = d3.select("#ying_wage")
//    .append("div")
//      .style("opacity", 0)
//      .attr("class", "tooltip")
//      .style("background-color", "skyblue")
//      .style("border-radius", "5px")
//      .style("padding", "10px")
//      .style("color", "black")
//
//  var showTooltip = function(d) {
//    tooltip
//      .transition()
//      .duration(200)
//    tooltip
//      .style("opacity", 1)
//      .html("The wages of 2020 and 2021 are predictions")
//      
//      .style("left", (d3.mouse(this)[0]+30)+ "px")
//      .style("top", (d3.mouse(this)[1]+250)+ "px")
//  }
//  var moveTooltip = function(d) {
//    tooltip
//      .style("left", (d3.mouse(this)[0]+30) + "px")
//      .style("top", (d3.mouse(this)[1]+250) + "px")
//  }
//  var hideTooltip = function(d) {
//    tooltip
//      .transition()
//      .duration(200)
//      .style("opacity", 0)
//  }
//
//    // Initialize line with first group of the list
//    var line = svg_wage
//      .append('g')
//      .append("path")
//        .datum(data.filter(function(d){return d.Industry==allGroup[0]}))
//        .attr("d", d3.line()
//          .x(function(d) { return x(parseInt(d.Year)); })
//          .y(function(d) { return y(+d.Wage); })
//        )
//        .attr("stroke", function(d){ return myColor("valueA") })
//        .style("stroke-width", 4)
//        .style("fill", "none")
//        .on("mouseover", showTooltip )
//        .on("mousemove", moveTooltip )
//       .on("mouseleave", hideTooltip )
//        
//
//    // A function that update the chart
//    function update(selectedGroup) {
//
//      // Create new data with the selection?
//      var dataFilter = data.filter(function(d){return d.Industry==selectedGroup})
//
//      // Give these new data to update line
//      line
//          .datum(dataFilter)
//          .transition()
//          .duration(1000)
//          .attr("d", d3.line()
//            .x(function(d) { return x(d.Year) })
//            .y(function(d) { return y(+d.Wage) })
//          )
//          .attr("stroke", function(d){ return myColor(selectedGroup) })
//    }
//
//    // When the button is changed, run the updateChart function
//    d3.select("#selectButton").on("change", function(d) {
//        // recover the option that has been chosen
//        var selectedOption = d3.select(this).property("value")
//        // run the updateChart function with this selected option
//        update(selectedOption)
//    })
//
//})
