const connection = new signalR.HubConnectionBuilder()
  .withUrl("https://localhost:7091/offers")
  .configureLogging(signalR.LogLevel.Information)
  .build();

const url = "https://localhost:7091/";
async function start() {
  try {
    await connection.start();

    const element = document.querySelector("#offerValue");
    $.get(url + "api/Offer", function (data, status) {
      console.log(data);
      element.innerHTML = "Begin price : " + data + "$";
    });

    console.log("SignalR Started");
  } catch (err) {
    console.log(err);
    setTimeout(() => {
      start();
    }, 5000);
  }
}

start();

let element = document.querySelector("#info");
connection.on("ReceiveConnectInfo", (message) => {
  // element.innerHTML=message;
});

let element2 = document.querySelector("#disconnectinfo");
connection.on("DisconnectInfo", (message) => {
  //element2.innerHTML=message;
});

connection.on("ReceiveMessage",(message,data)=>{
    let element=document.querySelector("#responseOfferValue");
    element.innerHTML=message+data+"$";
})

connection.on("ReceiveWinner",(message,data)=>{
  let element=document.querySelector("#winner");
  element.innerHTML=message+data+"$";
})
var check = ""
var timer = null;
var stopTime = null;

var myTime = 10;

connection.on("ReceiveTime",(data)=>{
  
  if(data == "stop")
  {
    let time = document.getElementById("timer");
    let btn = document.querySelector("#bidBtn");
    clearInterval(timer);
    clearTimeout(stopTime);
    myTime = 10;
    time.innerHTML = myTime;
    btn.disabled = false;
  }
})

connection.on("ReceiveStop",(data)=>{
  
  if(data == "stop")
  {
    let btn = document.querySelector("#bidBtn");
    btn.disabled = true;
  }
});

async function IncreaseOffer() {
  let user = document.querySelector("#user");
  let btn = document.querySelector("#bidBtn");

  $.get(url + "api/Offer/Increase?data=100", function (data, status) {
      $.get(url + "api/Offer", function (data, status) {
        connection.invoke("SendMessage", user.value);
        connection.invoke("SendTime");
        btn.disabled = true;
      });
    });
    
    timer =  setInterval(() => {
      let time = document.getElementById("timer");
      myTime-=1;
      time.innerHTML = myTime;
  }, 1000);

  stopTime = setTimeout(() => {
    connection.invoke("SendWinner",user.value);
    connection.invoke("SendStop");
    btn.disabled = true;
    clearTimeout(timer);
  }, 10000);

}