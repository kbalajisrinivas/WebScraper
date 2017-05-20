Web Scraper for SSMatri

What is it?
SSMatri is a website that shows the profiles of brides/grooms and helps in finding a life partner.
However, sometimes it is hard to keep track of the profiles. As you click on each profile, it takes you to the new tab and you need
to note it somewhere(notepad/paperpen) to keep track of the profiles you liked.
The WebScraper solves this problem by enabling the user to read all the profiles at once and process the records and store it in a MongoDB.
The user can then use it to get data and use it however they want.

Documentation:
GetListFromPage -- This is the place where you will enter your search criteria. It will get all the profiles(with links and names) from all the pages.
You store that in a file. 
main.js -- This file reads an input file(from previous step) and parses each profile and outputs information to the other file.
However due to some limitations, you cannot send requests every second. The SSMatri administrator seems to block your IP if you bombard their 
server with requests. So, we are sending an request every 2 seconds. Based on the number of profiles, it might take few days to get all the information.
Note that, we are processing only 30 requests/hr. 
SearchAPI/app.js -- It provies 2 APIs(GET, POST) -- GET Accepts parameters. But when you pass parameters make sure you, the name is same as
the Schema. For POST, We don't accept any parameters. It just reads everything from the file and stores it in the MongoDB collection

Packages used:
We are processing the WebPages using the package (Cheerio, https://cheerio.js.org/)
Reading lines from a file and then sending requests using line-reader (https://www.npmjs.com/package/line-reader)
Format numebers using util(https://www.npmjs.com/package/util). 

Youtube Video that was useful for developing the application : https://www.youtube.com/watch?v=eB9Fq9I5ocs

Express framework
MongoDB:
Mongo Installation: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
I DID NOT do the unattended installation.
After the installation you should see the MongoDB service running in your local. 
You can use these commands to start/stop MongoDB service. 
net start MongoDB -- to start
net stop MongoDB -- to stop

Mongoose:
This is the one that facilitates the communication between Node and Mongo
Make sure your Model has the same properties as your Mongo Schema.
This is the line that matches between your Node schema and MongoDB schema.
 /*mongoose.model('profile',profileSchema);*/ confirm this though
