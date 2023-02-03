/* eslint-disable @typescript-eslint/no-misused-promises */
import { type KeyboardEvent, useState, type ChangeEvent } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Gallery from "../../components/Gallery/Gallery";
import GalleryItem from "../../components/Gallery/GalleryItem";
import { api } from "../../utils/api";

interface IgetPutUrlResponse {
  putUrl: string;
  getUrl: string;
}

export default function AdminPage() {
  const { data: sessionData } = useSession();
  const [inputTag, setInputTag] = useState<string>("");
  const mutation = api.art.addNewArt.useMutation().mutateAsync;
  const deleteMutation = api.art.remove.useMutation().mutateAsync;
  const highlightMutation = api.art.addHighLight.useMutation().mutateAsync;
  const { data: allArts } = api.art.allArts.useQuery();
  const [imgSize, setImgSige] = useState({ width: 0, height: 0 });
  const [tags, setTags] = useState<string[]>([]);

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
    const highlight = !!formData.get("highlight");

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
        highlight,
      });

      await utils.art.allArts.invalidate();
    } catch (error) {
      console.error("Some error while uploading to s3", error);
    }
  }

  async function onDelete(id: string) {
    const toDelete = await utils.art.getById.fetch({ id });

    const key = toDelete?.link.split("amazonaws.com/")[1] as string;
    await fetch(`/api/delete-art?key=${key}`);

    await deleteMutation({ id });

    await utils.art.allArts.invalidate();
  }

  async function onAddHighLight(id: string, highlight: boolean) {
    console.log(id, highlight);
    try {
      await highlightMutation({ id, highlight });
    } catch (error) {
      console.log(error);
    }
    await utils.art.allArts.invalidate();
  }

  function handleTagChange(e: ChangeEvent<HTMLInputElement>) {
    setInputTag(e.target.value);
  }

  function handleAddTag(e: KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputTag) {
        setTags((prev) => {
          return [...new Set([...prev, inputTag])];
        });
        setInputTag("");
      }
    }
  }

  let toRender;

  if (sessionData) {
    const gallery = (
      <Gallery>
        {allArts?.map((art) => {
          return (
            <GalleryItem
              admin={sessionData.user.role === "admin"}
              onDelete={onDelete}
              onAddHighlight={onAddHighLight}
              key={art.id}
              art={art}
            />
          );
        })}
      </Gallery>
    );
    const signOutBtn = <button onClick={() => signOut()}>Sign Out</button>;
    if (sessionData.user.role === "admin") {
      toRender = (
        <>
          {signOutBtn}
          <p>Plaese select art to upload</p>
          <form onSubmit={uploadToS3}>
            <label>
              Select file to upload
              <input
                onChange={handleChange}
                type="file"
                accept="image/jpg image/jpeg image/png"
                name="file"
              />
            </label>
            <label>
              Title <input type="text" name="title" />
            </label>
            <label>
              <input type="checkbox" name="highlight" id="highlight" />
              Highlight in main gallery
            </label>

            <div>
              <h3>Set tags</h3>

              <input
                type="text"
                name="tag"
                id="tag"
                onChange={handleTagChange}
                onKeyDown={handleAddTag}
                value={inputTag}
              />

              <ul>
                {tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              className=" rounded border-2 border-orange-300"
            >
              Upload
            </button>
          </form>
          {gallery}
        </>
      );
    } else {
      toRender = (
        <>
          {signOutBtn}
          {gallery}
        </>
      );
    }
  } else {
    toRender = (
      <button onClick={() => signIn("google")}>SignIn with Google</button>
    );
  }

  return <>{toRender}</>;
}
