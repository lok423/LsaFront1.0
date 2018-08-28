
// test data for homework form data population
export var Privacy = [
  { id: 1, name: "Public" },
  { id: 0, name: "Private" }
];

export var HomeworkSubject = [
  { id: 100, name: "English" },
  { id: 200, name: "Maths" },
  { id: 300, name: "History" },
  { id: 400, name: "Maori" }
];

// category, level, tags
export var HomeworkCategory = [
  { id: 100, name: "English" },
  { id: 200, name: "Maths" },
  { id: 300, name: "History" },
  { id: 400, name: "Maori" }
];

// king-> age 0 ~ 4, year 0 -> age 5, year 8 -> secondary school, year 9 ~ 13 high school
export var HomeworkLevel = [
  { id: 1, name: "Years 1-8" },
  { id: 2, name: "Years 9-13" },
  { id: 3, name: "University Level 5" },
  { id: 4, name: "University Level 6" },
  { id: 5, name: "University Level 7" },
];

export var HomeworkTopic = [
  {
    id: 1,
    name: "English",
    topicLevel: [
      {
        id: 1,
        name: "Years 1-8",
        topic: [
          { id: 1, name: "Dialogue" },
          { id: 2, name: "Structure" },
          { id: 3, name: "Colour" }
        ]
      },
      {
        id: 2,
        name: "Years 9-13",
        topic: [
          { id: 1, name: "Dialogue II" },
          { id: 2, name: "Structure II" },
          { id: 3, name: "Colour II" }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Maths",
    topicLevel: [
      {
        id: 1,
        name: "Years 1-8",
        topic: [
          { id: 1, name: "Algebra" },
          { id: 2, name: "Number" },
          { id: 3, name: "Statistics" }
        ]
      },
      {
        id: 2,
        name: "Years 9-13",
        topic: [
          { id: 1, name: "Algebra II" },
          { id: 2, name: "Number II" },
          { id: 3, name: "Statistics II" }
        ]
      }
    ]
  }
];

export var HomeworkTags = [];

// question type and name map
export var questionTypeNameMap = [
  { type: "short", name: "Short Answer", link: "shortanswer" },
  { type: "multi", name: "Multiple Choice", link: "multiplechoice" },
  // { type: "blank", name: "Fill in Blank", link: "fillblank" },
  // { type: "template", name: "Template", link: "template" },
  // { type: "custom", name: "Customized", link: "customized" }
];


// // object for homework information
// export class HomeworkInfo {
//   // author_photo: string;
//   resource_type: number;
//   resource_subject: string;
//   resource_grade: string;
//   resource_title: string;
//   resource_des: string;
//   // resource_image: string;
//   resource_tags: string;
//   resource_body: string;
//   isPublic: number; // 0 or 1
//   resource_image: string;
//   constructor(hwBasicInfo: HomeworkBasicInfo, hwQuestionInfo: QuestionInfo) {
//     this.resource_type = 1; // homework type
//
//     this.resource_subject = hwBasicInfo.subject;
//     this.resource_grade = hwBasicInfo.grade;
//     this.resource_title = hwBasicInfo.title;
//     this.resource_des = hwBasicInfo.description;
//
//     this.resource_tags = hwBasicInfo.subject.toString();
//
//     this.isPublic = Number(hwBasicInfo.view);
//     this.resource_body = JSON.stringify(hwQuestionInfo);
//     // this.resource_image = hwBasicInfo.img;
//   }
// }
//
// export class HomeworkBasicInfo {
//   subject: string;
//   grade: string;
//   title: string;
//   category: any[];
//   level: string;
//   topic: string;
//   view: number;
//   timeDuration: any;
//   description: string;
//   img: any;
//
//   constructor(
//     hwSubject: string,
//     hwGrade: string,
//     hwTitle: string,
//     hwCategory: any[],
//     hwLevel: string,
//     hwTopic: string,
//     hwView: number,
//     hwTimeDuration: number,
//     hwDescription: string
//   ) {
//     this.subject = hwSubject;
//     this.grade = hwGrade;
//     this.title = hwTitle;
//     this.category = hwCategory;
//     this.level = hwLevel;
//     this.topic = hwTopic;
//     this.view = hwView;
//     this.timeDuration = hwTimeDuration;
//     this.description = hwDescription;
//   }
// }
