import Image from "next/image";
import { FeatureRecord } from "@/graphql/generated";

type Props = {
  feature: FeatureRecord;
};

const SingleFeature = ({ feature }: Props) => {
  const { featureIcon, featureTitle, featureDescription } = feature;

  return (
    <div className="w-full text-base-content bg-base-100 p-6 text-center grid gap-6">
      <div className="relative flex h-16 w-full">
        <Image
          src={featureIcon.url}
          className="object-contain absolute inset-0 w-full h-full"
          width={50}
          height={50}
          alt={featureTitle}
          title={featureTitle}
          aria-hidden={true}
        />
      </div>
      <h2 className="title-small">{featureTitle}</h2>
      {featureDescription && (
        <div
          className=""
          dangerouslySetInnerHTML={{ __html: featureDescription }}
        />
      )}
    </div>
  );
};

export default SingleFeature;
