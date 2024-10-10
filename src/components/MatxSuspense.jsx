import { Suspense } from "react";
import MatxLoading from "./MatxLoading";

export default function MatxSuspense({ children }) {
  return <Suspense fallback={<MatxLoading />}>{children}</Suspense>;
}
