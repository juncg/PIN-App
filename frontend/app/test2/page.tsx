import { createClient } from "@supabase/supabase-js";

export default async function Test2() {
    const supabaseUrl = "http://127.0.0.1:8000";
    const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzU4MDYwMDAwLCJleHAiOjE5MTU4MjY0MDB9.6qLbqgN5ZPTywJuDGdxvmv5J1gLWYNGXE5wA2uWejgE`;

    try {
        const supabase = createClient(supabaseUrl, supabaseKey);

        console.log("Intentando conectar a:", supabaseUrl);

        const { data: test, error } = await supabase.from("Test").select("*");

        console.log("Data recibida:", test);
        console.log("Error:", error);
        console.log("Tipo de data:", typeof test);
        console.log("¿Es array?:", Array.isArray(test));

        if (error) {
            console.error("Error de Supabase:", error);
            return (
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-red-600">Error</h1>
                    <p className="text-red-500">{error.message}</p>
                    <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                        {JSON.stringify(error, null, 2)}
                    </pre>
                </div>
            );
        }

        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Datos de Test</h1>
                <div className="mb-4 text-sm text-gray-600">
                    <p>Total de registros: {test ? test.length : 0}</p>
                    <p>URL: {supabaseUrl}</p>
                </div>
                {test && test.length > 0 ? (
                    <ul className="space-y-2">
                        {test.map((item, index) => (
                            <li key={index} className="bg-gray-100 p-2 rounded">
                                <pre>{JSON.stringify(item, null, 2)}</pre>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div>
                        <p className="text-gray-500">
                            No hay datos disponibles
                        </p>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded">
                            Respuesta completa: {JSON.stringify(test, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        );
    } catch (catchError) {
        console.error("Error en catch:", catchError);
        return (
            <div className="p-4">
                <h1 className="text-2xl font-bold text-red-600">
                    Error de conexión
                </h1>
                <pre className="text-red-500 text-xs bg-gray-100 p-2 rounded mt-2">
                    {JSON.stringify(catchError, null, 2)}
                </pre>
            </div>
        );
    }
}
