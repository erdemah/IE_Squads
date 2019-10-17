// Generate some data
function randomDataset() {
    var _randomNum = function() {
        return Math.floor(Math.random() * 10);
    };
    var data = [
        {
            "key": "NSW",
            "values": [
                {
                    "key": "Agriculture",
                    "value": 65.0
                },
                {
                    "key": "Transportation",
                    "value": 71.0
                },
                {
                    "key": "Construction",
                    "value": 52.0
                },
                {
                    "key": "Manufacturing",
                    "value": 23.0
                },
                {
                    "key": "Mining",
                    "value": 8.0
                },
                {
                    "key": "Arts services",
                    "value": 9.0
                },
                {
                    "key": "Public safety",
                    "value": 7.0
                },
                {
                    "key": "Administration",
                    "value": 4.0
                },
                {
                    "key": "Other services",
                    "value": 5.0
                },
                {
                    "key": "General services",
                    "value": 5.0
                },
                {
                    "key": "Other industries",
                    "value": 41.0
                }
            ]
        },
        {
            "key": "QLD",
            "values": [
                {
                    "key": "Agriculture",
                    "value": 68.0
                },
                {
                    "key": "Transportation",
                    "value": 54.0
                },
                {
                    "key": "Construction",
                    "value": 37.0
                },
                {
                    "key": "Manufacturing",
                    "value": 13.0
                },
                {
                    "key": "Mining",
                    "value": 10.0
                },
                {
                    "key": "Arts services",
                    "value": 14.0
                },
                {
                    "key": "Public safety",
                    "value": 9.0
                },
                {
                    "key": "Administration",
                    "value": 8.0
                },
                {
                    "key": "Other services",
                    "value": 7.0
                },
                {
                    "key": "General services",
                    "value": 4.0
                },
                {
                    "key": "Other industries",
                    "value": 21.0
                }
            ]
        },
        {
            "key": "VIC",
            "values": [
                {
                    "key": "Agriculture",
                    "value": 64.0
                },
                {
                    "key": "Transportation",
                    "value": 39.0
                },
                {
                    "key": "Construction",
                    "value": 29.0
                },
                {
                    "key": "Manufacturing",
                    "value": 3.0
                },
                {
                    "key": "Mining",
                    "value": 1.0
                },
                {
                    "key": "Arts services",
                    "value": 6.0
                },
                {
                    "key": "Public safety",
                    "value": 5.0
                },
                {
                    "key": "Administration",
                    "value": 6.0
                },
                {
                    "key": "Other services",
                    "value": 3.0
                },
                {
                    "key": "General services",
                    "value": 8.0
                },
                {
                    "key": "Other industries",
                    "value": 21.0
                }
            ]
        },
        {
            "key": "WA",
            "values": [
                {
                    "key": "Agriculture",
                    "value": 25.0
                },
                {
                    "key": "Transportation",
                    "value": 35.0
                },
                {
                    "key": "Construction",
                    "value": 21.0
                },
                {
                    "key": "Manufacturing",
                    "value": 15.0
                },
                {
                    "key": "Mining",
                    "value": 14.0
                },
                {
                    "key": "Arts services",
                    "value": 4.0
                },
                {
                    "key": "Public safety",
                    "value": 4.0
                },
                {
                    "key": "Administration",
                    "value": 5.0
                },
                {
                    "key": "Other services",
                    "value": 6.0
                },
                {
                    "key": "General services",
                    "value": 5.0
                },
                {
                    "key": "Other industries",
                    "value": 6.0
                }
            ]
        },
        {
            "key": "SA",
            "values": [
                {
                    "key": "Agriculture",
                    "value": 19.0
                },
                {
                    "key": "Transportation",
                    "value": 22.0
                },
                {
                    "key": "Construction",
                    "value": 9.0
                },
                {
                    "key": "Manufacturing",
                    "value": 0.0
                },
                {
                    "key": "Mining",
                    "value": 2.0
                },
                {
                    "key": "Arts services",
                    "value": 2.0
                },
                {
                    "key": "Public safety",
                    "value": 4.0
                },
                {
                    "key": "Administration",
                    "value": 4.0
                },
                {
                    "key": "Other services",
                    "value": 3.0
                },
                {
                    "key": "General services",
                    "value": 1.0
                },
                {
                    "key": "Other industries",
                    "value": 4.0
                }
            ]
        },
        {
            "key": "TAS",
            "values": [
                {
                    "key": "Agriculture",
                    "value": 9.0
                },
                {
                    "key": "Transportation",
                    "value": 6.0
                },
                {
                    "key": "Construction",
                    "value": 3.0
                },
                {
                    "key": "Manufacturing",
                    "value": 4.0
                },
                {
                    "key": "Mining",
                    "value": 3.0
                },
                {
                    "key": "Arts services",
                    "value": 0.0
                },
                {
                    "key": "Public safety",
                    "value": 1.0
                },
                {
                    "key": "Administration",
                    "value": 1.0
                },
                {
                    "key": "Other services",
                    "value": 2.0
                },
                {
                    "key": "General services",
                    "value": 0.0
                },
                {
                    "key": "Other industries",
                    "value": 4.0
                }
            ]
        },
        {
            "key": "NT",
            "values": [
                {
                    "key": "Agriculture",
                    "value": 4.0
                },
                {
                    "key": "Transportation",
                    "value": 8.0
                },
                {
                    "key": "Construction",
                    "value": 1.0
                },
                {
                    "key": "Manufacturing",
                    "value": 0.0
                },
                {
                    "key": "Mining",
                    "value": 2.0
                },
                {
                    "key": "Arts services",
                    "value": 1.0
                },
                {
                    "key": "Public safety",
                    "value": 2.0
                },
                {
                    "key": "Administration",
                    "value": 0.0
                },
                {
                    "key": "Other services",
                    "value": 0.0
                },
                {
                    "key": "General services",
                    "value": 0.0
                },
                {
                    "key": "Other industries",
                    "value": 3.0
                }
            ]
        }
    ];
    return data;
}



// var tooltip_vis3 = d3.select("body").append("div")
//     .attr("class", "tooltip3")
//     .style("opacity", 0);
/* var allGroup = d3.map(data, function(d){return(d.key)}).keys()
  console.log(allGroup)
 var myColor = d3.scaleOrdinal()
    .range(d3.schemeCategory20);*/


var data = randomDataset();


var colors = [ "#398abb", "#f4bc71", "#FBF6C4", "#9bcf95","#D34152"];
var chart = d3.ez.chart.heatMapRadial().colors(colors);
var legend = d3.ez.component.legend().title('Worker fatality number');
var title = d3.ez.component.title().mainText("").subText("");

// Create chart base
var myChart = d3.ez.base()
    .width(850)
    .height(600)
    .chart(chart)
    .legend(legend)
    .title(title)
    .on("customValueMouseOver", function(d, i) {
        d3.select("#message").text("Fatalities in "+d.key + ": " + +d.value);

    });

d3.select('#chartholder')
    .datum(randomDataset())
    .call(myChart);
// d3.select("#legendBox")
//     .attr("transform", "translate(50, -100)");