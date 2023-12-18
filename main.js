const { app, BrowserWindow, ipcMain } = require("electron/main");
const puppeteer = require("puppeteer");
const fs = require("fs/promises");
const path = require("node:path");
const jsonFilePath = "./templates.json";

function createWindow() {
    const win = new BrowserWindow({
        // width: 600,
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });
    win.setMenuBarVisibility(false);
    win.loadFile("index.html");
    win.webContents.openDevTools();

    ipcMain.handle("skrape", async (event, args) => {
        if (args.url !== "" && args.selector !== "") {
            const browser = await puppeteer.launch({ headless: "new" });
            const page = await browser.newPage();
            await page.goto(args.url);
            await delay(3000);
            const result = await page.evaluate((args) => {
                const dataList = [];
                const nodeList = Array.from(document.querySelectorAll(args.selector));
                nodeList.forEach((_node) => {
                    dataList.push(_node.innerText);
                });
                return dataList;
            }, args);
            await browser.close();
            return result;
        } else {
            return ["error"];
        }
    });

    ipcMain.handle("loadJson", async (event, args) => {
        try {
            const data = await fs.readFile(jsonFilePath, "utf8");
            const jsonData = JSON.parse(data);
            return jsonData;
        } catch (error) {
            throw error;
        }
    });

    ipcMain.handle("saveTemplate", async (event, args) => {
        try {
            const data = await fs.readFile(jsonFilePath, "utf8");
            const jsonData = JSON.parse(data);
            jsonData.push(args);
            await fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), "utf8");
        } catch (error) {
            console.error("エラー:", error);
            throw error;
        }
    });

    ipcMain.handle("deleteTemplate", async (event, args) => {
        try {
            const data = await fs.readFile(jsonFilePath, "utf8");
            let jsonData = JSON.parse(data);
            jsonData = jsonData.filter((obj) => obj.url !== args.url);
            await fs.writeFile(jsonFilePath, JSON.stringify(jsonData, null, 2), "utf8");
        } catch (error) {
            console.error("エラー:", error);
            throw error;
        }
    });
}

app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}
