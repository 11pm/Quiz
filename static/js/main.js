//handlebars extensions to hide back button
Handlebars.registerHelper('notnull', function(v1, options) {
  if(v1 != 1) {
    return options.fn(this);
  }
  return options.inverse(this);
});

var quiz = {
	//the current question the user sees
	questionPos: 0,
	//all categories a user wants
	category:  null,
	//all questions for a user
	questions: [],
	//keep user score
	user: {
		correct: [],
		wrong: []
	},
	mainFolder: '/static/',
	templateFolder: '/static/templates/',

	//dynamic data from JSON file
	data: [],

	init: function(){
		//generate all categories for user to select
		var allCategories = [];
	
		//get the json file and handle categories
		$.getJSON(quiz.mainFolder + "data/questions.json", function(response){
			console.log(response)
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
		var data = this.data;
		for(var i = 0; i < data.length; i++){
			var question = data[i];
			//if category of questions matches category selected
			if(this.category === question.category){
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
			console.log(context)
			this.render('question', context);
		}
	},

	click: function(){
		var dataset = $(this).data();
		var question = dataset.option;

		if(dataset.correct == true){
			quiz.user.correct.push(question);
		}
		else{
			quiz.user.wrong.push(question);
		}

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
$('body').on('click', '.next', quiz.click);

//back
$('body').on('click', '.back', quiz.back)