import UserInfoPopup from "@/components/UserInfoPopup";
import { formatNumber } from "@/helpers/evaluate-utils";
import timeFromNow from "@/helpers/time-utils";
import { GetCollectionResponse } from "@/types/types";
import { Numbers } from "@mui/icons-material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import { Tooltip } from "@mui/material";
import Link from "next/link";

export default function CollectionItem({ collection }: { collection: GetCollectionResponse }) {
    return (
        <Link href={`/collection/${collection.id}`}>
            <div className="group relative bg-[var(--card-background)] border border-[var(--border-color)] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-[var(--text-primary)] group-hover:text-blue-500 transition-colors">
                            {collection.name}
                        </h3>
                        {collection.isPublic ? (
                            <Tooltip title="Public collection">
                                <div className="flex items-center gap-1 text-green-500 text-sm">
                                    <PublicIcon className="w-4 h-4" />
                                    <span className="font-medium">Public</span>
                                </div>
                            </Tooltip>
                        ) : (
                            <Tooltip title="Private collection">
                                <div className="flex items-center gap-1 text-[var(--text-secondary)] text-sm">
                                    <LockIcon className="w-4 h-4" />
                                    <span className="font-medium">Private</span>
                                </div>
                            </Tooltip>
                        )}
                    </div>

                    <div className="flex items-center gap-1 text-sm text-[var(--text-secondary)] mb-4">
                        <span>Created by</span>
                        <UserInfoPopup
                            element="div"
                            user={collection.author}
                            className="font-medium text-[var(--text-primary)] hover:text-blue-500 transition-colors"
                        />
                    </div>

                    <p className="text-[var(--text-secondary)] line-clamp-2 mb-6 min-h-[3rem]">
                        {collection.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                        <Tooltip title="Likes">
                            <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                                <FavoriteBorderIcon className="w-4 h-4" />
                                <span>{formatNumber(collection.likeCount)}</span>
                            </div>
                        </Tooltip>

                        <Tooltip title={`Created ${timeFromNow(collection.createdAt)}`}>
                            <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                                <AccessTimeIcon className="w-4 h-4" />
                                <span>{timeFromNow(collection.createdAt)}</span>
                            </div>
                        </Tooltip>

                        <Tooltip title={`${collection.questionCount} question(s) in this collection`}>
                            <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                                <Numbers className="w-4 h-4" />
                                <span>{collection.questionCount}</span>
                            </div>
                        </Tooltip>
                    </div>
                </div>

                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500 rounded-xl pointer-events-none transition-colors" />
            </div>
        </Link>
    );
}