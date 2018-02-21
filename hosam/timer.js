function doMain()
{
	//setupAllTimers();      // setup event timers
	shufflePhoneNumbers(); // shuffle phone numbers to load balance phone calls
}

function setupAllTimers()
{
	var now = new Date();
	var eventCarmel = new Date(2018, 1, 20);
	var elCarmel = document.getElementById("carmel");
	
	daysTillCarmel = getDays(now, eventCarmel);
	manageTimer(elCarmel, daysTillCarmel);
		
	// refresh at midnight + 30 minutes
	if (daysTillCarmel >= 0)
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
