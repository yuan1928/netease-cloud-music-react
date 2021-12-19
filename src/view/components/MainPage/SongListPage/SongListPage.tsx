import React from "react";
import Header from "./Header/Header";
import Songs from "./Songs/Songs";
import Comments from "./Comments/Comments";
import Collectors from "./Collectors/Collectors";
import {withRouter,Route,Redirect} from "react-router";
import {NavMenu} from "../../common/NavMenu/NavMenu";
import {getSongListDetailInfo} from "../../../../apis/songListDetailPage";

interface State{
    menu:any,
    id:number
}

class SongListPage extends React.Component<any, any>{
    state:State={
        menu:[
            {key:"1",title:"歌曲列表",click:()=>{this.click("songs")}},
            {key:"2",title:"评论",click:()=>{this.click("comments")}},
            {key:"3",title:"收藏者",click:()=>{this.click("collectors")}},
        ],
        id:this.props.match.params.id
    }

    componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if(this.state.menu[1].title==="评论")
        {
            getSongListDetailInfo(this.state.id).then(res=>{
                const menu=this.state.menu
                menu[1].title="评论("+res.data.playlist.commentCount+")"
                this.forceUpdate()
            })
        }
    }

    click=(subPage:string)=>{
        this.props.history.push("/song-list/"+subPage+"/"+this.state.id)
    }
    render() {
        return (
            <div style={{width:"100%", height:"80vh", position:"relative",overflowY:"scroll",padding:'20px'}}>
                <Header id={this.state.id}/>
                <NavMenu menu={this.state.menu}/>
                <Route path="/song-list/songs/:id/:songID?" component={Songs}/>
                <Route path="/song-list/comments/:id" component={Comments}/>
                <Route path="/song-list/collectors/:id" component={Collectors}/>
                {this.props.location.pathname==="/song-list/"+this.state.id?
                    <Redirect to={"/song-list/songs/"+this.state.id}/>:null}

            </div>
        )
    }
}

export default withRouter(SongListPage)