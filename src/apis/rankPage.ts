import request from "./request";

export function getOfficialRanks(){
    return request({
        url:"/toplist/detail",
        method:"get",
    })
}

export function getRankInfo(id:number){
    return request({
        url:"/playlist/detail?id="+id,
        method:"get"
    })
}