"use client";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React from "react";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
    reverse?: boolean;
  }[];
  contentClassName?: string;
}) => {
  return (
    <div className="flex items-center flex-col gap-12 lg:gap-32 rounded-md p-4 lg:p-0">
      {content.map((item, index) => (
        <motion.div
          key={item.title + index}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: index * 0.1,
            ease: "easeOut"
          }}
          viewport={{ once: true, amount: 0.3 }}
          className={cn(
            "flex flex-col justify-between w-full lg:px-32 items-center",
            item.reverse ? "lg:flex-row-reverse lg:space-x-reverse lg:space-x-10" : "lg:flex-row lg:space-x-10"
          )}
        >
          <div className="w-full lg:w-1/2 px-4  flex justify-center">
            <div className="max-w-2xl flex flex-col gap-3 w-full items-center lg:items-start">
              <h2 className="text-2xl lg:text-4xl text-center lg:text-left font-bold font-caudex">
                {item.title}
              </h2>
              <p className="text-base lg:text-lg max-w-sm text-center lg:text-left text-muted-foreground font-alegreya">
                {item.description}
              </p>
            </div>
          </div>
          <div className="w-full lg:w-1/2 mt-8 lg:mt-0 flex items-center justify-center">
            <div className={cn("w-full h-[60vh] rounded-md overflow-hidden", contentClassName)}>
              {item.content ?? null}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
