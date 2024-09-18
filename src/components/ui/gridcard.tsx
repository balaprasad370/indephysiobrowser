import React from "react";
import { cn } from "./../../utils/cn";
import { TbClipboardCopy } from "react-icons/tb";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const GridCard = ({
  className,
  title,
  id,
  description,
  header,
  link,
  bgColor,
  image,
  editable,
  deletable,
  handleEdit,
  handleDelete
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
}) => {
  return (
    <div>
      <Link to={link}>
        <div
          style={{
            backgroundColor: bgColor != "" ? bgColor : "#fff",
            color: bgColor != "" && bgColor != null ? "#fff" : ""
          }}
          className={cn(
            "row-span-1 text-start rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2]  border border-gray-200 justify-between flex flex-col space-y-4 min-h-[18rem] text-black",
            className
          )}
        >
          <div className="relative flex flex-1 w-full h-full min-h-[6rem] max-h-[10rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100 flex items-center justify-center text-neutral-600 dark:text-neutral-200 overflow-hidden">
            {image != null && (
              <div>
                <img src={image} />
              </div>
            )}

            <div className="absolute top-0 w-full">
              <div className="flex justify-between items-center w- p-3">
                {(editable || editable == undefined) && (
                  <div
                    className="bg-white rounded-full pl-2 py-1 pr-1 flex justify-center items-center"
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit({ title, id, description, bgColor });
                    }}
                  >
                    <FaEdit size={22} className="text-blue-600 font-bold" />
                  </div>
                )}
                {(deletable || deletable == undefined) && (
                  <div
                    className="bg-white rounded-full p-1 "
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(id);
                    }}
                  >
                    <MdDeleteOutline
                      size={24}
                      className="text-red-600 font-bold"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="group-hover/bento:translate-x-2 transition duration-200">
            {TbClipboardCopy}
            <div className="font-sans font-bold  dark:text-neutral-200 mb-2 mt-2">
              {title}
            </div>
            <div className="font-sans font-normal  text-xs dark:text-neutral-300">
              {description}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default GridCard;
