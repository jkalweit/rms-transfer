require.config({
  paths: {
    "jquery": "/bower_components/jquery/dist/jquery.min",
    "react": "/bower_components/react/react",
    "socket.io": "/socket.io/socket.io"
  }
});

require(['require', 'exports', 'react', 'inventory'], function (require, exports, React, inventory) {
  React.render(React.createElement(inventory.Inventory, null), document.getElementById('content'));
});
