require.config({
  paths: {
    "jquery": "/bower_components/jquery/dist/jquery.min",
    "react": "/bower_components/react/react",
    "socket.io": "/socket.io/socket.io"
  }
});

require(['require', 'exports', 'react', 'views'], function (require, exports, React, views) {
  React.render(React.createElement(views.InventoryView, null), document.getElementById('content'));
});
