import Image from "next/image";

export default function Test() {
  return (
    <div className="w-[150px] ">
      <Image
        src="https://s3-art-portfolio.s3.ap-northeast-1.amazonaws.com/9b2b3a4d-1d0f-4f02-bd36-0b461779bdfa.jpeg"
        alt="test"
        width={1509}
        height={2356}
        className="h-auto w-full object-contain"
        sizes="(max-width: 640px) 30wv, (max-width: 750px) 250px, 350px"
      />
    </div>
  );
}
