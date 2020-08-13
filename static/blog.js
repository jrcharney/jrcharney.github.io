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
    async init(){
        Array.from(this.posts).forEach(post => {
            fetch(`${this.filepath}/${post}.html`)
            .then(res => {return res.text()})
            .then(data => {
                //document.querySelector("#blog").innerHTML = data;
                let article = document.createElement("article");
                article.innerHTML = data;
                this.blog.append(article);
            });
        });
    }
}