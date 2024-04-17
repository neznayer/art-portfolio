import {
  type KeyboardEvent,
  useState,
  type ChangeEvent,
  useCallback,
  useReducer,
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

enum EInputArtActions {
  SET_FILE = "SET_FILE",
  SET_DESCRIPTION = "SET_DESCRIPTION",
  SET_TITLE = "SET_TITLE",
  SET_HIGHLIGHTED = "SET_HIGHLIGHTED",
  ADD_TAG = "ADD_TAG",
  REMOVE_TAG = "REMOVE_TAG",
  SET_TAGS = "SET_TAGS",
}

interface IInputArtState {
  title: string;
  tags: string[];
  file: File | null;
  description: string;
  highlighted: boolean;
}

interface IArtAction {
  type: `${EInputArtActions}`;
  payload?: IInputArtState[keyof IInputArtState];
}

interface IgetPutUrlResponse {
  putUrl: string;
  getUrl: string;
  key: string;
}

function artReducer(state: IInputArtState, action: IArtAction): IInputArtState {
  const { type, payload } = action;
  switch (type) {
    case EInputArtActions.SET_TITLE:
      return { ...state, title: payload as string };

    case EInputArtActions.SET_DESCRIPTION:
      return { ...state, description: payload as string };

    case EInputArtActions.SET_FILE:
      return { ...state, file: payload as File };

    case EInputArtActions.SET_HIGHLIGHTED:
      return { ...state, highlighted: payload as boolean };

    case EInputArtActions.ADD_TAG:
      return {
        ...state,
        tags: [...new Set(state.tags.concat(payload as string))],
      };

    case EInputArtActions.REMOVE_TAG:
      return { ...state, tags: state.tags.filter((tag) => tag !== payload) };
    case EInputArtActions.SET_TAGS:
      return { ...state, tags: payload as string[] };

    default:
      return state;
  }
}

export default function AdminPage() {
  const { data: sessionData } = useSession();
  const mutation = api.art.addNewArt.useMutation().mutateAsync;
  const deleteMutation = api.art.remove.useMutation().mutateAsync;
  const highlightMutation = api.art.addHighLight.useMutation().mutateAsync;
  const { data: allArts } = api.art.allArts.useQuery();
  const [inputTag, setInputTag] = useState<string>("");
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [previewImg, setPreviewImg] = useState<string | null | undefined>();
  const [uploading, setUploading] = useState<boolean>(false);

  const [inputArt, dispatch] = useReducer(artReducer, {
    title: "",
    tags: [],
    file: null,
    description: "",
    highlighted: false,
  });

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
      dispatch({ type: "SET_FILE", payload: upFile });
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

    try {
      if (!inputArt.file) {
        throw new Error("No file was selected");
      }
      const fileType = encodeURIComponent(inputArt.file.type);
      const getPutUrlResponse = await fetch(
        `/api/upload-art?fileType=${fileType}`
      );

      const { putUrl, getUrl, key } =
        (await getPutUrlResponse.json()) as IgetPutUrlResponse;

      await fetch(putUrl, { method: "PUT", body: inputArt.file });

      await mutation({
        description: inputArt.description,
        title: inputArt.title,
        link: getUrl,
        tags: inputArt.tags,
        width: imgSize.width,
        height: imgSize.height,
        highlight: inputArt.highlighted,
        key,
      });

      await utils.art.allArts.invalidate();

      setInputTag("");
      dispatch({ type: "SET_TAGS", payload: [] });
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
        dispatch({ type: "ADD_TAG", payload: inputTag });
        setInputTag("");
      }
    }
  }

  function handleDeleteTag(tag: string) {
    dispatch({ type: "REMOVE_TAG", payload: tag });
  }

  const uploadDisabled = uploading || !inputArt.file || !inputArt.title;

  const signOutBtn = <Button onClick={() => signOut()}>SignOut</Button>;
  const signinBtn = (
    <Button
      onClick={() =>
        signIn(
          "google",
          { redirect: true, callbackUrl: "/api/auth/callback/google" },
          { prompt: "login" }
        )
      }
    >
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
        <section className="flex w-full justify-center px-5">
          <div className="flex flex-col gap-3">
            {signOutBtn}
            <h1 className=" text-lg">Welcome, {sessionData.user.name}! </h1>
            <form
              onSubmit={uploadToS3}
              className="h-30 flex flex-col items-center gap-3"
            >
              <div className=" flex flex-row gap-2 max-smartphone:flex-col">
                <div className="flex flex-col gap-2 smartphone:w-[300px]">
                  <TextInput
                    onChange={(e) =>
                      dispatch({ type: "SET_TITLE", payload: e.target.value })
                    }
                    placeholder="Title"
                    name="title"
                  />
                  <TextInput
                    onChange={(e) =>
                      dispatch({
                        type: "SET_DESCRIPTION",
                        payload: e.target.value,
                      })
                    }
                    placeholder="Description"
                    name="description"
                  />
                  <label>
                    <input
                      type="checkbox"
                      name="highlight"
                      id="highlight"
                      className="mr-2"
                      onChange={(e) =>
                        dispatch({
                          type: "SET_HIGHLIGHTED",
                          payload: e.target.checked,
                        })
                      }
                    />
                    Highlight in main gallery
                  </label>
                  <div className="smartphone:w-[300px]">
                    <TextInput
                      placeholder="Add tag"
                      name="tag"
                      onChange={handleTagChange}
                      onKeyDown={handleAddTag}
                      value={inputTag}
                      className="w-full"
                    />

                    <ul className="flex flex-row flex-wrap gap-2">
                      {inputArt.tags.map((tag) => (
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
                </div>
                <div
                  {...getRootProps()}
                  className="h-30 flex flex-1 flex-col items-center justify-center rounded-md border-2 border-slate-300 bg-slate-200 p-2 text-slate-400"
                >
                  <input {...getInputProps()} />
                  {previewImg && imgSize && (
                    <NextImage
                      src={previewImg}
                      width={imgSize.width}
                      height={imgSize.height}
                      alt="preview"
                      className="h-30  object-contain"
                    ></NextImage>
                  )}
                  {!previewImg && (
                    <>
                      <FaUpload />
                      <p>
                        Drag n drop some files here, or click to select files
                      </p>
                    </>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={uploadDisabled}
                className={`relative h-8 w-[10rem] rounded border-2 ${
                  uploadDisabled ? " border-slate-500" : "border-orange-300"
                }`}
              >
                <span>Upload</span>
                {uploading && (
                  <span className=" absolute right-2 top-1/2 -translate-y-1/2">
                    <Spinner className="border-slate-500" />
                  </span>
                )}
              </button>
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
