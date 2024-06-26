import api from "@/helpers/api";
import { map, atom } from "nanostores";
import type { APIResponses } from "@/helpers/api";

export const susType = atom<APIResponses["types"]["GET"][number] | null>(null);
export const checklistType = atom<APIResponses["types"]["GET"][number] | null>(
  null
);

const typesMap = map<Record<string, APIResponses["types"]["GET"][number]>>({});

export async function refreshTypes() {
  const types = await api({ endpoint: "types", method: "GET" });

  types.forEach((type) => typesMap.setKey(type.id, type));
  susType.set(types.find((t) => t.type === "sus") ?? null);
  checklistType.set(types.find((t) => t.type === "tasks") ?? null);
}

export default typesMap;
