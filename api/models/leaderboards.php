<?php 
class Leaderboards{

	public static function all($data){
		$data = OBJECT($data);

		$sql = "SELECT * FROM leaderboards WHERE category = ?";
		
		return Aid::query($sql, true, [$data->category]); 
	}

	public static function create($data){
		$data = OBJECT($data);

		$exists = Aid::query("SELECT * FROM leaderboards WHERE category = ? AND username = ?", true, [
			$data->category,
			$data->username
		]);

		//if the record exists in db; update it
		if(count($exists)){
					
			Aid::query("UPDATE leaderboards SET score = ? WHERE username = ? AND category = ?", false, [
				$data->score*100,
				$data->username,
				$data->category
			]);

		}
		else{
			$sql = "INSERT INTO leaderboards (username, score, category) VALUES (?, ?, ?)";
		
			$response = Aid::query($sql, false, [
				$data->username,
				$data->score*100,
				$data->category
			]);	
		}
		

	}

}