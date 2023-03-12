import React from "react";
import classNames from "classnames";

interface Props {
  children: React.ReactNode;
  variant: "Primary" | "Secondairy" | "Tertiary";
  type?: "button" | "submit" | "reset";
  onClick: () => void;
}

export default function Button({ children, variant, type, onClick }: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames("border rounded border-black", {
        "bg-green-400": variant == "Primary" || variant == "Tertiary",
        "bg-green-200": variant == "Secondairy",
        "w-full p-2": variant != "Tertiary",
        "w-32": variant == "Tertiary",
      })}
    >
      {children}
    </button>
  );
}
