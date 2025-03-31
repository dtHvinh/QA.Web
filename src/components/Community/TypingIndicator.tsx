import { motion } from "framer-motion";

interface TypingIndicatorProps {
    users: { userId: string, username: string }[];
}

const dotVariants = {
    initial: { y: 0 },
    animate: {
        y: [0, -2, 0],
        transition: {
            duration: 0.6,
            repeat: Infinity,
            ease: "easeInOut",
        }
    }
};

const containerVariants = {
    initial: { opacity: 0 },
    animate: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

export default function TypingIndicator({ users }: TypingIndicatorProps) {
    if (users.length === 0) return null;

    return (
        <div className="px-4 text-sm text-[var(--text-tertiary)] italic">
            <span>{users.map(e => e.username).join(', ')} {users.length == 1 ? 'is' : 'are'} typing</span>
            <motion.span
                className="inline-flex gap-[2px] ml-1"
                variants={containerVariants}
                initial="initial"
                animate="animate"
            >
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        variants={dotVariants}
                        className="text-lg"
                    >
                        .
                    </motion.span>
                ))}
            </motion.span>
        </div>
    );
}