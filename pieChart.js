

function log(piechart) {
  var ctx = document.getElementById("chart").getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [""],
      datasets: [{
        backgroundColor: [
          "#ff0000",
          "#bf4000",
          "#808000",
          "#40bf00",
          "#00ff00"
        ],
        data: [1, 2, 3, 4, 5]
      }]
    }
  });
  //send http request
  console.log(piechart);
}
module.exports = log;
