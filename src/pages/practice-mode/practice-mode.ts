import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

declare var BoxOfQuestions: any;
declare var LWdb: any;
declare var LWutils: any;
var lw = BoxOfQuestions(LWdb('lw-storage'));
var correctAnswer = "";
var mode = "";
var questionObj = null;
var tag = "";
var wordNumber = 1;

/**
 * Generated class for the PracticeModePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-practice-mode',
  templateUrl: 'practice-mode.html',
})
export class PracticeModePage {

  public buttonColor: string = '#FFFFFF';

  arrOptionButtons: any;
  lessonName: any; 
  title: string; 

  constructor(public translate: TranslateService, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PracticeModePage');
  }


  ionViewDidEnter()
  {
    console.log("entered PracticeModePage");

    tag = this.navParams.get('tag');
    mode = this.navParams.get('mode');
    this.lessonName = tag;
    
    this.title = this.translate.instant('Practice') + " '" + tag + "'";
    if(mode == "practice")
    {
      lw.resetQueried();
    }    
    else
    {
      this.title = this.translate.instant('Review');
    }

    this.showRepeat(tag, mode);
  }

  listen() : void
  {
    if(questionObj != null)
    {
      var mediaPath = LWutils.getMediaPath(questionObj['importedFromAPKG']);
      LWutils.playAudio(mediaPath + questionObj['word']);
      console.log("data/media/" + questionObj['word']);
    }
  }
  optionClick(clickedOption) : void
  {    
    if(clickedOption.buttonColor === '#FFFFFF') { 
      clickedOption.buttonColor = '#FFF0F5'
    } else {
      clickedOption.buttonColor = '#FFFFFF'
    }

    var wordID = clickedOption.currentTarget.id;

    var w = lw.findID(wordID);
    var clickedWord = lw.getWord(w);
    var myButton = document.getElementById(wordID);

    var correct = false;
    if(myButton)
    {
      console.log("clicked word: " + clickedWord.translate);
      if(clickedWord.translate == correctAnswer)
      {
          correct = true;

          myButton.classList.add("correct");
          lw.moveQuestionForward();
      }
      else {
          myButton.classList.add("wrong");

          lw.moveQuestionBackwards();
      }
      
      setTimeout(()=>{  
        if(correct)
        {
          console.log("removeCorrect " + wordID);
          myButton.classList.remove("correct");
          this.showRepeat(tag, mode);
        }
        else {
          this.listen();
          myButton.classList.remove("wrong");
          myButton.style.opacity = "0.3";
        }
      }, 2000);
    }
}
  showRepeat(tag, mode) {

    var wordsFilteredByTag = lw.allWordsFilteredByTag(tag);

    this.arrOptionButtons = [];

    questionObj = lw.question(tag, mode);
    console.log(tag + "#" + mode);
    console.log("questionObj: " + questionObj);
    
    if(typeof questionObj !== 'undefined')
    {
      correctAnswer = lw.answer(tag, mode);

      console.log("correctAnswer");
      console.log(correctAnswer);

      var mediaPathSound = LWutils.getMediaPath(questionObj['importedFromAPKG']);
      console.log("playAudio: " + mediaPathSound + questionObj.word);
      LWutils.playAudio(mediaPathSound + questionObj.word);

      var arrOptionButtons = document.getElementsByClassName("optionBtn");
      var arrOptions = lw.getAnswerOptions(tag, mode);

      var numberOfOptions = 4;
      if(arrOptions.length < numberOfOptions)
      {
        if(wordNumber > 4) {
          numberOfOptions = arrOptions.length - (wordNumber + 4);
        }
        else {
          numberOfOptions = arrOptions.length;
        }
      }      
      for (var i = 0; i < numberOfOptions; i++) {

        if(arrOptions[i])
        {
          var mediaPathImg = LWutils.getMediaPath(arrOptions[i]['importedFromAPKG']);

          if(arrOptions[i]['translateIsImage']) {
            var card = "<img class=imgAnswer src='" + mediaPathImg + arrOptions[i]['translate'] +"'>";
          }
          else {
            var card = "<span class=answerText>" + arrOptions[i]['translate'] + "</span>";
          }

          this.arrOptionButtons.push({id: arrOptions[i]['_id'], content: card}); 
        }
      }

    }
    else
    {
      if(mode == "practice")
      {
        this.showRepeat(tag, "practiceagain");
        /*
        this.navCtrl.push('PracticeModePage', {
          tag: tag,
          mode: "practiceagain"
        });
        */    
      }
      else
      {
        var LWarea = document.getElementById("learnWords2-area");
        LWarea.style.display = "none";

        var finished = document.getElementById("finished");
        finished.style.display = "block";
      }
    }

  }  

  goHome() {
    this.navCtrl.setRoot(HomePage);
    /* 
    Uncaught (in promise): Error Type HomePage is part of the declarations of 2 modules:
    AppModule and HomePageModule! Please consider moving HomePage to a higher module that imports AppModule
    */ 
  }
}
