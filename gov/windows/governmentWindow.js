// functions available to other modules:
var link_government;
var goto_government;

(function()
{
	function draw_governmentWindow(govNumber)
	{
		if (typeof govNumber == "string") govNumber = parseInt(govNumber);
		console.log("Rendering government window for government", govNumber);
		var gov = data_governments[govNumber - 1];
		var container = d3.select("#container");
		document.body.dir = "rtl"
		container.html("").style("padding", "2em"); // Remove previous content
		container.append("h1").text("ממשלת ישראל ה" + getHebrewNumber(gov.government));
		addBackButton(container);
		if (govNumber > 1)
		{
			container.append("br")
			addButton(container, "הממשלה הקודמת", function()
			{
				goto_government(govNumber - 1);
			});
		}
		if (data_governments[govNumber] !== undefined)
		{
			container.append("br")
			addButton(container, "הממשלה הבאה", function()
			{
				goto_government(govNumber + 1);
			});
		}
		
		container.append("h2").text("מידע כללי");
		var data = [];
		data.push({key: "מספר ממשלה", value: gov.government});
		data.push({key: "מספר כנסת", value: gov.kneset});
		data.push({key: "ראש הממשלה", value: gov.pm});
		data.push({key: 'מפלגת רהמ"ש', value: gov.pmParty});
		data.push({key: "שנים", value: gov.from + " - " + gov.to});
		makeBoldKeys(data);
		tabulate(container, data, ["key", "value"], null); // draw a table of the party data
		
		container.append("h2").text("הרכב מפלגות");
		var data = [];
		var parties = data_partiesInGovernment[gov.government];
		var maxGraphWidth = Math.ceil(gWidth/3);
		var unit = Math.ceil(gWidth / 60);
		for (var i = 0; i < parties.length; i++)
		{
			var partyInGov = parties[i];
			var party = data_parties[partyInGov.party];
			
			data.push({
				partyInGov: partyInGov,
				name: link_party(partyInGov.party),
				type: partyInGov.coalition == 1 ? '<div style="background: lightBlue;">קואליציה</div>' :
						'<div style="background: IndianRed;">אופוזיציה</div>',
				seats: partyInGov.seats,
				percent: Math.round((partyInGov.seats * 100 * 100 / 120))  / 100 + "%", // X * 100 / 120 - percentage. round(x * 100) / 100 - decimal point scaling.
				graphArea: '<svg id="svg' + data.length + '" width="' + maxGraphWidth + '" height="' + unit + '">' + '</svg>'
				});
				
			/*data.push({
				name: '<div style="background-color: ' + party.color + ';" id="party' + i + '">' + partyInGov.party + "</div>",
				type: partyInGov.coalition == 1 ? '<div style="background: lightBlue;">קואליציה</div>' :
						'<div style="background: IndianRed;">אופוזיציה</div>',
				seats: partyInGov.seats,
				percent: Math.round((partyInGov.seats * 100 * 100 / 120))  / 100 + "%" // X * 100 / 120 - percentage. round(x * 100) / 100 - decimal point scaling.
				});*/
		}		
		
		tabulate(container, data, ["name", "type", "seats", "percent", "graphArea"], ["מפלגה", "סוג", "מנדטים", "אחוז מנדטים", "גרף"]); // draw a table of the party data
		
		setTimeout(function()
		{
			for (var i = 0; i < data.length; i++)
			{
				var width = Math.round(maxGraphWidth * data[i].seats / 120);
				d3.select("#svg"+i).append("rect").attr("x", maxGraphWidth - width).attr("y", 0).attr("width", width).attr("height", unit)
				.attr("fill", data[i].partyInGov.coalition == 1 ? "lightBlue" : "IndianRed");
			}
		}, 1);
		
	}
	
	function link_government_(gov)
	{
		return createClickableLink(gov, "goto_government");
	}
	
	function goto_government_(gov)
	{
		draw(function()
		{
			draw_governmentWindow(gov);
		});
	}
	
	function getHebrewNumber(number)
	{
		switch (number)
		{
			case 1: return "ראשונה";
			case 2: return "שניה";
			case 3: return "שלישית";
			case 4: return "רביעית";
			case 5: return "חמישית";
			case 6: return "שישית";
			case 7: return "שביעית";
			case 8: return "שמינית";
			case 9: return "תשיעית";
		}
		return "-"+number;
	}
	link_government = link_government_;
	goto_government = goto_government_;
})();
