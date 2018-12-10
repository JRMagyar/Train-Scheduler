window.onload = function(){
//document ready

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDjebO6kUWFDEJ05AYQPHFTfymHmjdRId8",
    authDomain: "train-scheduler-6ac08.firebaseapp.com",
    databaseURL: "https://train-scheduler-6ac08.firebaseio.com",
    projectId: "train-scheduler-6ac08",
    storageBucket: "train-scheduler-6ac08.appspot.com",
    messagingSenderId: "154981265907"
  };
  firebase.initializeApp(config);
  var database = firebase.database();

//When user hits submit
$("#add-train").on("click", function(event){
    event.preventDefault();
    var newTrain = $("#train-name-input").val().trim();
    var newDestination = $("#train-destination-input").val().trim();
    var newTime = $("#train-time-input").val();
    var newFreq = $("#train-freq-input").val();

    database.ref().push({
        trainName: newTrain,
        trainDestination: newDestination,
        trainTime: newTime,
        trainFreq: newFreq,
    })
})

//calls database when new info added
database.ref().on("child_added", function(snapshot){
    //create new row and add info from database
    newRow = $("<tr>");
    newRow.append("<td>" + snapshot.val().trainName + "</th>");
    newRow.append("<td>" + snapshot.val().trainDestination + "</th>");
    newRow.append("<td>" + snapshot.val().trainFreq + "</th>");
    
    //calculate next arrival
    //add (frequency) minutes to the start time until it is past current time. If it is past midnight next train time is first run time.
    var start = snapshot.val().trainTime;
    var freq = snapshot.val().trainFreq
    var now = moment().format("HH:mm")
    var next = "";
    // console.log(start)
    // console.log(freq)
    // console.log(now)
   
    //calculate minutes away
    //convert first time and current time to minutes. subtract first from next and %frequency
    var timeDiff = moment().diff(moment(start, "HH:mm"), "minutes")

    if(timeDiff < 0){
        next = moment(start, "HH:mm").format("h:mm a")
        minutesUntil = moment(start, "HH:mm").diff(moment(), "minutes")
    }
    else{
        minutesSince = timeDiff % freq;
        minutesUntil = freq - minutesSince
        next = moment().add(minutesUntil, "m").format("h:mm a");
    }
    if(minutesUntil >= 60){
        a = minutesUntil
        var hours = Math.trunc(a/60);
        var minutes = a % 60;
        console.log(hours +":"+ minutes)
        minutesUntil = hours + " hr " + minutes + " min"
    }
    else{
        minutesUntil = minutesUntil + " min"
    }

    newRow.append("<td>" + next + "</td>");
    newRow.append("<td>" + minutesUntil + "</td>")

    $("#schedule").append(newRow)
})




}

