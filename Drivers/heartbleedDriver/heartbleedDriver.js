var fs = require('fs');
var path = require('path');
var cp = require("child_process");
var file = 'heartbleedDriver.json';    //configuration file placed in the same directory

var configPath = path.join(path.dirname(fs.realpathSync(__filename)), '/');

var getToolInfo = function (callback) {
  fs.readFile(configPath + file, 'utf8', function (err, Data)  {  //function for reading config file content 
    if (err){
      console.log('Error: ' + err);
      callback(err);
    }
    JSONData = JSON.parse(Data);    //parsing json data from config file
    delete JSONData.URL.commandOption;
    callback(JSONData);  
  });
}

var runTool = function (scanID, userJSONData, callback){
  fs.readFile(configPath + file, 'utf8', function (err, configJSONData){    //function for reading config file content 
    if (err){
      console.log('Error: ' + err);
      callback(err);
    }
   
    configJSONData = JSON.parse(configJSONData);    //parsing json data from config file

    var str=";";
    if(userJSONData.URL.value.indexOf(str) > -1)    //Checking for malicious data such as ';'
      callback("User input is Malicious");  
    else{    
      var JSONinput ="", JSONoutput="", message = "";
      var data = [];
      var heartbleedPath = configPath + "heartbleed.py";
      var command = "python " + heartbleedPath ;
      command = command + " " + userJSONData.URL.value;
      console.log(command);
      cp.exec(command, function (err, stdout, stderr) {
        console.log(stdout);
        JSONinput = userJSONData.URL.value;
        JSONoutput = stdout;
	console.log(JSONoutput);
        message = "heartbleed scan result";
        var JSONData = {"input":JSONinput, "output":JSONoutput, "message":message};
        data.push(JSONData);
        var datasend = {"scanID":scanID,"toolNPM":"heartbleedDriver", "data":data}
        callback(datasend);
        console.log(datasend);  
      });  
    }
  });
}

exports.getToolInfo = getToolInfo;        //Exports the getToolInfo function 
exports.runTool = runTool;          //Exports the runTool function 