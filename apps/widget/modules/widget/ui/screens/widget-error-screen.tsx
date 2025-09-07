"use client";

import { useAtomValue } from "jotai";
import { errorMessageAtom } from "../../atoms/widget-atoms";
import { AlertTriangleIcon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";

export const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMessageAtom);

  return (
    <>
      <WidgetHeader>
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <span className="text-xl font-semibold text-white">I</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Hi There 👋</h1>
            <p className="text-base text-white/90">Let's get you started</p>
          </div>
        </div>
      </WidgetHeader>

      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <AlertTriangleIcon className="h-10 w-10 " />
        <p className="">{errorMessage || "invalid configuration"}</p>
      </div>
    </>
  );
};
