/*
http://stackoverflow.com/questions/19557325/big5-to-utf-8-encoding-while-scraping-website-with-node-request
*/
// var iconv=require("iconv-lite");
var fs=require("fs");
var request=require("request");

/* 01. stream any web data to be local
   request('http://flagxor.com/static/4spire.png').pipe(fs.createWriteStream('4spire.png'));
   request('http://ruwach.googlepages.com/site/ruwach/bibletext').pipe(fs.createWriteStream('bibletext.html'));
   request('http://ruwach.googlepages.com/OldTestament.zip').pipe(fs.createWriteStream('OldTestament.zip'));
*/

/* 02. stream any web page to a local file
request
  .get('https://sites.google.com/site/ruwach/bibletext')
  .on('response', function(response) {
    console.log(response.statusCode) // 200
    console.log(response.headers['content-type']) // 'image/png'
  })
  .pipe(fs.createWriteStream('bibletext.html'));
*/

var versionG=/\n<p><font size="4">(([A-Za-z]+[^<]+)*[A-Za-z]+)/g;
var versionP=/\n<p><font size="4">(([A-Za-z]+[^<]+)*[A-Za-z]+)/;
var zipP=/\n<p><a href="([^"]+\.zip)[^"]*"/;
var versionOrZipG=/\n<p><font size="4">(([A-Za-z]+[^<]+)*[A-Za-z]+)|\n<p><a href="([^"]+\.zip)[^"]*"/g;
var weburl='https://sites.google.com/site/ruwach/bibletext';
var dir;
request({url:weburl,encoding:null}, function (error, response, body) {
	if (!error && response.statusCode == 200) {
	  console.log("return from",weburl);
	  var html=body.toString();
	  fs.writeFileSync('bibletext1.html',html);
	  html.replace(versionG,function(_,m){
	  	dir=m.replace(/[^A-Za-z]+/g,'_');
	  	if(!fs.existsSync(dir))
	  		fs.mkdirSync(dir);
	  		console.log('mkdir',dir);
	  });
	  html.replace(versionOrZipG,function(m){
	  	var zip=m.match(zipP);
	  	if(!zip) {
	  		dir=m.match(versionP)[1].replace(/[^A-Za-z]+/g,'_');
	  		console.log(dir);
	  	}
	  	else {
	  		zip=zip[1];
	  		var file=zip.match(/\/([^\/]+)$/)[1];
		  	var path=dir+'/'+file;
		  	console.log('wget',zip);
		  	console.log('as file',path);
		  	try{
		  		request(zip).pipe(fs.createWriteStream(path));
		  	} catch(e) {
		  		console.log(e);
		  		process.exit();
		  	}
	  	}
	  });
	} else {
	  console.log(error);
	}
});

/*
var weburl="https://sites.google.com/site/ruwach/bibletext"

	request({url:weburl,encoding:null}, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	console.log("return from",weburl);
	  	console.log("response",JSON.stringify(response));
	  	console.log("body",JSON.stringify(body));
	  } else {
	  	console.log(error);
	  }
	});	
/*
var targetfolder="raw/";
var errorlog=[];
var baseurl="https://sites.google.com/site/ruwach/bibletext"

var chapterurl=function(bkid,chapterid){
	return "http://open-lit.com/showlit.php?gbid="+bkid+"&cid="+chapterid;
}
//var gbidtoget=[6,140,231]; //see booklist.js
//"紅樓夢" ,二十年目睹之怪現狀,文明小史
//var gbidtoget=[10,92,12,14,19];
//var gbidtoget=[96,97,100,91,39,93,90,147]; //87 is empty
var gbidtoget=require("./booklist").allbooks.map(function(item){return item[0]});
gbidtoget=gbidtoget.slice(21); //remove top 21 books (Chu works)
var getchaptercount=function(bkid,cb) {
	request({url:baseurl+bkid,encoding:null}, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	    var str = iconv.decode(new Buffer(body), "big5");
		var i=str.indexOf("總章回 ");

		if (i>-1) {
			var chaptercount=parseInt(str.substr(i+4));
			console.log("book",bkid,'has ',chaptercount,'chapter')
			cb(chaptercount);
		}
	  }
	})
}

var msg=function(t){
	process.stdout.write(t+"\033[0G");
}
var getchapter=function(bkid,chapter,total,finishcb) {
	var url=chapterurl(bkid,chapter);
	request({url:url,encoding:null}, function (error, response, body) {
	  if (!error && response.statusCode == 200) {
	  	msg("return from "+url)
	    var str = iconv.decode(new Buffer(body), "big5");
	    if (!fs.existsSync(targetfolder+bkid)) fs.mkdirSync(targetfolder+bkid);
	    str=str.replace("charset=big5","charset=utf8");
	    fs.writeFileSync(targetfolder+bkid+"/"+chapter+".html",str,"utf8");
	    chapter++;

	    if (chapter<=total) {
	    	setTimeout(function(){
	    		getchapter(bkid,chapter,total,finishcb);	
	    	},300);
	    } else {
	    	finishcb();
	    }
	  } else {
	  	var estr="error bkid:"+bkid+",chapter:"+chapter;
	  	console.log(estr)
	  	errorlog.push(estr);
	  }
	});	
}
var now=0;
var getbook=function() {
	if (now==gbidtoget.length) {
		fs.writeFileSync("errordownload.txt",errorlog.join("\n"),"utf8");
		console.log("download finished")
		return;
	}
	var bkid=gbidtoget[now];

	getchaptercount(bkid,function(n){
		getchapter(bkid,1,n,function(){
			now++;
			getbook();
		});
	});
}

getbook();
*/