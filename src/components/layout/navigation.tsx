import BottomDock from "./dock";
import { ScrollTop } from "./scroll-top";

/**
 * Shell navigation — BottomDock desktop (Task 7); ScrollTop (Task 8).
 */
export default function Navigation() {
  return (
    <>
      <BottomDock className="hidden lg:block" />
      <ScrollTop />
    </>
  );
}
