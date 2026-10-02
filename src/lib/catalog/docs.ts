import { docs } from "../../../.velite";

export function getDocs() {
  return docs;
}

export function getDoc(id: string) {
  return docs.find((doc) => doc.id === id);
}
