var React = require('react'), _ = require('underscore'),
Sticky = React.createClass({
  reset: function() {
    var html = document.documentElement,
        body = document.body,
        windowOffset = window.pageYOffset || (html.clientHeight ? html : body).scrollTop,
        elementOffset = this.getDOMNode().getBoundingClientRect().top + windowOffset;

    this.setState({
      originalHeight: this.getDOMNode().offsetHeight,
      originalOffset: elementOffset,
      sticky: windowOffset >= elementOffset + this.props.stickyOffset
    });
  },

  handleResize: function() {
    this.setState({sticky: false}, this.reset);
  },

  handleScroll: function() {
    this.setState({
      sticky: window.pageYOffset >= this.state.originalOffset + this.props.stickyOffset
    });
  },

  getDefaultProps: function() {
    return {
      type: React.DOM.div,
      stickyClass: 'sticky',
      stickyOffset: 0,
      stickyStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0
      }
    };
  },

  getInitialState: function() {
    return {
      sticky: false,
      originalHeight: 0,
      originalOffset: Infinity
    };
  },

  componentDidMount: function() {
    // To avoid invalid heights:
    // http://stackoverflow.com/questions/21289115/element-height-incorrect-because-browser-hasnt-finished-rendering-it
    setTimeout(this.reset, 100);
    window.addEventListener('scroll', this.handleScroll = _.throttle(this.handleScroll, 10));
    window.addEventListener('resize', this.handleResize = _.debounce(this.handleResize, 10));
  },

  componentWillUnmount: function() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  },

  componentDidUpdate: function(prevProps, prevState) {
    var parent = this.getDOMNode().parentNode;
    if (this.state.sticky) {
      parent.style.paddingTop = this.state.originalHeight + "px";
    } else {
      parent.style.paddingTop = "0px";
    }
  },

  render: function() {
    return this.props.type({
      style: this.state.sticky ? this.props.stickyStyle : {},
      className: this.state.sticky ? this.props.stickyClass : ''
    }, this.props.children);
  }
});

module.exports = Sticky;
