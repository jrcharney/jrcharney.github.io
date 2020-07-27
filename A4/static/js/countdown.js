/* File: countdown.js
 * Info: Based on the one I used here: https://codepen.io/jrcharney/live/MdezYV
 *          Yes that is a countdown clock for She-Ra and the Princesses of Power
 *          Noelle Stevenson rocks!
 * REMINDER: Go in to HTML to update deadline
 * Usage: You need two divs:
 *  <div id="countdown">00:00:00:00</div><!-- a placeholder -->
 *  <div id="deadline">July 16, 2020, 5:00 PM CDT</div><!-- A deadline -->
 */

// TODO: Put this in Countdown class
// Sort of an ENUM
const one = {
    second : 1000,    /* 1 second = 1000 ms  */
    minute : 60000,   /*           60 * 1000 */
    hour   : 3600000, /*      60 * 60 * 1000 */
    day    : 86400000 /* 24 * 60 * 60 * 1000 */
};
           
// TODO: Typescript
// TODO: test cases. I haven't tested it for what happens when times up.
class Countdown {
    // query : string representing an id.
    // later : timestamp (July 16, 2020, 5:00 PM CDT) (zerotime) is our deadline
    // dir: boolean. false for down, true for up.
    constructor(query,later, dir=false){
        this.clock = document.querySelector(query);
        this.later = new Date(later);
        this.dir   = dir;
        this.mode  = false; // asethetic (TODO: Add settings for this later)

        // Mini-enum
        this.diff = {
            days    : 0,
            hours   : 0,
            minutes : 0,
            seconds : 0
            // TODO: ms : 0, or at least a 10th of a second.
        };
        
    }
    setMode(mode){this.mode = mode; return this;}
    getMode(){return this.mode;}
    getDiff(){return this.diff;}    // time object
    calculate(){
        // TODO: Maybe this should go in run
        if(!this.later) return null;    // Not sure if this is useful

        // Get current time
        let now = new Date();
        // Get the time difference in milliseconds
        let ms  = (this.dir) ? (now.getTime() - this.later.getTime()) :  (this.later.getTime() - now.getTime());


        this.diff.days    = ms / one.day;    ms %= one.day;     // days
        this.diff.hours   = ms / one.hour;   ms %= one.hour;    // hours
        this.diff.minutes = ms / one.minute; ms %= one.minute;  // minutes
        this.diff.seconds = ms / one.second; // ms %= one.second;  // seconds and ms
        // this.diff.ms   = ms;    // may want to round

        if (!this.mode){   // mode === 0
            this.clock.innerHTML = Object.entries(this.diff).map( ([k,v]) => `<span title="${k}">${String(Math.floor(v)).padStart(2,"0")}</span>`).join(" : ");
        } else {  // mode === 1
            this.clock.innerHTML = (this.diff.days === 0) ? "Less Than a Day" : `${this.diff.days} Day${(this.diff.days === 1) ? '' : 's'}`;
        };
        if (!this.dir && this.diff.days < 0)  // this.dir == "down" && diffDays < 0
            this.clock.innerHTML =  "Time's Up!";
        
        return this.diff; //diffDays   
    }
    run(interval=250){
        // run this countdown
        // Interval is the update interval in ms. 250 works for now.
        window.setInterval(() => this.calculate(),interval);
    }
}
