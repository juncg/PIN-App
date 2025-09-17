import Link from "next/link";

export default function Home() {
    return (
        <div>
            <p>Home page</p>

            <Link href={"/test-page"}>Go to test page</Link>
        </div>
    );
}
