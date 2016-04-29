var xml2standoff=require("ksana-master-format").xml2standoff;

var standoffutils=require("ksana-master-format").standoffutils;

var testfile=process.argv[2]||"和合版新舊約.xml";
var fs=require("fs");
var testcontent=fs.readFileSync(testfile,"utf8").replace(/\r\n/g,"\n");
var json=xml2standoff(testcontent);
var tags=json.tags, endtags=json.endtags;
var text=json.text.replace("`","\\`");

//remove /u

var out=standoffutils.stringify(json);
fs.writeFileSync(testfile.substr(0,testfile.length-4)+".kmf",out,"utf8");

