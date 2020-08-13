/* File: slideshow.js
 * Info: Slideshow functinality for Mostly CSS slideshow.
 * NOTE: See slideshow.css for slideshow classes
 */
// I intially though I should make the methods static, but then
// I realized I need to make an instance for a slideshow.
class SlideShow {
    constructor(name){
        // TODO: make sure the deck has a class called "slides"
        this.deck     = document.querySelector(name);
        this.slides   = this.deck.querySelectorAll(".slides > .slide");   // children should have the slide class
        this.prev_ctl = this.deck.querySelector(".prev_ctl");
        this.next_ctl = this.deck.querySelector(".next_ctl");
        this.index    = 0;                    // slide position
        this.length   = this.slides.length - 1;
    }
    init(){
        this.view(this.index);  // this.index should be zero
        this.prev_ctl.addEventListener("click",() => {this.prev()});
        this.next_ctl.addEventListener("click",() => {this.next()});
    }
    prev(){
        if(this.index > 0){
            this.view(--this.index);   // should decrement before executing
        }
    }
    next(){
        if(this.index < this.length){
            this.view(++this.index);    // should increment before executing
        }
    }
    view(idx){
        Array.from(this.slides).forEach(slide => slide.style.display = "none");
        this.slides[idx].style.display = "block";
    }
}
