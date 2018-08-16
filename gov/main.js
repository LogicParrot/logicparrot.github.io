var init;
var data_governments;
var data_parties;
var data_partiesInGovernment;
(function()
{	
	function init_()
	{
		readData(init2); //read CSV data and call init2 when finished
	}
	function init2(data_governments_, data_parties_, data_partiesInGovernment_)
	{
		data_governments = data_governments_;
		data_parties = data_parties_;
		data_partiesInGovernment = data_partiesInGovernment_;
		console.log("Done reading data. ");
		draw(function()
		{
			draw_listWindow();
		}); // defined in draw/listWindow.js. Draw a list of all governments
		
		//console.log(data_governments);
		//console.log(data_parties);
		//console.log(data_partiesInGovernment);
	}

	function readData(callback)
	{
		var finishCount = 0; // how many CSV files have been read
		
		var governments = []; // This list contains info about each government. index 1 is unused
		// e.g. government[0] contains the first Israel government's kneset,government,primeMinister,party,from,to attributes.
		
		var parties = {}; // This associative array contains info about each part.
		// e.g. parties["halekood"] contains {name: "halekood", gosh: "1"}
		
		var partiesInGovernment = []; // This list maps government numbers to the list of parties that were in that government.
		// e.g. partiesInGovernment[1] is the list of all parties that particated in government 1, that is:
		// [ { party }, { party }, etc.. ]	
		// index 0 is unused.
		
		d3.csv("governments.txt", function(datum)
		{
			//kneset,government,primeMinister,party,from,to
			return {
				kneset: parseInt(datum.kneset),
				government: parseInt(datum.government),
				pm: datum.primeMinister.trim(),
				pmParty: datum.party.trim(),
				from: parseInt(datum.from),
				to: parseInt(datum.to)
			};
		}).then(function(data)
		{
			for (var i = 0; i < data.length; i++)
			{
				if ((i == data.length - 1) && (data[i].kneset == "")) continue; //newline
				if (i + 1 != data[i].government) console.log("WARNING - UNEXPECTED GOVERNMENT ID in governments.txt. i+1:", i+1, "id:", data[i]);
				governments[i] = data[i];
			}
			checkIfDone();
		});
		
		d3.csv("parties.txt", function(datum)
		{
			return {
				name: datum.party.trim(),
				gosh: parseInt(datum.gosh)
			};
		}).then(function(data)
		{
			for (var i = 0; i < data.length; i++)
			{
				party = data[i];
				if (party.name == "") continue;
				parties[party.name] = party;
				party.color = getColor();
				if ((party.gosh != -2) && (party.gosh != -1) && (party.gosh != 0) &&
					(party.gosh != 1) && (party.gosh != 2) && (party.gosh != 9))
					console.log("WARNING: party with strange gosh.", party);
			}
			checkIfDone();
		});
		
		d3.csv("partiesInGovernments.txt", function(datum)
		{
			if (datum.government == "") return;
			return {
				government: parseInt(datum.government),
				party: datum.party.trim(),
				seats: parseInt(datum.seats),
				coalition: (parseInt(datum.coalition) == 1 ? true : false)
			};
		}).then(function(data)
		{
			for (var i = 0; i < data.length; i++)
			{
				var partyInGovernment = data[i];
				var governmentNumber = partyInGovernment.government;
				if (partiesInGovernment[governmentNumber] === undefined)
				{
					partiesInGovernment[governmentNumber] = [];
				}
				if (parties[partyInGovernment.party] === undefined)
				{
					// if a party is present in partiesInGovernments but not in parties.txt, add it as if it were in parties.txt with unknown gosh.
					var obj = {};
					obj.name = partyInGovernment.party;
					obj.color = getColor();
					obj.gosh = 9;
					parties[obj.name] = obj;
				}
				partiesInGovernment[governmentNumber].push(partyInGovernment);
			}
			checkIfDone();
		});
		
		function checkIfDone()
		{
			if (++finishCount == 3)
				callback(governments, parties, partiesInGovernment);
		}
	}
	init = init_;
})();


////// BASIC SCREEN DRAW RESIZE LOGIC

// The below code handles screen drawing and resize
// The "draw" function receives a drawing function as a parameters.
// This function will be called whenever a redraw is needed (e.g. on resize)
var draw;

var gWidth; // Width of the canvas in pixels 
var gHeight; // Height of the canvas
var gMin; // minimum of gWidth, gHeight

(function()
{
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
		gHeight = window.innerHeight;
		gWidth = document.body.clientWidth;
		gMin = Math.min(gWidth, gHeight);
	}


	var drawFunc = null;
	function draw_(drawFunc_)
	{
		if (drawFunc_ !== undefined)
		{
			document.body.scrollTop = 0; // For Safari
			document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
			drawFunc = drawFunc_;
		}
		if (drawFunc != null)
		{
			recalcSize(); // calculate gWidth, gHeight, gMin, gBarWidth based on screen size
			drawFunc();
		}
	}
	draw=draw_;
})();

// COLOR GENERATOR
var getColor;
(function()
{
	var i = -1;
	var CSS_COLOR_NAMES = ["Khaki", "AliceBlue","Aqua","Azure","Beige","Bisque","Black","Aquamarine","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGrey","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkSalmon","DarkSeaGreen","DarkSlateBlue","DarkSlateGray","DarkSlateGrey","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DimGrey","DodgerBlue","FireBrick","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGray","LightGrey","LightGreen","MediumAquaMarine", "LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSteelBlue","LightYellow","Lime","LimeGreen","Magenta","Maroon","MediumBlue","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","Navy","OldLace","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","SlateGrey","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","Yellow","YellowGreen","BlanchedAlmond"];
	function getColor_()
	{
		i = (i + 1) % CSS_COLOR_NAMES.length;
		return CSS_COLOR_NAMES[i];
	}
	getColor = getColor_;
})();

// table generator

 function tabulate(container, data, columns, titles) {
		var table = container.append('table')
		var thead = table.append('thead')
		var	tbody = table.append('tbody');

		// append the header row
		if (titles !== null)
		{
			thead.append('tr')
			  .selectAll('th')
			  .data(titles).enter()
			  .append('th')
				.text(function (title) { return title; });
		}

		// create a row for each object in the data
		var rows = tbody.selectAll('tr')
		  .data(data)
		  .enter()
		  .append('tr');

		// create a cell in each row for each column
		var cells = rows.selectAll('td')
		  .data(function (row) {
		    return columns.map(function (column) {
		      return {column: column, value: row[column]};
		    });
		  })
		  .enter()
		  .append('td')
		    .html(function (d) { return d.value; });

	  return table;
	}

/// utility functions

function makeBoldKeys(data)
{
	for (var i = 0; i < data.length; i++)
	{
		data[i].key = "<b>" + data[i].key + "</b>";
	}
}

function addBackButton(container)
{
	container.append("a").attr("href", "#").html("דף ראשי").on("click", function()
	{
		draw(function()
		{
			draw_listWindow();
		});
	}).on("style", "");
}

function createClickableLink(value, callbackString)
{
	if (typeof value == "string") value = value.replace('"', '&quot;');
	
	return '<div class="clickable" ' +
		'onMouseOver="this.style.background = \'#bbb\'" ' + 
		'onMouseOut="this.style.background=\'#fff\'" ' +
		'onClick="' + callbackString + "('" + value + "')" + '" ' + 
		'>' + value + '</div>'
}
