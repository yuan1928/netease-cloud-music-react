import React from "react";
import {getSongListDetailInfo} from "../../../../../apis/songListDetailPage";
import "./Header.css"
import {PlayCircleFilled, PlusOutlined, FileAddOutlined, ShareAltOutlined,
    DownloadOutlined, CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";

interface State{
    id:number,
    imgUrl:string,
    title:string,
    creator:string,
    creatorImg:string,
    createTime:string,
    tag:string[],
    songsCount:number,
    playCount:number,
    subscribeCount:number,
    shareCount:number,
    description:string,
    descriptionAbstractRef:any,
    descriptionFullRef:any
}
class Header extends React.Component<any, any>{
    state:State={
        id:this.props.id,
        imgUrl:"",
        title:"",
        creator:"",
        creatorImg:"",
        createTime:"",
        tag:[],
        songsCount:0,
        playCount:0,
        subscribeCount:0,
        shareCount:0,
        description:"",
        descriptionAbstractRef:React.createRef(),
        descriptionFullRef:React.createRef()
    }

    componentDidMount() {
        getSongListDetailInfo(this.state.id).then(res=>{
            const data=res.data.playlist
            console.log(data);
            this.setState(()=>({
                imgUrl:data.coverImgUrl,
                title:data.name,
                creator:data.creator.nickname,
                creatorImg:data.creator.avatarUrl,
                createTime:this.getCreateTime(data.createTime),
                tag:data.tags,
                songsCount:data.trackIds.length,
                playCount:data.playCount,
                subscribeCount:data.subscribedCount,
                shareCount:data.shareCount,
                description:(data.description!==undefined && data.description!==null)?data.description:""
            }),()=>{this.forceUpdate()})
        })
    }

    getCreateTime=(time:number)=>{
        const Time=new Date(time)
        return Time.getFullYear()+"年"+Time.getMonth()+"月"+Time.getDate()+"日"
    }

    showFullDescription=()=>{
        const abstract=this.state.descriptionAbstractRef
        abstract.current.style.display="none"
        const full=this.state.descriptionFullRef
        full.current.style.display="flex"
    }

    showAbstractDescription=()=>{
        const abstract=this.state.descriptionAbstractRef
        abstract.current.style.display="flex"
        const full=this.state.descriptionFullRef
        full.current.style.display="none"
    }

    render() {
        return (
            <div style={{width:"100%",display:"flex",alignItems:"flex-start"}}>
                <img src={this.state.imgUrl} style={{width:"20%",objectFit:"cover",borderRadius:"6px",marginRight:"10px"}}/>
                <div style={{width:"68%"}}>
                    <div className="songListPageHeaderRow">
                        <div style={{padding:"0 5px 0 5px", color:"rgb(201,38,32)",marginRight:"6px",
                                     border:"rgb(201,38,32) solid 0.05px",borderRadius:"3px"}}>
                            歌单
                        </div>
                        <div style={{fontSize:"25px",fontWeight:"bolder"}}>{this.state.title}</div>
                    </div>
                    <div className="songListPageHeaderRow">
                        <img src={this.state.creatorImg} style={{width:"40px",objectFit:"cover",borderRadius:"50%"}}/>
                        <div style={{color:"cornflowerblue",margin:"0 10px 0 3px"}}>{this.state.creator}</div>
                        <div style={{color:"rgba(0,0,0,0.4)"}}>{this.state.createTime}创建</div>
                    </div>
                    <div className="songListPageHeaderRow">
                        <div className="songListPageHeaderButtonSelected">
                            <PlayCircleFilled/>
                            播放全部
                            <PlusOutlined/>
                        </div>
                        <div className="songListPageHeaderButton">
                            <FileAddOutlined/>
                            收藏({this.state.subscribeCount})
                        </div>
                        <div className="songListPageHeaderButton">
                            <ShareAltOutlined/>
                            分享({this.state.shareCount})
                        </div>
                        <div className="songListPageHeaderButton">
                            <DownloadOutlined/>
                            下载全部
                        </div>
                    </div>
                    <div className="songListPageHeaderRow">
                        标签：
                        {this.state.tag.map((item,idx)=>(
                            <>
                                {
                                    idx!==this.state.tag.length-1?
                                        <div style={{display:"flex"}}><div style={{color:"cornflowerblue"}}>{item}</div>/</div>:
                                        <div style={{color:"cornflowerblue"}}>{item}</div>
                                }
                            </>
                        ))}
                    </div>
                    <div className="songListPageHeaderRow">
                        <div style={{marginRight:"20px"}}>歌曲：{this.state.songsCount}</div>
                        播放：{Math.floor(this.state.playCount/10000)}万
                    </div>
                    <div className="songListPageHeaderRow">
                        简介：
                        {
                            this.state.description.length<=100?
                                <>{this.state.description}</>:
                                <div style={{display:"flex"}} ref={this.state.descriptionAbstractRef}>
                                    {this.state.description.slice(0,11)+"..."}
                                    <CaretDownOutlined onClick={this.showFullDescription}  style={{color:"rgb(201,38,32)"}}/>
                                </div>
                        }
                    </div>
                    <div
                        className="songListPageHeaderRow"
                         style={{display:"none",textAlign:"start"}}
                         ref={this.state.descriptionFullRef}
                    >
                        {this.state.description}
                        <CaretUpOutlined onClick={this.showAbstractDescription} style={{color:"rgb(201,38,32)"}}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Header