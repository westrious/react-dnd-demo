import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
// eslint-disable-next-line
import { DragSource, DropTarget, DndProvider, DragSourceMonitor, DragSourceConnector, ConnectDragSource, DragSourceSpec, DropTargetSpec, DropTargetMonitor, DragSourceCollector, DropTargetCollector, DropTargetConnector, ConnectDropTarget, XYCoord } from 'react-dnd';
import { render } from 'react-dom';
import { TextArea } from '@douyinfe/semi-ui';
import picture from './const';

const fontStyle = { fontSize: 14, lineHeight: '20px' };

interface AppProps { }
interface Gid2Picture {
  gid: string;
  picture: string;
  isError: boolean;
}
interface AppState {
  text: string;
  gid2Picture: Array<Gid2Picture>;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      text: '',
      gid2Picture: [
        { gid: '11111111111', picture, isError: false },
        { gid: '22222222222', picture, isError: false },
        { gid: '33333333333', picture, isError: false },
        { gid: '44444444444', picture, isError: false },
        { gid: '55555555555', picture, isError: true },
        { gid: '66666666666', picture, isError: false },
        { gid: '77777777777', picture, isError: false },
        { gid: '88888888888', picture, isError: false },
        { gid: '99999999999', picture, isError: false },
        { gid: '00000000000', picture, isError: false },
        { gid: '01111111111', picture, isError: false },
        { gid: '02222222222', picture, isError: false },
        { gid: '03333333333', picture, isError: false },
        { gid: '04444444444', picture, isError: true },
        { gid: '05555555555', picture, isError: false },
        { gid: '06666666666', picture, isError: false },
        { gid: '07777777777', picture, isError: false },
        { gid: '08888888888', picture, isError: false },
        { gid: '09999999999', picture, isError: false },
        { gid: '10000000000', picture, isError: false },
        { gid: '21111111111', picture, isError: false },
        { gid: '32222222222', picture, isError: true },
        { gid: '13333333333', picture, isError: false },
        { gid: '14444444444', picture, isError: false },
        { gid: '15555555555', picture, isError: false },
      ],
    };
  }

  componentDidMount() {
    const { gid2Picture } = this.state;
    const text = gid2Picture.map((item) => item.gid).join('\n');
    this.setState({
      text,
    });
  }

  handleGidChange = (text: string) => {
    this.setState({
      text,
    });
  };

  // ??????????????????????????????????????????textarea???????????????list
  handleGidList = (value: string) => {
    const { gid2Picture } = this.state;
    const nowGidList = value.trim().split('\n').map(gid => {
      const gid2PictureItem = gid2Picture.find((item) => item.gid === gid) as Gid2Picture;
      return gid2PictureItem;
    });
    this.setState({
      gid2Picture: nowGidList,
    });
  };

  handleGidKeyUp = ({ key, target }: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (key === 'Enter') {
      this.handleGidList((target as HTMLTextAreaElement).value);
    }
  };

  handleGidBlur = ({ target }: React.FocusEvent<HTMLTextAreaElement>) => {
    this.handleGidList(target.value);
  };

  renderMask = () => {
    const { gid2Picture } = this.state;
    return (
      <>
        {gid2Picture.map((item, index) => item.isError ? (<div key={index} style={{ ...fontStyle, color: 'red', pointerEvents: 'none', position: 'absolute', top: 6 + index * 20, left: 13 }}>{item.gid}</div>) : null)}
      </>
    );
  }

  renderGid = () => {
    const { text } = this.state;
    return (
      <div style={{ position: 'relative', width: 200, height: 200, overflow: 'scroll' }}>
        <TextArea
          value={text}
          autosize
          onChange={this.handleGidChange}
          onKeyUp={this.handleGidKeyUp}
          onBlur={this.handleGidBlur as any}
          style={{ ...fontStyle }}
        />
        {this.renderMask()}
      </div>
    );
  };

  moverItem = (dragIndex: number, hoverIndex: number) => {
    const { gid2Picture } = this.state;
    let tmp = gid2Picture[dragIndex];
    gid2Picture[dragIndex] = gid2Picture[hoverIndex];
    gid2Picture[hoverIndex] = tmp;
    this.setState({
      text: gid2Picture.map((item) => item.gid).join('\n'),
      gid2Picture,
    });
  };
  renderPicture = () => {
    const { gid2Picture } = this.state;
    return (
      <DndProvider backend={HTML5Backend}>
        <div
          style={{
            width: 740,
            height: 148,
            border: '1px solid black',
            overflow: 'auto',
          }}
        >
          {gid2Picture.map((item, index) => (
            <Picture key={item.gid} index={index} moverItem={this.moverItem} {...item} />
          ))}
        </div>
      </DndProvider>
    );
  };

  render() {
    return (
      <div style={{ display: 'flex' }}>
        {this.renderGid()}
        {this.renderPicture()}
      </div>
    );
  }
}

interface PictureProps {
  gid: string;
  picture: string;
  isError: boolean;
  index: number;
  moverItem: (dragIndex: number, hoverIndex: number) => void;
}

interface DragCollectedProps {
  connectDragSource?: ConnectDragSource;
  isDragging?: boolean;
}

interface DragObject {
  index: number;
  gid: string;
}

interface DropResult {
  index: number;
  gid: string;
}

interface DropCollectedProps {
  connectDropTarget?: ConnectDropTarget,
  isOver?: boolean;
  canDrop?: boolean;
}

const dragSourceSpec = {
  beginDrag(props: PictureProps, monitor?: DragSourceMonitor, component?: Picture): DragObject {
    console.log('start');
    const { index, gid } = props;
    return {
      index,
      gid
    };
  },
  endDrag(props: PictureProps, monitor: DragSourceMonitor, component: Picture) {
    console.log('end');
    const item: DragObject = monitor.getItem();
    const dropResult = monitor.getDropResult();
    dropResult && console.log(`gid: ${item.gid}, dropResult: ${dropResult}`);
  }
};

const dropTagretSpec = {
  drop(props: PictureProps, monitor: DropTargetMonitor, component: Picture): DropResult {
    console.log('drop');
    const { gid, index } = props;
    return {
      index,
      gid
    };
  },
  hover(props: PictureProps, monitor: DropTargetMonitor<DragObject, DropResult>, component: Picture): void {
    console.log('hover');
    const dragIndex = monitor?.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    // const hoverBoundingRect = (findDOMNode(component) as Element).getBoundingClientRect();
    // const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
    // const clientOffset = monitor.getClientOffset() as XYCoord;
    // const hoverClientX = clientOffset.x - hoverBoundingRect.left;

    // if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
    //   return;
    // }

    // if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
    //   return;
    // }

    monitor.getItem().index = hoverIndex;
    props.moverItem(dragIndex, hoverIndex);
  }
};

const dragSourceCollector = (connect: DragSourceConnector, monitor: DragSourceMonitor): DragCollectedProps => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
});


// eslint-disable-next-line
const dropTargetCollector = (connect: DropTargetConnector, moniter: DropTargetMonitor, props: PictureProps): DropCollectedProps => ({
  connectDropTarget: connect.dropTarget(),
  isOver: moniter.isOver(),
  canDrop: moniter.canDrop(),
});

@DragSource('picture', dragSourceSpec, dragSourceCollector)
@DropTarget('picture', dropTagretSpec, dropTargetCollector)
class Picture extends React.Component<PictureProps & DragCollectedProps & DropCollectedProps> {

  render() {
    const { isError, picture, connectDragSource, isDragging, connectDropTarget } = this.props;
    return connectDropTarget!(connectDragSource!(
      <div style={{ width: 54, height: 54, margin: 10, cursor: 'move', opacity: isDragging ? 0.5 : 1, border: isError ? 'red 1px solid' : undefined, boxSizing: 'border-box', display: 'inline-block', position: 'relative' }}>
        <img src={picture} alt="demo" style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, right: 0, width: 10, height: 10, backgroundColor: 'blue' }}></div>
      </div>
    ));
  }
}

render(<App />, document.getElementById('root'));
