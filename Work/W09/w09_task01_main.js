d3.csv("https://TakumiMurakami1008.github.io/Work/W04/w04_task02.csv")
    .then(data =>{
        data.forEach( d => {d.label = +d.label; d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:10, right:50, bottom:50, left:15}
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update( data );

        d3.select('#reverse')
          .on('click', d => {
            data.reverse();
            bar_chart.update(data);
          });
        
        d3.select('#descend')
          .on('click', d => {
            data.sort((a,b) => a.value - b.value);
            bar_chart.update(data);
          });

        d3.select('#Reset')
          .on('click', d => {
            data.sort((a,b) => a.label - b.label);
            bar_chart.update(data);
          });
    })
    .catch( error =>{
        console.log( error );
    })

class BarChart{
    constructor( config, data ){
        this.config = {
            parent: config.parent,
            width: config.width || 128, 
            height: config.height || 128,
            margin: config.margin || {top:10, right:10, bottom:10, left:40}
        }
        this.data = data;
        this.init();
    } 

    init(){
        let self  =this;

        self.padding = 0.1;

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

        self.xaxis = d3.axisBottom( self.xscale )
                       .ticks(6);

        self.yaxis = d3.axisLeft(self.yscale)
                       .ticks(6);
                     
        self.xaxis_group = self.chart.append('g')
                               .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.svg.append("g")
                               .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.color = d3.scaleOrdinal()
                       .range(["crimson", "mediumblue", "darkgreen", "olive", "orange", "saddlebrown", "maroon", "silver"]);

        // self.reverse = d3.select('#reverse')
        //                .on('click', d => {
        //                   this.data.reverse();
        //                   self.update(this.data);
        //                });
    }

    update( new_data ){
        let self = this;

        self.xscale.domain([0, d3.max(new_data, d => d.value)]);
        self.yscale.domain(new_data.map(d => d.label))
                   .paddingInner(0.1);

        console.log(new_data.map(d => d.value));

        self.render( new_data );
    }

    render( new_data ){
        let self = this;

        self.chart.selectAll("rect")
                  .data(new_data)
                  .join("rect")
                  .transition().duration(1000)
                  .attr('fill', function(d) { return self.color(d.label) })
                  .attr("x", self.padding)
                  .attr("y", d => self.yscale(d.label))
                // .attr("y", (d,i) => self.padding + i * ( self.config.height + self.padding ))
                  .attr("width",d => self.xscale(d.value))
                //   .attr("width",d => d.value)
                  .attr("height", self.yscale.bandwidth());

        self.xaxis_group.call(self.xaxis);

        self.yaxis_group.call(self.yaxis);
    }
}







