/* File: slide.js
 * A class for creating slides in a Slideshow.
 * TODO: Make various layout configurations
 */
export class Slide {
    constructor(img,figcaption){
        this.img = img;
        this.cap = figcaption;  // NOTE: figcaption is an array of strings
    }
    make() {
        let slide = document.createElement("div");
        slide.classList.add("slide");
        let image = document.createElement("img");
        image.setAttribute("src",this.img);
        image.setAttribute("alt",this.img.replace(/^.*[\\\/]/, ''));
        let figcaption = document.createElement("figcaption");
        if(Array.isArray(this.cap)){
            Array.from(this.cap).forEach(text => {
                let para = document.createElement("p");
                para.innerHTML = text;
                figcaption.append(para);
            });
        }
        else {
            let para = document.createElement("p");
            para.innerHTML = this.cap;
            figcaption.append(para);
        }
        slide.append(image,figcaption);
        return slide;
    }
}