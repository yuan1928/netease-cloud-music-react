import React from "react";
import "./SearchPage.css"
import MenuBar from "./MenuBar/MenuBar";
import {playMusicEvent} from "../MainPage";
import {Route, Redirect,withRouter} from "react-router-dom";
import Singles from "./Singles/Singles";
import Singers from "./Singers/Singers";
import Albums from "./Albums/Albums";
import Videos from "./Videos/Videos";
import SongLists from "./SongLists/SongLists";
import Lyrics from "./Lyrics/Lyrics";
import Users from "./Users/Users";
import {updateKeyword} from "../../common/NavBar/NavBar";

interface State{
    keyword:string
    row:number
    subPage:string
}
class SinglesWithEvent extends React.Component<any, any>{
    render() {
        return (<Singles playMusicEvent={playMusicEvent}/>)
    }
}

class SearchPage extends React.Component<any, any>{
    state:State={
        keyword:this.props.match.params.keyword,
        row:this.props.match.params.selectedRow,
        subPage:"singles"
    }

    componentDidMount() {
        updateKeyword.addListener("update",(keyword:string,subPage:string)=>{
            this.setState({keyword:keyword, row:Infinity, subPage:subPage})
        })
    }

    render() {
        console.log(this.props.location.pathname,this.state.keyword);
        return (
            <div id="searchRoot" style={{width:"100%", overflowY:"scroll"}}>
                <MenuBar keyword={this.state.keyword}/>
                <Route path="/search/singles/:keyword" component={SinglesWithEvent}/>
                <Route path="/search/singers/:keyword" component={Singers}/>
                <Route path="/search/albums/:keyword" component={Albums}/>
                <Route path="/search/videos/:keyword" component={Videos}/>
                <Route path="/search/song-lists/:keyword" component={SongLists}/>
                <Route path="/search/lyrics/:keyword" component={Lyrics}/>
                <Route path="/search/users/:keyword" component={Users}/>
                {
                    this.props.location.pathname==="/search/"+this.state.keyword+"/"+this.state.row?
                        <Redirect to={"/search/"+this.state.subPage+"/"+this.state.keyword}/>:null
                }
            </div>
        )
    }
}

export default withRouter(SearchPage)