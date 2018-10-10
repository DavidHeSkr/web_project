var restaurantID = document.getElementById("id").innerHTML
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

var table_open = true;
function new_item(){
  var table_inflater = document.getElementById("table_inflater");
  if(table_open){
    var innerHTML = "<form class = 'col-sm-6' id = 'inflated'>" +
    "<label class = 'col-sm-4' for = 'name'>Name</label>" +
    "<input class = 'col-sm-6' type='text' id = 'name' name = 'name'>" +
    "<label class = 'col-sm-4' for = 'ingredients'>Ingredients</label>" +
    "<input class = 'col-sm-6' type='text' id = 'ingredients' name = 'ingredients'>" +
    "<label class = 'col-sm-4' for = 'price'>Price</label>" +
    "<input class = 'col-sm-6' type= 'text' id = 'price' name = 'price'>" +
    "<input class = 'col-sm-6' style= 'border: 3px solid green' type= 'submit' id = 'submit' value = 'submit'>" +
    "</form>"

    table_inflater.innerHTML = innerHTML;
    var inflatedForm = document.getElementById("inflated")
    inflatedForm.addEventListener("submit", function(event) {
      var request = new XMLHttpRequest();
      request.onreadystatechange = function () {
        console.log("status: " + this.readyState + ";;;" + this.status);
        if (this.readyState == 4 && this.status == 200) {
          //var jsonData = JSON.parse(this.response);
          console.log("response:::: "+ this.response);
        }
      };
      event.preventDefault();
      var url = "/insert_item"
      request.open("POST", url, true);
      request.setRequestHeader("Content-Type", "application/json");
      var title =  document.getElementById("name").value;
      var content = document.getElementById("ingredients").value;
      var author = document.getElementById("price").value;
      if(test(title, content, author)){
        var data = JSON.stringify({"name": title, "ingredients": content, "price": author});
        request.send(data);
        document.getElementById("name").value = ""
        document.getElementById("ingredients").value = ""
        document.getElementById("price").value = ""
      }
    });
    table_open = false;
  }
}

function show_items(){
  var infalter = document.getElementById('table_inflater');
  if(table_open){
    var request = new XMLHttpRequest();
    var url = "/get-data/" + restaurantID
    request.open("GET",url,true);
    var textHtml = ""
    request.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var responseText = this.responseText;
        console.log("responseText is:" + responseText);
        //var comment_array = responseText.split("/")
        var item_array = JSON.parse(responseText);
        item_array.forEach(function(item){
          textHtml = textHtml + "<div class = author>Name: " + item.name + "</div>";
          textHtml = textHtml + "<div class = title>ingredients: " + item.ingredients + "</div>";
          textHtml = textHtml + "<div class = content>price:" + item.price + "</div>";
          textHtml = textHtml + "<img src = " + "/images/"+restaurantID + "/" + item.name +".png" + " width='200' height='333'>";
          textHtml += "<br><br><br>"
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
var last_orders = []
var Orders = document.getElementById('received_orders');
//Orders.addEventListener("click", listen_to_orders);
setInterval(listen_to_orders,3000);
function listen_to_orders(){
  var url = "/listen_orders/"+restaurantID
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var received_orders = this.responseText;
      var parsed_orders = JSON.parse(received_orders);
      var increased_length = parsed_orders.length - last_orders.length;
      if(parsed_orders.length > last_orders.length){
      //  console.log("parsed_orders:"+parsed_orders);
      //  parsed_orders.forEach(function(order_list){
        for (var i = last_orders.length; i < parsed_orders.length; i++){
          var order_list = parsed_orders[i];
          var parsed_order_list = JSON.parse(order_list)
          console.log("order_list:"+parsed_order_list);
          Orders.innerHTML = Orders.innerHTML + "<br>new order<br>";
          Orders.innerHTML = Orders.innerHTML + "the table is "+ parsed_order_list.table + "<br>";
          parsed_order_list.order.forEach(function(order){
            console.log("order:"+order);
            Orders.innerHTML = Orders.innerHTML + "name:    " + order.name
            Orders.innerHTML = Orders.innerHTML + "price:   " + order.price + "<br>"
          })
          //Orders.innerHTML = Orders.innerHTML + + "<br>";
        }
        last_orders = parsed_orders;
      }
    }
  };
  request.send();
}
