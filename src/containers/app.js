import React, { Component } from 'react';
import SearchBar from '../components/search-bar';
import VideoDetail from '../components/video-detail';
import Video from '../components/video';
import VideoList from './video-list';
import axios from 'axios';

const API_KEY = "api_key=77502234e4e0fe937bbe32644fdbb523";
const API_END_POINT = "https://api.themoviedb.org/3/";
const POPULAR_MOVIES_URL = "discover/movie?language=fr&sort_by=popularity.desc&append_to_response=images";
const SEARCH_MOVIE_URL = "search/movie?language=fr";

const testurl = "https://api.themoviedb.org/3/discover/movie?language=fr&sort_by=popularity.desc&append_to_response=images&api_key=77502234e4e0fe937bbe32644fdbb523"
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentMovie: {},
            movieList: {},
            intervalBeforeRequest: 1000,
            lockRequest: false
        }
    }

    componentWillMount() {
        this.initMovies();
    }

    render() {
        const renderVideoList = () => {
            if (this.state.movieList.length > 0) {
                return <VideoList movieList={this.state.movieList} callback={this.onClickListItem.bind(this)} />
            }
        }

        return (
            <div>
                <div className="search-bar">
                    <SearchBar callback={this.onClickSearch.bind(this)} />
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <Video videoId={this.state.currentMovie.videoId} />
                        <VideoDetail title={this.state.currentMovie.title} description={this.state.currentMovie.overview} />
                    </div>
                    <div className="col-md-4">
                        {renderVideoList()}
                    </div>
                </div>
            </div>
        );
    }

    initMovies() {
        axios.get(`${API_END_POINT}${POPULAR_MOVIES_URL}&${API_KEY}`).then(function (response) {
            this.setState({ currentMovie: response.data.results[0], movieList: response.data.results.slice(1, 6) }, function () {
                this.applyVideoToCurrentMovie();
            });
        }.bind(this));
    };

    applyVideoToCurrentMovie() {
        axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}?append_to_response=videos&${API_KEY}`).then(function (response) {
            const youtubeKey = response.data.videos.results[0].key;
            let newCurrentMovieState = this.state.currentMovie;
            newCurrentMovieState.videoId = youtubeKey;
            this.setState({ currentMovie: newCurrentMovieState })
        }.bind(this));
    };

    onClickListItem(movie) {
        this.setState({ currentMovie: movie }, function () {
            this.applyVideoToCurrentMovie();
            this.setRecommandation();
        })
    };

    onClickSearch(searchText) {
        if (searchText) {
            axios.get(`${API_END_POINT}${SEARCH_MOVIE_URL}&${API_KEY}&query=${searchText}`).then(function (response) {
                if(response.data && response.data.results[0]){
                    if(response.data.results[0].id != this.state.currentMovie.id)
                    this.setState({currentMovie: response.data.results[0]}, () => {
                        this.applyVideoToCurrentMovie();
                        this.setRecommandation();
                    })
                }
            }.bind(this));
        }
    }

    setRecommandation(){
        axios.get(`${API_END_POINT}movie/${this.state.currentMovie.id}/recommendations?${API_KEY}&language=fr`).then(function (response) {          
            this.setState({ movieList: response.data.results.slice(0, 5) });
        }.bind(this));
    }
}


