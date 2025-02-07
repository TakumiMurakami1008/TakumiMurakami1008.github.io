class BarChart2 {
    constructor (config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 512,
            height: config.height || 512,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
            .range([0, self.inner_height])
            .paddingInner(0.1)
            .paddingOuter(0.1);
        
        self.xaxis = d3.axisBottom(self.xscale)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(5)
            .tickSizeOuter(0);

        self.xaxis_group = self.chart.append('g');

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        // self.chart.append("text")
        //           .attr("x", self.inner_width/2)
        //           .attr("y", -10)
        //           .attr('fill', 'black')
        //           .attr("font-size", "20px")
        //           .attr("text-anchor", "top")
        //           .text("title");

        const xlabel_space = 20;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.xlabel );

        const ylabel_space = 40;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .text( self.config.ylabel );
    }

    update() {
        let self = this;

        console.log(self.data);

        self.cvalue = d => d.prefecture;
        self.xvalue = d => d.price;
        self.yvalue = d => d.prefecture;

        const xmin = d3.min( self.data, self.xvalue );
        const xmax = d3.max( self.data, self.xvalue );
        self.xscale.domain([xmin, xmax]);

        const items = self.data.map( self.yvalue );
        self.yscale.domain(items);

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll(".bar")
            .data(self.data)
            .join("rect")
            .attr("class", "bar")
            // .attr("x", d => self.xscale( self.xvalue(d) ) )
            // .attr("y", d => self.yscale( self.yvalue(d) ) )
            // .attr("width", self.xscale.bandwidth())
            // .attr("height", d => self.inner_height - self.yscale( self.yvalue(d) ))
            .attr("x", d => self.xscale( d3.min([100,self.xvalue(d)]) ) )
            .attr("y", d => self.yscale( self.yvalue(d) ) )
            .attr("width", d => Math.abs(100-self.xvalue(d))*19.5 )
            .attr("height", self.yscale.bandwidth())
            .attr("fill", d => self.config.cscale( self.cvalue(d) ))
            .on('click', function(ev,d) {
                const is_active = filter.includes(d.prefecture);
                if ( is_active ) {
                    filter = filter.filter( f => f !== d.prefecture );
                }
                else {
                    filter.push( d.prefecture );
                }
                Filter();
                d3.select(this).classed('active', !is_active);
            });

        self.chart.selectAll(".bar")
        .data(self.data)
        .join("rect")
        .attr("class", "bar")
        .on('mouseover', (e,d) => {
            d3.select('#tooltip')
                .style('opacity', 1)
                .html(`<div class="tooltip-label">${d.prefecture}</div>${d.price}`);
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
            
        self.xaxis_group
            .call(self.yaxis);

        self.yaxis_group
            .call(self.xaxis);
    }
}
