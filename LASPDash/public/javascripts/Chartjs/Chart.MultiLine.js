Chart.types.Line.extend({
    name: "LineAlt",
    draw: function () {
        Chart.types.Line.prototype.draw.apply(this, arguments);

        var scale = this.scale;
       

        // draw lines
        this.chart.ctx.save();
        this.chart.ctx.strokeStyle = '#ff0000';

		this.chart.ctx.beginPath();
		this.chart.ctx.moveTo(scale.calculateX(this.datasets[0].points.length - 0.5), scale.startPoint);
		this.chart.ctx.lineTo(scale.calculateX(this.datasets[0].points.length - 0.5), scale.endPoint);
		this.chart.ctx.stroke();
		
		this.chart.ctx.beginPath();
		this.chart.ctx.moveTo(scale.calculateX(this.datasets[1].points.length - 0.5), scale.startPoint);
		this.chart.ctx.lineTo(scale.calculateX(this.datasets[1].points.length - 0.5), scale.endPoint);
		this.chart.ctx.stroke();

        this.chart.ctx.restore();
    }
});