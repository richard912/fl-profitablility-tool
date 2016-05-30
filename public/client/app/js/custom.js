
Number.prototype.formatMoney = function(c, d, t){
	var n = this, 
  c = isNaN(c = Math.abs(c)) ? 2 : c, 
  d = d == undefined ? "." : d, 
  t = t == undefined ? "," : t, 
  s = n < 0 ? "-" : "", 
  i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
  j = (j = i.length) > 3 ? j % 3 : 0;
 	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};

String.prototype.formatNumber = function() {
	var number = Number(this.replace(/[^0-9\.]+/g,""));
	return number;
}

var fitScreenHeight = function() {
	height = $(window).height();
	container_height = $('.view-frame').height();
	if (container_height < height) {
		$('#wrapper').css('min-height', height.toString() + 'px');
	};
	
}

$(document).ready( function () {
	$('input').blur(function() {
		if ($(this).val())
		{
		  $(this).addClass('used');
		} else {
		  $(this).removeClass('used');
		}
	});
	$('input[type="reset"]').on('click', function(){
		$('input').removeClass('used');
	});

});