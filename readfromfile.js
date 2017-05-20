var lineReader = require('line-reader');
var fs = require("fs");

var folder = 'C:\\Users\\balajisrinivas\\Desktop\\WebScraper\\WebScraper\\Output\\Info\\';
getFiles();
function getFiles(){
	fs.readdir(folder,(err,files) => {
		console.log(folder);
	    processFiles(files);
	});
}
 

function processFiles(files){
	for(var i=0;i<files.length;i++){
	(function(i){
	   setTimeout(function(){
		   readLines(folder+files[i]);
	   },i*4000);
	})(i);
		
	} 	
}

function readLines(file){
	var allLines = [];
		lineReader.eachLine(file,function(line,last){
			allLines.push(line);
			if(last){
				processAlLines(allLines);
			}
		});
}

function processAlLines(allLines){
	var notProcessedRecords = [];
	for(var i=0;i<allLines.length;i++){
	    if(i!=allLines.length-1){
           if(allLines[i].indexOf('url') !=-1){
			  if(allLines[i+1].indexOf('DOB -Time-Place') !=-1){
				  var idIndex = allLines[i].indexOf('id=');
				  var id = parseInt(allLines[i].substring(idIndex+3,idIndex+10),10);
				  console.log(id + "," + allLines[i+2]);
			  }
			  else{
				  var idIndex = allLines[i].indexOf('id=');
				  var id = parseInt(allLines[i].substring(idIndex+3,idIndex+10),10);
				  notProcessedRecords.push("not found" + id + "," + allLines[i]);
			  }
		   }
		}		
	}
 
   for(var j=0;j<notProcessedRecords.length;j++){
      console.log(notProcessedRecords[j]);
   }   
}