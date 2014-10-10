(function(){

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

		init: function(){
			//generate all categories for user to select
			var allCategories = [];
			
			for(prop in data){
				allCategories.push(prop);
			};
			
			
			//show checkboxes
			//var template = Handlebars.compile( $('#categories').html() );

			this.display($('#categories'), allCategories);
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

			if(quiz.categories.length == 0){
				quiz.categories = unchecked;
			}
			//create the questions from what the user wants
			quiz.makeQuestions();
			//show the current question
			quiz.loadQuestion();
		},

		makeQuestions: function(){
			//go through categories
			for (var category = 0; category < this.categories.length; category++){
				//get question array of objects in a category
				var obj = data[this.categories[category]]
				//get question object if it exists
				if(typeof obj !== 'undefined'){
					//for every question in a cateory
					for (var question = 0; question < obj.length; question++){
						//add every question object to a list
						this.questions.push(obj[question])
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
				//create data for Handlebars
				var context = {
					questionPos: this.questionPos + 1,
					questionTotal: this.questions.length,
					question: question.question,
					options: question.options
				};
				
				this.display($('#question'), context);

				$('.next').bind('click', this.handleClick);
			}
			
		},

		handleClick: function(e){
			//get data from clicked option
			var data = $(this)[0].dataset;
			
			//if option clicked is the correct answer
			if (data.correct == 'true'){
				quiz.user.correct.push(data.option);
			}
			else{
				quiz.user.wrong.push(data.option);
			}
			//go to next question index
			quiz.questionPos++;
			//load the next question
			quiz.loadQuestion();
		},

		displayScore: function(){
			var user = this.user;

			var context = {
				correctTotal: user.correct.length,
				questionTotal: quiz.questions.length 

			};
			console.log(context)
			this.display($('#finish'), context);
		},

		quizFinished: function(){
			return this.questionPos >= this.questions.length;
		},

		display: function(dom, content){
			var template = Handlebars.compile( dom.html() );
			$('.view').html(template(content));
		},
		
	};

	//Start quiz
	quiz.init();

	//Event handling
	$('.start').bind('click', quiz.start);
	
})()