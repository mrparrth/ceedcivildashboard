import { Suspense } from "react";
import Loading from "./Loading";

export default function Suspense({ children }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
