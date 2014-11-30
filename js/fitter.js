$(document).ready(function(){

	var view = $('.view');

	var wHeight = $(window).height();
	var viewHeight = view.height();
	var leftOver = wHeight - viewHeight;
	console.log(leftOver)
});