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
//  if(table_open){
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
          textHtml = textHtml + "<li class = item>"
          textHtml = textHtml + "<div class = name>Name: " + item.name + "</div>";
          textHtml = textHtml + "<div class = ingredients>ingredients: " + item.ingredients + "</div>";
          textHtml = textHtml + "<div class = price>price:" + item.price + "</div>";
          textHtml = textHtml + "<img class = image src = " + "/images/"+restaurantID + "/" + item.name +".png" + " width='200' height='200'>";
          textHtml = textHtml + "</li>"
          textHtml += "<br>"
        })
        infalter.innerHTML = textHtml;
      }
    };
    request.send();
    table_open = false;
//  }
//  else{
//    infalter.innerHTML = ""
//    table_open = true;
//  }
}

var inflater_ = document.getElementById("infalter");

function column_1(){
  inflater_.innerHTML = ""
  inflater_.appendChild(Orders)
}

function column_2(){
  inflater_.innerHTML = "<ol id = 'table_inflater' type = '1'></ol>"
  show_items();
}

function column_3(){
  inflater_.innerHTML = "<form action='/' method='post' enctype='multipart/form-data' id = 'submit_form'>" +
    "<label class = 'col-sm-4' for = 'name'>Name</label>" +
    "<input class = 'col-sm-6' type='text' id = 'name' name = 'name' required>" +
    "<label class = 'col-sm-4' for = 'ingredients'>Ingredients</label>" +
    "<input class = 'col-sm-6' type='text' id = 'ingredients' name = 'ingredients' required>" +
    "<label class = 'col-sm-4' for = 'price'>Price</label>" +
    "<input class = 'col-sm-6' type= 'text' id = 'price' name = 'price' required>" +
    "<input type='file' name='avatar' value = 'pick up an image' required>" +
    "<input class = 'col-sm-6' style= 'border: 3px solid green' type= 'submit' id = 'submit' value = 'submit'>" +
  "</form>"
  change_action();
}

function change_action(){
  var form = document.getElementById('submit_form');
  form.action = document.getElementById('upload').innerHTML;
}



var last_orders = []
//var Orders = document.getElementById('received_orders');
//Orders.addEventListener("click", listen_to_orders);
var Orders = document.createElement('ol');
Orders.setAttribute('type','1');
listen_to_orders();
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
          var parsed_order_list = JSON.parse(order_list);
          console.log("order_list:"+parsed_order_list);

          var order = document.createElement("li");
          order.className = "new_order"
            var div_new_order = document.createElement("div");
            //div_new_order.type.color = "gray";
              var new_order = document.createTextNode("New Order")
            div_new_order.appendChild(new_order);
            var div_table_number = document.createElement("div")
            //div_table_number.type.color = "blue"
              var number = "From table: "+ parsed_order_list.table;
              var table_number = document.createTextNode(number);
            div_table_number.appendChild(table_number);
            div_table_number.className = "table_number"
          order.appendChild(div_new_order);
          order.appendChild(div_table_number);

          //Orders.innerHTML = Orders.innerHTML + "<li class = order>"
          //Orders.innerHTML = Orders.innerHTML + "<div style = 'color : gray' >new order</div>";
          //Orders.innerHTML = Orders.innerHTML + "<div style = 'color : blue' > the table is "+ parsed_order_list.table + "</div>";
          //Orders.innerHTML += "<ol class = content type = '1'>"
          var ol_content = document.createElement("ol")
          ol_content.className = "content"
          parsed_order_list.order.forEach(function(order){
            //console.log("order:"+order);
            //Orders.innerHTML = Orders.innerHTML + "<li>name:    " + order.name + "     price:   " + order.price + "</li>"
            var each_order = document.createElement("li")
                var each_content = "name:    " + order.name + "     price:     " + order.price
              var each_content_text = document.createTextNode(each_content);
            each_order.appendChild(each_content_text);
            ol_content.appendChild(each_order);
          })
          order.appendChild(ol_content);
          Orders.appendChild(order);
          //for(var i = 0; i < parsed_order_list.order.length; i++ ){
          //  Orders.innerHTML = Orders.innerHTML + "<li>name:    " + parsed_order_list.order[i].name + "     price:   " + parsed_order_list.order[i].price + "</li>"
          //}
          //Orders.innerHTML += "</ol></li>"
          //Orders.innerHTML = Orders.innerHTML + + "<br>";
        }
        console.log(Orders);
        last_orders = parsed_orders;
      }
    }
  };
  request.send();
}

inflater_.appendChild(Orders);
