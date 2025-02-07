let input_data;
let scatter_plot;
let bar_chart;
let filter = [];
let original_data;


d3.csv("https://TakumiMurakami1008.github.io/Work/Final/price_income_Japan.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.income = +d.income;
            d.price = +d.price;
        }); 

        original_data = JSON.parse(JSON.stringify(input_data));
        console.log(original_data);
               
        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );

        scatter_plot = new ScatterPlot( {
            parent: '#drawing_region_ScatterPlot',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            title: 'Price Index - Annual Income Data',
            xlabel: 'Annual Income [ten thousand yen]',
            ylabel: 'Consumer Price Index' ,
            cscale: color_scale
        }, input_data );
        scatter_plot.update();

        bar_chart = new BarChart( {
            parent: '#drawing_region_barchart',
            width: 256,
            height: 768,
            margin: {top:10, right:10, bottom:50, left:80},
            xlabel: 'Annual Income',
            // ylabel: 'Prefecture' ,
            cscale: color_scale
        }, input_data );
        bar_chart.update();

        bar_chart2 = new BarChart2( {
            parent: '#drawing_region_barchart2',
            width: 256,
            height: 768,
            margin: {top:10, right:10, bottom:50, left:80},
            xlabel: 'Consumer Price Index',
            // ylabel: 'Prefecture' ,
            cscale: color_scale
        }, input_data );
        bar_chart2.update();

        d3.select('#descend')
          .on('click', d => {
            bar_chart.data = input_data;
            bar_chart.data.sort((a,b) => a.income - b.income);
            bar_chart2.data = input_data;
            bar_chart2.data.sort((a,b) => a.income - b.income);
            bar_chart.update();
            bar_chart2.update();
        });

        d3.select('#ascend')
          .on('click', d => {
            bar_chart.data = input_data;
            bar_chart.data.sort((a,b) => b.income - a.income);
            bar_chart2.data = input_data;
            bar_chart2.data.sort((a,b) => b.income - a.income);
            bar_chart.update();
            bar_chart2.update();
        });

        d3.select('#reset')
          .on('click', d => {
            Reset();
        });

        d3.select('#descend2')
          .on('click', d => {
            bar_chart.data = input_data;
            bar_chart.data.sort((a,b) => a.price - b.price);
            bar_chart2.data = input_data;
            bar_chart2.data.sort((a,b) => a.price - b.price);
            bar_chart2.update();
            bar_chart.update();
        });

        d3.select('#ascend2')
          .on('click', d => {
            bar_chart.data = input_data;
            bar_chart.data.sort((a,b) => b.price - a.price);
            bar_chart2.data = input_data;
            bar_chart2.data.sort((a,b) => b.price - a.price);
            bar_chart2.update();
            bar_chart.update();
        });

        d3.select('#reset2')
          .on('click', d => {
            Reset();
        });
    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot.data = input_data;
    }
    else {
        scatter_plot.data = input_data.filter( d => filter.includes( d.prefecture ) );
    }
    scatter_plot.update();

    d3.select('#clear')
      .on('click', d => {
        filter.length = 0;
        scatter_plot.data = input_data;
        scatter_plot.update();
        Reset();
    });
}

function Reset( ){
    bar_chart.data = original_data;
    bar_chart2.data = original_data;
    bar_chart.update();
    bar_chart2.update();
}