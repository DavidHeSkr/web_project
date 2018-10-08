var close = false;

function unseeThePopUpWindow() {
  let create = document.getElementById('p233');
  console.log(create);
  if(create.style.color == "red"){
    create.style.color = "black";
  }
  else{
    create.style.color = "red";
  }
  create.innerHTML = "gggg";
}

class target1 {

  constructor(text, element){
    this.text = text;
    this.element = element
    //console.log(this.element);
    this.innertext = this.element.innerHTML;
    //console.log(this.innertext);
    //console.log(this.text);
  }

  click(){
    var text = this.text;
    this.element.addEventListener("click", function(){
      this.innerHTML = text;
    });
  }

  hover(){
    var text = this.text;
    var innertext = this.innertext;
    this.element.addEventListener("mouseover", function(){
      this.innerHTML = text;
    });
    this.element.addEventListener("mouseout", function(){
      this.innerHTML = innertext;
    });
  }
}

class target2 {

  constructor(element){
    this.element = element
    this.innertext = this.element.innerHTML;
  }

  hover(){
    var open = true;
    var refreshIntervalId;
    this.element.addEventListener("mouseover", function(){
      //this.style.color = "red";
      //this.style.backgroundColor = "gray";
      this.style.animation = "animation 1s infinite"
      //var backgroundColor = this.style.backgroundColor;
      var object = this
      open = true;
      //terminate the animation after 1 second
      refreshIntervalId = setInterval(function(){
        //if(open){
        object.style.animation = ""
        object.style.backgroundColor = "gray"
        open = false;
        //  }
      }, 1000);
    });
    this.element.addEventListener("mouseout", function(){
      //this.style.color = "black";
      this.style.animation = ""
      this.style.backgroundColor = "white";
      open = false;
      clearInterval(refreshIntervalId);
    });
  }
}

/*
var target1 = new target("skr", document.getElementById("p1"));
target1.hover();
target1.click();
var target1 = new target("skr", document.getElementById("p2"));
target1.hover();
target1.click();
var target1 = new target("skr", document.getElementById("p3"));
target1.hover();
target1.click();
*/

var divs = document.getElementsByTagName('div');

// find out all those divs having class C
for(var i = 0; i < divs.length; i++)
{
  if (divs[i].getAttribute('class') === "col-sm-4")
  {
    //divs[i].style.border= "1px solid";
    // put the divs having class C inside container div
    console.log(divs[i]);
    var b = new target1("Skr~", divs[i]);
    var c = new target2(divs[i])
    b.hover();
    c.hover();
  }
}


var mySelf = " Hey there, I am David He, grown up in China, and came to australia for uni when I was 18. Major in Computing";
var myAchivement = "These are the apps I have done:";
var myFuturePlan = "I am going to do these in the future";

var p1 = document.getElementById("p1")
var p2 = document.getElementById("p2")
var p3 = document.getElementById("p3")
var inflater = document.getElementById("inflated")
var defaultText = document.createElement("div")
inflater.innerHTML = mySelf;

var loveMe = document.getElementById("loveMe")

var fuckMe = document.getElementById("fuckMe")

p1.addEventListener("mouseover", function(){
  //var para = document.createElement("div")
  //var node = document.createTextNode(mySelf);
  //para.appendChild(node);
  //let body = document.body;
  //body.appendChild(para);
  //inflater.innerHTML = splitSentence(mySelf);
  splitSentence(inflater, mySelf);
})

p2.addEventListener("mouseover", function(){
  //inflater.innerHTML = myAchivement;
  splitSentence(inflater, myAchivement);
  var line_breaker = document.createElement("br")
  inflater.appendChild(line_breaker);
  var superLink = document.createElement("a");
  superLink.setAttribute('href', "https://play.google.com/store/apps/details?id=com.davidheskr.votingmachine");
  superLink.innerHTML = "Voting Machine"
  inflater.appendChild(superLink);
})

p3.addEventListener("mouseover", function(){
  //inflater.innerHTML = myFuturePlan;
  splitSentence(inflater, myFuturePlan);
})

function splitSentence(inflater, string){
  var res = string.split(" ");
  var i;
  inflater.innerHTML = ""
  for(i=0;i<res.length;i++){
    var wordTemplate = document.createElement("span")
    //wordTemplate.innerHTML = res[i] + " "
    wordTemplate.innerHTML = res[i]
    var hover = new target2(wordTemplate);
    hover.hover();
    var space = document.createElement("span")
    space.innerHTML = " "
    inflater.appendChild(wordTemplate)
    inflater.appendChild(space)
  }
}

function getData(){

  var inflated = document.getElementById("comment_inflated");
  var textHtml = ""
  if(close){
    inflated.innerHTML = textHtml;
    close = false;
    return;
  }
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var responseText = this.responseText;
      console.log("responseText is:" + responseText);
      //var comment_array = responseText.split("/")
      var comment_array = JSON.parse(responseText);
      comment_array.forEach(function(comment){
        textHtml = textHtml + "<div class = author>Author: " + comment.author + "</div>";
        textHtml = textHtml + "<div class = title>Title: " + comment.title + "</div>";
        textHtml = textHtml + "<div class = content>" + comment.content + "</div>";
        textHtml += "<br><br><br>"
      })
      close = true;
      inflated.innerHTML = textHtml;
    }
  };
  xmlhttp.open("GET", "/get-data", true);
  xmlhttp.send();
}

function react(input){
  var path = ""
  var response = ""

  if(input == "love"){
    path = "/loveme"
    responseHead = "I have been loved "
    responseEnd = " times, Skr~,\n thank you bro!!"
  }

  else{
    path = "/fuckme"
    responseHead = "I have been fucked "
    responseEnd = " times, Skr~,\n sorry about that, I will do better next time!!"
  }

  var inflated = document.getElementById("inflater2");
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var responseText = this.responseText;
      inflated.innerHTML = responseHead + responseText + responseEnd;
    }
  };
  xmlhttp.open("GET", path, true);
  xmlhttp.send();
}

function submit_comment(title, content, author){
  console.log("666666666");
  console.log(title + content + author);
}
var request = new XMLHttpRequest();
var url = "/insert";
request.onreadystatechange = function () {
  console.log("status: " + this.readyState + ";;;" + this.status);
  if (this.readyState == 4 && this.status == 200) {
    //var jsonData = JSON.parse(this.response);
    console.log("response:::: "+ this.responseText);
    getData()
  }
};

contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", function(event) {
  event.preventDefault();
  request.open("POST", url, true);
  request.setRequestHeader("Content-Type", "application/json");
  var title =  document.getElementById("title").value;
  var content = document.getElementById("content").value;
  var author = document.getElementById("author").value;
  if(test(title, content, author)){
    var data = JSON.stringify({"title": title, "content": content, "author": author});
    request.send(data);
    document.getElementById("title").value = ""
    document.getElementById("content").value = ""
    document.getElementById("author").value = ""
  }
});

var origionalText = ""
function mouseDown(elem){
  origionalText = elem.value;
  elem.style.backgroundColor = "gray"
  console.log(elem.innerHTML);
  elem.value = "Skr~"
}

function mouseUp(elem){
  elem.value = origionalText;
  elem.style.backgroundColor = "white"
}

function test (title, content, author){
  if(title == "" || content == "" || author == ""){
    if(title == ""){
      alert("please fill in the title");
      return false;
    }
    if(content == ""){
      alert("please fill in the content");
      return false;
    }
    if(author == ""){
      alert("please fill in the author");
      return false;
    }
  }
  return true;
}
