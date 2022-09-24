import React, {
    useEffect,
    useState,
    useImperativeHandle,
    forwardRef,
  } from 'react';
  import { Rnd } from 'react-rnd';
  
  // layout
  export default forwardRef((props, ref) => {
    const { dataSource, rows, cols, background, lock, noborder } = props;
    const [data, setData] = useState([]);
    const [totalWidth, setTotalWidth] = useState(0);
    const [totalHeight, setTotalHeight] = useState(0);
    useEffect(() => {
      setData(
        dataSource.map((v, i) => {
          v.id = i;
          return v;
        }),
      );
    }, [dataSource]);
    useEffect(() => {
      window.onresize = () => {
        setTotalWidth(document.getElementById('rnd_container')?.offsetWidth);
        setTotalHeight(document.getElementById('rnd_container')?.offsetHeight);
      };
      window.setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 1);
    }, []);
    useImperativeHandle(ref, () => ({
      data,
      rows,
      cols,
    }));
    const getContent = () => {
      return data.map((v) =>
        totalWidth && totalHeight ? (
          <RND
            item={v}
            lock={lock}
            noborder={noborder}
            pages={{
              rows: rows ?? 1,
              cols: cols ?? 1,
              totalWidth,
              totalHeight,
            }}
            existArea={data
              .filter((t) => t.id != v.id)
              .map((t) => [t.x, t.y, t.width, t.height])}
            onDrag={(res) => {
              let tmp = [];
              data.map((t) => {
                if (t.id == v.id) {
                  t.x = res.x;
                  t.y = res.y;
                }
                tmp.push(t);
              });
              setData(tmp);
            }}
            onResize={(res) => {
              let tmp = [];
              data.map((t) => {
                if (t.id == v.id) {
                  t.width = res.width;
                  t.height = res.height;
                }
                tmp.push(t);
              });
              setData(tmp);
            }}
          />
        ) : null,
      );
    };
    return (
      <div
        id="rnd_container"
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
          background: 'gray',
          backgroundImage: background ? `url(${background})` : null,
        }}
        onContextMenu={(e) => {
          e.preventDefault();
        }}
      >
        {getContent()}
      </div>
    );
  });
  
  // 封装Rnd组件
  const RND = (props) => {
    const { item, pages, existArea, lock, noborder, onDrag, onResize } = props;
    let perrow = Math.floor(10000 / pages.rows) / 100;
    let percol = Math.floor(10000 / pages.cols) / 100;
    console.log(item.width, item.height, percol, perrow);
    const [shadow, setShadow] = useState({ show: false });
    let tmpfilt = [];
    for (let i in item.filted) {
      if (item.filted[i]) {
        tmpfilt.push(JSON.stringify(item.filted[i]));
      }
    }
    return [
      <Rnd
        style={
          noborder
            ? {}
            : {
                zIndex: 1,
                border: 'solid 1px #ddd',
              }
        }
        bounds="parent"
        size={{
          width: `${item.width * percol}%`,
          height: `${item.height * perrow}%`,
        }}
        position={{
          x: (item.x * percol * pages.totalWidth) / 100 ?? 0,
          y: (item.y * perrow * pages.totalHeight) / 100 ?? 0,
        }}
        disableDragging={!!lock}
        enableResizing={
          lock
            ? false
            : {
                bottomRight: true,
              }
        }
        onDrag={(e, d) => {
          let tmp = true;
          let tmpx = parseInt(((d.x * pages.cols) / pages.totalWidth).toFixed(0));
          let tmpy = parseInt(
            ((d.y * pages.rows) / pages.totalHeight).toFixed(0),
          );
          existArea.map((v) => {
            if (
              tmpx + item.width - 1 >= v[0] &&
              tmpx < v[0] + v[2] &&
              tmpy + item.height - 1 >= v[1] &&
              tmpy < v[1] + v[3]
            ) {
              tmp = false;
            }
          });
          if (tmp) {
            setShadow({
              show: true,
              x: tmpx,
              y: tmpy,
              width: item.width,
              height: item.height,
            });
          }
        }}
        onResize={(e, direction, ref, delta, position) => {
          let tmp = true;
          let tmpw = parseInt(
            ((ref.offsetWidth * pages.cols) / pages.totalWidth).toFixed(0),
          );
          let tmph = parseInt(
            ((ref.offsetHeight * pages.rows) / pages.totalHeight).toFixed(0),
          );
          tmpw = tmpw > 1 ? tmpw : 1;
          tmph = tmph > 1 ? tmph : 1;
          existArea.map((v) => {
            if (
              item.x + tmpw - 1 >= v[0] &&
              item.x < v[0] + v[2] &&
              item.y + tmph - 1 >= v[1] &&
              item.y < v[1] + v[3]
            ) {
              tmp = false;
            }
          });
          if (tmp) {
            setShadow({
              show: true,
              x: item.x,
              y: item.y,
              width: tmpw,
              height: tmph,
            });
          }
        }}
        onDragStop={(e, d) => {
          if (shadow.show) {
            onDrag({
              x: shadow.x,
              y: shadow.y,
            });
            setShadow({ show: false });
          }
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          if (shadow.show) {
            onResize({
              width: shadow.width,
              height: shadow.height,
            });
            setShadow({ show: false });
          }
        }}
      >
        {item.content}
      </Rnd>,
      shadow.show && (
        <Rnd
          style={{
            zIndex: 2,
            background: 'blue',
            opacity: 0.2,
            transitionDuration: 0.1,
          }}
          bounds="parent"
          size={{
            width: `${shadow.width * percol}%`,
            height: `${shadow.height * perrow}%`,
          }}
          position={{
            x: (shadow.x * percol * pages.totalWidth) / 100,
            y: (shadow.y * perrow * pages.totalHeight) / 100,
          }}
          enableResizing={false}
          disableDragging={false}
        />
      ),
    ];
  };
  