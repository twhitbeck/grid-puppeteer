const http = require("node:http");
const fs = require("node:fs");

const puppeteer = require("puppeteer");

const server = http.createServer(async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: "new",
    });

    const page = await browser.newPage();

    await page.setContent(
      fs.readFileSync("./grid.html", "utf8").replace(
        "__DATA__",
        JSON.stringify([
          { make: "Toyota", model: "Banana", price: 35000 },
          { make: "Ford", model: "Hotdog", price: 32000 },
          { make: "Porsche", model: "Taco", price: 72000 },
        ]),
      ),
    );

    const buffer = await page.pdf();

    res.writeHead(200, { "Content-Type": "application/pdf" });
    res.end(buffer);
  } catch (error) {
    console.log(error);

    res.writeHead(500);
    res.end("Internal Server Error");
  }
});

server.listen(3000, () => {
  console.log("server listening on 3000");
});
