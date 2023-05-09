google.charts.load('current', {'packages':['line']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {

var data = new google.visualization.DataTable();
data.addColumn('number', 'Day');
data.addColumn('number', 'Food & drinks');
data.addColumn('number', 'Bills & Utilities');
data.addColumn('number', 'Groceries');
data.addColumn('number', 'Travel');
data.addColumn('number', 'Medical');
data.addColumn('number', 'Others');

data.addRows([
[1, 22.6, 47.9, 11.2, 40.5, 18.7, 42.1],
  [2, 25.6, 49.9, 15.2, 44.5, 22.7, 45.1],
  [3, 22.6, 47.9, 11.2, 40.5, 18.7, 42.1],
  [4, 29.6, 52.9, 19.2, 35.5, 23.7, 50.1],
  [5, 22.6, 47.9, 20.2, 39.5, 26.7, 55.1],
  [6, 22.6, 47.9, 11.2, 40.5, 18.7, 42.1],
  [7, 25.6, 42.9, 15.2, 48.5, 15.7, 42.1],
  [8, 22.6, 55.9, 25.2, 55.5, 25.7, 58.1],
  [9, 28.6, 45.9, 19.2, 50.5, 20.7, 55.1],
  [10, 30.6, 39.9, 16.2, 48.5, 19.7, 49.1],
  [11, 22.6, 47.9, 11.2, 40.5, 18.7, 42.1],
  [12, 26.6, 48.9, 10.2, 45.5, 17.7, 42.1]
]);

var options = {
  chart: {
    title: 'Category Wise Breakup',
    subtitle: 'in thousands of rupees (INR)'
  },
  width: 1000,
  height: 500
};

var chart = new google.charts.Line(document.getElementById('linechart_material'));

chart.draw(data, google.charts.Line.convertOptions(options));
}
