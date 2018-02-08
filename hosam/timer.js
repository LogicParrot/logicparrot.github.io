function doMain()
{
	var now = new Date();
	var eventNorth = new Date(2018, 1, 9);
	var eventCarmel = new Date(2018, 1, 20);
	
	var elNorth = document.getElementById("north");
	var elCarmel1 = document.getElementById("carmel1");
	var elCarmel2 = document.getElementById("carmel2");
	
	daysTillNorth = getDays(now, eventNorth);
	daysTillCarmel = getDays(now, eventCarmel);
	
	manageTimer(elNorth, daysTillNorth);
	manageTimer(elCarmel1, daysTillCarmel);
	manageTimer(elCarmel2, daysTillCarmel);
	
	if ((daysTillNorth >= 0) || (daysTillCarmel >= 0))
	{
		var midnight = new Date();
		midnight.setDate(midnight.getDate() + 1);
		midnight.setHours(0,0,0,0);
		setTimeout(function(){location.reload(); }, midnight - now + 10000);
	}
}

function manageTimer(el, days)
{
	var str;
	if (days == 0)
		str = '<label class="red">'+translations["today"]+"</label>";
	else if (days == -1)
		str = translations["ended"];
	else if (days == 1)
		str = '<label class="red">'+translations["tomorrow"]+"</label>";
	else
		str = translations["days_prefix"] + " " + days + " " + translations["days_suffix"];
	str = " (" + str + ")";
	
	el.innerHTML = str;
}

//assuming "later" is 00:00:00 of the desired date
//0: the "later" date is today (now can be anywhere from 00 to 24 during that day)
//-1: the "later" date is over
//positive: the "later" day is X days into the future
function getDays(now, later)
{
		days = Math.ceil((later - now) / (1000*60*60*24));
		if (days < -1) days = -1;
		return days;
}
