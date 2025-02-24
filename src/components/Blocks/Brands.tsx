import { BrandRecord } from "@/graphql/generated";
import Image from "next/image";

type Props = {
  brandShowcase: BrandRecord[];
};

const Brands = ({ brandShowcase }: Props) => {
  return (
    <div className="container">
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-6 items-center justify-center">
        {brandShowcase.map((brand) => (
          <SingleBrand key={brand.id} brand={brand} />
        ))}
      </div>
    </div>
  );
};

export default Brands;

const SingleBrand = ({ brand }: { brand: BrandRecord }) => {
  const { brandUrl, brandLogo, brandName } = brand;

  return (
    <div className="relative h-32 w-full bg-secondary">
      <Image
        src={brandLogo.url}
        alt={brandName}
        fill
        className="!object-contain !w-[90%] !h-[90%] absolute !left-1/2 !top-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};
