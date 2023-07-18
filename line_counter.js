const glob = require("glob");
const fs = require("fs");

let line_count = 0;
let char_count = 0;

glob.glob(`${__dirname.replaceAll("\\", "/")}/**/*.*`).then((files) => {
    for(let i = 0; i < files.length; i++) {
        files[i] = files[i].replaceAll("\\", "/")
        if(files[i].includes("/node_modules/")) continue;
        if(files[i].includes("requirements.txt")) continue;
        if(files[i].includes("LICENSE")) continue;
        if(files[i].includes("package-lock.json")) continue;
        if(files[i].includes("package.json")) continue;
        if(files[i].includes("tsconfig.json")) continue;
        if(files[i].includes("/dist/")) continue;
        
        try {
            const file_data = fs.readFileSync(files[i]).toString();
            const file_lines = file_data.split("\n").length;
            const file_characters = file_data.split('').length;
    
            line_count += file_lines;
            char_count += file_characters   
        } catch(err) {}
    }

    console.log(`Line count : ${line_count}`);
    console.log(`Char count : ${char_count}`);
});

