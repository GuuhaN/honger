import classNames from "classnames";
import { ReactNode } from "react";

export const element = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  h7: "h6",
  h8: "h6",
  span: "span",
  ul: "ul",
  ol: "ol",
  p: "p",
};

type Props = {
  type?: keyof typeof element;
  className?: string;
  children: ReactNode;
  [key: string]: unknown;
};

export default function Typography({ children, type = "p", className = "", ...props }: Props) {
  const CustomTag = element[type] as any;

  const styling = classNames(
    className,
    { "text-5xl font-bold": type == "h1" },
    { "text-2xl font-light tracking-widest": type == "h2" },
    { "text-xl font-light tracking-wide": type == "h3" }
  );

  return (
    <CustomTag {...props} className={styling}>
      {children}
    </CustomTag>
  );
}
