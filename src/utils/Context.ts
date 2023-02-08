import { createContext } from "react";
import { type IArt } from "../types/art";

export const ArtContext = createContext<IArt[] | undefined>([]);
export const TagsContext = createContext<string[] | undefined>([]);
