/*
﻿export class User {
    _id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    online: boolean;
    newestMsg:string;
    unreadCount:number;
}*/

export class User {
    user_id: number;
    first_name: string;
    last_name: string;
    tutor_id:string;
    updated_at:Date;
    user_role: string;
    verify:string;

    online: boolean;
    newestMsg:string;
    unreadCount:number;

}
