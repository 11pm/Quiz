var quiz = {
	//the current question the user sees
	questionPos: -1,
	//all categories a user wants
	category:  null,
	//all questions for a user
	questions: [],
	//keep all anwered question objects
	answered: [],

	mainFolder: '',
	templateFolder: 'templates/',

	//dynamic data from JSON file
	data: [],

	init: function(){
		//Add new event listener
		$('body').bind('keydown', quiz.keys);

		//if questionPos in localstorage is set, use it
		var local_pos       = parseInt(localStorage.getItem('questionPos'));
		var local_questions = JSON.parse(localStorage.getItem('questions'));
		var local_answered  = JSON.parse(localStorage.getItem('answered'));
		var local_category  = localStorage.getItem('category');


		if( (local_pos == 0 || true) && local_questions && local_answered && local_category ){
			//set quiz data
			this.questionPos = local_pos;
			this.questions   = local_questions;
			this.answered    = local_answered;
			this.category    = local_category;
			//load the question, stop from getting new data
			if(this.questionPos == "finished"){
				this.displayScore();
				return false;
			}
			this.loadQuestion();
			return false;
		}

		//generate all categories for user to select
		var allCategories = [];
		
		//get the json file and handle categories
		$.getJSON(quiz.mainFolder + "data/questions.json", function(response){
			response.forEach(function(obj){
				var categories = obj.category;
				//if its unqiue
				var idx = allCategories.indexOf(categories);
				if(idx == -1){
					allCategories.push(categories);
				}
			});

			quiz.data = response;

		});

		this.render('categories', allCategories);
	},
	//get categories from user
	start: function(e){
		//set the index to 0 to get the first question
		quiz.questionPos = 0;
		//get category of clicked button
		quiz.category = $(this).data().category;
		//create the questions from what the user wants
		quiz.makeQuestions();
		//show questions in a random order
		quiz.questions = quiz.shuffle(quiz.questions);

		//set localstorage items
		localStorage.setItem('category', quiz.category);
		localStorage.setItem('questions', JSON.stringify(quiz.questions));

		//show the current question
		quiz.loadQuestion();

	},

	makeQuestions: function(){
		//quiz.data
		var data = this.data;
		for(var i = 0; i < data.length; i++){
			var question = data[i];

			//if category of questions matches category selected
			if(this.category === question.category){

				//add dynamic "answered"
				var options = question.options;
				//shuffle options
				question.options = this.shuffle(options);

				options.forEach(function(obj){
					obj.answered = false;
				});

				this.questions.push(question);
			}
		}	
	},

	loadQuestion: function(){
		//set new localstorage items
		localStorage.setItem('questionPos', quiz.questionPos);
		
		//check if quiz is completed
		if (this.quizFinished()){
			//kill event listener if user has submited
			$('body').off('keydown', quiz.keys);

			//show score and prevent going into this.function
			this.displayScore();
			return false;
		}
		else{
			
			
			//get current question
			var question = this.questions[this.questionPos];
			//update options in random order
			var context = {
				questionPos: this.questionPos + 1,
				questionTotal: this.questions.length,
				question: question.question,
				options: question.options,
				category: question.category
			};
			
			this.render('question', context);

		}
	},

	click: function(){

		var dataset = $(this).data();
		var option;
		var data = quiz.questions;

		quiz.answered.filter(function(obj, index){
		
			//if it is the current question
			//remove the option and add a new one
			if(obj.questionIndex === quiz.questionPos){
				
				quiz.answered.splice(index, index+1);
	
			}

		});

		//add the new option
		quiz.answered.push({
			questionIndex: quiz.questionPos,
			dataset: dataset
		});

		localStorage.setItem('answered', JSON.stringify(quiz.answered));

		//if the user has answered everything, create submit button
		if (quiz.isAnswered()){
			quiz.loadQuestion();
		}		

	},

	keys: function(e){

		var left = e.which == 37;
		var right = e.which == 39;

		//Left arrow key, go back exept first question
		if(left && quiz.questionPos>0){
			quiz.back();
		}

		//Right arrow key, go next question exept on last question
		if(right && quiz.questionPos != quiz.questions.length-1){
			quiz.next();
		}

		//arrow keys are doing something fucked up, stop them
		if(left || right)
			return false;
	},
	//goes to previous
	back: function(){
		quiz.questionPos--;
		quiz.loadQuestion();

	},

	//goes to next question
	next: function(){

		quiz.questionPos++;
		
		quiz.loadQuestion();
	},

	//resets variables in quiz, and starts at menu

	reset: function(){
		//reset event listener
		$('body').off('keydown', quiz.keys);
		quiz.category = null;
		quiz.questions = [];
		quiz.questionPos = -1;
		quiz.answered = [];

		localStorage.removeItem('questionPos');
		localStorage.removeItem('questions');
		localStorage.removeItem('answered');
		localStorage.removeItem('category');

		quiz.init();

	},

	//convert to values to percent
	toPercent: function(value1, value2){

		return ((value1/value2)*100).toFixed(0);
	},

	//Final screen
	displayScore: function(){
		var answered     = quiz.answered;
		var correctTotal = 0;
		var submitted    = false;
		var error        = false;

		//if passed in arg 1
		if(arguments[0]){ 
			submitted = arguments[0];
		}
		//if passed in arg 2
		if(arguments[1]){
			error = arguments[1];
		}

		//get number of correct options 
		answered.filter(function(obj){
			if (obj.dataset.correct === true){
				return correctTotal++;
			}
		});
		
		var context = {
			correctTotal: correctTotal,
			questionTotal: answered.length,
			percent: quiz.toPercent(correctTotal, answered.length),
			submitted: submitted,
			error: error
		};
		
		this.render('finished', context);
	},

	submit: function(e){

		var username = $('.username').val();

		//if username is empty
		if(username.length <= 0){

			//show with error 
			quiz.displayScore(false, true);
			return false;

		}

		quiz.displayScore(true);

	},

	//returns true if the quiz is finished
	quizFinished: function(){
		return this.questionPos >= this.questions.length;
	},

	//checks if user has answered all questions
	isAnswered: function(){
		return this.answered.length === this.questions.length;
	},

	render: function(name, context){

		var templatePath = function(name){
			return quiz.templateFolder + name + '.html';
		};
		
		//Get a new template, replace .view div content with the new content
		$.ajax({
			url: templatePath(name),
			method: 'GET',
			cache: false,
			success: function(response){
				var template = Handlebars.compile(response);
				$('.view').html(template(context));
			},
			error: function(error){
				$('body').load(templatePath('error'));
			}
		});

	},

	//Fisher Yates shuffle
	shuffle: function(array){
		var copy = [], n = array.length, i;
  		// While there remain elements to shuffle…
  		while (n) {
    		// Pick a remaining element…
    		i = Math.floor(Math.random() * array.length);
    		// If not already shuffled, move it to the new array.
    		if (i in array) {
    			copy.push(array[i]);
     			delete array[i];
      			n--;
    		}
  		}
  		return copy;
	}

};

//Start quiz
quiz.init();

//Start quiz
$('body').on('click', '.start', quiz.start);

//next
$('body').on('click', '.answer', quiz.click);

//back
$('body').on('click', '.back', quiz.back);

//next
$('body').on('click', '.next', quiz.next);

//reset quiz
$('body').on('click', '.reset', quiz.reset);

//submit name
$('body').on('click', '.submit', quiz.submit);

//hide back button in the first question
Handlebars.registerHelper('notFirst', function(v1, options) {
	if(v1 != 1) {
    	return options.fn(this);
  	}
  	return options.inverse(this);
});

//hide next button in the last question
Handlebars.registerHelper('notLast', function(v1, options){

	var totalLength = quiz.questions.length;

	if(v1 < totalLength){
		return options.fn(this);
	}
	return options.inverse(this);
});

//checks if it should show the submit button
Handlebars.registerHelper('isCompleted', function(v1, options){
	
	quiz.isAnswered();

	if (v1 == quiz.questions.length && quiz.isAnswered()) {
		return options.fn(this);
	}
	return options.inverse(this);

});

//Helper to check if option is correct
Handlebars.registerHelper('isCorrect', function(option, options){
	correct = false;
	
	//loop through all user answers
	quiz.answered.forEach(function(obj){
		//check if option name matches any answer
		if(obj.dataset.option == option) correct = true;

	});

	if(correct){
		return options.fn(this);
	}
	return options.inverse(this);

});