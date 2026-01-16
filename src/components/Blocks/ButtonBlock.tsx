import CustomIcon from "@/components/Blocks/CustomIcon";

type ButtonProps = {
  label: string;
  color?: string;
  arrow?: Boolean;
};

export default function ButtonBlock({
  label,
  arrow = false,
  color = "light",
}: ButtonProps) {
  const buttonClass =
    "inline-flex uppercase text-xs before:h-px before:bg-primary-content before:w-6 tracking-widest items-center justify-center text-center motion-safe:transition gap-2 before:duration-500 before:ease-in-out group-hover:before:w-8 group-hover:gap-1 before:duration-500";
  const colorButton =
    color === "light"
      ? "text-primary-content"
      : "bg-primary text-primary-content";
  const classArrow = "size-6 ml-2";

  return (
    <div className={`${colorButton} ${buttonClass}`}>
      {label}
      {arrow && <CustomIcon classes={`${classArrow}`} fileName="arrow-right" />}
    </div>
  );
}
