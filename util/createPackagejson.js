const fs = require('fs');
const path = require('path');

module.exports = (name, pathname, lang="JS") => {
    let package = {
        name: name,
        version: "1.0.0",
        description: "",
        main: `app.${lang.toLowerCase()}`,
        scripts: {
            start: `ts-node app.${lang.toLowerCase()}`
        },
        keywords: [],
        author: "",
        license: "MIT",
        dependencies: {
            "discord.js": "latest",
            "dotenv": "latest",
        },
    }

    if (lang == "JS") 
        package.scripts.start = "node app.js";
    else 
        package.dependencies["@types/node"] = "latest";
    

    fs.writeFileSync(path.join(pathname, "/package.json"), JSON.stringify(package));
}