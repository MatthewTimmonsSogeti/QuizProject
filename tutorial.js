(function scopeWrapper($) {
    
    $(document).ready(function(){
       getQuestions();
       callForQuote();
    });

    let currentQuestions = [];
    let score = 19;
    let currentEasyCount = 4;
    let currentMediumCount = 3;
    let currentHardCount = 3;
    
    function callForQuestions() {
        $.ajax({
            url: "https://opentdb.com/api.php?amount=10&encode=base64"
        }).done(function(data) {
            console.log(data);
            buildQuestionList(data);
        });

    }

    function getQuestions() {
        currentEasyCount = 0;
        currentMediumCount = 0;
        currentHardCount = 0;
        let totalQuestions = 0;

        while (score > 0 && totalQuestions < 10) {
            if (score > 2) {
                score -= 3;
                currentHardCount++;
                totalQuestions++;
            }
            if (score > 1 && totalQuestions < 10) {
                score -= 2;
                currentMediumCount++;
                totalQuestions++;
            }
            if (score > 0 && totalQuestions < 10) {
                score -= 1;
                currentEasyCount++;
                totalQuestions++;
            }
        }

        callForQuestionsOfDifficulty(currentEasyCount, "easy");
        callForQuestionsOfDifficulty(currentMediumCount, "medium");
        callForQuestionsOfDifficulty(currentHardCount, "hard");
    }

    function callForQuestionsOfDifficulty(amount, difficulty) {
        $.ajax({
            url: `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&encode=base64`
        }).done(function(data) {
            console.log(data);
            addQuestionsToQueue(data.results);
        });
    }

    function addQuestionsToQueue(questions) {
        currentQuestions = currentQuestions.concat(questions);
        console.log("CurrentQuestions: " + currentQuestions);
        console.log("Questions length: " + currentQuestions.length);
        console.log("First Question: " + atob(currentQuestions[0].question.toString()));
        if (currentQuestions.length === 10) {
            currentQuestions = shuffle(currentQuestions);
            buildQuestionList(currentQuestions);
        }
    }

    function callForQuote() {
        
        $.ajax({
            url: "http://quotes.rest/qod.json"
        }).done(function(data) {
            console.log(data);
            // TODO add a quote of the day to your web page if you would like!
        });
    }
    
    function buildQuestionList(data) {
        console.log("Building");
        $.each(data, function(i,e) {
            // TODO why is this code wrong? There are a LOT of reasons, but a
            // *hint* is to consider how someone with developer tools might get
            // a perfect score every time.
            var question = $(`<br><br><div class='question difficulty-${e.difficulty}'/>`).appendTo($("#questionsList"));

            $(`<div class='text-center'><span style='display:block' class='difficulty'>Difficulty : <em>${atob(e.difficulty)}</em></span></div>`).appendTo(question);
            $("<span/>").addClass("questionNumber").html(`${i+1}&nbsp;&nbsp;&nbsp;`).appendTo(question);
            $("<span/>").addClass("questionText").html(atob(e.question)).appendTo(question);
            $("<br><br>").appendTo(question);
            var answerDiv = $("<div/>").addClass("answerDiv").appendTo(question);

            // TODO wouldn't it be better to shuffle the answers so that the
            // last one isn't always the right one? Just a thought...
            $.each(e.incorrect_answers,function(index,element){
                $("<label class='radio'>").html(`<p>&nbsp;&nbsp;${atob(element)}</p>
                <input type='radio' class='answer' name='question${i}'>
                <span class='checkround'></span>`).appendTo(answerDiv);
            });
            $("<label class='radio'>").html(`<p>&nbsp;&nbsp;${atob(e.correct_answer)}</p>
            <input type='radio' class='answer correctAnswer' name='question${i}'>
            <span class='checkround'></span>`).appendTo(answerDiv);
        });
        var submit = $("<div class='text-center'><button class='btn btn-secondary'>Submit</button></div>").appendTo($("#questionsList"));
        
        submit.click(function(e) {
           e.preventDefault(); 
           // TODO there is probably a better way to determine the right
           // answer.
           const selectedAnswers = $("input:checked");
           if (selectedAnswers.length < 10) {
               alert("Please complete all ten questions to submit.");
           } else {
               // Get all correct selected answers
               const correctAnswers = $('input:checked.correctAnswer');
               const right = correctAnswers.length;
               
               score = 0;
               correctAnswers.each(function(index){
                   // Easy
                    if (($(this).parent().parent().parent().hasClass("difficulty-ZWFzeQ=="))) {
                        score += 1;
                    }
                   // Medium
                    if (($(this).parent().parent().parent()).hasClass("difficulty-bWVkaXVt")) {
                        score += 2;
                    }
                    // Hard 
                    if (($(this).parent().parent().parent()).hasClass("difficulty-aGFyZA==")) {
                        score += 3;
                    }
               })

            alert("Well done, you got " + right + " right!\nYou also got a score of " + score);

               // Clear HTML 
               $("#questionsList").empty();
                // currentQuestions = [];
                // currentEasyCount = 4;
                // currentMediumCount = 3;
                // currentHardCount = 3;
            
                currentQuestions = [];
                // score += (right + (right-10));
                // Temp - Reset score
                score = 19;
                getQuestions();
               
               // Get new questions

           }
        });

    }

    // Took this shuffle function from here:
    // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }
      
      // Used like so
      var arr = [2, 11, 37, 42];
      arr = shuffle(arr);
      console.log(arr);

}(jQuery));