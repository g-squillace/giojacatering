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
    "inline-flex items-center justify-center rounded-md px-7 py-3 text-center motion-safe:transition";
  const colorButton =
    color === "light"
      ? "bg-accent text-accent-content"
      : "bg-primary text-primary-content";
  const classArrow = "size-6 ml-2";

  return (
    <div className={`${colorButton} ${buttonClass}`}>
      {label}
      {arrow && <CustomIcon classes={`${classArrow}`} fileName="arrow-right" />}
    </div>
  );
}
