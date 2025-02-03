import React from "react";

export default function ItemPerPage(
    {
        onPageSizeChange,
        values
    }:
    {
        onPageSizeChange: (size: number) => void,
        values: number[]
    }) {
    const [pageSize, setPageSize] = React.useState(values[0]);

    const handlePageSizeChange = (size: number) => {
        setPageSize(size);
        onPageSizeChange(size);
    }

    return (
        <div>
            <div className={'flex items-center space-x-2.5'}>
                <span className={'text-gray-500'}>Items Per Page:</span>

                {values.map((value) => (
                    <button
                        key={value}
                        onClick={() => handlePageSizeChange(value)}
                        className={`px-3 py-2 text-sm ${pageSize == value ? 'bg-gray-300' : 'hover:bg-gray-200'} rounded-full`}>{value}
                    </button>
                ))}
            </div>
        </div>
    );
}