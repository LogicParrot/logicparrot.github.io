function doMain()
{
	var now = new Date();
	var eventCarmel = new Date(2018, 1, 20);

	var elCarmel1 = document.getElementById("carmel1");
	var elCarmel2 = document.getElementById("carmel2");
	var elCarmel3 = document.getElementById("carmel3");
	
	daysTillCarmel = getDays(now, eventCarmel);
	manageTimer(elCarmel1, daysTillCarmel);
	manageTimer(elCarmel2, daysTillCarmel);
	manageTimer(elCarmel3, daysTillCarmel);
		
	// refresh at midnight + 30 minutes
	if (daysTillCarmel >= 0)
	{
		var midnight = new Date();
		midnight.setDate(midnight.getDate() + 1);
		midnight.setHours(0,0,0,0);
		var waitAmount = midnight - now;
		if (waitAmount < 0) waitAmount = 0; // should never happen, but just in case
		var thirtyMinutes = 1000 * 60 * 30;
		setTimeout(function(){location.reload(); }, waitAmount + thirtyMinutes);
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
	else if (days <= 3)
		str = '<label class="green">' + translations["days_prefix"] + " " + days + " " + translations["days_suffix"] + "</label>";
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
