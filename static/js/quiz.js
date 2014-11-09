var quiz = {
	//the current question the user sees
	questionPos: 0,
	//all categories a user wants
	category:  null,
	//all questions for a user
	questions: [],
	//keep all anwered question objects
	answered: [],

	mainFolder: '/static/',
	templateFolder: '/static/templates/',

	//dynamic data from JSON file
	data: [],

	init: function(){
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
		//get category of clicked button
		quiz.category = $(this).data().category;
		//create the questions from what the user wants
		quiz.makeQuestions();
		//show questions in a random order
		quiz.questions = quiz.shuffle(quiz.questions);
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
				options.forEach(function(obj){
					obj.answered = false;
					//console.log(obj)
				});

				this.questions.push(question);
			}
		}	
	},

	loadQuestion: function(){

		//check if quiz is completed
		if (this.quizFinished()){
			//show score and prevent going into this.function
			this.displayScore();
			return false;
		}
		else{

			//var 

			//get current question
			var question = this.questions[this.questionPos];
			console.log(quiz.answered)
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

	changeOption: function(dataset, answered){

		var option;
		var data = quiz.data;

		for(var i = 0; i < data.length; i++){

			var question = data[i].options;

			for(var x = 0; x < question.length; x++){
				
				option = question[x];
				if(dataset.option == option.name){
					option.answered = answered;
				}

			}
		}

		return option;
	},

	//TODO, FIND THE QUESTION IN THE OBJECT	
	click: function(){

		var dataset = $(this).data();
		var option;
		var data = quiz.questions;

		option = quiz.changeOption(dataset, true);

		dataset.answered = true;
	
		quiz.answered.filter(function(obj, index, w){
		
			//if it is the current question
			//remove the option and add a new one
			if(obj.questionIndex == quiz.questionPos){
				quiz.changeOption(dataset, false);
				quiz.answered.splice(index);
			}

		});

		quiz.answered.push({
			questionIndex: quiz.questionPos,
			dataset: dataset
		});

		

		quiz.questionPos++;

		quiz.loadQuestion();
	},

	back: function(){
		quiz.questionPos--;
		quiz.loadQuestion();

	},

	next: function(){
		quiz.questionPos++;
		quiz.loadQuestion();
	},

	reset: function(){
		//reset stuff
		quiz.category = null;
		quiz.questions = [];
		quiz.questionPos = 0;
		quiz.answered = [];
		quiz.init();

	},

	displayScore: function(){
		var answered = quiz.answered;
		console.log(answered)
		var correctTotal = 0;
		//console.log(answered)
		//get number of correct 
		answered.filter(function(obj){
			if (obj.dataset.correct === true){
				return correctTotal++;
			}
		});

		var context = {
			correctTotal: correctTotal,
			questionTotal: answered.length, 
		};
		
		this.render('finished', context);
	},

	//returns true if the quiz is finished
	quizFinished: function(){
		return this.questionPos >= this.questions.length;
	},

	render: function(name, context){

		var templatePath = function(name){
			return quiz.templateFolder + name + '.html';
		};
		
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

//handlebars extensions to hide back button
Handlebars.registerHelper('notFirst', function(v1, options) {
	if(v1 != 1) {
    	return options.fn(this);
  	}
  	return options.inverse(this);
});

//hide next button if on last question
Handlebars.registerHelper('notLast', function(v1, options){
	if(v1 != quiz.questions.length){
		return options.fn(this);
	}
	return options.inverse(this);
});
/*
    <a 
                class="answer button radius
                {{#if this.answered}}success{{/if}}"
                data-option="{{this.name}}"
                data-correct="{{this.correct}}"
                data-answered="{{this.answered}}"
                name="question">
                    {{this.name}}
                </a>
                */