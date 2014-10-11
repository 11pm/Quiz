var templates = [
'<script type="text/x-handlebars-template" id="categories">' +
'<h1>Categories</h1>' +
'<div class="categories">' +
'{{#each this}}' +
'<input type="checkbox" id="{{this}}">{{this}}<br>' +
'{{/each}}' +
'</div>' +
'<button class="start">Start</button>' +
'</script>',

];
//load templates into the right place
templates.forEach(function(template){
	$('.quiz').append(template);
});