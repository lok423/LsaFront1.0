export interface Message {
  toid : string[],
  fromid: string,
	  msg : string,
	  sender_id : number,
    selfsockets: string[],
    receiver_id: number,
    createdAt:Date

}

export interface DrawImg {
  toid : string[],
  fromid: string,
	  sender_id : number,
    selfsockets: string[],
    receiver_id: number,
    drawImg:string,
    createdAt:Date

}

export interface UploadFile {
  toid : string[],
  fromid: string,
	  sender_id : number,
    selfsockets: string[],
    receiver_id: number,
    file:string,
    filename:string,
    createdAt:Date

}

export interface UploadImg {
  toid : string[],
  fromid: string,
	  sender_id : number,
    selfsockets: string[],
    receiver_id: number,
    img:string,
    imgname:string,
    createdAt:Date

}
