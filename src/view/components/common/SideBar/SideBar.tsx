import React from "react";
import 'antd/dist/antd.css'
import {VerticalAlignBottomOutlined,FieldTimeOutlined,CaretDownOutlined,
    PlusOutlined,HeartOutlined,FireOutlined} from '@ant-design/icons'
import {Button,Tooltip} from "antd";

const style=require("./SideBar.css")

interface IButton{
    title:string,
    class:string,
    href: string
    id:number
}
interface State{
    buttonGroup:IButton[]
    refs:any
    clicked:number
    isLogin:boolean
    isShowSongsList:boolean
    //songsListIcon:any
}
class SideBar extends React.Component<any, any>{
    private click: (cur:number) => void;
    constructor(props:any) {
        super(props);
        this.click = (cur) => {
            let clicked = this.state.refs.current.childNodes[this.state.clicked]
            clicked.className = (this.state.clicked>=7)?"ableSpecial":"able"
            let newClicked = this.state.refs.current.childNodes[cur]
            newClicked.className = (cur>=7)?"clickedSpecial":"clicked"
            this.setState({clicked:cur})
        }
    }

    state:State={
        buttonGroup:[
            {title:"发现音乐",class:"clicked",href:"",id:0},
            {title:"播客",class:"able",href:"",id:1},
            {title:"视频",class:"able",href:"",id:2},
            {title:"朋友",class:"able",href:"",id:3},
            {title:"直播",class:"able",href:"",id:4},
            {title:"私人FM",class:"able",href:"",id:5},
        ],
        refs:React.createRef(),
        clicked:0,
        isLogin:false,
        isShowSongsList:true,
        //songsListIcon:React.createRef()
    }

    componentDidMount() {
        this.state.refs.current.focus()
        //this.state.songsListIcon.current.focus()
    }

    render() {
        return (
            <div id='sideRoot' ref={this.state.refs}>
                <style ref={style} scoped/>
                {
                    this.state.buttonGroup.map((item)=>(
                        <div className={item.class} key={item.id} onClick={()=>{this.click(item.id)}}>
                            {item.title}
                        </div>
                    ))
                }

                {
                    this.state.isLogin?
                    <div className="able" onClick={()=>{this.click(6)}}>我的音乐</div>:
                    <div className="disabled">我的音乐</div>
                }

                <div className="ableSpecial" onClick={()=>{this.click(7)}}>
                    <VerticalAlignBottomOutlined className="sideIcon"/>
                    <div>本地与下载</div>
                </div>
                <div className="ableSpecial" onClick={()=>{this.click(8)}}>
                    <FieldTimeOutlined className="sideIcon"/>
                    <div>最近播放</div>
                </div>
                <div className={this.state.isLogin?"ableSpecial":"disabled"}  id="songsList"
                     onClick={()=>{this.setState({isShowSongsList:!this.state.isShowSongsList})}}>
                    <div>创建的歌单</div>
                    <CaretDownOutlined />
                    <PlusOutlined id="songsListIcon" onClick={(e)=>{alert("gd");e.stopPropagation()}}/>
                </div>
                {
                    this.state.isShowSongsList?
                        (
                            <div className="ableSpecial" onClick={()=>{this.click(10)}} id="sideLike">
                                <HeartOutlined className="sideIcon"/>
                                <div>我喜欢的音乐</div>
                                <Tooltip title="开启心动模式">
                                    <Button size="small" icon={<FireOutlined/>} id="sideLikeIcon" shape="circle"/>
                                </Tooltip>
                            </div>
                        )
                        :
                        null
                }

            </div>
        )
    }
}

export default SideBar