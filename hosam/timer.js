function doMain(timers)
{
	setupAllTimers(timers);      // setup event timers
	shufflePhoneNumbers(); // shuffle phone numbers to load balance phone calls
}

function setupAllTimers(timers)
{
	
	var minDaysLeft = -1;
	for (var i = 0; i < timers.length; ++i)
	{
		timerData = timers[i];
		var daysLeft = setupOneTimer(document.getElementById(timerData.el), timerData.year, timerData.month, timerData.day);
		if ((daysLeft != -1) && (daysLeft < minDaysLeft)) minDaysLeft = daysLeft;
	}
	
	// refresh at midnight
	if (minDaysLeft >= 0)
	{
		var midnight = new Date();
		midnight.setDate(midnight.getDate() + 1);
		midnight.setHours(0,0,0,0);
		var waitAmount = midnight - now;
		if (waitAmount < thirtyMinutes) waitAmount = thirtyMinutes; // should never happen, but just in case
		var thirtyMinutes = 1000 * 60 * 30;
		setTimeout(function(){location.reload(); }, waitAmount + 5000);
	}
}

function setupOneTimer(el, year, month, day)
{
	if (el == undefined) return;
	var now = new Date();
	var eventDate = new Date(year, month - 1, day);
	
	daysLeft = getDays(now, eventDate);
	updateElement(el, daysLeft);
	return daysLeft;
}

function updateElement(el, days)
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


function shufflePhoneNumbers()
{
	var numbers = [];
	{ // fill numbers array
		var els = document.getElementsByClassName("phoneNumber");
		for (var i = 0; i < els.length; ++i)
		{
			numbers.push(els[i].innerHTML);
		}
	}
	{  // shuffle numbers array
		var temp = [];
		while (numbers.length > 0)
		{
			var index = Math.floor(Math.random() * numbers.length);
			var removedValue = numbers.splice(index, 1)[0];
			temp.push(removedValue);
		}
		numbers = temp;
	}
	{ // put back in HTML
		var els = document.getElementsByClassName("phoneNumber");
		for (var i = 0; i < els.length; ++i)
		{
			els[i].innerHTML = numbers[i];
		}
	}
}
