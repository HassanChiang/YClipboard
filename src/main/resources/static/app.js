var stompClient = null;

function setConnected(connected) {
    $("#connect").prop("disabled", connected);
    $("#disconnect").prop("disabled", !connected);
    if (connected) {
        $("#conversation").show();
    }
    else {
        $("#conversation").hide();
    }
    $("#greetings").html("");
}
let intervalAA;
let lastContent;

function connect() {
    var socket = new SockJS('/y-clipboard');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        setConnected(true);
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/clipboardList', function (greeting) {
            appendMsg(JSON.parse(greeting.body).content);
        });

        intervalAA = setInterval(function (){
            navigator.clipboard.readText()
                .then(text => {
                    if(lastContent != text) {
                        stompClient.send("/app/receiveContent", {}, JSON.stringify({'content': text}));
                        lastContent = text;
                    }
                })
                .catch(err => {
                    console.error('Failed to read clipboard contents: ', err);
                });
        }, 1000);
    });
}

function disconnect() {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    setConnected(false);
    console.log("Disconnected");
    if(intervalAA){
        clearInterval(intervalAA);
    }
}

function appendMsg(message) {
    $("#clipboardDiv").append("<tr><td>" + message + "</td> </tr>");
}

$(function () {
    $("form").on('submit', function (e) {
        e.preventDefault();
    });
    $( "#connect" ).click(function() { connect(); });
    $( "#disconnect" ).click(function() { disconnect(); });
});