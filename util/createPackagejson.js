const fs = require('fs');
const path = require('path');
const createEnv = require('./createEnv');

module.exports = (name, pathname, lang="JS") => {
    let package = {
        name: name,
        version: "1.0.0",
        description: "",
        main: "app.ts",
        scripts: {
            start: "ts-node app.ts"
        },
        keywords: [],
        author: "",
        license: "MIT",
        dependencies: {
            "discord.js": "latest",
            "dotenv": "latest",
        },
    }

    if (lang == "JS") {
        package.main = "app.js";
        package.scripts.start = "node app";
    } else {
        package.dependencies["@types/node"] = "latest";
    }

    fs.writeFileSync(path.join(pathname, "/package.json"), JSON.stringify(package));
    createEnv(pathname);
}