var fs=require("fs");

var KMF=require("ksana-master-format");
var xml2standoff=KMF.xml2standoff;
var standoffutils=KMF.standoffutils;

var dir=process.argv[2]||"和合版新舊約";
var xmlDir=dir+"/xml/", kmfDir=dir+"/kmf/";

var list=fs.readdirSync(xmlDir);
if(!list){ console.log("?????",xmlDir,"無此資料夾"); return; }
fs.existsSync(kmfDir) || fs.mkdirSync(kmfDir);
for(var i=0;i<list.length;i++){
	name=list[i];
	if(!name.match(/\.xml$/)){
		console.log('?????',name,'not .xml file');
		exit;
	}
	var file=name.substr(0,name.length-4);
	var xmlFile=xmlDir+file+".xml";
	var xml=fs.readFileSync(xmlFile,"utf8").replace(/\r\n/g,"\n");
	console.log(xmlFile,xml.length);
	var json=xml2standoff(xml);
	var kmf=standoffutils.stringify(json);

	fs.writeFileSync(kmfDir+file+".kmf",kmf,"utf8");
}