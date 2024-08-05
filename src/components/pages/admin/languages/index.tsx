import React from "react";
import en from "../../../../assets/en.jpg";
import de from "../../../../assets/de.jpg";
import { TbClipboardCopy } from "react-icons/tb";
import { Link } from "react-router-dom";

const LanguageIndex = () => {
  return (
    <>
      <div>
        <div className="grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* <Link to="/admin/language/en/">
            <div className="row-span-1 cursor-pointer rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-gray-200 justify-between flex flex-col space-y-4">
              <div className="flex flex-1 w-full h-full min-h-[6rem] max-h-[10rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
                <img src={en} className="w-full" />
              </div>
              <div className="group-hover/bento:translate-x-2 transition duration-200 text-start">
                <TbClipboardCopy />
                <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
                  English
                </div>
                <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
                  Dedicated learners striving for fluency and mastery in English
                  language.
                </div>
              </div>
            </div>
          </Link> */}
          <Link to="/admin/language/de">
            <div className="row-span-1 cursor-pointer rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-gray-200 justify-between flex flex-col space-y-4">
              <div className="flex flex-1 w-full h-full min-h-[6rem] max-h-[10rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100">
                <img src={de} className="w-full" />
              </div>
              <div className="group-hover/bento:translate-x-2 transition duration-200 text-start">
                <TbClipboardCopy />
                <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
                  German
                </div>
                <div className="font-sans font-normal text-neutral-600 text-xs dark:text-neutral-300">
                  Committed individuals seeking to attain fluency and
                  proficiency in the German language.
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default LanguageIndex;
