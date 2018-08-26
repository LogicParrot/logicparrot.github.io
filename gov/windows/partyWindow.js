// functions available to other modules:
var link_party;
var goto_party;

(function()
{
	function draw_partyWindow(partyName)
	{
		console.log("Rendering party window for:",partyName);
		var container = d3.select("#container");
		document.body.dir = "rtl"
		container.html("").style("padding", "2em"); // Remove previous content
		container.append("h1").text("מפלגת " + partyName);
		addBackButton(container.append("div"));
		var party = data_parties[partyName];

		// calculate statistics
		var totalCoalition = 0;
		var totalOpposition = 0;
		var totalPrimeMinister = 0;
		var participatedGovernments = [];
		
		console.log(data_partiesInGovernment);
		for (var i = 1; i < data_partiesInGovernment.length; i++)
		{
			var debug = 0;
			for (var j = 0; j < data_partiesInGovernment[i].length; j++)
			{
				var currentParty = data_partiesInGovernment[i][j];
				if (currentParty.party != partyName) continue;
				if (currentParty.coalition) totalCoalition++;
				else totalOpposition++;
				var gov = data_governments[i - 1];
				participatedGovernments.push(
				{
					government: link_government(gov.government),
					kneset: gov.kneset,
					years: gov.from + "-" + gov.to,
					coalition: (currentParty.coalition == 1 ? 
						'<div style="background: lightBlue;">קואליציה</div>' :
						'<div style="background: IndianRed;">אופוזיציה</div>'),
					seats: currentParty.seats,
					percent: Math.round((currentParty.seats * 100 * 100 / 120))  / 100 + "%", // X * 100 / 120 - percentage. round(x * 100) / 100 - decimal point scaling.
					pm: gov.pm,
					pmParty: (gov.pmParty == currentParty.party ? '<div style="background: lightGreen; ">' + gov.pmParty + "</div>" : link_party(gov.pmParty)),
				}
				);
				if (data_governments[i - 1].pmParty == partyName)
				{
					debug = 1;
					totalPrimeMinister++;
				}
				break;
			}
			if (data_governments[i - 1].pmParty == partyName) 
			{
				if (debug == 0)
				console.log("Problem with GOV ", i, ". The pm's party does not appear in the party list");
			}
		}
		
		var data = [];
		
		data.push({key: "שם מפלגה", value: party.name});
		data.push({key: "גוש", value: goshIdToString(party.gosh)});
		data.push({key: 'מס\' פעמים <div style="background: LightBlue;">בקואליציה</div>', value: totalCoalition});
		data.push({key: 'מתוכם <div style="background: LightGreen;">מפלגת רהמ"ש</div>', value: totalPrimeMinister});
		data.push({key: 'מס\' פעמים <div style="background: IndianRed;">באופוזיציה</div>', value: totalOpposition});
		
		makeBoldKeys(data);
		tabulate(container.append("div").style("display", "inline-block"), data, ["key", "value"], null); // draw a table of the party data
		drawPieChart(container.append("div").attr("id", "pieChartContainer"), totalCoalition, totalOpposition, totalPrimeMinister);

		
		container.append("h2").text("השתתפות בממשלות");
		tabulate(container, participatedGovernments, 
		["government", "kneset", "years", "coalition", "seats", "percent", "pm", "pmParty"], 
		["ממשלה", "כנסת", "שנים", "סוג", "מנדטים", "אחוז מנדטים", "ראש ממשלה", 'מפלגת רהמ"ש']); // draw a table of the party data
		
	}
	
	function link_party_(name)
	{
		return createClickableLink(name, "goto_party");
	}
	
	function goto_party_(name)
	{
		draw(function()
		{
			draw_partyWindow(name);
		});
	}
	
	function goshIdToString(gosh)
	{
		if (gosh == -2) return "ערבים";
		if (gosh == -1) return "גוש שמאל";
		if (gosh == 0) return "גוש מרכז";
		if (gosh == 1) return "גוש ימין";
		if (gosh == 2) return "חרדים";
		return "לא ידוע";
	}
	
	function drawPieChart(container, totalCoalition, totalOpposition, totalPrimeMinister)
	{
		setTimeout(function()
		{
			var currentArc = 0;
			var size = document.getElementById("pieChartContainer").clientWidth;
			var svg = container.append("svg").attr("width", size).attr("height", size);
			
			var sum = totalCoalition + totalOpposition;
			var coalitionNoPM = totalCoalition - totalPrimeMinister;
			var coalitionPM = totalPrimeMinister;
			var opposition = totalOpposition;
			
			drawPiePart(360 * coalitionNoPM / sum, "LightBlue");
			drawPiePart(360 * coalitionPM / sum, "LightGreen");
			drawPiePart(360 * opposition / sum, "IndianRed");
			
			
			function drawPiePart(arc, color)
			{
				var start = currentArc;
				var end = currentArc + arc;
				if ((start == 0) && (end == 360))
				{
					svg.append("path").attr("fill", color).attr("d", describeArc(size / 2, size / 2, size / 2, 350, 10));
					end = 359;
				}
				svg.append("path").attr("fill", color).attr("d", describeArc(size / 2, size / 2, size / 2, start, end));
				
				currentArc += arc;
			}
			
		}, 5);
	}
	
	function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

	  return {
		x: centerX + (radius * Math.cos(angleInRadians)),
		y: centerY + (radius * Math.sin(angleInRadians))
	  };
	}

	function describeArc(x, y, radius, startAngle, endAngle){

		var start = polarToCartesian(x, y, radius, endAngle);
		var end = polarToCartesian(x, y, radius, startAngle);

		var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

		var d = [
			"M", start.x, start.y, 
			"A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
			"L", x, y
		].join(" ");

		return d;       
	}
	link_party = link_party_;
	goto_party = goto_party_;
})();

