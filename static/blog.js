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

    addArticle(data){
        let article = document.createElement("article");
        article.innerHTML = data;
        this.blog.append(article);
    }

    addMistake(err){
        let oops = document.createElement("div");
        oops.classList.add("oops");
        let oops_title = document.createElement("div");
        let oops_body  = document.createElement("div");
        oops_title.innerHTML = "<h2>An error has occurred.</h2>";
        oops_body.innerHTML = err;
        oops.append(oops_title,oops_body);
        //return oops;
        //let oops = this.mistake(err);
        this.blog.append(oops);
        console.error(err);
    }


    // To make sure our posts are posted in the order requested, init() is an async function
    // TODO: It still post things out of order!
    async fetchArticle(url){
        let res = await fetch(url);
        if(!res.ok){
            throw new Error(`HTTP error! status: ${res.status}`);
        } else {
            return await res.text();    // returns content
        }
    }
    // This is good, but what if I just wanted to do this for ONE article?
    async promisify(){
        let promises = Array.from(this.posts).reverse().map(post => {
            return this.fetchArticle(`${this.filepath}/${post}.html`)
        });
        let articles = await Promise.all(promises);
        articles.forEach(article => {this.addArticle(article)});
    }
    async init(){
        this.promisify().catch(err => {this.addMistake(err)});
    }
}