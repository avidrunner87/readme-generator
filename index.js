const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
let fileContents = "";
let readmeJSON = {
    "name": "",
    "description": "",
    "url": "",
    "useCases": [],
    "acceptanceCriteria": [],
    "license": "",
    "owner": "",
    "email": ""
}
const outputDir = './outputs';

console.clear();

console.log("\n**************************************************\n\nWELCOME TO README GENERATOR\n\n**************************************************");

console.log("\n-> Before we begin, we want to make sure you have everything ready to go.\n")
preWorkQuestions();

// Ask pre-work questions
function preWorkQuestions () {
    inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmAnswer',
            message: 'Have you created a Github repository and cloned it to your computer?'
        }
    ])
    .then((data) => {
        if (data.confirmAnswer) {
            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'confirmAnswer',
                    message: 'Have you taken screenshots of your application?'
                }
            ])
            .then((data) => {
                if (data.confirmAnswer) {
                    console.log("\nPerfect, you have everything ready to go!\n\n**************************************************\n");
                    readmeQuestions();
                } else {
                    console.log("\nPlease take a 2-3 screenshots and have them ready to include in the repo.\n\n**************************************************\n");
                    readmeQuestions();
                }
            })
        } else {
            console.log("\nPlease setup the Github repository and clone it to your computer. Then re-run this program.\n\n**************************************************\n");
        }
    })
}

function readmeQuestions() {
    console.log("-> Let's begin by getting some basic information about the application.\n")

    inquirer.prompt([
        {
            type: 'input',
            name: 'appName',
            message: 'What is the name of your application?'
        },
        {
            type: 'input',
            name: 'appDescription',
            message: 'How would you describe your application in 2-3 sentences?'
        },
        {
            type: 'input',
            name: 'appURL',
            message: 'What is the URL that users can access the application?'
        }
    ])
    .then((data) => {
        readmeJSON.name = data.appName;
        readmeJSON.description = data.appDescription;
        readmeJSON.url = data.appURL;

        console.log("\n-> Now tell us more about the application's use cases.\n");

        useCaseQuestions();
    })
}

function useCaseQuestions() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'useCaseUser',
            message: 'What is the persona (AS A ...)?'
        },
        {
            type: 'input',
            name: 'useCaseAction',
            message: 'What do they want to do (I WANT ...)?'
        },
        {
            type: 'input',
            name: 'useCaseOutcome',
            message: 'What is the value / outcome (SO THAT...)?'
        }
    ])
    .then((data) => {
        let newEntry = {
            "user": data.useCaseUser,
            "action": data.useCaseAction,
            "outcome": data.useCaseOutcome
        }
        readmeJSON.useCases.push(newEntry);
        console.log("\n");
        inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmAnswer',
                message: 'Do you have another use case?'
            }
        ])
        .then((data) => {
            if (data.confirmAnswer) {
                console.log("\n");
                useCaseQuestions();
            } else {
                console.log("\n-> Now tell us more about the application's acceptance criteria.\n");
                acceptanceCriteriaQuestions();
            }
        })
    })
}

function acceptanceCriteriaQuestions() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'criteriaScenario',
            message: 'What is the scenario (GIVEN ...)?'
        },
        {
            type: 'input',
            name: 'criteriaAction',
            message: 'What action does the application or user take (WHEN ...)?'
        },
        {
            type: 'input',
            name: 'criteriaOutcome',
            message: 'What is the expected result from the action taken (THEN ...)?'
        },
        
    ])
    .then((data) => {
        let newEntry = {
            "scenario": data.criteriaScenario,
            "action": data.criteriaAction,
            "outcome": data.criteriaOutcome
        }
        readmeJSON.acceptanceCriteria.push(newEntry);
        console.log("\n");
        inquirer.prompt([
            {
                type: 'confirm',
                name: 'confirmAnswer',
                message: 'Do you have an additional scenario?'
            }
        ])
        .then((data) => {
            if (data.confirmAnswer) {
                console.log("\n");
                acceptanceCriteriaQuestions();
            } else {
                console.log("\n-> Just a few more details.\n");
                additionalQuestions();
            }
        })
    })
}

function additionalQuestions() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'appLicense',
            message: 'Choose a license type:',
            choices: ["MIT", "Other"]
        },
        {
            type: 'input',
            name: 'appOwner',
            message: 'What is your Github username?'
        },
        {
            type: 'input',
            name: 'appEmail',
            message: 'What is your email address?'
        }
    ])
    .then((data) => {
        readmeJSON.license = data.appLicense;
        readmeJSON.owner = data.appOwner;
        readmeJSON.email = data.appEmail;
        console.log("\n**************************************************\n\n-> Generating the readme.\n");
        loadREADMETemplate();
    })
}

function loadREADMETemplate() {
    fs.readFile('./assets/templates/README.md', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        fileContents = data;
        generateREADME();
    })
}

function generateREADME() {

    // Update README content
    fileContents = fileContents.replace(/data\.title/g, readmeJSON.name.replace(' ', '-').toLowerCase());
    fileContents = fileContents.replace(/data\.description/g, readmeJSON.description);
    fileContents = fileContents.replace(/data\.appURL/g, readmeJSON.url);

    let useCaseString = "";
    readmeJSON.useCases.forEach(useCase => {
        useCaseString += `>**AS A(N)** ${useCase.user}<br>I **WANT** ${useCase.action}<br>**SO THAT** ${useCase.outcome}

`
    });
    
    fileContents = fileContents.replace(/data\.useCases/g, useCaseString);

    let acceptanceCriteriaString = "";
    readmeJSON.acceptanceCriteria.forEach(acceptanceCriteria => {
        acceptanceCriteriaString += `**GIVEN** ${acceptanceCriteria.scenario}

>**WHEN** ${acceptanceCriteria.action}<br>**THEN** ${acceptanceCriteria.outcome}

`
    });
    
    fileContents = fileContents.replace(/data\.acceptanceCriteria/g, acceptanceCriteriaString);

    fileContents = fileContents.replace(/data\.license/g, licenseDetails(readmeJSON.license));

    fileContents = fileContents.replace(/data\.owner/g, readmeJSON.owner);

    fileContents = fileContents.replace(/data\.email/g, readmeJSON.email);


    // Check for Output folder and create if needed
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }

    // Check if the Assets folder exists and create if needed
    if (!fs.existsSync("./assets")){
        fs.mkdirSync("./assets");
    }

    // Check if the Images folder exists and create if needed
    if (!fs.existsSync("./assets/images")){
        fs.mkdirSync("./assets/images");
    }

    // Check if the Screenshots folder exists and create if needed
    if (!fs.existsSync("./assets/images/screenshots")){
        fs.mkdirSync("./assets/images/screenshots");
    }

    // Create the README file
    fs.writeFile(
        './outputs/README.md', 
        fileContents, 
        (err) => err ? console.log(err) : console.log('Success! Your README file has been created! File Path: ./outputs/README.md\n')
    );
}

function licenseDetails(license) {
    switch (license) {
        case "MIT":
            return "[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]()";
            break;
    
        default:
            return "";
            break;
    }
}