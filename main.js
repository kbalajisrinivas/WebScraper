var request = require('request');
var cheerio = require('cheerio');
var fs = require("fs");
var util = require("util");

var profileUrl = "https://www.ssmatri.com/ssnmlprofile.php?id=19909";
var totalPages = 0;
var finalString = "";
readAndProcessProfiles();
function readAndProcessProfiles() {
	fs.readFile('inputfile.txt', 'utf8', function (err, data) {
		if (err) {
			return console.log(err);
		}
		console.log(data);
		var profileLinks = [];
		var rows = data.split("\n");
		for (var k = 0; k < rows.length; k++) {
			profileLinks.push(rows[k].split(" ")[0]);
		}
		//584 is hardcoded value
		for (var i = 0; i < 584; i++) {
			(function (i) {
				setTimeout(function () {
					processFiles(profileLinks[i]);
				}, i * 120000);
			})(i);
		}
	});
}

function processFiles(urlName) {
	console.log('url ' + urlName + new Date());
	request(urlName, function (error, response, body) {
		if (error) {
			console.log("error: " + error);
		}
		var $ = cheerio.load(body);
		var proviewtab = $(".proview");
		searchForElements(proviewtab);
	});
}


function searchForElements(proviewTab) {

	var keys = [' DOB -Time-Place', 'Sect-Gothram-Star',
		'Qual-Job-Place', 'Income(p.m)',
		'Ht -Wt-Complexion',
		'MotherTongue',
		"OtherLang.Known(Speaking)",
		'Nativity',
		'ParentsAlive?',
		'Father',
		'Mother ',
		'Brothers',
		'Sisters',
		'Status--Property',
		'VisaStatus',
		'Talents/Achievements',
		'Likes/Hobbies',
		'VehicleDrivingknown',
		'AnyotherDetails'
	]

	if (proviewTab && proviewTab[0] && proviewTab[0].children && proviewTab[0].children[1]) {
		var htmlElement = proviewTab[0].children[1].children[1].children; //14 children
		finalString = "";
		for (var j = 0; j < htmlElement.length; j++) {
			//console.log("html element " + j); 
			searchForTrTags(htmlElement[j], 14);
		}
		console.log(finalString);
		var finalValueString = ""
		for (var k = 0; k < keys.length; k++) {
			startStringIndex = finalString.indexOf(keys[k]);
			if (k < keys.length - 1) {
				endStringIndex = finalString.indexOf(keys[k + 1]);
			}
			var valueString = finalString.substring(startStringIndex + keys[k].length + 1, endStringIndex);
			finalValueString = finalValueString + "," + valueString;
		}
		console.log(finalValueString.replace(/:/g, "").substring(2, finalValueString.length));
	}
	//Now parse the whole string
}

function searchForTrTags(htmlElement, appendText) {
	if (htmlElement.name === undefined || htmlElement.children === undefined) {
		if (htmlElement.data && htmlElement.type != "comment") {
			var stringAfterRemovingWhiteSpaces = htmlElement.data.replace(/ /g, '').replace(/(\r\n|\n|\r)/gm, "");
			if (stringAfterRemovingWhiteSpaces != "") {
				return stringAfterRemovingWhiteSpaces;
			}
		}
		return null;
	}

	if (htmlElement.name == "tr" || htmlElement.children.length > 0) {
		if (htmlElement.children) {
			appendText = appendText + " -> " + htmlElement.children.length;
			//console.log(htmlElement.children.length + " " + appendText);
			for (var i = 0; i < htmlElement.children.length; i++) {
				var infoString = searchForTrTags(htmlElement.children[i], appendText);
				if (infoString) {
					finalString = finalString + " " + infoString;
				}
			}
		}
	}
}