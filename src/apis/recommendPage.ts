import request from "./request";

export function getBanner(){
    return request({
        url:"/banner",
        method:"get",

    })
}

export function getRecommendSongsList(){
    return request(
        {
            url:"/personalized?limit=10",
            method:"get"
        }
)}

export function getPersonalBroadcast(){
    return request(
        {
            url:'/personalized/privatecontent',
            method:"get"
        }
    )
}

export function getMV(){
    return request(
        {
            url:"/personalized?limit=4",
            method:"get"
        }
    )
}

export function getNewMusic(){
    return request(
        {
            url:"/personalized/newsong?limit=12",
            method:"get"
        }
    )
}

