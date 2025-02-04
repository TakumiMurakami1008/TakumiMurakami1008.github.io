d3.csv("https://TakumiMurakami1008.github.io/Work/W08/w08_data2.csv")
    .then(data =>{
        data.forEach( d => {d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:10, right:50, bottom:50, left:20}
        };

        const line_chart = new LineChart( config, data );
        line_chart.update();
    })
    .catch( error =>{
        console.log( error );
    })

class LineChart{
    constructor( config, data ){
        this.config = {
            parent: config.parent,
            width: config.width || 256, 
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    } 

    init(){
        let self  =this;

        self.svg = d3.select( self.config.parent )
                     .attr('width', self.config.width)
                     .attr('height', self.config.height);
                
        self.chart = self.svg.append('g')
                         .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
                        .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
                        .range([0, self.inner_height]);

        self.xaxis = d3.axisBottom(self.xscale)
                       .ticks(6);

        self.yaxis = d3.axisLeft(self.yscale)
                       .ticks(6);

        self.xaxis_group = self.chart.append('g')
                               .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.svg.append("g")
                               .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
                
        self.line = d3.line();
    }

    update(){
        let self = this;

        self.xscale.domain([0, d3.max(self.data, d => d.x)]);
        self.yscale.domain([0, d3.max(self.data, d => d.y)]);

        self.line.x( d => d.x )
                 .y( d => d.y );

        self.render();
    }

    render(){
        let self = this;

        self.chart.selectAll("rect")
                  .data(self.data)
                  .enter()
                  .append('path')
                  .attr('d', self.line(self.data))
                  .attr('stroke', 'black')
                  .attr('fill', 'none');

        self.chart.selectAll("circle").data(self.data).enter().append("circle")
        .attr("cx", self.line.x())
        .attr("cy", self.line.y())
        .attr("r", 3)
        .attr("fill", "#000");

        self.xaxis_group.call(self.xaxis);

        self.yaxis_group.call(self.yaxis);
    }
}