var draw_listWindow; // only export this function to other files

(function()
{
	var firstRendering = true;
	function draw_listWindow_()
	{
		// setup
		console.log("Rendering list window");
		d3.select("#container").html("").style("padding", "0px"); // Remove previous content
		document.body.dir = null;
		var unit = Math.ceil(gWidth/60); // the smallest size unit we'll use.
		var upperPadding = unit * 4;
		var leftLinePadding = unit * 5;
		var svg = d3.select("#container").append("svg")
			.attr("height", upperPadding + 2 * unit * data_governments.length)
			.attr("width", gWidth)
			
		var controls = d3.select("#container").append("div").attr("id", "controls");
		
		
		// title
		svg.append("text")
			.attr("x", gWidth / 2)
			.attr("y", upperPadding / 2)
			.attr("text-anchor", "middle")
			.html("ויזוליזציה למפלגות ממשלת ישראל")
			.style("font-size", (unit * 2) + "px");
		
		// foreach row
		for (var i = 0; i < data_governments.length; i++)
		{
			var gov = data_governments[i];
			var yPos = upperPadding + 1.5 * unit * i;
			var yMiddle = yPos - unit/2;
			
			// elections year
			svg.append("text")
			.attr("x", 10)
			.attr("y", yPos)
			.html(gov.from + "(" + gov.government + ")")
			.style("font-size", unit + "px")
			.on('mouseover', (function(yPos_, gov_){ return function(){
				d3.select(this).style("fill","#d0d");
				svg.append("rect").attr("x", leftLinePadding).attr("y", yPos_ - unit).attr("width", unit * 8).attr("height", unit)
				.attr("class", "popup").attr("fill", "#fff").attr("opacity", 0.7);
				svg.append("text").attr("class", "popup")
				.attr("x", leftLinePadding).attr("y", yPos_).style("font-size", unit + "px")
				.html(gov_.pm)
			}})(yPos, gov)).on('click', (function(gov_){
				return (function()
				{
					goto_government(gov_.government);
				})
			})(gov)
			).on('mouseout', function(){
				d3.select(this)
				.style("fill","#000");
				d3.selectAll(".popup").remove();
			}).attr("class", "clickable")
			
			// horizontal line
			/*svg.append("line")
			.attr("x1", leftLinePadding)
			.attr("x2", gWidth)
			.attr("y1", yMiddle)
			.attr("y2", yMiddle)
			.style("stroke", "rgb(200,200,200)")
			.style("stroke-width", Math.ceil(unit / 25) + "px");*/
			svg.append("line")
			.attr("x1", 0)
			.attr("x2", gWidth)
			.attr("y1", yPos - unit)
			.attr("y2", yPos - unit)
			.style("stroke", "rgb(200,200,200)")
			.style("stroke-width", Math.ceil(unit / 25) + "px");
			
			// parties
			var parties = data_partiesInGovernment[data_governments[i].government];
			if (firstRendering)
			{
				parties.sort(function(a, b)
				{
					return b.seats - a.seats;
				});
			}
			var totalSeats = 0;
			for (var j = 0; j < parties.length; j++)
			{
				parties[j].priorSeats = totalSeats;
				totalSeats += parties[j].seats;
			}
			if (firstRendering && (totalSeats != 120)) console.log("WARNING: Wrong number of seats in govt #", i+1,"expected 120. actual", totalSeats);
			
			// utility functions for proper placement of party rectangles
			function calcStartX(d)
			{
				return leftLinePadding + d.priorSeats * (gWidth - leftLinePadding) / 120;
			}
			function calcWidth(d)
			{
				return d.seats * (gWidth - leftLinePadding) / 120;
			}
			function calcPartyDisplayName(d)
			{
				function nameAndSeats(name, partial)
				{
					if (partial !== undefined) name += "...";
					return name + " - " + d.seats;
				}
				
				// cut off long names if there isn't enough space
				var name = d.party;
				var seats = d.seats;
				if (seats > 15) 
					return nameAndSeats(name);
				else if (seats > 5)
				{
					var limit = 8;
					if (name.length > limit)
						return nameAndSeats(name.substring(0, limit - 3), true);
					else 
						return nameAndSeats(name);
				}
				else 
					return "";
			}
			

			// draw party rectangles
			svg.selectAll()
			.data(parties)
			.enter().append("rect")
			.attr("x", calcStartX)
			.attr("y", yPos - unit)
			.attr("width", calcWidth)
			.attr("height", unit)
			.attr("fill", function(d){ return data_parties[d.party].color; })
			//.attr("fill", function(d){ return goshToColor(data_parties[d.party].gosh); })
			.attr("fill-opacity", "0.4")
			.html(calcPartyDisplayName)
			.attr("class", "clickable")
			.on('mouseover', function(){
				var originalColor = this.color;
				d3.select(this).style("fill","#ddd").on('mouseout', function(){
					d3.select(this)
					.style("fill",originalColor);
				})
			}).on('click', function(d){
				goto_party(d.party);
			});
			
			
			// draw party names
			svg.selectAll()
			.data(parties)
			.enter().append("text")
			.attr("x", function(d) { return calcStartX(d) + calcWidth(d) / 2; } )
			.attr("y", yMiddle + unit / 4)
			.attr("text-anchor", "middle")
			.attr("class", "clickable")
			.style("font-size", Math.ceil(unit / 1.5) + "px")
			.html(calcPartyDisplayName).on('click', function(d){
				goto_party(d.party);
			});
		}
		if (firstRendering) firstRendering = false;
	}
	draw_listWindow = draw_listWindow_;
})();
