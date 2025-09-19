import Link from "next/link";

export default function Home() {
    return (
        <div>
            <p>Home page</p>

            <p>
                <Link href={"/test-page"}>Go to test page</Link>
            </p>

            <p>
                <Link href={"/database-test"}>Go to database test page</Link>
            </p>

            <b>
                <Link href={"/funny"}>Go to Josep&apos;s epic page</Link>
            </b>
        </div>
    );
}
