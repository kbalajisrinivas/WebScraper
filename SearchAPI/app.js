var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var lineReader = require('line-reader');
var fs = require('fs');

var profiles = require('./models/profiles');

app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/ProfileStore');
var db = mongoose.connection;
var file = "C:\\Users\\balajisrinivas\\Desktop\\WebScraper\\SearchAPI\\CombinedRecords.txt"; 
	// var keys = ['DOB -Time-Place','Sect-Gothram-Star',
								// 'Qual-Job-Place','Income(p.m)',
								// 'Ht -Wt-Complexion',
								// 'MotherTongue',
								// "OtherLang.Known(Speaking)",
								// 'Nativity',
								// 'ParentsAlive?',
								// 'Father',
								// 'Mother ',
								// 'Brothers',
								// 'Sisters',
								// 'Status--Property',
								// 'MaritalStatus',
								// 'VisaStatus',
								// 'Talents/Achievements',
								// 'Likes/Hobbies',
								// 'VehicleDrivingknown',
								// 'Disability(IfAny)',
								// 'AnyotherDetails'
								// ];
								
	//this is beecause JSON does not allow special characters in the names.
	var keysAndJsonProperties = {};
	keysAndJsonProperties['DOB -Time-Place'] = 'DOBTimePlace';
	keysAndJsonProperties['Sect-Gothram-Star'] = 'SectGothramStar';
	keysAndJsonProperties['Qual-Job-Place'] = 'QualJobPlace';
	keysAndJsonProperties['Income(p.m)'] = 'Incomepm';
	keysAndJsonProperties['Ht -Wt-Complexion'] = 'HtWtComplexion';
	keysAndJsonProperties['MotherTongue'] = 'MotherTongue';
	keysAndJsonProperties['OtherLang.Known(Speaking)'] = 'OtherLangKnownSpeaking';
	keysAndJsonProperties['Nativity'] = 'Nativity';
	keysAndJsonProperties['Father'] = 'Father';
	keysAndJsonProperties['Mother '] = 'Mother';
	keysAndJsonProperties['Brothers'] = 'Brothers';
	keysAndJsonProperties['Sisters'] = 'Sisters';
	keysAndJsonProperties['Status--Property'] = 'StatusProperty';
	keysAndJsonProperties['MaritalStatus'] = 'MaritalStatus';
	keysAndJsonProperties['VisaStatus'] = 'VisaStatus';
	keysAndJsonProperties['Talents/Achievements'] = 'TalentsAchievements';
	keysAndJsonProperties['Likes/Hobbies'] = 'LikesHobbies';
	keysAndJsonProperties['VehicleDrivingknown'] = 'VehicleDrivingknown';
	keysAndJsonProperties['Disability(IfAny)'] = 'Disability';
	keysAndJsonProperties['AnyotherDetails'] = 'AnyotherDetails';
	
								
app.get('/api/profiles',function(req,res){
	var allLines = [],allObjects = [],allPropertyValues={};
	for(var propName in req.query){
		console.log(propName,req.query[propName]);
		allPropertyValues[propName]= new RegExp(req.query[propName], 'i');
		console.log(propName,allPropertyValues[propName]);
	} 
 	
	profiles.getProfiles(allPropertyValues,function(err,profiles){
		if(err) { 
			throw err;
		}
		console.log('profiles length' + profiles.length);
		for(var i=0;i<profiles.length;i++){
		 var objectAsString="";
		for(var prop in profiles[i]._doc){
			 if(!profiles[i]._doc.hasOwnProperty(prop)){
				continue; 
			  }
			  objectAsString = objectAsString + profiles[i]._doc[prop] + ", ";
			}
			console.log(objectAsString);
		}
		res.json(profiles);
	});
	
	// setTimeout(function(){
		       // //res.send('req.query.sect:' + req.query.sect);
			   // var filteredObjects=[];
			   // if(req.query.sect.indexOf('BRAH') != -1){
				   // //res.send('brah' + allObjects.length);
				   // for(var k=0;k<allObjects.length;k++){
					   // //filteredObjects.push(allObjects[k]);
					   // if(allObjects[k]['Sect-Gothram-Star'].indexOf('BRAHACHA') != -1
					               // && allObjects[k]['ParentsAlive?'].indexOf('BothAlive') != -1
								   // && allObjects[k]['Brothers'] != null
								   // && (allObjects[k]['Qual-Job-Place'].indexOf('B.E') !=-1 || allObjects[k]['Qual-Job-Place'].indexOf('B.Tech') !=-1)){
					        // filteredObjects.push(allObjects[k]); 
					   // } 
				   // }
			   // }
			   // res.send(filteredObjects);
			   // }, 5000);
	//res.send('hello World!');
});

app.post('/api/profile', function (req,res){
	// var profile =  {
    // "id": 3990,
    // "profileLink": "https://ssmatri.com/ssnmlprofile.php?id=3990",
    // "DOBTimePlace": ": 23-May-1988 -- 2.27AM -- Chennai ",
    // "SectGothramStar": ": BRAHACHARANAM -- KOUSIGAM -- AYILYAM-4 ",
    // "QualJobPlace": ": B.Tech,MS(USA),MBA(USA) -- SoftwareWriter -- Orlando,Florida-USA ",
    // "Incomepm": "",
    // "HtWtComplexion": ": US$6,000 -- 5.2 --60Kgs--VeryFair ",
    // "MotherTongue": ": Tamil ",
    // "OtherLangKnown": null,
    // "Nativity": ": Tiruchirappalli ",
    // "ParentsAlive": ": BothAlive ",
    // "Father": ": Name :T.S.SUBRAMANIAN-- Father'sJob :Journalist ",
    // "Mother": " Name :POORNIMA --Mother'sJob :HouseWife Mother'sSubsect :BRAHACHARANAM ",
    // "Brothers": ": ElderBrothers(1) ",
    // "Sisters": null,
    // "StatusProperty": ": Status :MiddleClass Property :OwnHouse Place :Chennai ",
    // "MaritalStatus": ": Unmarried ",
    // "VisaStatus": ": H1BVisa ",
    // "TalentsAchievements": null,
    // "LikesHobbies": ": Dance,Music ",
    // "VehicleDrivingknown": ": TwoWheeler,FourWheeler ",
    // "Disability": null,
    // "AnyotherDetails": "AnyotherDetails "
  // };
    var allLines = [];
   	lineReader.eachLine(file,function(line,last){
		allLines.push(line);
		if(last){
	       allObjects = processAllLines(allLines);		
		}
	});
	
	//res.send(req.body.test);
});

function processAllLines(allLines){
	var AllObjects = [];
	for(var i=0;i<allLines.length;i++){
		if(allLines[i].indexOf('DOB -Time-Place') != -1){
			var profileObj = {};
		  //get the id from the previous step
		   var idIndex = allLines[i-1].indexOf('id=');
		   var id = parseInt(allLines[i-1].substring(idIndex+3,idIndex+10),10);
		   profileObj.id = id;
		   profileObj.profileLink = "https://ssmatri.com/ssnmlprofile.php?id="+id;
		   var keys = Object.keys(keysAndJsonProperties);
		  for(var k=0;k<keys.length;k++){
		   startStringIndex = allLines[i].indexOf(keys[k]);
		   if(k<keys.length-1){
		   endStringIndex = allLines[i].indexOf(keys[k+1]);   
		   }
		   
	   var valueString = allLines[i].substring(startStringIndex+keys[k].length+1,endStringIndex);
	   profileObj[keysAndJsonProperties[keys[k]]] = valueString == ": --- " ? null : valueString; 
	   }

	   	profiles.addProfile(profileObj,function(err,profiles){
		if(err) {
			throw err;
		}
		//res.json(profile);
	});
	  //AllObjects.push(profileObj);
		}
	}
	return AllObjects;
}
 
app.listen(10209);
console.log('running on port 10209');