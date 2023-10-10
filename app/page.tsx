import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col">
      <p className="font-bold my-10 text-center">Work Duration: 3 Hours</p>
      <div className="flex-row flex gap-4">
        <Link href={"/todo/firestore"} className="btn">
          Todo Sync (Firestore)
        </Link>
        <Link href={"/todo/dummy"} className="btn">
          Todo Dummy (Context)
        </Link>
        <Link href={"/todo/api"} className="btn">
          Todo API (Postgres)
        </Link>
      </div>
    </div>
  );
}
