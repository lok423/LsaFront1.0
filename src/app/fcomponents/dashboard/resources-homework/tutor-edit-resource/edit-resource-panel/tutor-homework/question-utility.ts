
import { QuestionInfo, QuestionObj } from '../../../../../../models/HomeworkResourceModel';

export class QuestionUtility {
  constructor() { }

  // ******************* interface function ******************* //
  //
  // prepare initial question information
  prepareQuestionInfo(type: string, id: number, content: object) {
    return new QuestionObj(type, id, content);
  }

  // add question
  addQuestion(questionArray: any[], questionObj: object) {
    questionArray.push(questionObj);
  }

  // delete question
  deleteQuestion(questionArray: any[], questionIndex: number) {
    questionArray.splice(questionIndex - 1, 1);
    for (let i = questionIndex - 1; i < questionArray.length; i++) {
      questionArray[i].questionId--;
    }
  }

  // edit question
  editQuestion(questionArray: any[], questionId: number, questionObj: QuestionObj) {
    questionArray[questionId - 1] = questionObj;
  }

  // change question save status for view display
  changeQuestionStatus(questionArray: any[], questionId: number, quizStatus: string) {
    questionArray[questionId - 1].questionSaveStatus = quizStatus;
  }

  // create question information object
  createQuestionInfo(questionType: string, questionCollection: QuestionObj[]) {
    let questionInfo = {
      questionType: '',
      questionCollection: []
    };
    questionInfo.questionType = questionType;
    questionInfo.questionCollection = questionCollection;
    return questionInfo;
  }

  // change question position
  // up a question
  questionUp(questionArray: any[], questionId: number) {
    if (questionId != 1) {
      let quiz = questionArray[questionId - 1];
      let upperQuiz = questionArray[questionId - 2];
      if (upperQuiz.questionSaveStatus == "saved") {
        quiz['questionId']--;
        upperQuiz['questionId']++;
        questionArray[questionId - 2] = quiz;
        questionArray[questionId - 1] = upperQuiz;
      } else {
        alert("Unable to move question up. You have unsaved question.");
      }
    }
  }

  // down a question
  questionDown(questionArray: any[], questionId: number) {
    if (questionId != questionArray.length) {
      let quiz = questionArray[questionId - 1];
      let lowerQuiz = questionArray[questionId];
      if (lowerQuiz.questionSaveStatus == "saved") {
        quiz['questionId']++;
        lowerQuiz['questionId']--;
        questionArray[questionId] = quiz;
        questionArray[questionId - 1] = lowerQuiz;
      } else {
        alert("Unable to move question down. You have unsaved question.");
      }
    }
  }

  // hide or display add question button
  hideOrDisplayAddBtn(questionArray: any[]) {
    let isHide: boolean = false;
    if(questionArray.length == 0) {
      isHide = true;
    } else {
      for (let quiz of questionArray) {
        if (quiz.questionSaveStatus != "saved") {
          isHide = true;
          break;
        }
      }
    }
    return isHide;
  }
}
