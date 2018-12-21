import React, { Component } from 'react';
import './app.css';
import FacebookPlayer from 'react-facebook-player';
import YouTube from 'react-youtube';
import $ from 'jquery';
import ReactDOM from 'react-dom';

class Videos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      source: 'url'
    };
  }

  componentDidMount() {
    this.state.source = $('#filterby option:selected').val();
    fetch('/api/getVideos')
      .then(res => res.json())
      .then(
        (response) => {
          this.setState({
            isLoaded: true,
            items: response.items
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  onChange(event) {
    this.setState({ source: event.target.value });
  }

  isvalid(item) {
    if (item.source !== 'url' && !item.hasOwnProperty('title')) { return ('video has no title'); }
    if (!item.hasOwnProperty('views')) { return ('video has no views'); }
    if (!item.hasOwnProperty('type')) { return ('video has no type'); }
    if (!item.hasOwnProperty('source')) { return ('video has no source'); }
    if ((item.source === 'youtube' || item.source === 'facebook') && !item.hasOwnProperty('videoId')) { return ('video has no videoId'); }
    return 'OK';
  }

  getPlayer(item) {
    const error = this.isvalid(item);
    if (error !== 'OK') { return <_Error value={error} />; }
    if (item.source === 'url') { return <_VideoPlayer value={item} />; }
    if (item.source === 'youtube') { return <_YoutubePlayer value={item} />; }
    if (item.source === 'facebook') { return <_FacebookPlayer value={item} />; }
  }

  roundViews(num) {
    debugger;
    var numParts = Math.floor(num.toString().length /3 )
    return (parseInt(num) / Math.pow(1000, numParts)).toFixed(1) + " " + ["TH", "M", "B"][numParts -1] + " views"
  }

  render() {
    const {
      error, isLoaded, items, source
    } = this.state;
    const filterItems = $.grep(items, (item, i) => (item.source === source));
    return (
      <div>
        <div>
          <div className="header">
            <span>FEED VIDEO</span>
            <span className="filterbywrapper">Filter By Source:</span>
            <select id="filterby" onChange={this.onChange.bind(this)}>
              <option value="facebook">Facebook</option>
              <option value="youtube">YOUTUBE</option>
              <option value="url">URL</option>
            </select>
          </div>
        </div>
        <div>
          {filterItems.map(_item => (
            <div className="video_wrapper">
              <div className="headers">
                <span className="title">{_item.title}</span>
                <span className="views">{this.roundViews(_item.views)}</span>
              </div>
              <div className="video_div">{this.getPlayer(_item)}</div>
            </div>
          ))}
          ;
        </div>
      </div>
    );
  }
}


class _Error extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }

  render() {
    return (
      <div>
        {' '}
Error
        {' '}
        {this.props.value}
      </div>
    );
  }
}

class _VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }

  render() {
    return (
      <video controls>
        <source src={this.props.value.url} type="video/mp4" />
      </video>
    );
  }
}

class _FacebookPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }

  render() {
    return <FacebookPlayer videoId={this.props.value.videoId} />;
  }
}

class _YoutubePlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  }

  render() {
    const opts = {
      playerVars: {
        autoplay: 1
      }
    };

    return (
      <YouTube
        videoId={this.props.value.videoId}
        opts={opts}
      />
    );
  }
}


// eslint-disable-next-line react/no-multi-comp
export default class App extends Component {
  componentDidMount() {
    fetch('/api/getUsername')
      .then(res => res.json())
      .then(user => this.setState({ username: user.username }));
  }

  render() {
    return (
      <div>
        <Videos />
      </div>
    );
  }
}
