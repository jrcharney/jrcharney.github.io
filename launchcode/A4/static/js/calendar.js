/* File: calendar.js
 * Info: Generate a calendar
 */
//import * from 'ajax.js'; Don't need this since I can just fetch

// TODO: Put this in Countdown class
// Sort of an ENUM
const one = {
    second : 1000,    /* 1 second = 1000 ms  */
    minute : 60000,   /*           60 * 1000 */
    hour   : 3600000, /*      60 * 60 * 1000 */
    day    : 86400000, /* 24 * 60 * 60 * 1000 */
    week   : 604800000  /* 7 * 24 * 60 * 60 * 1000 */
};

const size = {
    FULL : -1,
    NUMBER : 0,
    TINY : 1,
    SMALL : 2,
    MEDIUM : 3,
    LARGE : -1
};

// TODO: Might just get rid of this.
const View = {
    LIST  : { "name" : "list",  "value" : -1 },
    DAY   : { "name" : "day",   "value" :  1 },
    WEEK  : { "name" : "week",  "value" :  7 },
    MONTH : { "name" : "month", "value" : 42 }
};

const dotw  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const events_file = "../../assets/events.js";

class Calendar {
    constructor(query,events_file){
        this.cal = document.querySelector(query);
        // TODO: add controls
        this.events_file = events_file;
    }
    /*
    constructor(){
        // Set the date to now.
        this.date = new Date();   // TODO: will this need to be updated?
    }
    constructor(date){
        // Date string or another date
        this.date = new Date(date);
        //this.date = date;
    }
    constructor(year,month){
        // If need be, set to the first of the month
        this.date = new Date(year,month-1);
    }
    constructor(year,month,day){
        this.date = new Date(year,month-1,day);
    }
    */
    // Month here is range between 1 and 12.
    static monthHeader(month,year,size=-1){
        let dm = new Date(year,month-1,1);
        let monthHeadDiv = document.createElement("div");
        monthHeadDiv.classList.add("month");
        let monthHead = document.createElement("h1");
        let m = dm.getMonth();
        let monthText = (size === -1 ) ? month[m] : (size === 0) ? i : month[m].slice(0,size);
        let yearText  = dm.getFullYear();
        if(size !== -1){
            let monthAbbr = document.createElement("abbr");
            monthAbbr.setAttribute("title",month[m]);
            monthAbbr.innerText = monthText;
            monthHead.append(monthAbbr); 
        } else {
            monthHead.innerText = monthText;
        }
        return monthHead;
    }

    // firstday should be a value between 0 and 6.
    // days should define how many day we should make.
    static weekHeader(firstDay,days=7,size=-1){
        // DON'T FORGET! We still need to find the first day of the week!
        
        let weekHeadDiv = document.createElement("div");
        let dotwDiv = document.createElement("div");
        dotwDiv.classList.add("dotw");

        if(days > 1){
            let weekdays = Array.from({length: days}, (wday,i) => {
                let wdayDiv  = dotwDiv.cloneNode(true); // deep clone!
                let d = (firstDay + i) % 7;
                let wdayText = (size === -1 ) ? dotw[d] : (size === 0) ? i : dotw[d].slice(0,size);
                if(size !== -1){
                    let wdayAbbr = document.createElement("abbr");
                    wdayAbbr.setAttribute("title",dotw[d]);
                    wdayAbbr.innerText = wdayText;
                    wdayDiv.append(wdayAbbr);
                }else{
                    wdayDiv.innerText = wdayText;
                }
                weekHeadDiv.append(wdayDiv);
            });
        } else {
            // Get it for this day
            let d = firstDay % 7; //.getDay();
            let dotwText = (size === -1 ) ? dotw[d] : (size === 0) ? i : dotw[d].slice(0,size);
            if(size !== -1){
                let dotwAbbr = document.createElement("abbr");
                dotwAbbr.setAttribute("title",dotw[i]);
                dotwAbbr.innerText = dotwText;
                dotwDiv.append(dotwAbbr);
            }else{
                dotwDiv.innerText = dotwText;
            }
            weekHeadDiv.append(dotwDiv);
        }
        return weekHeadDiv;
    }

    // Get day of the week (0..6)
	static getDay(date,size=0){
        return (size === -1) ? dotw[date.getDay()] : (size === 0) ? date.getDay() : dotw[date.getDay()].slice(0,size);
    }
    // Get month (1..12)
    static getMonth(date,size=0){
        //return (size === -1) ? month[date.getMonth()-1] : (size === 0) ? date.getMonth() : month[date.getMonth()-1].slice(0,size);
        return (size === -1) ? month[date.getMonth()] : (size === 0) ? date.getMonth() : month[date.getMonth()].slice(0,size);
    }
    // Show calendar output (this won't be permenant)
    static show(date,size=0){
          console.log(`${Calendar.getDay(date,size)}, ${Calendar.getMonth(date,size)} ${date.getDate()}, ${date.getFullYear()}`);
    }

    static getMidnight(date){
        return new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0);
    }

    // Month here needs to be (1..12) so it processes 
    static getMidnight(year,month,day){
        return new Date(year,month-1,day,0,0,0);
    }
    //static firstOf(date,a,b){}
    //static lastOf(date,a,b){}
    static firstDayOfWeek(date){
        let dotw = date.getDay();
        return new Date((dotw > 0) ? (date.getTime() - dotw * one.day) : date);
    }
    static lastDayOfWeek(date){
        let dotw = date.getDay();
        return new Date((dotw < 6) ? (date.getTime() + (6 - dotw) * one.day) : date);
    }
    static firstDayOfMonth(date){
        return new Date(date.getFullYear(),date.getMonth(),1);
    }
    // in my methods, months are 1 indexed (1..12)
    static firstDayOfMonth(year,month){
        return new Date(year,month-1,1);    // month is zero-index
    }
    static lastDayOfMonth(date){
        return new Date(date.getFullYear(),date.getMonth()+1,0);
    }
    // in my methods, months are 1 indexed (1..12)
    static lastDayOfMonth(year,month){
        return new Date(year,month,0);    // month is zero-index
    }
    /*
    static firstDayOfYear(date){
        return new Date(date.getFullYear(),0,1);  // month is zero-indexed
    }
    static lastDayofYear(date){
        return new Date(date.getFullYear(),11,31);  // month is zero-indexed
    }
    */
    // Compare if two dates are in the same day
    static isInDay(date,otherDate){
        let fotd = Calendar.getMidnight(otherDate).getTime();
        let lotd = fotd + one.day;
        let dt = date.getTime();
        return (dt < fotd) ? -1 : (dt > lotd) ? 1 : 0;
    }
    // Compare if two dates are in the same week
    static isInWeek(date,otherDate){
        let fotw = Calendar.firstDayOfWeek(otherDate).getTime();
        let lotw = Calendar.lastDayOfWeek(otherDate).getTime() + one.day;
        let dt = date.getTime();
        return (dt < fotw) ? -1 : (dt > lotw) ? 1 : 0;
    } 
    static isInMonth(date,otherDate){
        let fotm = Calendar.firstDayOfMonth(otherDate).getTime();
        let lotm = Calendar.lastDayOfMonth(otherDate).getTime() + one.day; // add another day to be inclusive
        let dt = date.getTime();
        return (dt < fotm) ? -1 : (dt > lotm) ? 1 : 0;
    }
    static isInMonth(date,year,month){
        let fotm = Calendar.firstDayOfMonth(year,month).getTime();
        let lotm = Calendar.lastDayOfMonth(year,month).getTime() + one.day; // add another day to be inclusive
        let dt = date.getTime();
        return (dt < fotm) ? -1 : (dt > lotm) ? 1 : 0;
    }
    static isInYear(date,year){
        let foty = new Date(year,0,1).getTime();
        let loty = new Date(year,11,31).getTime() + one.day; // add a day to be inclusive
        let dt = date.getTime();
        return (dt < foty) ? -1 : (dt > loty) ? 1 : 0;
    }

    // get a list of events between two dates
    static getEvents(dateStart,dateStop){
        let range_start = dateStart.getTime();
        let range_stop  = dateStop.getTime() + one.day; // add a day to be inclusive
        //let promise = fetch(events_file);
        return fetch(events_file).then((res) => {
            return res.json().then((json) => json.filter((rec) => {
                let rec_start = new Date(rec.date_time_start).getTime();
                let rec_stop  = new Date(rec.date_time_stop).getTime(); 
                return rec_start >= range_start && rec_stop <= range_stop;
            })).catch((err) => console.error(err));
        }).catch((err) => console.error(err));
    }


    // make as a list of events.
    static makeList(startDate,stopDate){
        let events = Calendar.getEvents(startDate,stopDate);

        let table = document.createElement("table");
        let thead = document.createElement("thead");
        let tbody = document.createElement("tbody");
        table.append(thead,tbody);

        let tr = document.createElement("tr");
        let td = document.createElement("td");

        //getEvents(startDate,stopDate)

        events.map((rec) => {
            let record  = tr.cloneNode();
            //let id = td.cloneNode().innerText = rec.id;        
            let name    = td.cloneNode().innerText = rec.name;
            let dtstart = td.cloneNode().innerText = rec.date_time_start;        
            let dtstop  = td.cloneNode().innerText = rec.date_time_stop;
            let desc    = td.cloneNode().innerText = rec.desc;
            record.append(name,dtstart,dtstop,desc);
            tbody.append(record);
        });
        return table;

    }

    static makeEventList(startDate,stopDate){
        if(startDate === stopDate){
            stopDate += one.day;
        }

        // TODO: Add a callout popup later if this works.

        let events = Calendar.getEvents(startDate,stopDate);
        return events.map((rec) => {
            let event = document.createElement("div");
            event.setAttribute("data-eventId",rec.id);
            event.setAttribute("data-eventName",rec.name);
            event.setAttribute("data-eventStartDate",rec.date_time_start);
            event.setAttribute("data-eventStopDate",rect.date_time_stop);
            event.setAttribute("data-eventDesc",rec.eesc)
            event.classList.add("calevent");
            let eventName = document.createElement("div");
            //event.classList.add("calevent");
            eventName.innerHTML = rec.name;
            //let eventDesc = document.createElement("div");
            //event.classList.add("calevent");
            //eventDesc.innerHTML = rec.desc;
            //event.append(eventName,eventDesc);
            event.append(eventName);
            return event;
        });
    }

    // make a day block
    // Make date with time stamp or zero-index value
    static makeDay(otherDate){
        let date = new Date(otherDate);
        let dayBox = document.createElement("div");
        dayBox.classList.add("day");
        let dayNumBox = document.createElement("div");
        dayNumBox.classList.add("daynum");
        let dn = date.getDate();
        dayNumBox.innerText = dn;
        dayNumBox.addEventListener("click",() => {
            changeView(date,View.DAY);
        })

        //dayNumBox.innerText = date.getDate();
        let eventBox = document.createElement("div");
        eventsBox.classList.add("calevents");

        // TODO: This might not work but I will try.
        let eventList = Calendar.makeEventList(otherDate,otherDate);
        eventsBox.append(eventList);
        
        dayBox.append(dayNumBox,eventsBox);
        return dayBox;
    }
    // Make day block with one-indexed date.
    static makeDay(year,month,day){
        let date = new Date(year,month-1,day);
        let dayBox = document.createElement("div");
        dayBox.classList.add("day");
        let dayNumBox = document.createElement("div");
        dayNumBox.classList.add("daynum");
        dayNumBox.innerText = date.getDate();
        let eventBox = document.createElement("div");
        eventsBox.classList.add("calevents");
        dayBox.append(dayNumBox,eventsBox);

        /*
        // TODO: Move this elsewhere
        // Dim days outside of this month
        if(date.getMonth() !== this.now.getMonth()){
            dayNumBox.classList.add("outmonth");
        }
        // TODO: Move this elsewhere
        // Cross out past dates
        if(date < now){
            dayBox.classList.add("crossout");
            //dayNumBox.classList.add("crossout");
        }
        // TODO: Add short events;*/
        return dayBox;
    }
    // dateFirst is the date on the first day of the week...So that Sunday.
    static makeWeek(date){
        let fotw = Calendar.firstDayOfWeek(date);
        return Array.from({length: 7}, (day,i) => Calendar.makeDay(fotw + i * one.day));
    }
    static makeMonth(date){
        //let fdotm = Calendar.firstDayOfMonth(date);
        //let ldotm = Calendar.lastDayOfMonth(date);
        //let fdotw = Calendar.firstDayOfWeek(fdotm); // 0,0
        //let ldotw = Calendar.lastDayOfWeek(ldotm);  // 5,6
    }
    static makeMonth(year,month){
        // REMEMBER: Months and DOTW start at 0!
        // Months would be easy if there were 28 to 31 days in a week and they all started on sunday.
        // This construct considers
        //let weeks = new Array(6);   // Typically we can get by with viewing up to six weeks
        // TODO find the first of the month. We need to adjust for what day of the week it is on.
        let firstOfMonth = new Date(year,month,1);
        let firstSunday = firstOfMonth.getTime() - firstOfMonth.getDay() * one.day;

        /*
        for(let i = 0; i < 6; i++){
            weeks[i] = Calendar.makeWeek(firstSunday + i * one.week);
        };
        */

        // return the weeks
        return Array.from({length:6}, (week,i) => Calendar.makeWeek(firstSunday + i * one.week) );

        //return weeks;
    }
    // Special case of how to view weeks
    //makeRange(){}
    
    
    //viewList(dateStart,dateEnd){}
    viewDay(date){
        // In viewDay, dateStart === dateEnd === date
        let cal = Calendar.makeDay(date);
        cal.getEvents(date,date);
        return cal;
    }
    //viewDay(year,month,day){}
    viewWeek(date){
        let cal = Calendar.makeWeek(date);
        //let cal.addEvents(cal.getFullYear(),cal.getMonth(),cal.getDate())
        cal.getEvents(Calendar.firstDayOfWeek(date),Calendar.lastDayOfWeek(date));
        return cal;
    }
    /*
    viewWeek(year,month,day){
        let cal = Calendar.makeWeek(year,month);
        let cal.getEvents(year,month-1);
        return cal;
    }
    */
    viewMonth(date){
        // The view needs to have 42 days so everything looks even
        let cal = Calendar.makeMonth(date);
        let first = Calendar.firstDayOfWeek(Calendar.firstDayOfMonth(date));
        let last  = Calendar.lastDayOfWeek(Calendar.lastDayOfMonth(date));
        let days = Math.floor(last.getTime() - first.getTime()) / one.day;
        if(days < 42){
            last.setTime(last + (42 - days) * one.day);
        }
        cal.getEvents(first,last);
        return cal;
    }

    /*
    viewMonth(year,month){
        let cal = Calendar.makeMonth(year,month);
        let cal.addEvents(year,month-1);
        return cal;
    }
    */

    changeView(date,appView){
        let calview = this.cal.querySelector("calview");
        // remove the old view if it changes        
        if(calView.hasChildNodes()){
            while(calView.firstChild){
                calView.removeChild(calView.firstChild);
            }
        }
        // use a new view
        if(appView === View.DAY.value){
            calView.append(viewDay(date));
        }
        else if(appView === View.WEEK.value){
            calView.append(viewWeek(date));
        }
        else if(appView === View.MONTH.value){
            calView.append(viewMonth(date));
        }
        else if(appView === View.LIST.value){
            calView.append(viewList(date));
        }
    }

    renderModel(date,defaultAppView){
        // I guess we could call this stuff the model. TODO: Consider putting it its own function.
        let controls = document.createElement("div");
        controls.classList.add("calctrl");
        let selectView = document.createElement("select");
        selectView.setAttribute("name","view");
        let optionView = document.createElement("option");
        Array.from(View).map(view => {
            let ov = optionView.cloneNode();
            ov.setAttribute("value",view.value);
            if(ov.view.value === defaultAppView){
                ov.selected = true;     // set the default value.
            }
            ov.innerText = view.name;
            selectView.append(ov);
        });
        // TODO: might want to put this in a field div later.
        let labelView = createElement("label");
        let spanView  = createElement("span");
        spanView.innerHTML = "Views: ";
        labelView.append(spanView,selectView);
        controls.append(labelView);

        selectView.addEventListener("change",() => {
            this.changeView(date,selectView.value);
        });

        
        let calView  = document.createElement("div");
        calView.classList.add("calview");
        this.cal.append(controls,calView);
        
    }

    run(date,appView=View.MONTH){
        this.renderModel(date,appView);
        this.changeView(date,appView);
    }
}