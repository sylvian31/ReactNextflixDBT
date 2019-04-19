import React, { Component } from 'react';

const VideoDetail = (props) => {
    return (
        <div>
            <h1>{props.title}</h1>
            <p>{props.description}</p>
        </div>
    )
}

export default VideoDetail;