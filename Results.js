const http = require('http');
const url = require('url');
const fs = require('fs');
const port = 3000;


var resultsFinal = {};
var formPage = '';
var piePage = '';

fs.readFile('./form.html', function (err, html) {
    formPage = html;
    if (err) throw err;
});

fs.readFile('./pie.html', function (err, html) {
    piePage = html;
    if (err) throw err;
});

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString(); // convert Buffer to string
        });
        req.on('end', () => {
            var surveyResponse = processesResponse(body);
            updateResults(surveyResponse);
            res.writeHead(200, {
                'Content-Type': 'text/html'
            });
            res.end(piePage);
        });
    }
    else if (req.method === 'PATCH') {
        // console.log("PATCH METHOD CALLED");
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(resultsFinal));
    }
    else if (req.method === 'GET') {
        // console.log("GET METHOD CALLED");
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.end(formPage);
    }
});
server.listen(port);


function processesResponse(body) {
    var fields = body.split('&');
    var processedData = {};
    // results array:
    // holds value count for [strongly disagree, somewhat disagree, neutral, somewhat agree, strongly agree]
    results = new Array(8);
    // results[0] = index of radio
    row = [0, 0, 0, 0, 0];
    possibleFeedback = ["Strongly+Disagree", "Somewhat+Disagree", "Neutral", "Somewhat+Agree", "Strongly+Agree"]

    var arrayLength = fields.length;

    // loopig until arraylength - 1 to avoid the submit=Submit value in fields
    for (var i = 0; i < arrayLength - 1; i++) {
        keyVal = fields[i].split('=');
        key = keyVal[0];
        value = keyVal[1];
        processedData[key] = value;

        results[i] = possibleFeedback.indexOf(value);
    }
    return results;
}

function updateResults(surveyResponse) {
    var text = fs.readFileSync("./result.txt").toString('utf-8');
    var textByLine = text.split("\n");
    var updatedResults = [];
    var currentResults = [];

    for (var i = 0; i < textByLine.length; i++) {
        currentResults = textByLine[i].split(',');
        currentResults = currentResults.map(function (x) {
            return parseInt(x, 10);
        });
        currentResults[surveyResponse[i]] += 1;
        updatedResults.push(currentResults);
    }

    // flushing contents of output file
    fs.writeFile('./result.txt', "", function (err) {
        // Deal with possible error here.
    });

    size = updatedResults.length;
    for (var i = 0; i < size; i++) {
        var line = updatedResults[i];
        resultsFinal[i] = line;

        if (i < size - 1) {
            line += "\n";
        }
        fs.appendFileSync('./result.txt', line, function (err) {
            if (err) { /* Do whatever is appropriate if append fails*/ }
        });
    }

}