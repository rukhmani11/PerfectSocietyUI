import { Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import React, { Component } from "react";

const useStyles = makeStyles((theme: Theme) => ({
    iframe: {
        width: "100%",
        height: "1000px",
        overflow: "hidden",
        border: "none"
    },
    outerDiv: {
        width: '100%',
        height: '100%'
    }
}));

var __html = require('./Html.js');
//var __html = require('../../../public/html/TermsConditionsNew.html');
var template = { __html: __html };

// var perf = require('../../html/home.html');


const ExampleB = () => {
    const classes = useStyles();
    function iframe() {
        return {
            __html: '<iframe src="../html/TermsConditionsNew.html" width="100%" height="1000"></iframe>'
        }
    }

    return (

        <div className={classes.outerDiv}>
            {/* <div className="screen-share">
                <span dangerouslySetInnerHTML={template} />
            </div> */}
            {/* https://stackoverflow.com/questions/50792942/how-to-import-html-file-into-react-component-and-use-it-as-a-component */}
            {/* <iframe src={'/aboutUs.html'}></iframe> */}
            <iframe src={'/html/TermsConditionsNew.html'}  className={classes.iframe} height="6000px"></iframe>
            {/* <div>
                <div dangerouslySetInnerHTML={iframe()} />
            </div> */}
        </div>
    )
}

export default ExampleB

