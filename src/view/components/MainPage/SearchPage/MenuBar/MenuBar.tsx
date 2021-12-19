import React from "react";
import 'antd/dist/antd.css'
import {NavMenu,MenuItem} from "../../../common/NavMenu/NavMenu";
import {withRouter} from "react-router";

interface State{
    menuItem:MenuItem[]
}
class MenuBar extends React.Component<any, any>{
    state:State={
        menuItem:[
            {key:"1",title:"单曲",click:()=>{this.props.history.push("/search/singles/"+this.props.keyword)}},//click跳转路由
            {key:"2",title:"歌手",click:()=>{this.props.history.push("/search/singers/"+this.props.keyword)}},
            {key:"3",title:"专辑",click:()=>{this.props.history.push("/search/albums/"+this.props.keyword)}},
            {key:"4",title:"视频",click:()=>{this.props.history.push("/search/videos/"+this.props.keyword)}},
            {key:"5",title:"歌单",click:()=>{this.props.history.push("/search/song-lists/"+this.props.keyword)}},
            {key:"6",title:"歌词",click:()=>{this.props.history.push("/search/lyrics/"+this.props.keyword)}},
            {key:"7",title:"用户",click:()=>{this.props.history.push("/search/users/"+this.props.keyword)}},
        ]
    }
    render() {
        return (
            <div>
                <NavMenu menu={this.state.menuItem}/>
            </div>
        )
    }
}

export default withRouter(MenuBar)