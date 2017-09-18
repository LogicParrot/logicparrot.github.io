function c(str)
{
	return document.createElement(str);
}

function g(str)
{
	return document.getElementById(str);
}
function del(str)
{
	var el = g(str);
	el.parentNode.removeChild(el);
}

// source: https://sashat.me/2017/01/11/list-of-20-simple-distinct-colors/

// todo Kol-Hashar always the same color. 

var getColor = generateGetter(["#e6194b", "#3cb44b", "#ffe119", "#0082c8", "#f58231", "#911eb4", "#46f0f0", "#f032e6", "#d2f53c", "#fabebe",
"#008080", "#e6beff", "#aa6e28", "#fffac8", "#800000", "#aaffc3", 
 "#808000", "#ffd8b1", "#000080", "#808080", "#FFFFFF", "#000000"]);

var getTextColor = generateGetter([
"#ffffff", "#ffffff", "#000000", "#ffffff", "#ffffff", "#ffffff",
"#000000", "#ffffff", "#000000", 
"#000000","#ffffff", "#000000", 
"#ffffff", "#000000", "#ffffff",
"#000000",  "#ffffff", "#000000", 
"#ffffff", "#000000", "#000000", 
"#ffffff"]);


//var getHighlight = generateGetter(["#FF5A5E", "#5AD3D1", "#FFC870"]);
var getHighlight = function(){return "#FFFFFF";} // What do highlights even do

// returns a function which returns items of "array" sequentially each call, wraps back when it ends.
function generateGetter(array)
{

	return (function()
	{
		var i = 0;
		function getter()
		{
			i = (i + 1) % array.length;
			return array[i];
		}
		return getter;
	})();
}

var data = [];
function init()
{
	g("reset").onclick = function(){location.reload();}
	g("input").value = "";
	handleNames(data);
}

function handleNames(data)
{
	g("msg").innerHTML = "נא להזין את כל שמות המפעלים, מופרדים בשורה. העתקת עמודה מאקסיל אמורה לעבוד:";
	g("nxt").onclick = function(){convertNamesFromTextToData(data);};
}

function convertNamesFromTextToData(data)
{
	delete g("nxt").onclick;

	var lines = g("input").value.split('\n');
	for(var i = 0;i < lines.length;i++)
	{
		var name = lines[i].trim();
		data[i] = {
			label: name
		}
	}

	g("input").innerHTML = "";
	handleValues(data);
}

function handleValues(data)
{
	g("msg").innerHTML = "עכשין נזין את הערכים באותו אופן:";
	g("input").value = "";
	g("nxt").onclick = function(){convertValuesFromTextToData(data);}
}

function convertValuesFromTextToData(data)
{
	var lines = g("input").value.split('\n');
	if (lines.length != data.length)
	{
		g("msg").innerHTML = 'מספר שורות הערכית לא שווה למספר שורות השמות.' +
		'<br>לחצו על "התחלה מחדש" כדי לתקן את השמות, או נסו להזין שוב את הערכים כאן';
		return;
	}

	function addValueToData(index, value)
	{
		var num = value.trim();
		if (num == "")
		{
			if (data[index].label != "")
				num = 0;
			else
			{
				data[index].delme = true; // name and num both blank
				return true;
			}
		}
		else if (data[index].label == "")
		{
			var he1 = "תקלה! בשורה ";
			var he2 = " יש ערך אבל אין שם. הערך הוא: ";
			var he3 = ". תקנו אותו כאן או לחצו התחלה מחדש ותקנו שמות.";
			g("msg").innerHTML = he1 + (index + 1) + he2 + num + he3;
			return false;
		}
		if (data[index].delme !== undefined) delete data[index].delme; // from previous tries

		if (isNaN(num))
		{
			var he1 = "תקלה! הערך בשורה ";
			var he2 = ' הוא לא מספר. הערך הבעייתי הוא: "';
			g("msg").innerHTML = he1 + (index + 1) + he2 + num + '"';
			return false;
		}
		else num=parseInt(num); 
		data[index].value = num;
		return true;
	}

	for(var i = 0;i < lines.length;i++)
	{
		var value = lines[i].trim();
		if (!addValueToData(i, value)) return;
	}


	for(var i = 0;i < data.length;i++)
	{
		if (data[i].delme !== undefined)
		{
			data[i] = data[data.length - 1];
			data.pop();
			--i;
		}
	}

	handleHowMany();
}

function handleHowMany()
{
	g("msg").innerHTML = 'כמה ערכים להציג?<br>השאר יופיעו תחת השם "אחר":';
	g("input").value = "20";
	g("nxt").onclick = function(){
		if (groupData(data))
		{
			toPercentages(data);
			displayData(data);
		}
	};
}

// shows the top 'howMany' normally, groups the rest as a single one.
// return true on success
function groupData(data)
{

	howMany=g("input").value;
	if(isNaN(howMany)) 
	{
		g("msg").innerHTML = "יש להזין מספר! כמה ערכים להציג?";
		return false;
	}

	howMany = parseInt(howMany);

	if (data.length <= howMany + 1)
	{
		console.log(data.length + " is smaller than " + (howMany + 1));
		return true;
	}

	console.log("entering...");

	data.sort(function(a, b){return b.value-a.value});

	// everything will be grouped into last item
	var lastItem = data[howMany];
	lastItem.label = "כל השאר";
	
	var len = data.length;
	for (i = howMany + 1; i < len; ++i)
	{
		console.log("beep!");
		var current = data[i];
		lastItem.value += current.value;
	}
	for (i = howMany + 1; i < len; ++i)
	{
		console.log("Pop " + i);
		data.pop();
	}


	return true;
}

function toPercentages(data)
{
	var sumAll = 0;
	// to percentages
	for(var i = 0;i < data.length;i++)
	{
		sumAll += data[i].value;
	}

	for(var i = 0;i < data.length;i++)
	{
		data[i].value = ((data[i].value * 100) / sumAll).toFixed(2);
	}
}

var drawSegmentValues;
function displayData(data)
{
	// apply color (we do that only after sorting and weeding out things, meaning after groupData).
	for (i = 0; i < data.length; ++i)
	{
		data[i].color = getColor(); //background
		data[i].myTextColor = getTextColor(); //txt
		data[i].highlight = getHighlight();
	}

	g("msg").innerHTML = "מייצר טבלה...";
	del("ui");2
	generateChart(data);
	setTimeout(drawSegmentValues, 500);
}

/*
var dat = [
  {
    value: 300,
    color:"#F7464A",
    highlight: "#FF5A5E",
    label: "כל השאר"
  },
  {
    value: 50,
    color: "#46BFBD",
    highlight: "#5AD3D1",
    label: "הירקון"
  },
  {
    value: 100,
    color: "#FDB45C",
    highlight: "#FFC870",
    label: "חיפה כימיכלים"
  }
];*/





function generateChart(data)
{

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var midX = canvas.width/2;
var midY = canvas.height/2

// Create a pie chart
var myPieChart = new Chart(ctx).Pie(data, {
  showTooltips: false,
  animation: false/*,
  onAnimationProgress: drawSegmentValues,*/
});

var radius = myPieChart.outerRadius;


drawSegmentValues = function()
{
	for(var i=0; i<myPieChart.segments.length; i++) 
	{
		ctx.fillStyle=data[i].myTextColor;
		var textSize = 15; // 15 with MAXLEN 15 worked fine too
		ctx.font= textSize+"px Verdana";

		var value = myPieChart.segments[i].value;
		var distance;
		var strArr = ["", "", ""];

		if (value >= 11)
		{
			var MAXLEN = 20;
			var words = data[i].label.split(" "); 
			distance = 0.6;
	
			var strIndex = 0;
			var dotsNeeded = false;
			var lastStrIndex = 0;
			for (var j = 0; j < words.length; ++j)
			{
				if (strArr[strIndex].length + 1 + words[j].length <= MAXLEN)
				{
					strArr[strIndex] += " " + words[j];
					lastStrIndex = strIndex;
				}
				else
				{
					strIndex++;
					--j;
					// couldn't fit all words, we need to add 3 dots
					if (strIndex == strArr.length) 
					{
						dotsNeeded = true;
						break;
					}
				}
			}
			console.log(data[i].label + "required " + (lastStrIndex + 1) + " strings");
			for (var k = 0; k <= lastStrIndex; ++k)
			{
				console.log("string " + (k + 1) + ": " + strArr[k]);
			}
	
			var suffix = " - " + value + "%";

			// if there's no space for suffix
			if ((!dotsNeeded) && (strArr[lastStrIndex].length + suffix.length) >= MAXLEN)
			{
				// See if we can simply put suffix on an unused line
				if (lastStrIndex != strArr.length - 1)
				{
					lastStrIndex++;
				}
				else
				{
					// there are no unused lines, so we need to put dots on the last line
					dotsNeeded = true;
				}
			}
	
			if (dotsNeeded)
			{
				suffix = "..." + suffix;
				var extraSpaceNeeded = suffix.length;
				if (strArr[lastStrIndex].length + extraSpaceNeeded >= MAXLEN)
					strArr[lastStrIndex] = strArr[lastStrIndex].substring(0, MAXLEN - extraSpaceNeeded - 1);
			}

			strArr[lastStrIndex] += suffix;
		}
		else
		{
			distance = 0.8;
			strArr[0] = value + "%";
			lastStrIndex = 0;
		}
		var startAngle = myPieChart.segments[i].startAngle;
		var endAngle = myPieChart.segments[i].endAngle;
		var middleAngle = startAngle + ((endAngle - startAngle)/2);

		// Compute text location
		/* var posX = (radius/2) * Math.cos(middleAngle) + midX;
		var posY = (radius/2) * Math.sin(middleAngle) + midY;*/
		var posX = (radius*distance) * Math.cos(middleAngle) + midX;
		var posY = (radius*distance) * Math.sin(middleAngle) + midY;

		// Text offside by middle
		var h_offset = textSize/4;

		for (var j = 0; j <= lastStrIndex; ++j)
		{
			var w_offset = ctx.measureText(strArr[j]).width/2;
			ctx.fillText(strArr[j], posX + w_offset, posY + h_offset + 14 * j);
		}
	}
}


var legend = g("legend");
var table = c("table");

for (var i =0; i < data.length; ++i)
{

	
	//var labelName = document.createTextNode(data[i].label + " - " + data[i].value + "%");
	var tr = c("tr");
	var td1 = c("td");
	var td2 = c("td");
	var td3 = c("td");
	tr.appendChild(td1);
	tr.appendChild(td2);
	tr.appendChild(td3);
	table.appendChild(tr);

	// td1
	var colorBox = c("label");
	colorBox.innerHTML = "&#x25A0;";
	colorBox.style.color = data[i].color;
	td1.appendChild(colorBox);
	td1.appendChild(document.createTextNode(data[i].label));

	// td2
	td2.appendChild(document.createTextNode("-"));

	// td3
	td3.appendChild(document.createTextNode(data[i].value + "%"));
}
legend.appendChild(table);
}
