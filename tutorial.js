(function scopeWrapper($) {
    
    $(document).ready(function(){
       getInitialQuestions();
       callForQuote();
    });

    let currentQuestions = [];
    
    function callForQuestions() {
        $.ajax({
            url: "https://opentdb.com/api.php?amount=10&encode=base64"
        }).done(function(data) {
            console.log(data);
            buildQuestionList(data);
        });

    }

    function getInitialQuestions() {
        callForQuestionsOfDifficulty(4, "easy");
        callForQuestionsOfDifficulty(3, "medium");
        callForQuestionsOfDifficulty(3, "hard");
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
        if (currentQuestions.length > 9) {
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
        
        /*
        submit.click(function(e) {
           e.preventDefault(); 
           // TODO there is probably a better way to determine the right
            // answer.
           var len = $(".btn-info").length;
           if (len < 10) {
               alert("Please complete all ten questions to submit.")
           } else {
               var right = $(".btn-info.correctAnswer").length;
               alert("Well done, you got " + right + " right!");
           }
        });
        */

    }
    
    function uuid4() {
        const ho = (n, p) => n.toString(16).padStart(p, 0); 
        const view = new DataView(new ArrayBuffer(16)); 
        crypto.getRandomValues(new Uint8Array(view.buffer)); 
        view.setUint8(6, (view.getUint8(6) & 0xf) | 0x40); 
        view.setUint8(8, (view.getUint8(8) & 0x3f) | 0x80); 
        return `${ho(view.getUint32(0), 8)}-${ho(view.getUint16(4), 4)}-${ho(view.getUint16(6), 4)}-${ho(view.getUint16(8), 4)}-${ho(view.getUint32(10), 8)}${ho(view.getUint16(14), 4)}`; 
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