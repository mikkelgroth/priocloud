function showhide(link, t) {
    for(var i=1;i<t+1;i++){
        if(i==link){
            document.getElementById('linkdiv'+i).className='view';
            document.getElementById('fane'+i).className='fane set';
        }else{
            document.getElementById('linkdiv'+i).className='noview';
            document.getElementById('fane'+i).className='fane';
        }
    }
}
function showhidemenu(link, t) {
    for(var i=1;i<t+1;i++){
        if(document.getElementById('menufane'+i)){
        if(i==link){
            document.getElementById('menufane'+i).className='menu menuset';
        }else{
            document.getElementById('menufane'+i).className='menu';
        }
        }
    }
}
function closeport() {
            document.getElementById('menufane2').className='menu';
}
function showhidesub(link, t) {
    for(var i=1;i<t+1;i++){
        if(i==link){
            document.getElementById('linkdiv'+i).className='view';
            document.getElementById('fane'+i).className='fane bottom set';
        }else{
            document.getElementById('linkdiv'+i).className='noview';
            document.getElementById('fane'+i).className='fane bottom back';
        }
    }
}
function showhidepop(link,open) {
        if(open){
            $('#popdiv'+link).attr('class', 'mainbox editboxon');
            $('#popdiv'+link).parent().addClass('editable');
        }else{
            $('#popdiv'+link).attr('class', 'noview');
            $('#popdiv'+link).parent().removeClass('editable');
        }
}

var minipie = function(id,val){
    $(id).empty();
    var le = 100 - val;
    var dataset = {
      priokpiset: [val,le],
    };

    var width = 50,
        height = 50,
        radius = Math.min(width, height) / 2;

    var color = ['#00f','#ddf'];

    var pie = d3.layout.pie()
        .sort(null);

    var arc = d3.svg.arc()
        .innerRadius(radius - 10)
        .outerRadius(radius - 20);

    var svg = d3.select(id).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var path = svg.selectAll("path")
        .data(pie(dataset.priokpiset))
      .enter().append("path")
        .attr("fill", function(d, i) { return color[i]; })
        .attr("d", arc);
}
