/*
http://a2z.fhl.net/bible/
*/
var fs=require("fs");
var request=require("request");

/* 01. stream any web data to be local
   request('http://flagxor.com/static/4spire.png').pipe(fs.createWriteStream('4spire.png'));
   request('http://ruwach.googlepages.com/site/ruwach/bibletext').pipe(fs.createWriteStream('bibletext.html'));
   request('http://a2z.fhl.net/bible/').pipe(fs.createWriteStream('bibletext_a2z.html'));
   request('http://ruwach.googlepages.com/OldTestament.zip').pipe(fs.createWriteStream('OldTestament.zip'));
*/

/* 02. stream any web page to a local file
request
  .get('https://sites.google.com/site/ruwach/bibletext')
  .on('response', function(response) {
    console.log(response.statusCode) // 200
    console.log(response.headers['content-type']) // 'text/html'
  })
  .pipe(fs.createWriteStream('bibletext.html'));
request
  .get('http://a2z.fhl.net/bible/')
  .on('response', function(response) {
    console.log(response.statusCode) // 200
    console.log(response.headers['content-type']) // 'text/html'
  })
  .pipe(fs.createWriteStream('bibletext_a2z.html'));
*/
var booknames=
[[01,'創世記','創','Gen']
,[02,'出埃及記','出','Ex']
,[03,'利未記','利','Lev']
,[04,'民數記','民','Num']
,[05,'申命記','申','']
,[06,'約書亞記','書','Josh']
,[07,'士師記','士','Judg']
,[08,'路得記','得','Ruth']
,[09,'撒母耳記上','撒上','1_Sam']
,[10,'撒母耳記下','撒下','2_Sam']
,[11,'列王紀上','王上','1_Kin']
,[12,'列王紀下','王下','2_Kin']
,[13,'歷代誌上','代上','']
,[14,'歷代誌下','代下','']
,[15,'以斯拉記','拉','Ezra']
,[16,'尼希米記','尼','Neh']
,[17,'以斯帖記','斯','Esth']
,[18,'約伯記','伯','Job']
,[19,'詩篇','詩','']
,[20,'箴言','箴','Prov']
,[21,'傳道書','傳','Eccl']
,[22,'雅歌','歌','Song']
,[23,'以賽亞書','賽','Is']
,[24,'耶利米書','耶','Jer']
,[25,'耶利米哀歌','哀','Lam']
,[26,'以西結書','結','Ezek']
,[27,'但以理書','但','Dan']
,[28,'何西阿書','何','Hos']
,[29,'約珥書','珥','Joel']
,[30,'阿摩司書','摩','Amos']
,[31,'俄巴底亞書','俄','Obad']
,[32,'約拿書','拿','Jon']
,[33,'彌迦書','彌','Mic']
,[34,'那鴻書','鴻','Nah']
,[35,'哈巴谷書','哈','Hab']
,[36,'西番雅書','番','Zeph']
,[37,'哈該書','該','Hag']
,[38,'撒迦利亞書','亞','Zech']
,[39,'瑪拉基書','瑪','Mal']
,[40,'馬太福音','太','Matt']
,[41,'馬可福音','可','Mark']
,[42,'路加福音','路','Luke']
,[43,'約翰福音','約','John']
,[44,'使徒行傳','徒','Acts']
,[45,'羅馬書','羅','Rom']
,[46,'哥林多前書','林前','1_Cor']
,[47,'哥林多後書','林後','2_Cor']
,[48,'加拉太書','加','Gal']
,[49,'以弗所書','弗','Eph']
,[50,'腓立比書','腓','Phil']
,[51,'歌羅西書','西','Col']
,[52,'帖撒羅尼迦前書','帖前','1_Thess']
,[53,'帖撒羅尼迦後書','帖後','2_Thess']
,[54,'提摩太前書','提前','1_Tim']
,[55,'提摩太後書','提後','2_Tim']
,[56,'提多書','多','Titus']
,[57,'腓利門書','門','Philem']
,[58,'希伯來書','來','Heb']
,[59,'雅各書','雅','James']
,[60,'彼得前書','彼前','1_Pet']
,[61,'彼得後書','彼後','2_Pet']
,[62,'約翰一書','約壹','1_John']
,[64,'約翰二書','約貳','2_John']
,[63,'約翰三書','約参','3_John']
,[65,'猶大書','猶','Jude']
,[66,'啟示錄','啟','Rev']];

var weburl='http://a2z.fhl.net/bible/';
var e2c={},c2e={},txt={},n=0;
var webpageGet=function(weburl,errorPress,webpageProcess){
	request({url:weburl,encoding:null}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var html=body.toString();
			webpageProcess(html);
		} else {
			errorPress(error);
		}
	});
}
var bookG=/(\/php\/pcom\.php\?book=3&engs=([^"]+))">([^<]+)/g;
var bookP=/(\/php\/pcom\.php\?book=3&engs=([^"]+))">([^<]+)/;
webpageGet(weburl,function(error){console.log(error);},function(html){
	var file='a2z_bible.html';
	console.log(weburl+' as '+file,html.length);
	fs.writeFileSync(file,html);
	var page_urls=html.match(bookG).map(function(url){
		var page_url='http://a2z.fhl.net'+url.match(bookP)[0];
		return page_url;
	});
	var n=html.match(bookG).length;
	console.log(n,'more web pages');
//	page_urls.forEach(function(page_url,i){ console.log(page_url,i+1); });
	var done=function(){
		booknames.forEach(function(fld){
			console.log(fld[0],fld[1],fld[2],fld[3]);
		})
	}
	var i=0;
	var next=function(){
		if (i>=page_urls.length) { done(); return; } 
		var page_url=page_urls[i++];
		console.time('wget'+i);
		var m=page_url.match(bookP);
	//	console.log(page_url,bookP)
	//	console.log('try',i,page_url,m);
		var m1=m[1], m2=m[2], m3=m[3];
		var page_url='http://a2z.fhl.net'+m1;
	  	var book=m2.replace(/\+/,'_');
	  	e2c[book]=m3, c2e[m3]=book;
	  	var file='a2z_'+book+'.html';
		webpageGet(page_url,function(error){console.log(error);},function(html){
			console.timeEnd('wget'+i);
			fs.writeFileSync(file,html);
			txt[book]=html;
			console.log(page_url+' as '+file,html.length,m3,i);
			setTimeout(next,0);
		});
	}
	next();
	/*
	html.replace(booksG,function(_,m1,m2,m3){
		var page_url='http://a2z.fhl.net'+m1;
	  	var book=m2.replace(/\+/,'_');
	  	e2c[book]=m3, c2e[m3]=book;
	  	var file='a2z_'+book+'.html';
		webpageGet(page_url,function(error){console.log(error);},function(html){
			console.log(page_url+' as '+file,html.length,m3,n--);
			fs.writeFileSync(file,html);
			txt[book]=html;
  			if(n == 0){
				var lst=Object.keys(e2c).sort();
				lst.forEach(function(e,i){
					console.log(i,e,e2c[e]);
				})
				lst=Object.keys(c2e).sort();
				lst.forEach(function(c,i){
					console.log(i,c,c2e[c]);
				})
  			}
		});
	});
	*/
});
/*
request({url:weburl,encoding:null}, function (error, response, body) {
	if (!error && response.statusCode == 200) {
	  var html=body.toString();
	  var file='a2z_bible.html';
	  console.log(weburl+' as '+file,html.length);
	  fs.writeFileSync(file,html);
	  var booksG=/(\/php\/pcom\.php\?book=3&engs=([^"]+))">([^<]+)/g;
	  n=html.match(booksG).length;
	  console.log(n,'matched',booksG);
	  html.replace(booksG,function(_,m1,m2,m3){
	  	var page_url='http://a2z.fhl.net'+m1;
	  	var book=m2.replace(/\+/,'_');
	  	e2c[book]=m3, c2e[m3]=book;
	  	var file='a2z_'+book+'.html';
	//	console.log(page_url+' as '+file);
	//	request(page_url).pipe(fs.createWriteStream(file));
	  	request({url:page_url,encoding:null}, function (error, response, body) {
	  		if (!error && response.statusCode == 200) {
	  			var html=body.toString();
	  			console.log(page_url+' as '+file,html.length,m3,n--);
	  			fs.writeFileSync(file,html);
	  			txt[book]=html;
	  			if(n == 0){
					var lst=Object.keys(e2c).sort();
					lst.forEach(function(e,i){
						console.log(i,e,e2c[e]);
					})
					lst=Object.keys(c2e).sort();
					lst.forEach(function(c,i){
						console.log(i,c,c2e[c]);
					})
	  			}
	  		} else {
	  			console.log(error);
	  		}
	  	})
	  });
	} else {
	  console.log(error);
	}
})
*/
/* 03. stream all .zip to be local
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
*/
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