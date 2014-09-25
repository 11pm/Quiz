<?php 
include 'init.php';

$route = new Router();

$route->add('/test', function(){
	echo 'ayy lmao';
});

$route->submit();