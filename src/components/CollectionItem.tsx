import {GetCollectionResponse} from "@/types/types";
import React from "react";
import UserInfoPopup from "@/components/UserInfoPopup";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {Tooltip} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import timeFromNow from "@/helpers/time-utils";
import {formatNumber} from "@/helpers/evaluate-utils";
import Link from "next/link";
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

export default function CollectionItem({collection}: { collection: GetCollectionResponse }) {
    return (
        <Link href={`/collection/${collection.id}`}>
            <div className="overflow-hidden hover:scale-[1.01] transition">
                <div className="relative border border-black hover:bg-blue-50">
                    <div className="py-10 px-8">
                        <h3 className="text-2xl font-bold">{collection.name}</h3>
                        <div className="text-gray-600 text-sm font-medium flex mb-4 mt-2">
                            <p>Created by&nbsp;</p>
                            <UserInfoPopup
                                user={collection.author}
                                className="hover:text-black transition duration-300 ease-in-out"/>

                        </div>

                        <div className={'py-2'}>
                            <p className="leading-7 line-clamp-2 border-l-2 text-gray-500 border-gray-400 pl-5 min-h-[3.5rem]">
                                {collection.description}
                            </p>
                        </div>

                        <div className="mt-4 flex justify-between items-center">
                            <div className={'flex items-center gap-5'}>
                                <div className={'flex items-center gap-1'}>
                                    <Tooltip title={'Like'} className={'flex items-center gap-1'}>
                                        <div>
                                            <FavoriteBorderIcon fontSize={'small'}/>
                                            <small className={'text-gray-600'}>
                                                {formatNumber(collection.likeCount)}
                                            </small>
                                        </div>
                                    </Tooltip>
                                </div>

                                <div className={'flex items-center gap-1'}>
                                    <Tooltip title={`Created ${timeFromNow(collection.createdAt)}`}
                                             className={'flex items-center gap-1'}>
                                        <div>
                                            <AccessTimeIcon fontSize={'small'}/>
                                            <small className={'text-gray-600 text-nowrap text-ellipsis'}>
                                                {timeFromNow(collection.createdAt)}
                                            </small>
                                        </div>
                                    </Tooltip>
                                </div>

                                <div>
                                    {collection.isPublic
                                        ?
                                        <Tooltip title={'This collection is public'}
                                                 className={'flex items-center gap-1 text-green-700'}>
                                            <div>
                                                <PublicIcon fontSize={'small'}/>
                                                Public
                                            </div>
                                        </Tooltip>
                                        :
                                        <Tooltip title={'This collection is private'}
                                                 className={'flex items-center gap-1 text-red-700'}>
                                            <div>
                                                <LockIcon fontSize={'small'}/>
                                                Private
                                            </div>
                                        </Tooltip>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}