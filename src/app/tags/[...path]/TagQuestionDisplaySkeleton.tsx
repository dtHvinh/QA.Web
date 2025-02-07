import React from 'react';
import Skeleton from '@mui/material/Skeleton';

const TagQuestionDisplaySkeleton: React.FC = () => {
    return (
        <>
            {Array.from({length: 6}).map((_, index) => (
                <div key={index} className="border-b p-4 flex flex-col md:flex-row">
                    <div className="flex-shrink-0 flex flex-col items-center md:items-start md:w-24">
                        <div className="text-center md:text-left">
                            <Skeleton variant="text" width={40} height={30}/>
                            <Skeleton variant="text" width={30} height={20}/>
                        </div>
                        <div className="text-center md:text-left mt-2">
                            <Skeleton variant="text" width={40} height={30}/>
                            <Skeleton variant="text" width={30} height={20}/>
                        </div>
                        <div className="text-center md:text-left mt-2">
                            <Skeleton variant="text" width={40} height={30}/>
                            <Skeleton variant="text" width={30} height={20}/>
                        </div>
                    </div>
                    <div className="flex-grow md:ml-4 mt-4 md:mt-0">
                        <Skeleton variant="text" width="60%" height={30}/>
                        <Skeleton variant="text" width="100%" height={20}/>
                        <Skeleton variant="text" width="100%" height={20}/>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <Skeleton variant="rectangular" width={60} height={30}/>
                            <Skeleton variant="rectangular" width={60} height={30}/>
                            <Skeleton variant="rectangular" width={60} height={30}/>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                            <Skeleton variant="text" width="40%" height={20}/>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default TagQuestionDisplaySkeleton;