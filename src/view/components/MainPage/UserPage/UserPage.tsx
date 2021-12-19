import React from "react";
import MenuBar from "./MenuBar/MenuBar";
import RecommendPage from "./RecommendPage/RecommendPage";
import PersonalPage from "./PersonalPage/PersonalPage";
import SongslistPage from "./SongslistPage/SongslistPage";
import RankPage from "./RankPage/RankPage";
import SingerPage from "./SingerPage/SingerPage";
import NewSongsPage from "./NewSongsPage/NewSongsPage";
import {Route, Redirect, Router, BrowserRouter} from "react-router-dom";
import {withRouter} from "react-router";

interface State{

}
class UserPage extends React.Component<any, any>{
    state:State={

    }
    render() {
        return (
                <div id="userRoot">
                    <MenuBar/>
                    <Route path="/user/user" component={RecommendPage}/>
                    <Route path="/user/personal" component={PersonalPage}/>
                    <Route path="/user/songs" component={SongslistPage}/>
                    <Route path="/user/rank" component={RankPage}/>
                    <Route path="/user/singer" component={SingerPage}/>
                    <Route path="/user/new" component={NewSongsPage}/>
                    {this.props.location.pathname==='/user'?<Redirect to="/user/user"/> :null}
                </div>
        )
    }
}

export default withRouter(UserPage)