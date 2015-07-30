/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./Models.ts" />

import React = require('react/addons');
import $ = require('jquery');
import io = require('socket.io');
import moment = require('moment');
import models = require('Models');




export class TestView  extends React.Component<any, any> {
    render() {
        return (
            <div>Hello from Test View6!</div>
        );
    }
}
