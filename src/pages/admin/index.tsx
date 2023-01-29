/* eslint-disable @typescript-eslint/no-misused-promises */
import { DeleteObjectCommandOutput } from "@aws-sdk/client-s3";
import { useState, type ChangeEvent } from "react";
import Gallery from "../../components/Gallery/Gallery";
import GalleryItem from "../../components/Gallery/GalleryItem";
import { api } from "../../utils/api";

interface IgetPutUrlResponse {
  putUrl: string;
  getUrl: string;
}

export default function AdminPage() {
  const mutation = api.art.addNewArt.useMutation().mutateAsync;
  const deleteMutation = api.art.remove.useMutation().mutateAsync;
  const { data: allArts } = api.art.allArts.useQuery();
  const [imgSize, setImgSige] = useState({ width: 0, height: 0 });
  const utils = api.useContext();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    const file = files?.item(0);
    if (file) {
      const reader = new FileReader();
      reader.onload = function () {
        const img = new Image();
        img.src = this.result as string;
        img.onload = function () {
          setImgSige({ width: img.width, height: img.height });
        };
      };
      reader.readAsDataURL(file);
    }
  }
  async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.target);

    const file = formData.get("file") as File;
    const title = formData.get("title")?.toString() as string;

    const description = "some descr";
    const tags = ["tag1", "tag2"];

    if (!file) {
      return null;
    }

    const fileType = encodeURIComponent(file.type);

    try {
      const getPutUrlResponse = await fetch(
        `/api/upload-art?fileType=${fileType}`
      );

      const { putUrl, getUrl } =
        (await getPutUrlResponse.json()) as IgetPutUrlResponse;

      await fetch(putUrl, { method: "PUT", body: file });

      await mutation({
        description,
        title,
        link: getUrl,
        tags,
        width: imgSize.width,
        height: imgSize.height,
      });

      await utils.art.allArts.invalidate();
    } catch (error) {
      console.error("Some error while uploading to s3", error);
    }
  }

  async function onDelete(id: string) {
    const toDelete = await utils.art.getById.fetch({ id });

    console.log("id", id);
    const key = toDelete?.link.split("amazonaws.com/")[1] as string;
    const response = await fetch(`/api/delete-art?key=${key}`);
    const responseJson = (await response.json()) as DeleteObjectCommandOutput;

    console.log(responseJson);
    await deleteMutation({ id });

    await utils.art.allArts.invalidate();
  }

  return (
    <>
      <p>Plaese select a file to upload</p>
      <form onSubmit={uploadToS3}>
        <input
          onChange={handleChange}
          type="file"
          accept="image/jpg image/jpeg image/png"
          name="file"
        />
        <input type="text" name="title" />
        <button type="submit">Upload</button>
      </form>
      <Gallery>
        {allArts?.map((art, i) => {
          return <GalleryItem onDelete={onDelete} key={i} art={art} />;
        })}
      </Gallery>
    </>
  );
}
