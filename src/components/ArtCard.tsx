import Image from "next/image";

interface IArtProps {
  link: string;
  title: string;
  tags: string[];
  description: string;
}

export default function ArtCard({ title, link, tags, description }: IArtProps) {
  return (
    <li>
      <Image alt={title} src={link} width={200} height={300}></Image>
      <h3>{title}</h3>
      <small>{description}</small>
      <ul>
        {tags.map((tag) => {
          return <span key={tag}>{tag}</span>;
        })}
      </ul>
    </li>
  );
}
