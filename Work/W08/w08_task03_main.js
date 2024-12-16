d3.csv("https://TakumiMurakami1008.github.io/Work/W04/w04_task02.csv")
    .then(data =>{
        data.forEach( d => {d.label = +d.label; d.value = +d.value; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:10, left:10}
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error =>{
        console.log( error );
    })

class BarChart{
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

        self.radius = 100

        self.svg = d3.select( self.config.parent )
                     .attr('width', self.config.width)
                     .attr('height', self.config.height);
                
        self.chart = self.svg.append('g')
                         .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
                        .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
                        .range([0, self.inner_height]);

        self.pie = d3.pie();

        self.arc = d3.arc()
                     .innerRadius(self.radius/2)
                     .outerRadius(self.radius);

         self.color = d3.scaleOrdinal()
                        .range(["crimson", "mediumblue", "darkgreen", "olive", "orange", "saddlebrown", "maroon", "silver"]);
    }

    update(){
        let self = this;

        self.pie.value( d => d.value );

        self.render();
    }

    render(){
        let self = this;

        self.chart.selectAll('pie')
                  .data( self.pie(self.data) )
                  .enter()
                  .append('path')
                  .attr('d', self.arc)
                  .attr('fill', function(d) { return self.color(d.index) })
                  .attr('stroke', 'white')
                  .style('stroke-width', '2px');

        self.chart.selectAll('text')
        .data(self.pie(self.data))
        .enter()
        .append('text')
        .text(function(d) { return d.data.label; }) // 表示するテキスト
        .attr("transform", d => `translate(${self.arc.centroid(d)})`) // 扇型の中心に移動
        .attr('fill', 'white')
        .style("text-anchor", "middle")
        .style("font-size", 20);
    }
}