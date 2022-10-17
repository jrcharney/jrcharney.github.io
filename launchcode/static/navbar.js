/* File: navbar.js
 * Info: Use JSON to generate a navigation bar with drop down menus.
 */
class NavBar {
    constructor(qsel,jsonfile){
        this.navbar = document.querySelector(qsel);
        this.file   = jsonfile;
    }

    addLink(obj){
        if(obj.url === undefined){
            throw new Error("addLink: URL is required.");
        }
        let anchor = document.createElement("a");
        anchor.setAttribute("href",obj.url);
        anchor.innerHTML = (obj.text !== undefined) ? obj.text : obj.url;    // TODO: can it be a shorted URL?
        if(obj.title !== undefined){
            anchor.setAttribute("title",obj.title);
        }
        return anchor;
    }
    addListItem(content){
        // TODO: Eventually think about attributes or if there are submenus
        let item = document.createElement("li");
        if(typeof(content) === "string"){
            item.innerHTML = content;
        }
        else if(typeof(content) === "object"){
            // For now assume the object is a link
            item.append(this.addLink(content));
        }
        else {
            throw new Error(`addListItem not parsable: ${content}`);
        }
        return item;
    }
    addList(arr){
        if(!Array.isArray(arr)){
            throw new Error(`addList not parsable: ${arr}`);
        }
        let list  = document.createElement("ul");
        Array.from(arr).forEach(item => {list.append(this.addListItem(item));});
        return list;
    }
    addMenu(obj){
        //console.log(obj);
        if(!Array.isArray(obj.items)){
            throw new Error(`addMenu not parsable: ${obj.items}`);
        }
        let menu = document.createElement("li");
        menu.classList.add("dropdown");
        let link = {
            "text"  : obj.text,
            "title" : obj.title,
            "url"   : obj.url || "#"
        }
        menu.append(
            this.addLink(link),
            this.addList(obj.items)
        );
        return menu;
    }

    mistake(err){
        let oops = document.createElement("div");
        oops.classList.add("oops");
        let oops_title = document.createElement("div");
        let oops_body  = document.createElement("div");
        oops_title.innerHTML = "<h2>An error has occurred.</h2>";
        oops_body.innerHTML = err;
        oops.append(oops_title,oops_body);
        this.navbar.append(oops);
        console.error(err);
    }

    async fetchNavData(){
        let res = await fetch(this.file);
        if(!res.ok){
            throw new Error(`HTTP error! status: ${res.status}`);
        } else {
            return await res.json();    // returns content
        }
    }
    async promisify(){
        let navdata = await Promise.resolve(this.fetchNavData());
        let navlist = document.createElement("ul");
        Array.from(navdata).forEach(navitem => {navlist.append(this.addMenu(navitem))});
        this.navbar.append(navlist);
    }
    async init(){
        this.promisify().catch(err => {this.mistake(err)});
    }
}
