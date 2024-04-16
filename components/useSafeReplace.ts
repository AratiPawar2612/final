import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const useSafeReplace = () => {
  const [onChanging, setOnChanging] = useState(false);
  const handleRouteChange = () => {
    setOnChanging(false);
  };
  const router = useRouter();
  // safePush is used to avoid route pushing errors when users click multiple times or when the network is slow:  "Error: Abort fetching component for route"
  const safeReplace = (path: string) => {
    if (onChanging) {
      return;
    }
    setOnChanging(true);
    router.replace(path);
  };

  useEffect(() => {
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router, setOnChanging]);
  return { safeReplace };
};

export default useSafeReplace;
