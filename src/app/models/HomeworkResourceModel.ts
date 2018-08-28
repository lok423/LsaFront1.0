export interface HomeworkResourceModel {

}

export class ResourceData {
  studyResource_id: number; //
  resource_author: string;
  author_photo: any;
  resource_type: any;
  resource_title: string; //
  resource_des: string; //
  resource_image: any; //
  resource_tags: any; //
  resource_body: object; ///
  isPublic: number; //
  tutor_id: string;
  created_at: string;
  updated_at: string;

  constructor() {

  }
}

export class ResourceOprationObject {
  operation: string;
  resourceDetails: ResourceDetails;

  constructor(operation: string, resourceDetails: ResourceDetails) {
    this.operation = operation;
    this.resourceDetails = resourceDetails;
  }
}

export class ResourceDetails {
  resource_type: string;
  resource_desc: object;
  resource_body: object;

  constructor(resource_type: string, resource_desc: object, resource_body: object) {
    this.resource_type = resource_type;
    this.resource_desc = resource_desc;
    this.resource_body = resource_body;
  }
}

// object for homework information
export class HomeworkInfo {
  // author_photo: string;
  resource_type: number;
  resource_subject: string;
  resource_grade: string;
  resource_title: string;
  resource_des: string;
  // resource_image: string;
  resource_tags: string;
  resource_body: string;
  isPublic: number; // 0 or 1
  resource_image: string;
  constructor(hwBasicInfo: HomeworkBasicInfo, hwQuestionInfo: QuestionInfo) {
    this.resource_type = 1; // homework type

    this.resource_subject = hwBasicInfo.subject;
    this.resource_grade = hwBasicInfo.grade;
    this.resource_title = hwBasicInfo.title;
    this.resource_des = hwBasicInfo.description;

    this.resource_tags = hwBasicInfo.subject.toString();

    this.isPublic = Number(hwBasicInfo.view);
    this.resource_body = JSON.stringify(hwQuestionInfo);
    this.resource_image = hwBasicInfo.img;
  }
}

export class HomeworkBasicInfo {
  subject: string;
  grade: string;
  title: string;
  category: any[];
  level: string;
  topic: string;
  view: number;
  timeDuration: any;
  description: string;
  img: any;

  constructor(
    hwSubject: string,
    hwGrade: string,
    hwTitle: string,
    hwCategory: any[],
    hwLevel: string,
    hwTopic: string,
    hwView: number,
    hwTimeDuration: number,
    hwDescription: string
  ) {
    this.subject = hwSubject;
    this.grade = hwGrade;
    this.title = hwTitle;
    this.category = hwCategory;
    this.level = hwLevel;
    this.topic = hwTopic;
    this.view = hwView;
    this.timeDuration = hwTimeDuration;
    this.description = hwDescription;
  }
}

// question information
export class QuestionInfo {
  questionType: string;
  questionCollection: QuestionObj[];

  constructor(type: string, list: QuestionObj[]) {
    this.questionType = type;
    this.questionCollection = list;
  }
}

// object for each single question
export class QuestionObj {
  questionObjType: string;
  questionId: number;
  questionContent: any;
  questionSaveStatus: string;

  constructor(type: string, quizId: number, quizContent: any) {
    this.questionObjType = type;
    this.questionId = quizId;
    this.questionContent = quizContent;
  }
}

export class ShortAnswers {
  questionId: number;
  questionType: string;
  questionTitle: string;
  questionText: string;
  questionAnswer: any;
}

// class ChoiceOption {
//   choiceNumber: number;
//   choiceText: string;
// }
//
// export class MultipleChoice {
//   questionId: number;
//   questionType: string;
//   questionTitle: string;
//   questionText: string;
//   questionOption: ChoiceOption[];
//   questionAnswer: string;
// }
//
// export class MultipleChoiceContainer {
//   question: [MultipleChoice];
// }
