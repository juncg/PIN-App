import { Database } from "../database/supabase";
import { supabase } from "../database/supabase-connection";

type TestRow = Database["public"]["Tables"]["Test"]["Row"];
type TestInsert = Database["public"]["Tables"]["Test"]["Insert"];

export async function getAllTestEntries() {
    const res = await supabase.from("Test").select("*");

    const data = res.data as TestRow[] | null;
    const error = res.error;

    return { data, error };
}

export async function postNewTestEntry() {
    const res = await supabase
        .from("Test")
        .insert<TestInsert>([{ test: "SomeValue" }])
        .select("*");

    const data = res.data as TestRow[] | null;
    const error = res.error;

    return { data, error };
}
