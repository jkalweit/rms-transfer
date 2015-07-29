require.config({
  paths: {
    "jquery": "/bower_components/jquery/dist/jquery.min",
    "react": "/bower_components/react/react",
    "react/addons": "/bower_components/react/react-with-addons",
    "moment": "/bower_components/moment/moment",
    "socket.io": "/socket.io/socket.io"
  }
});

require(['require', 'exports', 'react/addons', 'views'], function (require, exports, React, views) {
  React.render(React.createElement(views.MainView, null), document.getElementById('content'));
});
