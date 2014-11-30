<?php 
include 'core/quiz.php';
	
$router = new Router("$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]");

$router->add('/leaderboards', function(){
	echo JSON(Leaderboards::all($_POST));
});

$router->add('/leaderboards/create', function(){
	echo Leaderboards::create($_POST);
});

$router->run();