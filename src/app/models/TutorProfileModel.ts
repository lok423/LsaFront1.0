export interface TutorProfileModel {
    tutor_id: number;
    edu_1: string;
    edu_1_detail: string;
    edu_1_date: string;
    edu_2: string;
    edu_2_detail: string;
    edu_2_date: string;
    edu_3: string;
    edu_3_detail:  string;
    edu_3_date:  string;
    work_1:  string;
    work_1_detail:  string;
    work_1_date_s:  string;
    work_1_date_e:  string;
    work_2:  string;
    work_2_detail:  string;
    work_2_date_s:  string;
    work_2_date_e:  string;
    work_3:  string;
    work_3_detail:  string;
    work_3_date_s:  string;
    work_3_date_e:  string;
    hobby_1:  string;
    hobby_1_detail:  string;
    hobby_2:  string;
    hobby_2_detail:  string;
    
    first_name: string;
    
    sp_ages:Array<string>;
    sp_lesson_structure:Array<string>
    sp_course_focus:Array<string>
    sp_experience:Array<string>
    sp_test_prep:Array<string>
}