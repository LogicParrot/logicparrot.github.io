/**
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    Written by Safwat Halaby, 2017
**/
/** globals **/
var THRESHOLD = 0; // A match is found only if the best score is higher than the threshold
var SCORE_FUNCTION = 1; // whether to use score function 1 or 2
var LEFT = "L", TOP = "T", TOP_LEFT = "LT"; // string representations for cell arrows

function main()
{
	var compare = new Compare();
	var gui = new Gui(compare); // gui will wait for onResetClick or onMatchClick, and will call compare.matchAndPrintToGui
}

// two problems. type hello, hellxo.
// problem 1: space cost is set to 0 but it's -	, it's always picking LT
// problem 2: cutting first letter for some reason.

/*** Cell class ***/
// A cell's value in the dynamic programming array, has a value and an arrow
function Cell(score, arrow)
{
	this.score = score;
	this.arrow = arrow;
	
	this.set = function(score, arrow)
	{
		this.score = score;
		this.arrow = arrow;
	}
	
	var arrowString;
	
	this.toStr = function()
	{
		if (this.arrow !== null)
		{
			switch (this.arrow)
			{
				case LEFT:
					arrowString = "<";
				break;
				case TOP:
					arrowString = "^";
				break;
				case TOP_LEFT:
					arrowString = "*";
			}
		}		
		else arrowString = "";
		
		return arrowString + this.score;
	}
}

/** compare class ***/
function Compare()
{
	// the dynamic programming matrix
	var arr;
	var w;
	var h;
	
	// Compares two strings and finds their best local match, prints the local match to the gui, returns nothing
	function matchAndPrintToGui(str1, str2, gui)
	{
		var match = localMatch(str1, str2);
		
		// colorize the matches (using html and css)
		colors = colorize(match.str1, match.str2);
		
		gui.showMessage("Best match: ", "<b>Left text....</b>" + colors.str1 + "<br><b>right text...</b>" + colors.str2 +
		"<br/>Score: " + match.score);
		gui.drawArray(arr, w, h, str1, str2); // Draw the matrix
	}
	
	// Compares two strings and returns their best local match
	function localMatch(str1, str2)
	{
		str1 = "|" + str1.toLowerCase().trim();
		str2 = "|" + str2.toLowerCase().trim(); // filler character to align the length with the matrix length
		
		w = str1.length; // width of the dynamic programming array
		h = str2.length; // height of the dynamic programming array
		arr = create2dArray(w, h); // This matrix contains value (match score), and arrow(parent)
		
		// add zeros first col and first row
		initializeArray(arr, w, h);
		
		// fill the entire dynamic programming array
		fillArray(arr, w, h, str1, str2)
		
		// find the best score to start backtracking the arrows. returns: (ret.x, ret.y)
		var ret = findMaxScore(arr, w, h);
		var score = arr[ret.x][ret.y].score;
		if (score <= THRESHOLD)
		{
			return {str1: "no match found.", str2: "no match found.", score: score};
		}
		
		// backtrack the arrow trail and build the matching string
		var matches = backTrackArrows(arr, str1, str2, ret.x, ret.y);
		var str1match = matches.str1;
		var str2match = matches.str2;
		
		// reverse result matches and turn 1d arrays to string
		str1match = str1match.reverse()
		str1match = str1match.join("");
		str2match = str2match.reverse()
		str2match = str2match.join("");
		
		// return both matches
		return {str1: str1match, str2: str2match, score: score};
	}
	
	function initializeArray(arr, w, h)
	{
		// zero first row
		for (var x = 0; x < w; ++x)
		{
			arr[x][0] = new Cell(0, null);
		}
		
		// zero first col
		for (var y = 0; y < h; ++y)
		{
			arr[0][y] = new Cell(0, null);
		}
	}
	
	function fillArray(arr, w, h, str1, str2)
	{
		var scoreFunction;
		if (SCORE_FUNCTION == 1)
		{
			scoreFunction = scoreFunction1;
		}
		else
		{
			scoreFunction = scoreFunction2;
		}
		for (var y = 1; y < h; ++y)
		{
			for (var x = 1; x < w; ++x)
			{
				letter1 = str1[x];
				letter2 = str2[y];
				// Search for the best score. Temporary candidate cell values. We choose one of them.
				cellTopLeft = new Cell(arr[x - 1][y - 1].score + scoreFunction(letter1, letter2), TOP_LEFT);
				cellTop = new Cell(arr[x][y - 1].score + scoreFunction("-", letter2), TOP); // - is an indel
				cellLeft = new Cell(arr[x - 1][y].score + scoreFunction("-", letter1), LEFT);
				startNew = new Cell(0, null); // for local matching
				
				if ((x == 7) && (y == 7))
				{
					console.log(cellTopLeft);
					console.log(cellTop);
					console.log(cellLeft);
					console.log(startNew);
				}
				// find the max among the 4 candidates and fill this cell
				var candidates = [startNew, cellTopLeft, cellTop, cellLeft];
				var max = candidates[0];
				for (var i = 1; i < 4; ++i)
				{
					if ((x == 7) && (y == 7)) console.log(str1[x], str2[y], candidates[i]);
					if (candidates[i].score > max.score)
					{
						max=candidates[i];
					}
				}
				
				arr[x][y] = max;
			}
		}
	}
	
	function findMaxScore(arr, w, h)
	{
		var max_cell = arr[0][0];
		var max_x = 0;
		var max_y = 0;
		
		for (var y = 1; y < h; ++y)
		{
			for (var x = 1; x < w; ++x)
			{
				if (arr[x][y].score > max_cell.score)
				{
					max_cell = arr[x][y];
					max_x = x;
					max_y = y;
				}
			}
		}
		
		return {x: max_x, y: max_y}
	}
	
	function backTrackArrows(arr, str1, str2, startingX, startingY)
	{
		var str1match = []; // the result of the best local match is stored here
		var str2match = [];
		var cell = arr[startingX][startingY];
		var x = startingX;
		var y = startingY;
		for(;;)
		{
			var previousCell = cell;
			switch (cell.arrow)
			{
				case TOP:
				str1match.push("-");
				str2match.push(str2[y]);
				y -= 1;
				cell = arr[x][y];
				break;
				
				case LEFT:
				str1match.push(str1[x]);
				str2match.push("-");
				x -= 1;
				cell = arr[x][y];
				break;
				
				case TOP_LEFT:
				str1match.push(str1[x]);
				str2match.push(str2[y]);
				x -= 1;
				y -= 1;
				cell = arr[x][y];
				break;
			}
			if (previousCell.score == 0) break;
		}
		
		return {str1: str1match, str2: str2match};
	}
	
	function scoreFunction1(str1, str2)
	{
		if (str1 == "-") return -2;
		else if (str1 == str2) return 1;
		else return -1;
	}
	
	function scoreFunction2(str1, str2)
	{
		function lettersEqual(letter1, letter2)
		{
			return ((str1 == letter1) && (str2 == letter2)) || ((str2 == letter1) && (str1 == letter2))
		}
				
		if (str1 == "-") return -2;
		else if (str1 == str2) return 1;
		else if (lettersEqual("e","a")) return 0;
		else if (lettersEqual("g","j")) return 0;
		else if (lettersEqual("v","w")) return 0;
		else return -1000;
	}
	
	
	
	this.matchAndPrintToGui = matchAndPrintToGui; // set function to public
}

/*** GUI class ***/
function Gui(compare_)
{
	// private member variables - GUI elements from HTML
	var input1 = el("input1");
	var input2 = el("input2");
	var textBig = el("textBig");
	var textSmall = el("textSmall");
	var buttonMatch = el("buttonMatch");
	var buttonReset = el("buttonReset");
	var textThreshold = el("threshold");
	var radioBox1 = el("f1");
	var radioBox2 = el("f2");
	var tableArea = el("tableArea");
	var example1 = el("example1");
	var example2 = el("example2");
	var example3 = el("example3");
	var example4 = el("example4");
	
	// private memeber variables - other
	var compare = compare_;      // the compare object received in constructor
	var gui = this;
	var regex = /[a-zA-Z0-9 ]+/; // regular expression to check for only English or numbers in input

	// set the public methods
	this.showMessage = showMessage;
	this.showError = showError;
	this.drawArray = drawArray;
	
	// initialize the gui object
	reset();
	buttonMatch.onclick = onMatchClick;
	buttonReset.onclick = onResetClick;
	
	example1.onclick = function()
	{
		input1.value = "john and I saw the amazing quick brown fox";
		input2.value = "my neighbor saw the aamazing slow brown fox";
	}
	
	example2.onclick = function()
	{
		input1.value = "hello world how are you";
		input2.value = "hallo world how are you";
	}
	
	example3.onclick = function()
	{
		input1.value = "William Beach Thomas (1868–1957) was a British author and journalist who worked as a war correspondent and wrote about nature and country life. After a short-lived career as a schoolmaster, he began to write articles for newspapers and periodicals, as well as books. During the early part of the First World War he defied military authorities by reporting news stories from the Western Front for his employer, the Daily Mail. He was briefly imprisoned before being granted official accreditation as a war correspondent. His book With the British on the Somme (1917) portrayed the English soldier in a ";
		input2.value = "In very favourable light. Both France and Britain rewarded him with knighthoods after the war, but Baach Thomas regretted some of his wartime output. His primary interest as an adult was in rural matters. He was an advocate for the creation of national parks in England and Wales, and mourned the decline of traditional village society. He wrote extensively, particularly for The Observer newspaper and periodicels and The Spectator, a conservative magazine. His book The English Landscape (1938) includes selections from";
	}
	
	example4.onclick = function()
	{
		input1.value = "the man";
		input2.value = "the tree";
	}
	
	/** Class methods */
	
	// Clear inputs and result text
	function reset()
	{
		input1.value = "";
		input2.value = "";
		textSmall.innerHTML = "We'll find out if a student has copied their homework.";
		textBig.innerHTML = 'Enter two strings, then click "start matching"'; // clear big text
		radioBox2.checked = false;
		radioBox1.checked = true;
		tableArea.innerHTML = "";
		threshold.value = "0";
	}
	
	// Show an error
	function showError(errorString)
	{
		textBig.innerHTML = errorString;
		textSmall.innerHTML = "";
	}
	
	// Show result
	function showMessage(bigText, smallText)
	{
		textBig.innerHTML = bigText;
		textSmall.innerHTML = smallText;
	}
	
	// Triggered when the match button is clicked
	function onMatchClick()
	{
		var str1 = input1.value;
		var str2 = input2.value;
		threshold = textThreshold.value;
		if (isNaN(threshold) || (threshold < 0))
		{
			showError("Threshold must be a non negative number");
			return;
		}
		THRESHOLD = Number(threshold); // global variable
		var chosenFunction;
		if (radioBox1.checked) SCORE_FUNCTION = 1;
		else SCORE_FUNCTION = 2;
			
		
		// check if inputs are not empty
		if ((str1.replace(/\s/g, "") == "") || (str2.replace(/\s/g, "") == ""))
		{
			showError("Input must not be empty!");
			return;
		}
		
		// check if input is English and numbers only
		var valid = regex.test(str1) && regex.test(str2);
		if (!valid)
		{
			showError("Input must be English only. a-z, A-Z, 0-9, and spaces.");
			return;
		}
		
		showMessage("Please wait...", "");
		

		setTimeout(function() // start matching after "please wait" reneders to the screen
		{
			compare.matchAndPrintToGui(str1, str2, gui);
		}, 0);
	}
	
	// Triggered when the reset button is clicked
	function onResetClick()
	{
		reset();
	}
	
	function drawArray(arr, w, h, str1, str2)
	{
		if ((w > 30) || (h > 30))
		{
			tableArea.innerHTML = "Text too big for printing the array. size is: " + w + "x" + h + ". max allowed for printing: 30x30";
			return;
		}
		var c = function(str){return document.createElement(str);};
		var table = c("table");
		var row;
		
		function newRow()
		{
			row = c("tr");
			table.appendChild(row);
		}
		
		function addCell(str)
		{
			var cell = c("td");
			cell.innerHTML = str;
			row.appendChild(cell);
		}

		// row 1
		newRow();
		addCell(" ");
		addCell("-");
		for (var i = 0; i < str1.length; ++i)
		{
			addCell(str1[i]);
		}
		
		// row 2
		newRow();
		addCell("-");
		for (var x = 0; x < w; ++x)
		{
			addCell(arr[x][0].toStr());
		}
		
		// rest of the rows
		for (var y = 1; y < h; ++y)
		{
			newRow();
			addCell(str2[y - 1]);
			for (var x = 0; x < w; ++x)
			{
				addCell(arr[x][y].toStr());
			}
		}
		
		tableArea.innerHTML = "";
		tableArea.appendChild(table);
	}
	
}

/*** Other functions ***/

// Find and return an html element by id
function el(elementId)
{
	return document.getElementById(elementId);
}

// create a "2d array"
function create2dArray(width, height) {
	var arr = [];
	for (var i=0; i < width; i++)
	{
		arr[i] = [];
	}
	return arr;
}

//colorizes (using html) str1 and str2. indel is red, mismatch is yellow, match is green

function colorizeLetter(letter, colorClass)
{
	return '<label class="'+colorClass+'">' + letter + "</label>";
}

function colorize(str1, str2)
{
	var result1 = "", result2 = "";
	var len = str1.length;
	if (len > 100)
	{
		// don't colorize if too long
		return {str1: str1, str2: str2};
	}
	
	for (i = 0; i < len; ++i)
	{
			var letter1 = str1[i];
			var letter2 = str2[i];
			if (letter1 == letter2)
			{
				if (letter1 != " ")
				{
					result1 += colorizeLetter(letter1, "green");
					result2 += colorizeLetter(letter2, "green");
				}
				else
				{
					result1 += colorizeLetter("&nbsp;", "green");
					result2 += colorizeLetter("&nbsp;", "green");
				}
			}
			else if ((letter1 == "-") || (letter2 == "-"))
			{
				result1 += colorizeLetter(letter1, "red");
				result2 += colorizeLetter(letter2, "red");
			}
			else
			{
				result1 += colorizeLetter(letter1, "yellow");
				result2 += colorizeLetter(letter2, "yellow");
			}
	}
	return {str1: result1, str2: result2};
}

