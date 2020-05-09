import React, { useCallback, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { createPopper, Instance } from '@popperjs/core';

interface IProps {
  content: React.ReactNode;
  trigger?: 'click' | 'focus';
  style?: React.CSSProperties;
}

const Example: React.FC<IProps> = ({
  children,
  content,
  trigger = 'click',
  style,
}) => {
  const [visible, setVisible] = useState(false);
  const popperRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<{ instance: Instance | null }>({ instance: null });

  const onClick = useCallback(
    (event) => {
      if (trigger !== 'click') return;
      const referenceElement = event.currentTarget;
      const popperElement = popperRef.current;
      if (!popperElement) return;
      if (!instanceRef.current.instance) {
        instanceRef.current.instance = createPopper(
          referenceElement,
          popperElement,
          {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 4],
                },
              },
            ],
          },
        );
      }
      if (popperElement.getAttribute('data-show')) {
        popperElement.removeAttribute('data-show');
        setVisible(false);
      } else {
        popperElement.setAttribute('data-show', 'visible');
        setVisible(true);
      }
    },
    [children, popperRef.current, trigger],
  );

  const onFocus = useCallback(
    (event) => {
      if (trigger !== 'focus') return;
      const referenceElement = event.currentTarget;
      const popperElement = popperRef.current;
      if (!popperElement) return;
      if (!instanceRef.current.instance) {
        instanceRef.current.instance = createPopper(
          referenceElement,
          popperElement,
          {
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 4],
                },
              },
            ],
          },
        );
      }
      popperElement.setAttribute('data-show', 'visible');
      setVisible(true);
    },
    [children, popperRef.current, trigger],
  );

  const onBlur = useCallback(() => {
    if (trigger !== 'focus') return;
    const popperElement = popperRef.current;
    if (!popperElement) return;
    popperElement.removeAttribute('data-show');
    setVisible(false);
  }, [children, popperRef.current, trigger]);

  const handleClickPopover = useCallback(
    (event) => {
      const target = event.target as HTMLElement;
      const popperElement = popperRef.current;
      if (popperElement && target.hasAttribute('data-popover-closeable')) {
        popperElement.removeAttribute('data-show');
        setVisible(false);
      }
    },
    [popperRef.current],
  );

  const childNode = useMemo(() => {
    const child = React.Children.only(children) as React.ReactElement;
    return React.cloneElement(child, { onClick, onFocus, onBlur });
  }, [onClick, children]);

  return (
    <>
      {childNode}
      {ReactDOM.createPortal(
        <div
          className="popover"
          onClick={handleClickPopover}
          ref={popperRef}
          role="popover"
          style={style}
        >
          <div className="arrow" data-popper-arrow />
          <div className="popover-content">{visible ? content : null}</div>
        </div>,
        document.body,
      )}
    </>
  );
};

export default Example;