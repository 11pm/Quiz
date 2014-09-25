var helper = {


};

var quiz = {

	questionPos: 0,

	categories: [],

	questions: [],

	init: function(){
		//generate all categories for user to select
		var allCategories = [];

		for (var i = 0 ; i < data.length; i++) {
			for(prop in data[i]){
				allCategories.push(prop);
			}
		};
		
		//show checkboxes
		var template = Handlebars.compile( $('#categories').html() );
		$('.quiz').append( template(allCategories) );
		
	},

	start: function(){
		//get all checkboxes
		var children = $('.categories').children();
		for (var i = 0; i < children.length; i++){
			//checks checkboxes
			if(children[i].checked){
				//add category name to array
				quiz.categories.push(children[i].id);
			}
		}
		quiz.makeQuestions();
		quiz.loadQuestion();
	},

	makeQuestions: function(){
		//go through categories
		for (var i = 0; i < this.categories.length; i++){
			//go trough date
			for(var x = 0; x < data.length;x++){
				//get data object with category key
				var obj = data[x][this.categories[i]]
				//if it exists
				if(typeof obj !== 'undefined'){
					for (var y = 0; y < obj.length; y++){
						this.questions.push(obj[y]);
					}
				}
			}
		}
	},

	loadQuestion: function(){
		var question = this.questions[this.questionPos]
		console.log(question.options)
		var context = {
			questionPos: this.questionPos + 1,
			questionTotal: this.questions.length +1,
			question: question.question,
			options: question.options
		}
		
		var template = Handlebars.compile( $('#question').html() );
		$('.quiz').empty().append( template(context) );
	}

};
quiz.init();
//start quiz
$('.start').click(quiz.start);