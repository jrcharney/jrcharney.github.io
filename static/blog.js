/* File: blog.js
 * Info: Import HTML files from somewhere else.
 */
class Blog {
    constructor(qsel,filepath,posts){
        this.blog = document.querySelector(qsel);
        this.filepath = filepath;
        this.posts = posts; // a list of posts (how can we fetch them?)
    }
    // TODO: Sort posts
    // TODO: Fetch posts by date (it will be easier just to title them as dates)
    // TODO: Fetch the most recent posts
    // TODO: Fetch the beginning of long posts
    // TODO: Extract titles and timestamps

    // To make sure our posts are posted in the order requested, init() is an async function
    // TODO: It still post things out of order!
    async fetchArticle(url){
        let res = await fetch(url);
        let content;
        if(!res.ok){
            throw new Error(`HTTP error! status: ${res.status}`);
        } else {
            content = await res.text();
        }
        return content;
    }
    mistake(err){
        let oops = document.createElement("div");
        oops.classList.add("oops");
        let oops_title = document.createElement("div");
        let oops_body  = document.createElement("div");
        oops_title.innerHTML = "<h2>An error has occurred.</h2>";
        oops_body.innerHTML = err;
        oops.append(oops_title,oops_body);
        return oops;
    }
    async init(){
        // The sort and reverse are probably not necessary, but this will enforce the order of the pages we requested.
        Array.from(this.posts).sort().reverse()
        .forEach(post => {
            // TODO: I might need to add some features to this fetch
            //await fetch(`${this.filepath}/${post}.html`)
            this.fetchArticle(`${this.filepath}/${post}.html`)
            //.then(res => {return res.text()})         // We don't need this. It's done in fetchArticle.
            .then(data => {
                //document.querySelector("#blog").innerHTML = data;
                let article = document.createElement("article");
                article.innerHTML = data;
                this.blog.append(article);
            })
            .catch(err => {
                let oops = this.mistake(err);
                this.blog.append(oops);
                console.error(err);
            });
        });
    }
}