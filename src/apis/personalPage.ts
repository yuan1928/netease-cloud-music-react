import request from "./request";

export function getSongsList(){
    return request({
        url:'/personalized?limit=100',
        method:"get",
    })
}