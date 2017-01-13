window.addEventListener('load', function () {
    drawBackground();
});
window.addEventListener('resize', function () {
    drawBackground();
});

var svg = d3.select('svg');
var curWidth = 0,
    curHeight = 0;
var newWidth, newHeight;
var minWidth = 1000;

function drawBackground() {
    var bgWrap = d3.select('.bg_wrap').node();
    var bgWrapWidth = bgWrap.offsetWidth;
    var bgWrapHeight = bgWrap.offsetHeight;

    newWidth = bgWrapWidth > minWidth ? bgWrapWidth : minWidth;
    newHeight = bgWrapHeight;

    svg
        .attr('width', bgWrapWidth)
        .attr('height', bgWrapHeight);

    if (curWidth != newWidth || curHeight != newHeight) {
        curWidth = newWidth;
        curHeight = newHeight;
        draw(getData());
    }
}

function getData() {
    var sites = [[0,0], [newWidth,0], [0,newHeight], [newWidth, newHeight]];
    var xStep = 30;
    var yStep = 15;
    var xBand = newWidth / xStep;
    var yBand = newHeight / yStep;

    for (var i = 0; i <= xStep; i++) {
        for (var j = 0; j <= yStep; j++) {
            var xNoise = Math.random() - 0.5;
            var yNoise = Math.random() - 0.5;
            sites.push([
                xBand * i + xNoise * xBand,
                yBand * j + yNoise * yBand
            ])
        }
    }
    var voronoi = d3.voronoi();
    return voronoi(sites).triangles();
}

function draw(data) {
    var pattern = svg.selectAll('path').data(data);
    pattern.exit().remove();
    pattern
        .enter()
            .append('path')
        .merge(pattern)
            .attr('d', function(d) { return d == null ? null : 'M' + d.join('L') + 'Z' })
            .style('fill', function(d) { return color(d) })
            .style('stroke', function(d) { return color(d) });
}

function color(d) {
    var dx = ((d[0][0] + d[1][0] + d[2][0]) / d.length),
        dy = ((d[0][1] + d[1][1] + d[2][1]) / d.length);
    var hue = d3.scaleLinear()
        .domain([0, newWidth / 2, newWidth])
        .range([200, 220, 200]);
    var sat = d3.scalePow()
        .domain([0, newHeight])
        .range([0.1, 0.5]);
    var lit = d3.scalePow()
        .domain([0, newWidth + newHeight])
        .range([0.1, 0.5]);
    return d3.hsl(hue(dx), sat(dy), lit(dx + dy));
}