import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSafeReplace from "./useSafeReplace";

export default function MainLayout(props: any) {
  const { children } = props;

  const { data: session, status } = useSession();
  const [isSessionLoading, setIsSessionLoading] = useState(false);
  const { safeReplace } = useSafeReplace();

  useEffect(() => {
    setIsSessionLoading(status === "loading");
    if (status === "unauthenticated" && safeReplace) {
      safeReplace("/");
    }
  }, [status, session, safeReplace]);

  return isSessionLoading ? <div>Loading...</div> : children;
}
