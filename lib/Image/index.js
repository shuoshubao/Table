import React, { useMemo, Fragment } from 'react';
import RcImage from 'rc-image';
import {
    EyeOutlined,
    RotateLeftOutlined,
    RotateRightOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
    CloseOutlined,
    LeftOutlined,
    RightOutlined
} from '../Icons';
import './index.less';

const icons = {
    rotateLeft: <RotateLeftOutlined />,
    rotateRight: <RotateRightOutlined />,
    zoomIn: <ZoomInOutlined />,
    zoomOut: <ZoomOutOutlined />,
    close: <CloseOutlined />,
    left: <LeftOutlined />,
    right: <RightOutlined />
};

const Image = ({ preview, ...otherProps }) => {
    const mergedPreview = useMemo(() => {
        if (preview === false) {
            return preview;
        }
        const _preview = typeof preview === 'object' ? preview : {};

        return {
            mask: (
                <Fragment>
                    <EyeOutlined />
                    <span>预览</span>
                </Fragment>
            ),
            icons,
            ..._preview
        };
    }, [preview]);

    return <RcImage previewPrefixCls="dynamic-table-image rc-image-preview" preview={mergedPreview} {...otherProps} />;
};

export default Image;
