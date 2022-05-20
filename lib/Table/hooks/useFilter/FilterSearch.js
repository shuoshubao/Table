import * as React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '../../../Icons';

const FilterSearch = ({ value, onChange, filterSearch, tablePrefixCls, locale }) => {
    if (!filterSearch) {
        return null;
    }
    return (
        <div className={`${tablePrefixCls}-filter-dropdown-search`}>
            <Input
                prefix={<SearchOutlined />}
                placeholder={locale.filterSearchPlaceholder}
                onChange={onChange}
                value={value}
                // for skip min-width of input
                htmlSize={1}
                className={`${tablePrefixCls}-filter-dropdown-search-input`}
            />
        </div>
    );
};

export default FilterSearch;
