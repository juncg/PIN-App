import { getAllTestEntries } from "@/lib/services/test";

export default async function Test2() {
    const testData = await getAllTestEntries();

    return (
        <>
            <p>Inserted value: {testData.data && testData.data[0].test}</p>
            <p>
                {testData.error &&
                    `Error inserting data: ${testData.error.message}`}
            </p>
        </>
    );
}
