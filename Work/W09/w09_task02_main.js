d3.csv("https://TakumiMurakami1008.github.io/Work/W04/data.csv")
    .then(data =>{
        data.forEach( d => {d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:50, right:50, bottom:50, left:50}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error =>{
        console.log( error );
    })

class ScatterPlot{
    constructor( config, data ){
        this.config = {
            parent: config.parent,
            width: config.width || 256, 
            height: config.height || 256,
            margin: config.margin || {top:50, right:50, bottom:50, left:50}
        }
        this.data = data;
        this.init();
    } 

    init(){
        let self = this;

        self.svg = d3.select( self.config.parent )
                     .attr('width', self.config.width)
                     .attr('height', self.config.height);

        self.chart = self.svg.append('g')
                         .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
                        .range( [0, self.inner_width] );
            
        self.yscale = d3.scaleLinear()
                        .range( [0, self.inner_height] );

        self.xaxis = d3.axisBottom( self.xscale )
                       .ticks(6);
                    
        self.xaxis_group = self.chart.append('g')
                                     .attr('transform', `translate(0, ${self.inner_height})`);
            
        self.yaxis = d3.axisLeft( self.yscale )
                       .ticks(6);
                            
        self.yaxis_group = self.chart.append('g')
                                     .attr('transform', `translate(0, 0)`);
    }

    update(){
        let self = this;

        const xmin = d3.min( self.data, d => d.x);
        const xmax = d3.max( self.data, d => d.x);
        self.xscale.domain( [0, xmax] );

        const ymin = d3.min( self.data, d => d.y);
        const ymax = d3.max( self.data, d => d.y);
        self.yscale.domain( [ymax, 0] );

        console.log(self.data);

        self.render( self.data );
    }

    render( data ){
        let self = this;

        self.chart.selectAll("circle")
                  .data(self.data)
                  .enter()
                  .append("circle")
                  .attr('fill', 'steelblue')
                  .attr("cx", d => self.xscale( d.x ))
                  .attr("cy", d => self.yscale( d.y ))
                  .attr("r", d => d.r)
                  .attr("class", "point")
                  .on('mouseover', (e,d) => {
                    d3.select('#tooltip')
                      .style('opacity',1)
                      .html(`<div class="tooltip-label">Position</div>(x:${d.x}, y:${d.y})`);
                })
                .on('mousemove', (e) => {
                    const padding = 10;
                    d3.select('#tooltip')
                      .style('left', (e.pageX + padding) + 'px')
                      .style('top', (e.pageY + padding) + 'px'); 
                })
                .on('mouseleave', () => {
                    d3.select('#tooltip')
                      .style('opacity', 0);
                });

        self.xaxis_group.call(self.xaxis);
        self.yaxis_group.call(self.yaxis);

        self.chart.append("text")
                  .attr("x", self.inner_width/2)
                  .attr("y", -20)
                  .attr('fill', 'black')
                  .attr("font-size", "20px")
                  .attr("text-anchor", "top")
                  .text("title");

        self.chart.append("g")
        .attr("transform", "translate(" + 0 + "," + (self.inner_height) + ")")
        .append("text")
        .attr("fill", "black")
        .attr("x", (self.inner_width) / 2 )
        //.attr("x", 0)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .attr("font-size", "10pt")
        .text("x-label");

        self.chart.append("g")
        .attr("transform", "translate(" + (self.config.margin.left) + ","+ 0 + ")")
        .append("text")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("x", -(self.inner_height) / 2 )
        //.attr("x", 0)
        .attr("y", -80)
        .attr("transform", "rotate(-90)")
        .attr("font-weight", "middle")
        .attr("font-size", "10pt")
        .text("y-label");
    }
}