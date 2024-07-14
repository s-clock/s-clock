import React, { CSSProperties, FC, ReactNode } from 'react';
import classNames from 'classnames';

interface Props {
  title: string;
  className?: string;
  styles?: CSSProperties;
  children: ReactNode;
}

const Panel: FC<Props> = (props) => {
  const { children, className, styles } = props;
  return (
    <div className={classNames(className)} style={styles}>
      {children}
    </div>
  );
};

export default Panel;
