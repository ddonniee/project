var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateModeSelector() {
 return `
 <a href="index.html"><img class="main" src="img/duck.png"></a></span>
  
 <section class="category">
     <button class="btn"><a href="data/daily">daily</a></button>
     <button class="btn"><a href="data/weekly">weekly</a></button>
     <button class="btn"><a href="data/mon thly">monthly</a></button>
  <button class="btn"><a href="data/yearly">yearly</a></button>
     <button class="btn"><a href="data/bucketlist">bucket list</a></button>
 </section>

 <form name="lists" class="info">
  <p><input id="Title" type="text" name="title" placeholder="add things to do..."></p>
  <p><textarea id="Description" name="description"></textarea></p>
   <input type="radio" class="choice" name="selector" value="daily" id="choice-1" checked>
     <label for="daily">D</label>
   <input type="radio" class="choice" name="selector" value="weekly" id="choice-2">
    <label for="weekly">W</label>
   <input type="radio" class="choice" name="selector" value="monthly" id="choice-3">
    <label for="monthly">M</label>
   <input type="radio" class="choice" name="selector" value="yearly" id="choice-4">
    <label for="yearly">Y</label>
   <input type="radio" class="choice" name="selector" value="bucketlist" id="choice-5">
    <label for="bucketlist">Bucket</label>
    <button id="add" onclick="getInformation()">add</button>
 </form>
 `;
}

function templateHTML(address, title, description, list) {
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="design.css">
  <title>Planner</title>
  
</head>
<body>
  
  <a href="index.html"><img class="main" src="img/blue.png"></a></span>
  
  templateModeSelector();

  <script>
    const add=document.querySelector('#add');
    
    add.onclick = function () {
    
    const rbs=document.querySelectorAll('input[name="selector"]');
    let selectedOne;

    for(const rb of rbs) {
      if(rb.checked) {
        selectedOne=rb.value;

        break;
      }
    }
     return selectedOne;
    };

    var each_title;
    var each_description;

    function getInformation() {
       each_title = document.getElementById("Title").value;
       each_description= document.getElementById("Description").value;

      return each_title,each_description;
    }

    var temp = add.onclick();

    function add_process(selectedOne,each_title,each_description) {
      const fs=require('fs');
      fs.writeFile(${address}/${title},${description},'utf-8', function(err) {
        if(err) {
          return console.log("Error!");
        } 
        fs.readfile('data/unit', (err,data) =>{
          if(err) throw err;
          console.log(data);
        });
      });
      
    };
  </script>
  
</body>
</html>
    `;
    
}

function templateList(filelist) {
    var list = '<li>';
    var i = 0;

    while(i<filelist.length) {
        list = list+filelist[i];
        i = i+1;
    }
    list = list+'</ul>';
    return list;
}

var app = http.createServer(function (req,res) {
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    // pathnam이 유효하나 queryData.id가 존재하지 않을 때
    if(pathname=='/') {
        if(queryData.id===undefined) {
            var address = 'homepage';
            var title = 'Welcome';
            var description = 'Hello Stranger :)';
            var lists = templateList('');
            var template = templateHTML(address, title, description,lists);

            res.writeHead(200);
            res.end(template);
        }else {
            fs.readdir(`./${title}`,function(err,filelist) {
                fs.readFile('./pathname/queryData.id','utf-8', function(err, filelist) {
                    var address = `${title}`;
                    var title = queryData.id;
                    var description = 'address/title';
                    var lists = templateList(filelist);
                    var template = templateHTML(address, title, 
                    `<h2>${address}</h2>${title}`,
                    `<p><a href="/create">create</a><p>
                     <a href="/update?id=${title}">update</a>
                     <form action ="delete_process" method="post">
                     <p><input type="hidden" name="id" value="${title},${description}"><p>
                     <input type="submit" value="delete">
                     </form>
                    ` //id 값을 선택한경우,,
                    );

                    res.writeHead(200);
                    res.end(template);
                });
            });
        }
    }else if(pathname==='/create') {
        fs.readdir(`./${title}`, function(err, filelist) {
            var address = `${title}`;
            var title = queryData.id;
            var lists = templateList(filelist);
            var template = templateHTML(address, title, 
                `
              <form action="create_process" class="info" method="post">
                <p><input id="Title" type="text" name="title" placeholder="add things to do..."></p>
                <p><textarea id="Description" name="description"></textarea></p>
                 <input type="radio" class="choice" name="selector" value="daily" id="choice-1" checked>
                   <label for="daily">D</label>
                  <input type="radio" class="choice" name="selector" value="weekly" id="choice-2">
                   <label for="weekly">W</label>
                  <input type="radio" class="choice" name="selector" value="monthly" id="choice-3">
                   <label for="monthly">M</label>
                  <input type="radio" class="choice" name="selector" value="yearly" id="choice-4">
                   <label for="yearly">Y</label>
                  <input type="radio" class="choice" name="selector" value="bucketlist" id="choice-5">
                   <label for="bucketlist">Bucket</label>
                   <button id="add" onclick="getInformation()">add</button>
              </form>
                `
                ,'');
            
            res.writeHead(200);
            res.end(template);
        });
    }else if(pathname==='/create_process') {
        var body='';
        req.on(data, function(data) {
            body = body+data;
        });
        req.on('end', function() {
            var post = qs.parse(body);
            var address = post.address;
            var title = post.title;
            var description = post.description;

            fs.writeFile(`${adress}/${title}`,'description','utf-8', function(err) {
                res.writeHead(302, {Location: `/?id=${address}`}); // 이건 다른 페이지로 보내
                res.end();
            });
        });
        
    }else if(pathname==='/update') {
        fs.readdir('./pathname', function(err, filelist) {
            var address = 'pathname';
            var title = queryData.id;
            var lists = templateList(filelist);
            var template = templateHTML(address, title, 
                `
              <form action="update_process" class="info" method="post">
                <p><input id="Title" type="hidden" name="title" placeholder="add things to do..."></p>
                <p><textarea id="Description" type="hidden" name="description"></textarea></p>
                  <input type="radio" class="choice" name="selector" value="daily" id="choice-1" checked>
                   <label for="daily">D</label>
                  <input type="radio" class="choice" name="selector" value="weekly" id="choice-2">
                   <label for="weekly">W</label>
                  <input type="radio" class="choice" name="selector" value="monthly" id="choice-3">
                   <label for="monthly">M</label>
                   <input type="radio" class="choice" name="selector" value="yearly" id="choice-4">
                   <label for="yearly">M</label>
                   <input type="radio" class="choice" name="selector" value="bucketlist" id="choice-5">
                   <label for="bucketlist">M</label>
             </form>
             `
             ,'');
        });
    }else if(pathname=='update_process') {
        fs.readdir('./pathname', utf-8, function(err, filelist){

        });
    }else if(pathname==='delete_process') {

    }else {
        res.writeHead(404);
        res.end();
    }
});
app.listen(3000);