// A match is found only if the best score is higher than the threshold
var THRESHOLD = 0;
var LEFT = "L", TOP = "T", TOP_LEFT = "LT"; // enums for cell arrows
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
}

/** compare class ***/
function Compare()
{
	// the dynamic programming matrix
	var arr;
	
	// Compares two strings and finds their best local match, prints the local match to the gui, returns nothing
	function matchAndPrintToGui(str1, str2, gui)
	{
		var match = localMatch(str1, str2);
		console.log(match);
		gui.showMessage("Best match: ", "<b>Left text....</b>" + match.str1 + "<br><b>right text...</b>" + match.str2 +
		"<br/>Score: " + match.score);
		gui.drawArray(arr); // Draw the matrix
	}
	
	// Compares two strings and returns their best local match
	function localMatch(str1, str2)
	{
		str1 = "|" + str1;
		str2 = "|" + str2; // filler character to align the length with the matrix length
		
		var w = str1.length; // width of the dynamic programming array
		var h = str2.length; // height of the dynamic programming array
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
		console.log(w);
		for (var x = 0; x < w; ++x)
		{
			console.log(x);
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
		for (var y = 1; y < h; ++y)
		{
			for (var x = 1; x < w; ++x)
			{
				letter1 = str1[x];
				letter2 = str2[y];
				
				// Search for the best score. Temporary candidate cell values. We choose one of them.
				topLeft = new Cell(arr[x - 1][y - 1].score + scoreFunction(letter1, letter2), TOP_LEFT);
				top = new Cell(arr[x][y - 1].score + scoreFunction("-", letter2), TOP); // - is an indel
				left = new Cell(arr[x - 1][y].score + scoreFunction("-", letter1), LEFT);
				startNew = new Cell(0, null); // for local matching
				
				// find the max among the 4 candidates and fill this cell
				var candidates = [startNew, topLeft, top, left];
				var max = candidates[0];
				for (var i = 1; i < 4; ++i)
				{
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
				str2match.push(str1[x]);
				x -= 1;
				y -= 1;
				cell = arr[x][y];
				break;
			}
			if (previousCell.score == 0) break;
		}
		
		return {str1: str1match, str2: str2match};
	}
	function scoreFunction(str1, str2)
	{
		if (str1 == "-") return 0;
		else if (str1 == str2) return 1;
		else return -1;
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
	
	// private memeber variables - other
	var compare = compare_;      // the compare object received in constructor
	var gui = this;
	var regex = /[a-zA-Z0-9 ]+/; // regular expression to check for only English or numbers in input

	// public methods
	this.showMessage = showMessage;
	this.showError = showError;
	
	// initialize the gui object
	reset();
	buttonMatch.onclick = onMatchClick;
	buttonReset.onclick = onResetClick;
	
	/** public functions */
	
	// Clear inputs and result text
	function reset()
	{
		input1.value = "hello my dear children";
		input2.value = "elementary dear children";
		textSmall.innerHTML = "Enter two strings. We'll find out if a student has copied their homework.";
		textBig.innerHTML = ""; // clear big text
	}
	
	// Show an error
	function showError(errorString)
	{
		textBig.innerHTML = errorString;
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

