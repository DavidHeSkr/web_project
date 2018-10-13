var table_open = true;
var total_price = 0;
var restaurantID = document.getElementById("restaurantID").innerHTML;
var tableID = document.getElementById("tableID").innerHTML;
function show_items(){
  var infalter = document.getElementById('table_inflater');
  if(table_open){
    var request = new XMLHttpRequest();
    var url = "/get-data/" +restaurantID;
    request.open("GET",url,true);
    var textHtml = ""
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var responseText = this.responseText;
        console.log("responseText is:" + responseText);
        //var comment_array = responseText.split("/")
        var item_array = JSON.parse(responseText);
        item_array.forEach(function(item){
          textHtml = textHtml + "<li class = item>"
          textHtml = textHtml + "<div class = name>Name:" + item.name + "</div>";
          textHtml = textHtml + "<div class = ingredients>Ingredients:" + item.ingredients + "</div>";
          textHtml = textHtml + "<div class = price>Price:" + item.price + "</div>";
          textHtml = textHtml + "<img class = image src = " + "/images/"+restaurantID + "/" + item.name +".png" + " width='200' height='200'>";
          textHtml = textHtml + "<button onclick = 'addorder(this)' style = 'width: 40%; height:40px; color: green; font-size : 130%; border: 3px solid green;' >" + "Order This" + "</button>";
          textHtml = textHtml + "</li>"
          textHtml += "<br>"
        })
        infalter.innerHTML = textHtml;
      }
    };
    request.send();
    table_open = false;
  }
  else{
    infalter.innerHTML = ""
    table_open = true;
  }
}

function addorder(element){
  var nodeArray = element.parentNode.childNodes;
  var name = nodeArray[0].innerHTML;
  var ingredients = nodeArray[1].innerHTML;
  var price = nodeArray[2].innerHTML;
  order.addInner("<div class = order>" + "<div class = name>" + name + "</div>" + "<div class =ingredients>" + ingredients + "</div>"+"<div class =price>" + price+"</div>" + " <button onclick = 'deleteThis(this)' style = 'width: 20%; height:30px; border: 2px solid red; color: red'> DELETE </button><br></div>");
  total_price += parseFloat(get_price(price));
  update_price();
  console.log(order);
}

var order = document.getElementById("orders");
order.addInner = function(input){
  this.innerHTML += input;
}

function deleteThis(element){
  var parentNode = element.parentNode
  var price = parentNode.childNodes[2].innerHTML
  console.log("price: " + price);
  total_price -= parseFloat(get_price(price));
  var grandparentNode = element.parentNode.parentNode
  grandparentNode.removeChild(parentNode);
  update_price();
}


function get_price(string){
  return string.substring(string.indexOf(":")+1)
}


function update_price(){
  document.getElementById("total_price").innerHTML = "Total Price:" + total_price;
}

function submit_order(){
  //the list for all items for one order
  var json_list = []
  console.log(order.childNodes);
  //convert the html to json
  order.childNodes.forEach(function(child){
    console.log(child);
    console.log(child.childNodes[0].innerHTML);
    console.log(child.childNodes[2].innerHTML);
    var json_item = {
      //get intened intent of html element
      name : get_price(child.childNodes[0].innerHTML),
      price : get_price(child.childNodes[2].innerHTML)
    }
    json_list.push(json_item)
  })
  var request = new XMLHttpRequest();
  var url = "/send_order/" + restaurantID;
  if(json_list.length == 0){
    alert("please order something before you submit the order!")
  }
  else{
    request.open("POST",url,true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        alert("request has been sent!")
      };
    };
    //order : all items for this order, table : the tableID
    var submit = { order : json_list, table : tableID }
    var parsed_submit = JSON.stringify(submit);
    request.send(parsed_submit);
    order.innerHTML = ""
    document.getElementById('total_price').innerHTML = ""
  }
};
