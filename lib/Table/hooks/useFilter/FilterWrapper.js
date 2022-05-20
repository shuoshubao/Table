import * as React from 'react';

const FilterDropdownMenuWrapper = props => (
    <div className={props.className} onClick={e => e.stopPropagation()}>
        {props.children}
    </div>
);

export default FilterDropdownMenuWrapper;
