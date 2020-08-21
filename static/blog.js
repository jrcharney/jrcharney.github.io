/* File: blog.js
 * Info: Import HTML files from somewhere else.
 */
class Blog {
    constructor(qsel,postFile){
        this.blog = document.querySelector(qsel);
        //this.filepath = filepath;
        this.posts = postFile; // a list of posts (how can we fetch them?) // this is now a file name
        // WATCH: I'm hoping this will use the URL of the blog page (which is still index.html), not this js file. 
        let url = new URL(document.location.href);
        let params = url.searchParams;          // TODO: Make betteruse of this later!
        console.log(params);
        this.page = params.has('p') ? parseInt(params.get('p')) : 0;     // The the page we are on, if it is not available, use 1.
        this.ppp  = params.has('c') ? parseInt(params.get('c')) : 4;     // the max number of posts per page, 4 is used for each page.
    }
    // TODO: Sort posts (done?)
    // TODO: Fetch posts by date (it will be easier just to title them as dates) (done)
    // TODO: Fetch the most recent posts (done, .reverse())
    // TODO: Fetch the beginning of long posts
    // TODO: Extract titles and timestamps
    // Get a list of approved files. (done-ish)


    // TODO: Create a file library that does fetches like how PHP does.

    // Func: fetchPostList
    // Info: Fetch the JSON file that contains where our files are located and what type they are.
    // Returns: JSON file which should contain the file path, file type, and list of approved files to post.
    async fetchPostList(){
        let res = await fetch(this.posts);
        if(!res.ok){
            throw new Error(`HTTP error! status: ${res.status}`);
        } else {
            return await res.json();    // return JSON data which should include a list of file names
        }
    }

    // Func: fetchArticle
    // Args: url - a string that contains a relative file path to a file.
    // Returns: The Text/HTML content of a post.
    async fetchArticle(url){
        let res = await fetch(url);
        if(!res.ok){
            throw new Error(`HTTP error! status: ${res.status}`);
        } else {
            return await res.text();    // returns content
        }
    }
    
    // Func: addArticle
    // Info: Add a <article> that will contain a blog post.
    addArticle(data){
        let article = document.createElement("article");
        article.innerHTML = data;
        this.blog.append(article);
    }

    // Get an individual post.
    /*
    async getArticle(post){
        // get data from 
        let data = this.fetchArticle(`${this.filepath}/${post}.html`);
        this.addArticle(data);
    }
    */

    // Func: mistake
    // Args: err - the error
    // Info: Error reporting function. Some mods were added to make it look nice.
    mistake(err){
        // TODO: Hopefully I won't need to put this in a div.
        let oops = document.createElement("blockquote");
        oops.classList.add("oops");
        let oops_title = document.createElement("h2");
        let oops_body  = document.createElement("p");
        oops_title.innerHTML = "An error has occurred";
        oops_body.innerHTML = err;
        oops.append(oops_title,oops_body);
        //return oops;
        //let oops = this.mistake(err);
        this.blog.append(oops);
        console.error(err);
    }

    //async fetchPage(page = 1, postsPerPage = 4){}


    // This is good, but what if I just wanted to do this for ONE article?

    // Func: promisify
    // Info: 
    // What happens here:
    //  1. Get the list if files from the JSON file using fetchPostList()
    //  2. Get a subset of those file.
    //  3. Convert each file into a promise.
    //  4. Display all the promises.
    async promisify(){

        let json = await this.fetchPostList();      // get our JSON file    // TODO: Do we need a .catch()?

        // Reduce the number of files we want to include.
        let files  = Array.from(json.files).reverse();   // All the files!  We need our files in reverse order.
        let first  =  this.page      * this.ppp;        // The index of the first post
        let last   = (this.page + 1) * this.ppp;        // The index of the last post.
        let subset = files.slice(first,last); // even if lastIndex is greater than fileCount, slice will only go as far as the end of the array.
        if(subset.length === 0){
            // Throw a message to prevent possible hack
            // TODO: See if I can throw a 403 or 404
            throw new Error("Nothing found. Were you trying do do something? Don't do that.");
        }

        // Convert our posts into promises
        let promises = subset.map(post => {
            return this.fetchArticle(`${json.path}/${post}.${json.type}`);
        });

        let articles = await Promise.all(promises);
        articles.forEach(article => {this.addArticle(article)});

    }

    // Func: pagenate
    // Info: Add a widget after our blog that allows us to move between pages.
    async pagenate(){
        // We need to use the JSON file to get the file count.
        let json = await this.fetchPostList();        // TODO: Should I add an await?
        let firstPageNum = 0;   // Obviously
        let prevPageNum  = this.page - 1; //--this.page;
        let nextPageNum  = this.page + 1; //++this.page;
        let lastPageNum  = Math.floor(json.files.length / this.ppp);
        console.log(`${firstPageNum} and ${prevPageNum} and ${nextPageNum} and ${lastPageNum}`);
        

        // Create our widget
        let pagebar = document.createElement("div");
        pagebar.setAttribute("id","pagebar");

        // create our first page button
        let firstPage = document.createElement("button");
        firstPage.innerHTML = "&LeftArrowBar;";
        let firstAttrs = {
            "id" : "firstpage",
            "title" : "First Page",
            "onclick" : `location.href = '?p=${firstPageNum}';`
        }
        Object.entries(firstAttrs).forEach(([name,val]) => firstPage.setAttribute(name,val));
        firstPage.disabled = (this.page === firstPageNum);

        // Create our previous page button
        let prevPage = document.createElement("button");
        prevPage.innerHTML = "&ShortLeftArrow;";
        let prevAttrs = {
            "id" : "prevpage",
            "title" : "Previous Page",
            "onclick" : `location.href = '?p=${prevPageNum}';`

        };
        Object.entries(prevAttrs).forEach(([name,val]) => prevPage.setAttribute(name,val));
        prevPage.disabled = (prevPageNum < firstPageNum);    // disable this button if we are on the first page.

        // Create our next page button
        let nextPage = document.createElement("button");
        nextPage.innerHTML = "&ShortRightArrow;";
        let nextAttrs = {
            "id" : "nextpage",
            "title" : "Next Page",
            "onclick" : `location.href = '?p=${nextPageNum}';`

        };
        Object.entries(nextAttrs).forEach(([name,val]) => nextPage.setAttribute(name,val));
        nextPage.disabled = (nextPageNum > lastPageNum);

        // create our last page button
        let lastPage = document.createElement("button");
        lastPage.innerHTML = "&RightArrowBar;";
        let lastAttrs = {
            "id" : "lastpage",
            "title" : "Last Page",
            "onclick" : `location.href = '?p=${lastPageNum}';`
        }
        Object.entries(lastAttrs).forEach(([name,val]) => lastPage.setAttribute(name,val));
        lastPage.disabled = (this.page === lastPageNum);

        // Add our buttons to the page bar, and our pagebar to the blog.
        pagebar.append(firstPage,prevPage,nextPage,lastPage);
        this.blog.append(pagebar);
    }

    // To make sure our posts are posted in the order requested, init() is an async function
    async init(){
        this.promisify()
        .then(() => {this.pagenate()})
        .catch(err => {this.mistake(err)});
    }
}