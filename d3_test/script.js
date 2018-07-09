////////// GENERAL CODE

var gWidth; // Width of the canvas in pixels 
var gHeight; // Height of the canvas
var gMin; // minimum of gWidth, gHeight
var gBarWidth; // width of  bars in plot 1

var mode; // 1: draw bars. 2: draw plot chart

function init()
{
	recalcSize(); // calculate gWidth, gHeight, gMin, gBarWidth based on screen size
	draw(1);
}

function draw(mode_)
{
	if (mode_ !== undefined)
		mode = mode_;
	if (mode == 1) draw_part1();
	else draw_part2();
}

function createNewSvg()
{
	d3.select("#container").html(""); // Remove previous content
	var svg = d3.select("#container").append("svg");
	return svg;
}

// redraw after a screen resize has been made and then there was no resize for 500ms.
var resizeTimeout = null;
window.onresize = resize;
function resize() {
	if (resizeTimeout != null) 
	{
		clearTimeout(resizeTimeout);
		resizeTimeout = null;
	}
	resizeTimeout = setTimeout(function()
	{
		recalcSize();
		draw();
		resizeTimeout = null;
	}, 100);
};

function recalcSize() // recalculate svg size
{
	gHeight = document.getElementById("container").clientHeight;
	gWidth = document.getElementById("container").clientWidth;
	gMin = Math.min(gWidth, gHeight);
	gBarWidth = gWidth / 20; // width of bars in graph 1.
}

////////// SHARED CODE (code used in both plots)

function lineStyle(d)
{
	d.style("stroke", "rgb(0,0,0)")
	.style("stroke-width", "2px");
}

function xTicksStyle(d) // style of the ticks on the X axis
{
	d.attr("class", "xTick")
	.attr("y1", gHeight * 0.88)
	.attr("y2", gHeight * 0.92)
	.call(lineStyle);
	
}

function yTicksStyle(d)
{
	d.attr("class", "yTick")
	.attr("x1", gBarWidth * 1.65)
	.attr("x2", gBarWidth * 1.35)
	.call(lineStyle);
}

// Draws both X and Y axis.
// SVG - the svg
// xData - the data used to draw tick marks on the X axis
// yData - the data used to draw tick marks on the Y axis
// calcXPos - Callback which calculates the position for each tick on the X axis. Called for each item in xData.
// calcYPos - Callback which calculates the position for each tick on the Y axis. Called for each item in yData.
// calcXLabel - Callback which calculates the label for each tick on the X axis. Called for each item in xData.
// calcYLabel - Callback which calculates the label for each tick on the Y axis. Called for each item in yData.
// All callbacks are called with (dataItem, index) and should return a value.
function drawAxis(svg, xData, yData, calcXPos, calcYPos, calcXLabel, calcYLabel)
{
	// Y axis
	svg.append("line")
	.attr("x1", gBarWidth * 1.5)
	.attr("x2", gBarWidth * 1.5)
	.attr("y1", gHeight * 0.02)
	.attr("y2", gHeight * 1)
	.call(lineStyle);
	
	// X axis
	svg.append("line")
		.attr("x1", 0)
		.attr("x2", gBarWidth * 30)
		.attr("y1", 0.9 * gHeight)
		.attr("y2", 0.9 * gHeight)
		.call(lineStyle);
		
	// X axis ticks
	svg.selectAll(".xTick").data(xData).enter().append("line")
		.call(xTicksStyle)
		.attr("x1", calcXPos)
		.attr("x2", calcXPos)
		
	// X axis labels
	svg.selectAll(".xLabel").data(xData).enter().append("text")
		.attr("class", "xLabel")
		.attr("x", function(d, i) { return calcXPos(d, i) - gBarWidth / 2; })
		.attr("y", gHeight * 0.95)
		.html(calcXLabel) 
		.style("font-size", "1em");
	
	// Y axis ticks
	svg.selectAll(".yTick").data(yData).enter().append("line")
		.call(yTicksStyle)
		.attr("y1", function(d, i) { return calcYPos(d, i); })
		.attr("y2", function(d, i) { return calcYPos(d, i); })
	
	// Y axis labels
	svg.selectAll(".yLabel").data(yData).enter().append("text")
		.attr("class", "yLabel")
		.attr("x", gBarWidth * 1.3)
		.attr("y", function(d, i) { return calcYPos(d); })
		.html(calcYLabel)
		.style("font-size", "1em")
		.style("text-anchor", "end");
}

function drawLegend(svg, legendList)
{
	for (var i = 0; i < legendList.length; i++)
	{
		color = legendList[i].color;
		name = legendList[i].name;
		yOffset = gMin * 0.05 * i;
		
		svg.append("rect")
		.attr("x", gWidth * 0.85 - gMin * 0.05)
		.attr("y", yOffset)
		.attr("width", gMin * 0.05)
		.attr("height", gMin * 0.05)
		.attr("fill", color)
		
		svg.append("text")
		.attr("x", gWidth * 0.85)
		.attr("y", yOffset + gHeight * 0.05)
		.html(name)
		.style("font-size", "1em")
	}
}

function hoverEffects(svg, selection, originalColor)
{
	svg.selectAll(selection)
	.on('mouseover', function(){
		d3.select(this)
		.style("fill","#ddd");
	}).on('mouseout', function(){
		d3.select(this)
		.style("fill",originalColor);
	})
}

////////// PART 1 (BAR CHART) code

function draw_part1()
{
	d3.csv("carsAggregated.csv", function(datum)
	{
		return {
			type: datum.CarType, // Usage: X axis in bar plot. Also controls color
			retail: datum.RetailPrice, // Usage: left bar in bar plot (the red one) + tooltip data
			dealer: datum.DealerCost, // Usage: right bar in bar plot (the blue one) + tooltip data
		};
	}).then(function(data)
	{
		part1_drawBars(data, 50000);
	});
}

function part1_drawBars(data, maxHeight)
{
	var svg = createNewSvg();
	var color_retail = "#ca0020";
	var color_dealer = "#0571b0";
	
	// Things shared by red and blue bars
	var barsBottomMargin = 0.1; 
	var barsTopMargin = 0.05; 
	function calculateHeight(value) // determine bar height based on value and screen size
	{
		return (value / maxHeight) * gHeight * (1 - barsTopMargin - barsBottomMargin);
	}
	function calculateY(value) // determine bar Y position based on value and screen size
	{
		return gHeight * ( 1 - barsBottomMargin) - calculateHeight(value);
	}
	function formatRect(offset, attribute) // format a bar. attribute should be "retail" for red and "dealer" for blue.
	{
		return function (d, i)
		{
			d.attr("x", function(d, i) { return gBarWidth * offset + i * gBarWidth * 3; })
			.attr("y", function(d, i) { return calculateY(d[attribute]);})
			.attr("width", gBarWidth)
			.attr("height", function(d, i) { return calculateHeight(d[attribute]);})
		}
	}
	
	// Draw Legend
	drawLegend(svg, [
		{"name": "Retail Price", "color": color_retail},
		{"name": "Dealer Cost", "color": color_dealer}]);
		
	// Draw red bars
	svg.selectAll(".retailRects").data(data).enter().append("rect")
		.call(formatRect(2, "retail"))
		.attr("fill", color_retail)
		.attr("class", "retailRects")
		.append("title").html(function(d) { return "Retail price: " + parseFloat(d.retail).toFixed(2); }); // tooltip
	
	// Draw blue bars
	svg.selectAll(".dealerRects").data(data).enter().append("rect")
		.call(formatRect(3, "dealer"))
		.attr("fill", color_dealer)
		.attr("class", "dealerRects")
		.append("title").html(function(d) { return "Dealer Cost: " + parseFloat(d.dealer).toFixed(2); }); // tooltip

	// Create red hover effects
	hoverEffects(svg, ".retailRects", color_retail);
		
	// Create blue hover effects
	hoverEffects(svg, ".dealerRects", color_dealer);
		
	// Draw Axis
	var xData = data;
	var yData  = [5000, 10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000];
	var calcXPos = function(d, i)
	{
		return gBarWidth * 3 - 1 + i * gBarWidth * 3;
	}
	var calcYPos = calculateY;
	var calcXLabel = function(d, i) { return d.type; }
	var calcYLabel = function(d, i) { return (d / 1000) + "k"; }
	drawAxis(svg, xData, yData, calcXPos, calcYPos, calcXLabel, calcYLabel);
}

////////// PART 2 (SCATTER PLOT) code

function draw_part2()
{
	d3.csv("cars.csv", function(datum)
	{
		var carType = "other";
		if (datum["Sports Car"] == "1") carType ="sports";
		else if (datum["Wagon"] == "1") carType="wagon";
		
		
		
		datum = {
			hp: datum.HP, // Usage: X axis in scatter plot + tooltip
			mpg: datum["Hwy MPG"], // Usage: Y axis in scatter + tooltip
			cyl: datum.Cyl, // Usage: will be mapped to radius
			type: carType // Usage: determines color
		};
		
		if (datum.mpg == "*") return;
		if (datum.cyl == "*") return;
		return datum;
	}).then(function(data)
	{
		part2_drawScatter(data);
	});
}

function part2_drawScatter(data)
{
	var svg = createNewSvg();
	var color_sports = "#fcbf86";
	var color_wagon = "#3b6fae";
	var color_other = "#7cc97c";
	var maxHp = 550;
	var maxMpg = 70;
	
	// Draw legend
	drawLegend(svg, [
		{"name": "Other", "color": color_other},
		{"name": "Sports", "color": color_sports},
		{"name": "Wagon", "color": color_wagon}]);
	
	// Prepare drawing scatter plot
	function colorByType(d)
	{
		if (d.type == "sports") return color_sports;
		if (d.type =="wagon") return color_wagon;
		return color_other;
	}
	
	function xByHp(hp)
	{
		return hp * gWidth * 0.9 / maxHp;
	}
	
	function yByMpg(mpg)
	{
		return gHeight - mpg * gHeight * 0.9 / maxMpg;
	}
	
	// Draw scatter plot
	svg.selectAll(".scatterPlotItem").data(data).enter().append("circle")
		.attr("class", "scatterPlotItem")
		.attr("cx", function (d) { return xByHp(d.hp); })
		.attr("cy", function (d) { return yByMpg(d.mpg); })
		.attr("r", function (d) { return d.cyl; })
		.style("fill", colorByType)
		.style("stroke", "#000")
		.append("title").html(function(d) { return "HP: " + d.hp + ", MPG: " + d.mpg + ", Cylinders: " + d.cyl; }); // tooltip
	
	// Create hover effects
	hoverEffects(svg, ".scatterPlotItem", colorByType);
	
	// Draw axis
	var xData = [];
	for (var i = 50; i <= maxHp; i += 100) xData.push(i);
	var yData = [];
	for (var i = 10; i <= maxMpg; i+= 5) yData.push(i);
	var calcXPos = xByHp;
	var calcYPos = yByMpg;
	var calcXLabel = function(d, i) { return d; }
	var calcYLabel = function(d, i) { return d; }
	drawAxis(svg, xData, yData, calcXPos, calcYPos, calcXLabel, calcYLabel);
}
