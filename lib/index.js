'use strict';

var React = require('react');
var reactRnd = require('react-rnd');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var index = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var dataSource = props.dataSource,
      rows = props.rows,
      cols = props.cols,
      background = props.background,
      lock = props.lock,
      noborder = props.noborder;

  var _useState = React.useState([]),
      _useState2 = _slicedToArray(_useState, 2),
      data = _useState2[0],
      setData = _useState2[1];

  var _useState3 = React.useState(0),
      _useState4 = _slicedToArray(_useState3, 2),
      totalWidth = _useState4[0],
      setTotalWidth = _useState4[1];

  var _useState5 = React.useState(0),
      _useState6 = _slicedToArray(_useState5, 2),
      totalHeight = _useState6[0],
      setTotalHeight = _useState6[1];

  React.useEffect(function () {
    setData(dataSource.map(function (v, i) {
      v.id = i;
      return v;
    }));
  }, [dataSource]);
  React.useEffect(function () {
    window.onresize = function () {
      var _document$getElementB, _document$getElementB2;

      setTotalWidth((_document$getElementB = document.getElementById('rnd_container')) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.offsetWidth);
      setTotalHeight((_document$getElementB2 = document.getElementById('rnd_container')) === null || _document$getElementB2 === void 0 ? void 0 : _document$getElementB2.offsetHeight);
    };

    window.setTimeout(function () {
      window.dispatchEvent(new Event('resize'));
    }, 1);
  }, []);
  React.useImperativeHandle(ref, function () {
    return {
      data: data,
      rows: rows,
      cols: cols
    };
  });

  var getContent = function getContent() {
    return data.map(function (v) {
      return totalWidth && totalHeight ? /*#__PURE__*/React__default["default"].createElement(RND, {
        item: v,
        lock: lock,
        noborder: noborder,
        pages: {
          rows: rows !== null && rows !== void 0 ? rows : 1,
          cols: cols !== null && cols !== void 0 ? cols : 1,
          totalWidth: totalWidth,
          totalHeight: totalHeight
        },
        existArea: data.filter(function (t) {
          return t.id != v.id;
        }).map(function (t) {
          return [t.x, t.y, t.width, t.height];
        }),
        onDrag: function onDrag(res) {
          var tmp = [];
          data.map(function (t) {
            if (t.id == v.id) {
              t.x = res.x;
              t.y = res.y;
            }

            tmp.push(t);
          });
          setData(tmp);
        },
        onResize: function onResize(res) {
          var tmp = [];
          data.map(function (t) {
            if (t.id == v.id) {
              t.width = res.width;
              t.height = res.height;
            }

            tmp.push(t);
          });
          setData(tmp);
        }
      }) : null;
    });
  };

  return /*#__PURE__*/React__default["default"].createElement("div", {
    id: "rnd_container",
    style: {
      position: 'relative',
      height: '100%',
      width: '100%',
      background: 'gray',
      backgroundImage: background ? "url(".concat(background, ")") : null
    },
    onContextMenu: function onContextMenu(e) {
      e.preventDefault();
    }
  }, getContent());
}); // 封装Rnd组件

var RND = function RND(props) {
  var _ref, _ref2;

  var item = props.item,
      pages = props.pages,
      existArea = props.existArea,
      lock = props.lock,
      noborder = props.noborder,
      onDrag = props.onDrag,
      onResize = props.onResize;
  var perrow = Math.floor(10000 / pages.rows) / 100;
  var percol = Math.floor(10000 / pages.cols) / 100;
  console.log(item.width, item.height, percol, perrow);

  var _useState7 = React.useState({
    show: false
  }),
      _useState8 = _slicedToArray(_useState7, 2),
      shadow = _useState8[0],
      setShadow = _useState8[1];

  var tmpfilt = [];

  for (var i in item.filted) {
    if (item.filted[i]) {
      tmpfilt.push(JSON.stringify(item.filted[i]));
    }
  }

  return [/*#__PURE__*/React__default["default"].createElement(reactRnd.Rnd, {
    style: noborder ? {} : {
      zIndex: 1,
      border: 'solid 1px #ddd'
    },
    bounds: "parent",
    size: {
      width: "".concat(item.width * percol, "%"),
      height: "".concat(item.height * perrow, "%")
    },
    position: {
      x: (_ref = item.x * percol * pages.totalWidth / 100) !== null && _ref !== void 0 ? _ref : 0,
      y: (_ref2 = item.y * perrow * pages.totalHeight / 100) !== null && _ref2 !== void 0 ? _ref2 : 0
    },
    disableDragging: !!lock,
    enableResizing: lock ? false : {
      bottomRight: true
    },
    onDrag: function onDrag(e, d) {
      var tmp = true;
      var tmpx = parseInt((d.x * pages.cols / pages.totalWidth).toFixed(0));
      var tmpy = parseInt((d.y * pages.rows / pages.totalHeight).toFixed(0));
      existArea.map(function (v) {
        if (tmpx + item.width - 1 >= v[0] && tmpx < v[0] + v[2] && tmpy + item.height - 1 >= v[1] && tmpy < v[1] + v[3]) {
          tmp = false;
        }
      });

      if (tmp) {
        setShadow({
          show: true,
          x: tmpx,
          y: tmpy,
          width: item.width,
          height: item.height
        });
      }
    },
    onResize: function onResize(e, direction, ref, delta, position) {
      var tmp = true;
      var tmpw = parseInt((ref.offsetWidth * pages.cols / pages.totalWidth).toFixed(0));
      var tmph = parseInt((ref.offsetHeight * pages.rows / pages.totalHeight).toFixed(0));
      tmpw = tmpw > 1 ? tmpw : 1;
      tmph = tmph > 1 ? tmph : 1;
      existArea.map(function (v) {
        if (item.x + tmpw - 1 >= v[0] && item.x < v[0] + v[2] && item.y + tmph - 1 >= v[1] && item.y < v[1] + v[3]) {
          tmp = false;
        }
      });

      if (tmp) {
        setShadow({
          show: true,
          x: item.x,
          y: item.y,
          width: tmpw,
          height: tmph
        });
      }
    },
    onDragStop: function onDragStop(e, d) {
      if (shadow.show) {
        onDrag({
          x: shadow.x,
          y: shadow.y
        });
        setShadow({
          show: false
        });
      }
    },
    onResizeStop: function onResizeStop(e, direction, ref, delta, position) {
      if (shadow.show) {
        onResize({
          width: shadow.width,
          height: shadow.height
        });
        setShadow({
          show: false
        });
      }
    }
  }, item.content), shadow.show && /*#__PURE__*/React__default["default"].createElement(reactRnd.Rnd, {
    style: {
      zIndex: 2,
      background: 'blue',
      opacity: 0.2,
      transitionDuration: 0.1
    },
    bounds: "parent",
    size: {
      width: "".concat(shadow.width * percol, "%"),
      height: "".concat(shadow.height * perrow, "%")
    },
    position: {
      x: shadow.x * percol * pages.totalWidth / 100,
      y: shadow.y * perrow * pages.totalHeight / 100
    },
    enableResizing: false,
    disableDragging: false
  })];
};

module.exports = index;
