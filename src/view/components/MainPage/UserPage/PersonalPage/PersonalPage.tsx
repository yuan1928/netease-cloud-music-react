import React from "react";
import {getSongsList} from "../../../../../apis/personalPage";
import ShowFramI from "../../../common/ShowFramI/ShowFramI";
import './PersonalPage.css'

interface Item{
    id:number,
    imgUrl:string,
    title:string,
    playCount:number
}
interface State{
    songsList:Item[]
}
class PersonalPage extends React.Component<any, any>{
    state:State={
        songsList:[]
    }
    componentDidMount() {
        getSongsList().then(res=>{
            console.log(res);
            for(let item of res.data.result)
            {
                this.state.songsList.push({
                    id:item.id,
                    imgUrl:item.picUrl,
                    title:item.name,
                    playCount:item.playCount
                })
            }
            this.forceUpdate()
        })
    }

    render() {
        return (
            <div style={{width:"100%", height:"80vh", display:"flex",flexWrap:"wrap",position:"relative",overflowY:"scroll"}}>
                <div style={{fontSize:"20px", fontWeight:"bolder", width:"100%", display:"flex",padding:"20px"}}>
                    你的雷达歌单
                </div>
                {
                    this.state.songsList.map(item=>(
                        <div className="personalPageSongListItem">
                            <ShowFramI
                                item={item}
                                titlePos="220px"
                            />
                        </div>
                    ))
                }
            </div>
        )
    }
}

export default PersonalPage