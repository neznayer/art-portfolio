import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  const { tag } = router.query;
}
