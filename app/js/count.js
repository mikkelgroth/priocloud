$(function() {    
    $("#detailoutcome").keyup(function(){countdown('detailoutcome');});
    $("#detailbenefit").keyup(function(){countdown('detailbenefit');});
    $("#detailrisk").keyup(function(){countdown('detailrisk');});
    $("#detailreal").keyup(function(){countdown('detailreal');});
    
    $("#statusdel").keyup(function(){countdown('statusdel');});
    $("#statusnext").keyup(function(){countdown('statusnext');});
    $("#statusconcerns").keyup(function(){countdown('statusconcerns');});
    $("#statuschanges").keyup(function(){countdown('statuschanges');});
    $("#statusdescision").keyup(function(){countdown('statusdescision');});
    $("#statuscomments").keyup(function(){countdown('statuscomments');});
    
    $("#miledel").keyup(function(){countdown('miledel');});
    $("#milecom").keyup(function(){countdown('milecom');});
    
    $("#riskdesc").keyup(function(){countdown('riskdesc');});
    $("#riskmit").keyup(function(){countdown('riskmit');});
    $("#risktrig").keyup(function(){countdown('risktrig');});
    $("#riskplan").keyup(function(){countdown('riskplan');});
    
});

var countdown = function(id){
    var text = $('#'+id).val();
    var chars = 300 - text.length; 
    $('span#'+id+'_count').html('['+chars+']'); 
};