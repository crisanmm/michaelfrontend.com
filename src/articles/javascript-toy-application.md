---
title: JavaScript toy application
date: 2022-02-08
---

While I was going through [The Complete JavaScript Course 2022: From Zero to Expert!](https://www.udemy.com/course/the-complete-javascript-course/) course on Udemy I noticed the author had in plan to create applications as to show how things tie together and how to apply the new-found knowledge in a practical way. Having finished other similar courses where practical applications are built, an idea had crossed my mind. Why don't I come up with a project idea all by myself and build something else instead? This would put me in a more challenging place because if I would be facing issues, I would not be able to rely on the author facing the same issues and simply follow his steps in order to fix them. This way I would go on my own path towards building something that I like, something that would definitely involve more effort from my side, which would mean more lessons to be learned! Sounds great!

In order for this to come alive, I had to brainstorm what I would actually want to build. I thought of things that I like and, since I consider myself a [sneakerhead](https://en.wikipedia.org/wiki/Sneaker_collecting), it didn't take me long and I settled on something that's related to sneakers. I wanted to have an application that encompasses a wide technical area, something that would involve front-end, back-end, databases and all that jazz. After some time, I concluded I will build a replica of [StockX](https://stockx.com/). Besides creating a similar app, I will inevitably have to dig deep into how StockX does certain things, so, that would be reverse engineering, just like the cool kids say.

## First step, getting the data

I did some research in order to find a huge database of sneaker data and photos of them and, I failed... If I can't find any data about sneakers, what kind of sneaker marketplace can I create? This was one of the first obstacle I encountered. The solution to this? Well, not so ethical, I know StockX has tons of the data I want, I know I am at just a HTTP request away from obtaining data about the sneaker I want. You can guess I thought of scraping the entire site of every single item on there, and so I did!

Next step on the list would be to debunk StockX to see how the page data is rendered, this could be **client-side**, **server-side** or **statically-generated**. If it was server-side, statically-generated, or even if it had featured incremental static generation, my idea would be pretty much busted since all I was looking for was obtaining a clue towards their API. Luckily, at the time of building the application, the data was client-side rendered, and by using the browser's developer tools I was able to see what APIs the browser is fetching from in order to obtain data about a sneaker, and more importantly, data about related sneakers of that sneaker! From one endpoint about a sneaker's data, I could fetch 20 more endpoints about that sneaker's related sneakers. Take for instance this [Air Jordan 1 Retro Royal Blue](https://stockx.com/air-jordan-1-retro-black-blue-2017) sneaker, I could get information about the sneakers in the *Related Products* section. Now, what if given one sneaker and its related sneakers, you can get all the data about sneakers that StockX has? I'm gonna test this hypothesis by creating a script that does just that. Spoiler alert, it worked pretty well.

## The scraping script

The highlight tool for this job was [Puppeteer](https://www.npmjs.com/package/puppeteer), which is basically an API to control Chrome/Chromium. Using Puppeteer I could manipulate a chrome instance into sending the HTTP requests to the StockX web page and API. You may wonder why I needed a browser instance when simple HTTP requests could do the trick? Well, since the web page was client-side rendered, the HTML found in a HTTP response wouldn't be of much help, so I needed an environment in which JavaScript could run so the page could render.

Below is the main logic of the script, for brevity, certain aspects regarding data persistence have been avoided. Let's analyze the script from top to bottom. 

```js
let shoeList = [
    { name: 'air-jordan-1-retro-black-blue-2017' },
    { name: 'air-jordan-5-retro-off-white-black' },
    { name: 'adidas-ultra-boost-pb-white-black' }
];

async function scrape(pagePool) {
    for (let i = 0; i < pagePool.pages.length; i++)
        if (shoeList.length > 0)
            setTimeout(async () => {
                let page = await pagePool.acquire();
                let shoe = shoeList.pop();
                try {
                    if (shoeList.length > 0)
                        await scrapeShoe(page, shoe);
                } catch (e) {
                    shoeList.push(shoe);
                    // in case of captcha verification allow the user up to 10 seconds to confirm
                    await new Promise((resolve, reject) => {
                        setTimeout(() => {
                            resolve();
                        }, 10000);
                    });
                } finally {
                    await pagePool.release(page);
                }
            }, 0);
}

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const pagePool = new PagePool();

    await pagePool.create(browser, numOfPages);

    setInterval(async () => {
        await scrape(pagePool);
    }, 2500);
})()
```

First there is a `shoeList` array which contains IDs of some sneakers to start scraping from, related sneakers will be added into this array. So, after scraping data about the first element in the array (`air-jordan-1-retro-black-blue-2017`), 20 more related shoes will be appended to the array (so 20 shoes related to `air-jordan-1-retro-black-blue-2017`). On a best case scenario, after scraping the first 3 elements in the array, we would end up with 60 other distinct shoes to scrape data for. In other cases there will be fewer than 60, for instance if the first 3 elements have a related shoe in common, we would end up with 58 distinct shoes instead. Random observation, we can see how the probability of having a shoe in common at the beginning of scraping can be low, while at the end of scraping (after we scraped hundreds or thousands of shoes) that probability is high.

Next, at the heart of this script stays the `scrape()` function. This receives a `pagePool` which is simply a pool of pages to execute the requests from (we'll talk more about this later). It loops through all the pages and if there is a shoe that has not been scraped yet, set it up for asynchronous processing by using a `setTimeout` with `0` delay. First thing to do before scraping the data for a shoe is to get control of a page where requests can be executed from, this is done in the `let page = await pagePool.acquire();` line. The next line removes the element corresponding to a shoe in the array so that no other function scrapes the same shoe twice. Inside the `try catch` block, the same condition check from above is available here is as well, that is because in certain cases there can be more pages available than shoes to scrape data for. For example we could initialize a browser instance with 50 pages and start off with the 3 shoes in `shoeList`, in a simplified scenario there would be 50 functions added to the callback queue, each of which will get control of a page. This second check is there to free the control of the page when the `shoeList` array is empty. Obviously, this function's logic could be perfected but I tried to be pragmatic as there is no need to scrape data that often and I don't mind a longer running time. After a lot of requests, captcha issues would arise, therefore I added 10 seconds to go through the captchas manually, as it can be seen in the `catch` block. Finally, whether or not the shoe was scraped successfully or errors arose, the page had to be freed, as seen in the `finally` block.

Finally, the IIFE at the end of the script is what starts the process of scraping. This initializes the resources and adds `scrape()` callbacks to the callback queue. In the `scrape()` function I omitted a console log in order to increase brevity, the length of the `shoeList` is logged periodically and I have to manually observe when the length converges to 0. Once it does converge, I would `CTRL^C` the application, resulting in a `SIGINT` signal to be sent to the app, at which point a signal handler is executed where the data will be persisted into a file, thus ending the script execution gracefully.

Next up is the `PagePool` abstraction I've mentioned above, which is an implementation of the [Object Pool design pattern](https://en.wikipedia.org/wiki/Object_pool_pattern). This abstraction helped a lot in decoupling the page logic from the scraping logic. You may ask why the `create()` function is not a constructor instead, that is because a constructor can't be asynchronous. A constructor returns an object and an asynchronous function returns a `Promise`, so an asynchronous constructor would be an impossible situation. Let's go through each function in detail:
* `create()` creates `noOfPages` in the browser instance and adds the pages into a `pages` array attached to the `this` object
* `acquire()` gets a page from the pool, if there is a free page available, it resolves the promise instantly, otherwise it keeps trying and will eventually resolve the promise with a page 
* `release()` lets go of a page that has been previously `acquired()`, it simply adds the page to the `this.pages` array.

```js
const puppeteer = require('puppeteer');

class PagePool {
    async create(browser, noOfPages) {
        this.pages = [];
        for (let i = 0; i < noOfPages; i++) {
            let page = await browser.newPage();
            this.pages.push(page);
        }
    }

    acquire() {
        const pages = this.pages;
        return new Promise((resolve, reject) => {
            if (pages.length > 0) {
                resolve(pages.pop());
            } else {
                setTimeout(() => this.acquire(), 1500);
            }
        });
    }

    release(page) {
        this.pages.push(page);
    }
}

module.exports = PagePool;
```

## The web application

Going forward we are finally going to talk about the application itself. Because in the past I have built service oriented or microservice based applications, I wanted to give the good old monolithic architecture a try with the hope of understanding its strenghts and weaknesses even better now that I am more experienced.

## The persistence layer

The data is persisted into a MongoDB database and it is accessed using Mongoose. The natural document structure obtained from the API tempted me to try a document-oriented database. Below is shown the schema for a sneaker.

```js
const sneakerSchema = new mongoose.Schema(
    {
        _id: String,
        brand: String,
        countryOfManufacture: String,
        gender: String,
        primaryCategory: String,
        secondaryCategory: String,
        shoe: String,
        title: String,
        urlKey: String,
        sizeLocale: String,
        description: String,
        styleId: String,
        colorway: String,
        retailPrice: Number,
        releaseDate: {
            type: Date,
            required: false,
        },
        year: {
            type: Number,
            required: false,
        },
        media: {
            has360: Boolean,
            // 360 IMAGE FORMAT
            // https://stockx-360.imgix.net//nike-hyperdunk-2017-low-la_TruView/Images/nike-hyperdunk-2017-low-la_TruView/Lv2/img01.jpg?auto=format,compress&w=559&q=90&dpr=2&updated_at=1538080256
            imageURL: String,
        },
        related: {
            type: [String],
            ref: 'Sneaker',
        },
    },
    {
        // use uuid v4
        _id: false,
        versionKey: undefined,
    }
);
```

Of course, the app also has user functionality, so there is a user schema as well.

```js
const userSchema = new mongoose.Schema(
    {
        name: {
            type: mongoose.Schema.Types.Mixed,
            first: {
                type: String,
                required: true,
            },
            last: {
                type: String,
                required: true,
            },
        },
        email: {
            type: String,
            unique: true,
            validate: validator.isEmail,
            required: true,
        },
        password: {
            type: String,
            required: true,
            // equivalent validator to minlength but easier to understand
            validate: {
                validator: password => {
                    if (password.length >= 6) return true;
                    return false;
                },
                message: 'Password must be at least 6 characters long',
            },
        },
        passwordConfirm: {
            type: String,
            required: true,
            validate: {
                validator: function (passwordConfirm) {
                    return passwordConfirm === this.password;
                },
                message: "Password confirmation doesn't match password",
            },
        },
        passwordChangedAt: {
            type: Date,
            default: Date.now(),
        },
        passwordResetToken: String,
        passwordResetTokenExpires: Date,
        // soft delete
        active: {
            type: Boolean,
            default: true,
            select: false,
        },
    },
    {
        versionKey: undefined,
    }
);
```

## The application layer

To keep it consistent with the frontend language, and within the context of this article, the backend language is node.js. The directory structure for the web application is the one from below.

```bash
── webapp
    ├── app.js
    ├── controllers
    │   ├── errorController.js
    │   ├── sneakerController.js
    │   ├── userController.js
    │   └── viewController.js
    ├── index.js
    ├── models
    │   ├── sneakerModel.js
    │   └── userModel.js
    ├── node_modules
    ├── package-lock.json
    ├── package.json
    ├── public
    │   ├── css
    │   ├── fonts
    │   ├── img
    │   └── js
    ├── routers
    │   ├── sneakerRouter.js
    │   ├── userRouter.js
    │   └── viewRouter.js
    ├── scss
    │   ├── abstract
    │   ├── base
    │   ├── libraries
    │   ├── main.sass
    │   └── sections
    ├── utils
    │   ├── CustomError.js
    │   ├── capitalizeName.js
    │   └── catchAsync.js
    └── views
        ├── _footer.pug
        ├── _header.pug
        ├── _localization-popup.pug
        ├── base.pug
        ├── error.pug
        ├── rendered
        ├── root-page.pug
        ├── shoe-page.pug
        ├── shoes-page.pug
        └── sign-in-up-page.pug
```

Inside the `controllers/` directory lie functions that map to API routes, together with the `routes/` directory we have a typical CRUD API that operates on sneakers and users. 

## The presentation layer

What is more interesting to see is that the pages are server-side rendered, a giveaway is the use of the [Pug templating language](https://www.npmjs.com/package/pug). Templates are used in order to avoid duplicate code, for example this is the base template for a page:

```pug
doctype html

html(lang="en")

    head
        meta(charset="UTF-8")
        meta(name="viewport" content="width=device-width, initial-scale=1.0")

        link(rel="stylesheet" href="/public/css/main.css")
        block scripts
            script(src="/public/js/slugify.js" defer)
            script(src="/public/js/replace-img-svg.js" defer)
            script(src="/public/js/responsive-nav-btn.js" defer)
            script(src="/public/js/localization-popup.js" defer)

        block title
            title oSneaks

    body
        //- LOCALIZATION POP-UP
        include _localization-popup.pug

        //- HEADER
        include _header.pug

        block content
            p lorem, ipsum dolor sit amet consectetur adipisicing elit. Quam error laudantium minima unde, ipsum, saepe rerum excepturi cupiditate rem autem reiciendis explicabo et totam? Illo adipisci doloribus excepturi voluptates ipsam hic quae assumenda accusantium amet ab cumque, eaque incidunt fugiat neque modi enim sapiente dignissimos a ut iusto maiores et quod! Quo quae illum a neque, assumenda quam consectetur fugit dolorem sunt dicta explicabo minima. Aperiam assumenda, laborum reiciendis ullam doloremque odio veritatis, nisi ad consequuntur voluptates id, odit nulla. Ipsum delectus cum obcaecati tempora laborum alias iusto eaque earum temporibus, assumenda nostrum perferendis corporis atque quisquam quo soluta dolorum.

        //- FOOTER
        include _footer.pug
```

This template can be inherited by any other page, and the `block` contents can be replaced by the page that inherits the template. To be noticed is also the use of SCSS and compilation of all of it into a single CSS file `main.css`.

To have a better idea of how page rendering is done, the function `shoePage()` receives the HTTP requests and returns the rendered HTML. It is wrapped by `catchAsync()`, a function which catches an error that could be thrown asynchronously. Some additional processing is done before passing the data to the pug engine for rendering the HTML.

```js
module.exports.shoePage = catchAsync(async (req, res, next) => {
    const { urlKey } = req.params;

    let data = await sneakerModel.findOne({ urlKey: urlKey }).exec();
    // if no shoe with specified urlKey has been found
    // then throw error
    if (data === null)
        throw new CustomError(404, `Haven't found shoe with URL:\n ${urlKey}`);

    await data.populate('related').execPopulate();
    data.releaseDateFormatted = data.releaseDate
        ? format(data.releaseDate, 'P')
        : '';

    res.status(200).render('shoe-page', data);
});
```

## Finally

The project is still work in progress! I think I have a lot to learn if I keep working on it, at the moment I am also widening my knowledge on API specifications, thus creating an OpenAPI specification.

Want to see more? [Check out the repository](https://github.com/crisanmm/javascript-toy-app).