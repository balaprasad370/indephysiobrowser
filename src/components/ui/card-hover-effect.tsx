import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "./../../utils/cn";

export const HoverEffect = ({
  items,
  handleDeleteModule,
  handleEditModule,
  page,
  className
}: {
  items: {
    name: string;
    description: string;
    link: string;
  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className={cn("w-full", className)}>
      {items.map((item, idx) => (
        <Link
          to={
            page == "subquiz"
              ? "/admin/quiz/" + item?.id
              : "/admin/quiz/sub/" + item?.id
          }
          key={idx}
          className="relative group  block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 dark:bg-slate-800/[0.8] block  rounded-3xl"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 }
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 }
                }}
              />
            )}
          </AnimatePresence>
          <Card>
            <CardTitle>{item?.name}</CardTitle>
            <CardDescription>{item?.description}</CardDescription>

            <div className="absolute right-1 bottom-1 h-full ">
              <div className="flex flex-col justify-between items-center h-full">
                <button
                  className="px-3 text-sm"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEditModule(item?.id);
                  }}
                >
                  Edit
                </button>
                <button
                  className="p-2 text-sm bg-red-600 hover:border-white text-white"
                  variant="destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDeleteModule(item?.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "rounded-2xl h-full w-full p-4 overflow-hidden bg-black border border-transparent dark:border-white/[0.2] group-hover:border-slate-700 relative z-20",
        className
      )}
    >
      <div className="relative z-50 text-start">
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
