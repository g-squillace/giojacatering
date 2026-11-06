type JsonLdProps = {
  id: string;
  data: Record<string, unknown>;
};

export default function JsonLd({ id, data }: JsonLdProps) {
  const serialized = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialized }}
    />
  );
}
