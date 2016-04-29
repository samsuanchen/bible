var fs=require("fs");
var KMF=require("ksana-master-format");

var xmlDir="test/xml/", kmfDir="test/kmf/";
var file=process.argv[2]||"test";
if (file.match(/\.xml$/))
	file=file.substr(0,file.length-4);
var xmlFile=xmlDir+file+".xml", kmfFile=kmfDir+file+".kmf";
var xml=fs.readFileSync(xmlFile,"utf8").replace(/\r\n/g,"\n");

var json=KMF.xml2standoff(xml);
var kmf=KMF.standoffutils.stringify(json);

fs.writeFileSync(kmfFile,kmf,"utf8");