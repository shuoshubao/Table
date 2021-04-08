import React, { useRef } from 'react';
import MenuOutlined from '@ant-design/icons/MenuOutlined';
import CheckOutlined from '@ant-design/icons/CheckOutlined';
import { useDrag, useDrop } from 'react-dnd';

export default props => {
    const { id, title, index, onMove } = props.column;
    const ref = useRef(null);
    const [{ handlerId }, drop] = useDrop({
        accept: 'item',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId()
            };
        },
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            onMove(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex;
        }
    });
    const [{ isDragging }, drag] = useDrag({
        type: 'item',
        item: () => {
            return { id, index };
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    });
    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));
    return (
        <div className="dyna-table-header-setting-item" ref={ref} data-handler-id={handlerId} style={{ opacity }} draggable="true">
            <div className="dyna-table-header-setting-item-sort">
                <MenuOutlined />
            </div>
            <div className="dyna-table-header-setting-item-label">{title}</div>
            <div className="dyna-table-header-setting-item-check">
                <CheckOutlined />
            </div>
        </div>
    );
};
