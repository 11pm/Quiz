<?php
class Router{

	private $uri;

	private $routes = [];

	public function __construct($url){
		
		$this->uri = $url;
	}

	public function add($route, $closure){

		$this->routes[] = func_get_args();

	}


	public function run(){
		//shitty hack(temp)
		$currentRoute = explode('index.php', $this->uri);
		$currentRoute = end($currentRoute);
		
		foreach ($this->routes as $key) {
			
			$route = $key[0];
			$func = $key[1];

			$parameter = null;
			//echo $route.'<br>';
			if(contains($route, ':')){

				$routeParam = strchr($route, ':');

				$parameter = explode('/', $currentRoute);
				$parameter = end($parameter);

				$route = str_replace($routeParam, $parameter, $route);

			}
			//echo $route;

			//if route matches
			if($currentRoute == $route){
				

				if(isset($parameter)){
					call_user_func_array($func, [$parameter]);
				}
				else{
					call_user_func($func);
				}


			}

		}

	}

	public static function get($route, $closure){

		//Length of route parts
		$partLength = count(explode('/', $route));

		//Parts of browser url
		$segments = explode('/', self::$uri);

		//get last items of browser url
		$parts = array_slice($segments, count($segments)-$partLength);

		//create dynamic url of last parts in browser
		$current  = '/' . implode('/', $parts);
		//print_r($current);
		$parameter = null;

		//If the route has a parameter
		if(contains($route, ':')){
			//find :id in $route context
			$routeParam = strrchr($route, ':');
			//find last part of url
			$parameter = end(explode('/', $current));
			//replace :id with last part of url
			$route = str_replace($routeParam, $parameter, $route);

		}

		echo $route.'<br>';
		echo $current;
		//If the route matches
		if ($route == $current){
			//If route has a parameter, call it with it
			if(isset($parameter)){
				call_user_func_array($closure, [$parameter]);
			}
			//Else, just call it normally
			else{
				call_user_func($closure);
			}
		}

	}
	/*
	public static function get($route, $closure){

		# /aircrafts
		$routeSegments = explode('/', $route);
		//unset($routeSegments[0]);
		$routeSegmentLength = count($routeSegments);
		$uriSegments = explode('/', self::$uri);

		$wantedSegments = array_slice($uriSegments, count($uriSegments)-$routeSegmentLength);
	
		$current = '/' . implode('/', $wantedSegments);
		//print_r($wantedSegments);
		//print_r(self::$uri);
		echo $route.'<br>';
		echo $current;

	}*/
}