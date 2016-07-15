
google.load('visualization', '1', {
  'packages': ['corechart']
});
var metricsResponse;

var metricTypes = [
      {id:'orders', name:'orders'},
      {id:'pageViews', name:'pageViews'},
      {id:'sales', name:'sales'},
      {id:'clickThruRate', name:'clickThruRate'}
];


var oReq = new XMLHttpRequest();
oReq.onload = reqListener;
oReq.open("get", "chart-api-data.json", true);
oReq.send();

function reqListener(e) {
    metricsResponse = JSON.parse(this.responseText);
    init();
}



var Dropdown = React.createClass({
    propTypes: {
        id: React.PropTypes.string.isRequired,
        options: React.PropTypes.array.isRequired,
        valueField: React.PropTypes.string,
        labelField: React.PropTypes.string,
        metricActiveSelection: React.PropTypes.string,
        onUserInput: React.PropTypes.func
    },

    render: function() {
        var self = this;
        var options = self.props.options.map(function(option) {
            return (
                <option key={option[self.props.valueField]} value={option[self.props.valueField]}>
                    {option[self.props.labelField]}
                </option>
            )
        });
        return (
            <select id={this.props.id} 
                    className='form-control' 
                    value={this.props.metricActiveSelection} 
                    onChange={this.handleChange}>
                {options}
            </select>
        )
    },

    handleChange: function(e) {
        this.props.onUserInput(
          e.target.value
        );
    }

});


var Chart = React.createClass({

  getInitialState: function() {
    return {
      data: this.getData(this.props)
    };
  },
  render: function() {
    return React.DOM.div({
      id: 'line',
      style: {
        width: '800px',
        height: '500px'
      }
    });
  },
  
  componentDidMount: function() {
    this.draw(this.props);
  },
  
  componentWillReceiveProps: function (nextProps) {
    this.draw(nextProps);
 },
  
  draw: function(props) {
    var data = this.getData(props);
    var options = {
      title: props.filterByMetric,
      curveType: 'function',
      legend: { position: 'bottom' }

    };
    var element = document.getElementById('line');
    var chart = new google.visualization.LineChart(element);
    chart.draw(data, options);
  },
  
  getData: function(props) {
    var rows = [['Date', props.filterByMetric]];
    props.metricsData.records.forEach((record) => {
      rows.push([record.date, record[props.filterByMetric]]);
    });
    return google.visualization.arrayToDataTable(rows);
  }
  
});


var MetricsChart = React.createClass({
   getInitialState: function() {
        return {
            selected: this.props.metricSelection[0].id
        }
    },
     handleUserInput: function(selected) {
      this.setState({
        selected: selected
      });
  },

  render: function() {
    return (
      <div>
        <Dropdown id='myDropdown' 
                  options={this.props.metricSelection} 
                  labelField='name'
                  valueField='id'
                  metricActiveSelection={this.state.selected}
                  onUserInput={this.handleUserInput}/>
        <Chart metricsData={this.props.metrics}
               filterByMetric={this.state.selected}/>
      </div>
    );
  }
});


function init() {
  React.render(<MetricsChart metrics={metricsResponse}  metricSelection={metricTypes} />,
  document.getElementById('root'));
}
