var request = require('request');
var cheerio = require('cheerio');
var fs = require("fs");
var util = require("util");

//var url = "https://www.ssmatri.com/ssnmlprofilelist.php?type=GI";
var url = "https://www.ssmatri.com/ssnmlprofilelist.php?type=GI&search=search&profile_id=&profile_name=&photo=&get_gothiram=&get_htfrom=&get_htto=&get_incometo=&from=26&to=29&placeofjob=&job_indiastate=&job_indiacity=&abrooad=&page=23&tot_page=%d";
var firstPage = util.format(url, 1);
var totalPages = 0;
var finalString = "";
request(firstPage, function (error, response, body) {
    if (error) {
        console.log("Error: " + error);
    }
    console.log(body);
    var $ = cheerio.load(body);
    var uiCorner = $(".ui-corner-all")[2];
    //hardcode the totalpages for now
    //var totalPages = uiCorner.next.next.next.next.children[3].children[0].data;
    var totalPages = 23;
    var tableObject = uiCorner.children;
    console.log("page: 1");
    processRecords(tableObject);
    processOtherPages(2);
});

function processRecords(tableObject) {
    for (var i = 0; i < tableObject.length; i++) {
        if (tableObject[i].children) {
            if (tableObject[i].children.length == 13) {
                var link = tableObject[i].children[5].children[1].children[0].attribs.href;
                var girlName = tableObject[i].children[7].children[1].children[0].children[0].data.replace(/ /g, '').replace(/(\r\n|\n|\r)/gm, "");;
                console.log(link + " " + girlName);
            }
        }
    }
}

function processOtherPages(pageNumber) {
    if (pageNumber == 3)
        return;
    else {
        request(util.format(url, pageNumber), function (error, response, body) {
            var $ = cheerio.load(body);
            console.log(util.format("page: %d", pageNumber));
            processRecords($(".ui-corner-all")[2].children);
            processOtherPages(pageNumber + 1);
        });
    }
}