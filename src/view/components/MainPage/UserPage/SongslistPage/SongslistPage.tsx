import React from "react";
import {getSongLists} from "../../../../../apis/songListPage";
import ShowFramI from "../../../common/ShowFramI/ShowFramI";
import './SongslistPage.css'
import {Pagination} from "antd";
import {RightOutlined} from "@ant-design/icons";

interface Item{
    playCount:number,
    imgUrl:string,
    author:string,
    title:string,
    id:number,
    updateTime:number
}
interface State{
    curSongListsNum:number
    curTag:string,
    curOffset:number,
    curSongLists:Item[],
    mainConsole:string[],
    mainConsoleRef:any
}
class SongslistPage extends React.Component<any, any>{
    state:State={
        curSongListsNum:0,
        curTag:"全部",
        curOffset:Infinity,
        curSongLists:[],
        mainConsole:["华语","流行","摇滚","民谣","电子","另类/独立","轻音乐","综艺","影视原声","ACG"],
        mainConsoleRef:React.createRef()
    }

    componentDidMount() {
        this.getCurInfo()
    }

    getCurInfo=()=> {
        this.setState(() => ({curSongLists: []}), () => {
            getSongLists(this.state.curTag, this.state.curOffset).then(res => {
                for (let item of res.data.playlists) {
                    this.state.curSongLists.push({
                        playCount: item.playCount,
                        imgUrl: item.coverImgUrl,
                        author: item.creator.nickname,
                        title: item.name,
                        id: item.id,
                        updateTime: item.updateTime
                    })
                }
                this.setState({curOffset: this.state.curSongLists[this.state.curSongLists.length-1].updateTime,
                    curSongListsNum: res.data.total})
                //console.log(this.state.curOffset,this.state.curSongListsNum);
                this.forceUpdate()
            })
        })
    }

    chooseTag=(idx:number)=>{
        for(let button of this.state.mainConsoleRef.current.children) {button.id=""}
        const node=this.state.mainConsoleRef.current.children[idx]
        node.id="songListsPageTagButtonSelected"
        this.setState(()=>({curTag:this.state.mainConsole[idx],curOffset:Infinity}),()=>{
            this.getCurInfo()
        })
    }


    render() {
        return (
            <div style={{width:"100%", height:"80vh", display:"flex",flexWrap:"wrap",position:"relative",overflowY:"scroll"}}>
                <div style={{fontSize:"20px", fontWeight:"bolder", width:"100%", display:"flex",padding:"20px"}}>
                    精品歌单
                </div>
                <div id="songListsPageConsole">
                    <div style={{border:"gray solid 1px",borderRadius:"10px",padding:'3px 8px 3px 8px'}}>
                        {this.state.curTag}
                        <RightOutlined/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-evenly",alignContent:"center"}} ref={this.state.mainConsoleRef}>
                        {this.state.mainConsole.map((item,idx)=>(
                            <div className="songListsPageTagButton" onClick={()=>{this.chooseTag(idx)}}>{item}</div>
                        ))}
                    </div>
                </div>
                {
                    this.state.curSongLists.map(item=>(
                            <div className="songsListPageSongListItem">
                                <ShowFramI
                                    item={item}
                                    titlePos="220px"
                                />
                            </div>
                        ))
                }
                <div style={{width:"100%",margin:'20px 0 50px 0',display:"flex",justifyContent:"center"}}>
                    <Pagination
                                defaultCurrent={1}
                                defaultPageSize={50}
                                total={this.state.curSongListsNum}
                                onChange={()=>{this.getCurInfo()}}
                    />
                </div>

            </div>
        )
    }
}

export default SongslistPage