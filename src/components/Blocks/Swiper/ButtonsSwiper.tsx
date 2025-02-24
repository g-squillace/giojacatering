import CustomIcon from "@/components/Blocks/CustomIcon";
type Props = {
  classButton: string;
};

export default function ButtonsSwiper({ classButton }: Props) {
  return (
    <>
      <button
        className="absolute top-1/2 left-0 -translate-y-1/2 z-10"
        id="prevButton"
      >
        <div className={classButton}>
          <CustomIcon classes="bg-black size-12" fileName="arrow-left" />
        </div>
      </button>
      <button
        className="absolute top-1/2 right-0 -translate-y-1/2 z-10"
        id="nextButton"
      >
        <div className={classButton}>
          <CustomIcon
            classes="bg-black size-12 rotate-180"
            fileName="arrow-left"
          />
        </div>
      </button>
    </>
  );
}
