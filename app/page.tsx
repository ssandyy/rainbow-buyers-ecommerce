import { Button } from "@/components/ui/button";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoutes";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <h1>Hello Home page </h1>
        <Button >
          <Link href={WEBSITE_LOGIN}>
            Login
          </Link>
        </Button>
      </div>
    </>
  );
}
