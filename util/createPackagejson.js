const fs = require('fs');
const path = require('path');
const createEnv = require('./createEnv');

module.exports = (name, pathname, lang="JS") => {
    let package = {
        name: name,
        version: "1.0.0",
        description: "",
        main: "app.js",
        scripts: {
            start: "ts-node app.ts"
        },
        keywords: [],
        author: "",
        license: "MIT",
        dependencies: {
            "discord.js": "latest"
        },
    }

    if (lang == "JS") {
        package.scripts.start = "node app";
        createEnv(pathname);
    } else {
        package.dependencies["@types/node"] = "latest";
    }

    fs.writeFileSync(path.join(pathname, "/package.json"), JSON.stringify(package));
}