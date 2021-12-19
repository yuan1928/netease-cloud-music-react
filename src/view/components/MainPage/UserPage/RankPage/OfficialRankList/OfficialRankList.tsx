import React from "react";
import {RightOutlined} from "@ant-design/icons";
import './OfficialRankList.css'
import {withRouter} from "react-router";
import {playSingleSong} from "../../../MainPage";
import {isSongValid,getSongUrl} from "../../../../../../apis/songListDetailPage";

interface Song{
    title:string,
    alias:string,
    singer:string,
    id:number
}
class OfficialRankList extends React.Component<any, any>{
    click=(id:number)=>{
        this.props.history.push("/song-list/"+id)
    }

    play=(id:number)=>{
        isSongValid(id).then(()=>{
            getSongUrl(id).then(res=>{
                playSingleSong.emit("play", id, res.data.data[0].url, "$rank")
            })
        },()=>{alert("没有播放源")})
    }

    render() {
        return (
            <div style={{width:"100%",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{width:"13%",cursor:"pointer"}}>
                    <img
                        style={{width:"100%",objectFit:"cover",borderRadius:"3px"}}
                        src={this.props.rank.cover}
                        onClick={()=>{this.click(this.props.rank.id)}}
                        alt=""
                    />
                    <div onClick={()=>{this.click(this.props.rank.id)}}>
                        查看全部<RightOutlined/>
                    </div>
                </div>
                <div style={{width:"80%"}}>
                    {this.props.rank.songs.map((item:Song,idx:number)=>(
                        <div
                            style={{backgroundColor:(idx%2===0)?"rgba(0,0,0,0.05)":"white",cursor:"pointer"}}
                            className="officialRankListItem"
                            onClick={()=>{this.play(item.id)}}
                        >
                            <div style={{display:"flex",alignContent:"center"}}>
                                {
                                    idx<3?
                                    <div style={{color:'rgb(201,38,32)',fontWeight:"bolder",marginRight:"8px"}}>
                                        {idx+1}-
                                    </div>:
                                    <div style={{marginRight:"8px"}}>{idx+1}-</div>
                                }
                                <div>{item.title}</div>
                                {item.alias.length?<div style={{color:"grey"}}>({item.alias})</div>:null}
                            </div>
                            <div style={{color:"grey"}}>{item.singer}</div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

export default withRouter(OfficialRankList)