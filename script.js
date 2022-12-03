function cdtime(targetDate){
	var thisobj=this
	this.syncinfo = {afterSec:300, currentSec:0} // resync current time with user's computer time after every x seconds (afterSec prop)
	this.targetDate = new Date(targetDate)
	this.currentDate = ''
	this.oncountdown = function(ms){}
	this.diff
}


cdtime.prototype.getDifference=function(){
	this.diff = this.targetDate - this.currentDate
}

cdtime.prototype.startCount = function(){
	var thisobj = this
	var syncinfo = this.syncinfo
	var updatetimer = setInterval(function(){ // update countdown every second
		if (syncinfo.currentSec >= syncinfo.afterSec){ // sync currentDate with time on user computer?
			thisobj.currentDate = new Date()
			syncinfo.currentSec = 0
		}
		else{
			thisobj.currentDate.setSeconds( thisobj.currentDate.getSeconds() + 1 )
		}
		thisobj.getDifference()
		thisobj.oncountdown(thisobj.diff)
		syncinfo.currentSec++
		if (thisobj.diff <= 0){
			clearInterval(updatetimer)
		}
	}, 1000) //update every second
}

cdtime.prototype.start = function(){
	this.currentDate = new Date()
	this.getDifference()
	this.oncountdown(this.diff)
	if (this.diff > 0){
		this.startCount()
	}
}

cdtime.formatDuration = function(ms, baseunit){
	/*
	Usage: cdtime.formatDuration(ms, baseunit)
		1) ms param: Time left in milliseconds
		2) baseunit: The topmost unit to calculate the remaining time using: "days", "hours", "minutes", or "seconds"
				If baseunit is "hours" for example, function will calculate the number of hours plus minutes plus seconds left for the specified ms duration
				If baseunit is "minutes" for example, function will calculate the number of minutes plus seconds left for the specified ms duration

	Returns: object containing the time left in the specified baseunit plus sub units. Other units will return "n/a"
		{
			days: int,
			hours: int,
			minutes: int,
			seconds: int
		}
	*/
	var timediff = ms/1000 // time remaining in sec
	var oneMinute=60 //minute unit in seconds
	var oneHour=60*60 //hour unit in seconds
	var oneDay=60*60*24 //day unit in seconds
	var dayfield=Math.floor(timediff/oneDay)
	var hourfield=Math.floor((timediff-dayfield*oneDay)/oneHour)
	var minutefield=Math.floor((timediff-dayfield*oneDay-hourfield*oneHour)/oneMinute)
	var secondfield=Math.floor((timediff-dayfield*oneDay-hourfield*oneHour-minutefield*oneMinute))
	if (baseunit=="hours"){ //if base unit is hours, set "hourfield" to be topmost level
		hourfield=dayfield*24+hourfield
		dayfield="n/a"
	}
	else if (baseunit=="minutes"){ //if base unit is minutes, set "minutefield" to be topmost level
		minutefield=dayfield*24*60+hourfield*60+minutefield
		dayfield=hourfield="n/a"
	}
	else if (baseunit=="seconds"){ //if base unit is seconds, set "secondfield" to be topmost level
		var secondfield=timediff
		dayfield=hourfield=minutefield="n/a"
	}
	return{
		days: dayfield,
		hours: hourfield,
		minutes: minutefield,
		seconds: secondfield
	}
}

document.addEventListener('DOMContentLoaded', function(){
  var christmascounter = document.getElementById('christmascounter')
  var daysdiv = christmascounter.querySelector('.days')
  var hoursdiv = christmascounter.querySelector('.hours')
  var minutesdiv = christmascounter.querySelector('.minutes')
  var secondsdiv = christmascounter.querySelector('.seconds')

  function padandwrap(number){
    // padandwrap function
    // 1) Pads single digit numbers with 0
    // 2) Converts each number to string and wrapped in a DIV (ie: 19 becomes <div>1</div><div>9</div>) and returns it
    var output = ''
    var numstr = (number <=9)? '0' + number : String(number)
    for (var i=0; i<numstr.length; i++){
      output += '<div>' + numstr.charAt(i) + '</div>\n'
    }
    return output
  }

  var today = new Date()
  var christmasyear = today.getFullYear()
  if (today.getMonth() == 11 && today.getDate() > 25){
    christmasyear += 1
  }

  var christmas = new cdtime(christmasyear + "-12-25 00:00:00")
  christmas.oncountdown = function(ms){
    if (ms <= 0){ // if time's up
      alert("2016 Christmas is Upon Us!") // do something
    }
    else{
      var timeleft = cdtime.formatDuration(ms, "days") // format time using formatDuration(timeleftms, "baseunit") function
      if (timeleft.days != 'n/a'){
        daysdiv.innerHTML = padandwrap( timeleft.days )
      }
      if (timeleft.hours != 'n/a'){
        hoursdiv.innerHTML = padandwrap( timeleft.hours )
      }
      if (timeleft.minutes != 'n/a'){
        minutesdiv.innerHTML = padandwrap( timeleft.minutes )
      }
      secondsdiv.innerHTML = padandwrap( timeleft.seconds )
    }
  }
  christmas.start()
})