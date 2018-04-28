  // Initialize Firebase
  var config = {
      apiKey: "AIzaSyCUhbbDdrWmx0fWfFS5MzqAks70Bgvsv2E",
      authDomain: "traintime-d23cc.firebaseapp.com",
      databaseURL: "https://traintime-d23cc.firebaseio.com",
      projectId: "traintime-d23cc",
      storageBucket: "traintime-d23cc.appspot.com",
      messagingSenderId: "149967884854"
  };
  firebase.initializeApp(config);



  var database = firebase.database();


  // Initial Values
  var trainName = "";
  var destination = "";
  var time = "";
  var freq = "";

  $("#submit-now").on("click", function (event) {
      event.preventDefault();



      var trainName = $("#train-name-input").val().trim();
      var destination = $("#destination-input").val().trim();
      var time = $("#time-input").val().trim();
      var freq = $("#freq-input").val().trim();

      var addTrain = {
          newTrain: trainName,
          newDestination: destination,
          newTime: time,
          newFreq: freq
      };

      database.ref().push(addTrain);

      //sanity check to make sure everything is added
      console.log(addTrain.newTrain);
      console.log(addTrain.newDestination);
      console.log(addTrain.newTime);
      console.log(addTrain.newFreq);

      alert("New Train and Time Added");


      $("#train-name-input").val("");
      $("#destination-input").val("");
      $("#time-input").val("");
      $("#freq-input").val("");
  });



  database.ref().on("child_added", function (childSnapshot, prevChildKey) {

      var trainNameData = childSnapshot.val().newTrain;
      var destinationData = childSnapshot.val().newDestination;
      var frequencyData = childSnapshot.val().newFreq;
      var firstTrainTimeData = childSnapshot.val().newTime;

      var timeArr = firstTrainTimeData.split(":");
      var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]); // this make an actual "moment" out of the time
      var maxMoment = moment.max(moment(), trainTime);
      console.log(maxMoment);
      var tMinutes;
      var tArrival;

      // If the first train is later than the current time, sent arrival to the first train time
      // keep this here in case you need to ref back to how max works https://momentjs.com/docs/#/get-set/max/
      if (maxMoment === trainTime) {
          tArrival = trainTime.format("hh:mm A");
          tMinutes = trainTime.diff(moment(), "minutes");
      } else {


          var differenceTimes = moment().diff(trainTime, "minutes");
          var tRemainder = differenceTimes % frequencyData;
          tMinutes = frequencyData - tRemainder;

          // To calculate the arrival time, add the tMinutes to the current time
          tArrival = moment().add(tMinutes, "m").format("hh:mm A");
      }
      var newRow = "<tr><td>" + trainNameData + "</td><td>" + destinationData + "</td><td>" + firstTrainTimeData + "</td><td>" +
          frequencyData + "</td><td>" + tArrival + "</td><td>" + tMinutes + "       <button class=btn-danger id=delete>Delete</button>" + "</td></tr>"
      $('.table').append(newRow)
      //at on  click of delete, removes all info from current <tr> on train-table 
      $('#train-table tr').on("click", function () {
          $(this).remove();
          return false;
      });
  });