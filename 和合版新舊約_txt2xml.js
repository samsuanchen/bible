var fs=require("fs");

var txtDir="和合版新舊約/txt/", xmlDir="和合版新舊約/xml/";
var file=process.argv[2]||"和合版新舊約";
if (file.match(/\.txt$/))
	file=file.substr(0,file.length-4);
var txtFile=txtDir+file+".txt";
var txt=fs.readFileSync(txtFile,"utf8").replace(/\r\n/g,"\n");

var nBook=0, book='', xml=[];
var d2=function(n){ return (n<10?'0':'')+n; } // 十進制兩位數字串
var writeBook=function(b){
	if(b===book)return; // 正在處理一卷書
	if(!book)return; // 尚未處理任何一卷書
	var xmlFile=xmlDir+d2(++nBook)+book+".xml"; // 處理完一卷書
	console.log(xmlFile);
	fs.writeFileSync(xmlFile,xml.join('\n'),"utf8");
}
txt.replace(/([^0-9\n]+)(\d+:\d+) ([^\n]+)/g,
	function(_,b,v,verse){
		if(b!==book){ // 開始處理新的一卷書 之前
			writeBook(b); // 
			book=b, xml=[];
		}
		xml.push('<verse>'+v+'</verse>'+verse);
	}
);
writeBook('');

