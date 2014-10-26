var quiz = {
	//the current question the user sees
	questionPos: 0,
	//all categories a user wants
	categories: [],
	//all questions for a user
	questions: [],
	//keep user score
	user: {
		correct: [],
		wrong: []
	},

	templateFolder: '/templates/',

	init: function(){
		//generate all categories for user to select
		var allCategories = [];
	
		for(var prop in data){
			allCategories.push(prop);
		}

		this.render('categories', allCategories);
	},
	//get categories from user
	start: function(){
		unchecked = [];
		//get all checkboxes
		var children = $('.categories').children();
		for (var i = 0; i < children.length; i++){
			//checks checkboxes
			if(children[i].checked){
				//add category name to array
				quiz.categories.push(children[i].id);
			}
			unchecked.push(children[i].id);
		}

		if(quiz.categories.length === 0){
			quiz.categories = unchecked;
		}
		//create the questions from what the user wants
		quiz.makeQuestions();
		//show questions in a random order
		quiz.questions = quiz.shuffle(quiz.questions);
		//show the current question
		quiz.loadQuestion();
	},

	makeQuestions: function(){
		//go through categories
		for (var category = 0; category < this.categories.length; category++){
			//get question array of objects in a category
			var obj = data[this.categories[category]];
			//get question object if it exists
			if(typeof obj !== 'undefined'){
				//for every question in a cateory
				for (var question = 0; question < obj.length; question++){
					//add every question object to a list
					this.questions.push(obj[question]);
				}
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
			//get current question
			var question = this.questions[this.questionPos];
			//update options in random orderu
			question.options = this.shuffle(question.options);
			//create data for Handlebars
			var context = {
				questionPos: this.questionPos + 1,
				questionTotal: this.questions.length,
				question: question.question,
				options: question.options
			};
			
			this.render('question', context);
			//$('body').on('click', '.start', quiz.start);
			//$('body').on('click', '.next', this.click);

			console.log(this.questionPos)
		}
	},

	click: function(){
		var dataset = $(this).data();
		console.log(dataset);
		console.log(this);
		quiz.questionPos++;

		quiz.loadQuestion();
	},

	displayScore: function(){
		var user = this.user;
		console.log(user);
		var context = {
			correctTotal: user.correct.length,
			questionTotal: quiz.questions.length, 
			result: user
		};
			
		this.render('finished', context);
	},

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
$('body').on('click', '.next', quiz.click);