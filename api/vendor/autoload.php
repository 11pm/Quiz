<?php
function inc($x){
	require __DIR__ . '/../' . $x;
}
function incArray(array $ar){
	foreach ($ar as $value) {
		inc($value);
	}
}

//Set dependecies
$depen = [
	'vendor/database.php',
	'core/utils.php',
	'vendor/aid.php',
	'vendor/router.php'
];

//Get every model in folder
$models = glob('models/*.php');
//Include the files
incArray($depen);
incArray($models);