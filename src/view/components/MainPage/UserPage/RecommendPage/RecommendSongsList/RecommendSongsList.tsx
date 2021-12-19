import React from "react";
import 'antd/dist/antd.css'
import './RecommendSongsList.css'
import {RightOutlined,PlayCircleOutlined} from '@ant-design/icons'
import {getRecommendSongsList} from "../../../../../../apis/recommendPage";
import ShowFramI from "../../../../common/ShowFramI/ShowFramI";

interface Song{
    imgUrl:string,
    playCount:number,
    title:string,
    id:number,
}
interface Style{
    songsInfo:Song[],
    dataUrl:any[],
    isRequest:boolean
}
class RecommendSongsList extends React.Component<any, any>{
    state:Style={
        songsInfo:[],
        dataUrl:[],
        isRequest:false
    }

    componentDidMount() {
        if(!this.state.isRequest)
        {
            getRecommendSongsList().then(res=>{
                for(let item of res.data.result)
                {
                    this.state.songsInfo.push({
                        imgUrl:item.picUrl,
                        playCount:item.playCount,
                        title:item.name,
                        id:item.id,
                    })
                }
                return new Promise((resolve)=>{resolve("")})
            }).then(res=>{this.forceUpdate();this.setState({isRequest:true})})
        }
    }

    render() {
        //const songs=this.state.songs
        return (
            <div id="recommendSongsListRoot">
                <span style={{width:"90%",marginLeft:"10%",fontSize:"20px",fontWeight:"bolder",display:"flex",alignItems:"center"}}>
                    推荐歌单<RightOutlined/>
                </span>
                <div style={{width:"80%",marginLeft:"10%",display:"flex",flexWrap:"wrap"}}>
                    {
                        this.state.songsInfo.map((item)=>(
                            <ShowFramI className="recommendSongContainer" item={item} titlePos="200px" key={item.id}/>
                        ))
                    }
                </div>
            </div>
        )
    }
}

export default RecommendSongsList