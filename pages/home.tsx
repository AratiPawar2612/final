import MainLayout from "@/components/mainlayout";
import { signOut } from "next-auth/react";

export default function Home() {
  return (
    <MainLayout>
      <div
        onClick={async () => {
          await signOut();
        }}
      >
        Logouts
      </div>
    </MainLayout>
  );
}
