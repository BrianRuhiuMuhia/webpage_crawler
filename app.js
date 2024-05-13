const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const express = require("express");
const fetch = require("node-fetch");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function getPage(url) {
  try {
    const response = await fetch(url);
    return await response.text();
  } catch (error) {
    console.error(error);
    return { message: "error fetching page" };
  }
}

app.get("/", function (req, res) {
  return res.render("home.ejs");
});

app.get("/tags", function (req, res) {
  return res.render("tags.ejs", { data: [] });
});

app.post("/post", function (req, res) {
    const { url, tag } = req.body;
    const data = {url,tag,tagArr:[]};
  if (!url ||!tag) {
    return res.redirect("/");
  }
  getPage(url).then((response) => {
    const dom = new JSDOM(response);
    const linkList = dom.window.document.querySelectorAll(tag);

    if (linkList.length > 0) {
      for (let element of linkList) {
        data.tagArr.push(element);
      }
      return res.render("tags.ejs", { data: data });
    } else {
      return res.redirect("/");
    }
  });
});

app.listen(5000, () => {
  console.log(`server running on port 5000`);
});