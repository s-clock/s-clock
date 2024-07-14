import React, {
  Children,
  CSSProperties,
  FC,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import BTween from 'b-tween';
import Panel from './panel';
import './index.less';

interface Props {
  defaultActiveIndex?: number;
  children: ReactNode;
}

const _Tabs: FC<Props> = (props) => {
  const prefixCls = 'tabs';

  const { defaultActiveIndex, children } = props;

  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex ?? 0);

  const arr = Children.toArray(children).map((element: any) => ({
    title: element.props.title,
    icon: element.props.icon,
    element,
  }));

  const touchControllerRef = useRef<{
    startX?: number;
    lastMoveX?: number;
    startT?: number;
  }>();

  const [w, setW] = useState<{
    w: number;
    // 负值往左距离
    offset: number;
  } | null>(null);
  useEffect(() => {
    setW({
      w: window.innerWidth ?? document.documentElement.clientWidth,
      offset: 0,
    });
  }, []);

  const animationRef = useRef(null);
  const [disableTouch, setDisableTouch] = useState(false);

  return (
    <div className={classNames(prefixCls)}>
      <div className={classNames(`${prefixCls}-title`)}>
        {arr[activeIndex].title}
      </div>
      <div
        className={classNames(
          `${prefixCls}-panel`,
          disableTouch ? `${prefixCls}-panel-disable` : '',
        )}
        onTouchStart={(e) => {
          if (animationRef.current) {
          } else {
            const { timeStamp, touches } = e;
            touchControllerRef.current = {
              startX: touches[0].clientX,
              startT: timeStamp,
            };
          }
        }}
        onTouchMove={(e) => {
          const { timeStamp, touches } = e;
          const currentX = touches[0].clientX;
          touchControllerRef.current.lastMoveX = currentX;
          const offset =
            -w.w * activeIndex + currentX - touchControllerRef.current.startX;

          setW((pre) => ({
            ...pre,
            offset,
          }));
        }}
        onTouchEnd={(e) => {
          const { timeStamp, touches } = e;
          const currentX = touchControllerRef.current.lastMoveX;

          // 正数向右
          const offset = touchControllerRef.current.startX - currentX;
          const duration = timeStamp - touchControllerRef.current.startT;

          const { nextIndex, direction } = (() => {
            // 向右
            if (offset > 0) {
              if (activeIndex === arr.length - 1) {
                return {
                  nextIndex: activeIndex,
                  direction: 'mid',
                };
              }

              if (offset > w.w / 2 || duration < 200) {
                return {
                  nextIndex: activeIndex + 1,
                  direction: 'right',
                };
              } else {
                return {
                  nextIndex: activeIndex,
                  direction: 'mid',
                };
              }
            } else {
              // 向左

              if (activeIndex === 0) {
                return {
                  nextIndex: activeIndex,
                  direction: 'mid',
                };
              }

              if (-offset > w.w / 2 || duration < 200) {
                return {
                  nextIndex: activeIndex - 1,
                  direction: 'left',
                };
              } else {
                return {
                  nextIndex: activeIndex,
                  direction: 'mid',
                };
              }
            }
          })();
          const nextOffset = nextIndex * -w.w;
          setDisableTouch(true);
          animationRef.current = new BTween({
            from: {
              offset: w.offset,
            },
            to: {
              offset: nextOffset,
            },
            duration: 500,
            easing: 'quadOut',
            onUpdate: (keys) => {
              setW((pre) => ({
                ...pre,
                offset: keys.offset,
              }));
            },
            onFinish: () => {
              animationRef.current = null;
              setDisableTouch(false);
              if (direction === 'right') {
                setActiveIndex((pre) => pre + 1);
              } else if (direction === 'left') {
                setActiveIndex((pre) => pre - 1);
              }
            },
          });
          animationRef.current.start();
        }}
      >
        {arr.map(({ title, element }, index) => {
          const isActive = index === activeIndex;

          const styles: CSSProperties = w
            ? {
                transform: `translateX(${w.w * index + w.offset}px)`,
              }
            : {};

          return React.cloneElement(element, {
            key: index,
            className: classNames(
              `${prefixCls}-panel-wrapper`,
              isActive ? `${prefixCls}-panel-active` : '',
              `${prefixCls}-panel-${index}`,
            ),
            title,
            styles,
          });
        })}
      </div>
      <div className={classNames(`${prefixCls}-footer`)}>footer</div>
    </div>
  );
};

type TabsCom = typeof _Tabs & {
  Panel: typeof Panel;
};

const Tabs = _Tabs as TabsCom;
Tabs.Panel = Panel;
Tabs.displayName = 'Tabs';

export default Tabs;
