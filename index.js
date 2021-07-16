const inquirer = require('inquirer');
const fs = require('fs');
let fileContents = "";

console.log("\n\n**************************************************\n\nWELCOME TO README GENERATOR\n\n**************************************************");

console.log("\n1. Loading README template\n");

fs.readFile('./assets/templates/README.md', 'utf8', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    fileContents = data;
    // console.log(fileContents);
})

console.log("\n2. Please provide the following information:\n");

questions();

function questions () {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the application?'
            },
            {
                type: 'input',
                name: 'description',
                message: 'What does the application do?'
            },
            {
                type: 'input',
                name: 'appURL',
                message: 'What is the URL of the live application?'
            }
        ])
    .then((data) => {
        // Update the README title
        let rdmTitle = data.title.replace(' ', '-').toLowerCase();
        fileContents = fileContents.replace(/data\.title/g, rdmTitle);
        fileContents = fileContents.replace(/data\.description/g, data.description);
        fileContents = fileContents.replace(/data\.appURL/g, data.appURL);

        const filename = "README.md";

        fs.writeFile(
            filename, 
            fileContents, 
            (err) => err ? console.log(err) : console.log(`Success! Your README file has been created! Filename: ${filename}`)
        );
    });
}

