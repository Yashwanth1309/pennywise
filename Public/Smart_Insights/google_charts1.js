google.charts.load('current', {packages: ['corechart', 'line']});
google.charts.setOnLoadCallback(drawBackgroundColor);

function drawBackgroundColor() {
      var data = new google.visualization.DataTable();
      data.addColumn('number', 'X');
      data.addColumn('number', 'Amount');

      data.addRows([
        [1, 0], [2, 500], [3, 750], [4, 800],[5, 1000],[6, 1200],[7, 1500],[8, 2500],[9, 3000],[10, 1000],[11, 2500],[12, 2300]
      ]);

      var options = {
        hAxis: {
          title: 'Month'
        },
        vAxis: {
          title: 'Spendings in Rs'
        },
        backgroundColor: '#f5f5f5'
      };

      var chart = new google.visualization.LineChart(document.getElementById('linear_1'));
      chart.draw(data, options);
    }
