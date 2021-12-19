import React from "react";
import 'antd/dist/antd.css'
import {NavMenu,MenuItem} from "../../../common/NavMenu/NavMenu";
import {withRouter} from "react-router";

interface State{
    menuItem:MenuItem[],
    curren:string
}
class MenuBar extends React.Component<any, any>{
    state:State={
        menuItem:[
            {key:"1",title:"个性推荐",click:()=>{this.props.history.push("/")}},//click跳转路由
            {key:"2",title:"专属定制",click:()=>{this.props.history.push("/user/personal")}},
            {key:"3",title:"歌单",click:()=>{this.props.history.push("/user/songs")}},
            {key:"4",title:"排行榜",click:()=>{this.props.history.push("/user/rank")}},
            {key:"5",title:"歌手",click:()=>{this.props.history.push("/user/singer")}},
            {key:"6",title:"最新音乐",click:()=>{this.props.history.push("/user/new")}},
        ],
        curren:"1"
    }
    render() {
        return (
            <div>
                <NavMenu menu={this.state.menuItem} />
            </div>
        )
    }
}

export default withRouter(MenuBar)