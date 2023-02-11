import {
  type KeyboardEvent,
  useState,
  type ChangeEvent,
  useCallback,
} from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import NextImage from "next/image";
import { api } from "../../utils/api";
import { useDropzone } from "react-dropzone";
import { FaGoogle, FaTimes, FaUpload } from "react-icons/fa";
import GalleryItem from "../../components/Gallery/GalleryItem";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import Gallery from "../../components/Gallery/Gallery";
import Spinner from "../../components/Spinner";

interface IgetPutUrlResponse {
  putUrl: string;
  getUrl: string;
  key: string;
}

export default function AdminPage() {
  const { data: sessionData } = useSession();
  const [inputTag, setInputTag] = useState<string>("");
  const mutation = api.art.addNewArt.useMutation().mutateAsync;
  const deleteMutation = api.art.remove.useMutation().mutateAsync;
  const highlightMutation = api.art.addHighLight.useMutation().mutateAsync;
  const { data: allArts } = api.art.allArts.useQuery();
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [tags, setTags] = useState<string[]>([]);
  const [file, setFile] = useState<File>();
  const [previewImg, setPreviewImg] = useState<string | null | undefined>();
  const [uploading, setUploading] = useState<boolean>(false);

  const utils = api.useContext();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((upFile) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = new Image();
        img.src = this.result as string;
        img.onload = function () {
          setImgSize({ width: img.width, height: img.height });
        };
        setPreviewImg(e.target?.result as string);
      };
      reader.readAsDataURL(upFile);
      setFile(upFile);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxSize: 5 * 1024 ** 2,
    accept: { "image/jpg": [], "image/jpeg": [], "image/png": [] },
  });

  async function uploadToS3(e: ChangeEvent<HTMLFormElement>) {
    setUploading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get("title")?.toString() as string;
    const description = formData.get("description") as string;
    const highlight = !!formData.get("highlight");

    if (!file) {
      return null;
    }

    const fileType = encodeURIComponent(file.type);

    try {
      const getPutUrlResponse = await fetch(
        `/api/upload-art?fileType=${fileType}`
      );

      const { putUrl, getUrl, key } =
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
        key,
      });

      await utils.art.allArts.invalidate();

      setInputTag("");
      setTags([]);
    } catch (error) {
      console.error("Some error while uploading to s3", error);
    } finally {
      setUploading(false);
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

  function handleDeleteTag(tag: string) {
    setTags((prev) => {
      return prev.filter((prevTag) => tag !== prevTag);
    });
  }

  const signOutBtn = <Button onClick={() => signOut()}>SignOut</Button>;
  const signinBtn = (
    <Button onClick={() => signIn("google")}>
      <FaGoogle color="red" className="mr-1 inline-block text-lg" /> SignIn with
      Google
    </Button>
  );

  if (sessionData) {
    if (sessionData?.user.role !== "admin") {
      return (
        <section className="flex w-full justify-center">
          <div className="flex max-w-xl flex-col gap-3">
            {signOutBtn}
            <h1 className=" text-lg">Welcome, {sessionData.user.name}! </h1>
            <p>
              To upload art you must be an admin. Please use another account for
              admin access. For now, non-admins can only view all, highlighted
              and not highlighted arts.
            </p>

            {allArts?.map((art) => {
              return <GalleryItem mode="view" {...art} key={art.id} />;
            })}
          </div>
        </section>
      );
    } else if (sessionData?.user.role === "admin") {
      return (
        <section className="flex w-full justify-center">
          <div className="flex max-w-xl flex-col gap-3">
            {signOutBtn}
            <h1 className=" text-lg">Welcome, {sessionData.user.name}! </h1>
            <form onSubmit={uploadToS3} className=" h-30 flex w-[600px] gap-3">
              <div className="flex w-[300px] flex-col gap-2">
                <TextInput placeholder="Title" name="title" />
                <TextInput placeholder="Description" name="description" />
                <label>
                  <input
                    type="checkbox"
                    name="highlight"
                    id="highlight"
                    className="mr-2"
                  />
                  Highlight in main gallery
                </label>
                <div>
                  <TextInput
                    placeholder="Add tag"
                    name="tag"
                    onChange={handleTagChange}
                    onKeyDown={handleAddTag}
                    value={inputTag}
                  />

                  <ul className="flex flex-row flex-wrap gap-2">
                    {tags.map((tag) => (
                      <li
                        key={tag}
                        className="flex items-center gap-1 rounded border-2 border-slate-100 bg-slate-50 px-1 text-slate-500"
                      >
                        <span>{tag}</span>
                        <FaTimes
                          className="cursor-pointer text-slate-500"
                          onClick={() => handleDeleteTag(tag)}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`relative rounded border-2 ${
                    uploading ? " border-slate-500" : "border-orange-300"
                  }`}
                >
                  <span>Upload</span>
                  {uploading && (
                    <span className=" absolute right-2 top-1/2 -translate-y-1/2">
                      <Spinner className="border-slate-500" />
                    </span>
                  )}
                </button>
              </div>
              <div
                {...getRootProps()}
                className="flex h-[100px] flex-1 flex-col items-center justify-center rounded-md border-2 border-slate-300 bg-slate-200 p-2 text-slate-400"
              >
                <input {...getInputProps()} />
                {previewImg && imgSize && (
                  <NextImage
                    src={previewImg}
                    width={imgSize.width}
                    height={imgSize.height}
                    alt="preview"
                    className=" h-auto max-h-full w-auto max-w-full"
                  ></NextImage>
                )}
                {!previewImg && (
                  <>
                    <FaUpload />
                    <p>Drag n drop some files here, or click to select files</p>
                  </>
                )}
              </div>
            </form>

            <Gallery
              arts={allArts || []}
              mode="control"
              onAddHighlight={onAddHighLight}
              onDelete={onDelete}
            />
          </div>
        </section>
      );
    }
  } else {
    return signinBtn;
  }
}
